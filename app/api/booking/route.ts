import { NextRequest, NextResponse } from 'next/server';
import { createCalendarEvent } from '@/lib/google-calendar';
import { sendBookingConfirmation } from '@/lib/email';
import { isSlotAvailable } from '@/lib/calendar-availability';

function sanitizeInput(input: string, maxLength: number = 255): string {
  return input.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, // Legacy support
      firstName,
      lastName,
      phone, 
      email, 
      address,
      aptSuite,
      serviceType, 
      serviceName,
      servicePrice,
      preferredDate, 
      preferredTime, 
      slotStart,
      slotEnd,
      message,
      notes,
      referralSource
    } = body;

    // Build full name (support both old and new format) with sanitization
    const fullName = sanitizeInput(
      name || (firstName && lastName ? `${firstName} ${lastName}` : ''),
      100
    );
    const sanitizedPhone = sanitizeInput(phone, 20);
    const sanitizedEmail = sanitizeInput(email, 254);
    const sanitizedAddress = sanitizeInput(address, 500);
    const sanitizedAptSuite = aptSuite ? sanitizeInput(aptSuite, 50) : '';
    const sanitizedNotes = sanitizeInput(notes || message || '', 1000);
    const fullAddress = sanitizedAptSuite ? `${sanitizedAddress}, ${sanitizedAptSuite}` : sanitizedAddress;

    // Validate required fields
    if (!fullName || !sanitizedPhone || !sanitizedEmail || !sanitizedAddress || !serviceType) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate date/time
    if ((!preferredDate || !preferredTime) && (!slotStart || !slotEnd)) {
      return NextResponse.json(
        { error: 'Date and time must be provided' },
        { status: 400 }
      );
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      return NextResponse.json(
        { error: 'Calendar not configured' },
        { status: 500 }
      );
    }

    // Parse the slot times
    let appointmentStart: Date;
    let appointmentEnd: Date;

    if (slotStart && slotEnd) {
      appointmentStart = new Date(slotStart);
      appointmentEnd = new Date(slotEnd);
    } else {
      // Legacy format support
      appointmentStart = new Date(`${preferredDate}T${preferredTime}:00`);
      appointmentEnd = new Date(appointmentStart);
      appointmentEnd.setHours(appointmentEnd.getHours() + 2); // 2 hour appointment
    }

    // Validate dates
    if (isNaN(appointmentStart.getTime()) || isNaN(appointmentEnd.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date/time format' },
        { status: 400 }
      );
    }

    // CONFLICT CHECK: Verify slot is still available
    const available = await isSlotAvailable(calendarId, appointmentStart, appointmentEnd);
    
    if (!available) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please select a different time.' },
        { status: 409 } // Conflict status code
      );
    }

    // Create Google Calendar event (2 hour duration)
    const calendarResult = await createCalendarEvent({
      name: fullName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      serviceType: serviceName || serviceType,
      dateTime: appointmentStart.toISOString(),
      message: sanitizedNotes,
      address: fullAddress,
      duration: 120, // 2 hours
    });

    if (!calendarResult.success) {
      console.error('Calendar error:', calendarResult.error);
      return NextResponse.json(
        { error: 'Failed to create calendar event' },
        { status: 500 }
      );
    }

    // Send confirmation email
    const emailResult = await sendBookingConfirmation({
      name: fullName,
      email: sanitizedEmail,
      serviceType: serviceName || serviceType,
      servicePrice,
      dateTime: appointmentStart.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      address: fullAddress,
      referralSource,
    });

    if (!emailResult.success) {
      console.error('Email error:', emailResult.error);
      // Don't fail the request if email fails, calendar event is already created
    }

    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        eventId: calendarResult.eventId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

