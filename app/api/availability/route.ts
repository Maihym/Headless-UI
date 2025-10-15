import { NextRequest, NextResponse } from 'next/server';
import { calculateAvailability, getDetailedDaySlots } from '@/lib/calendar-availability';
import { generateMockAvailabilityMap, generateMockTimeSlots } from '@/lib/mock-availability';
import { logger } from '@/lib/logger';

/**
 * GET /api/availability
 * 
 * Query params:
 * - startDate: YYYY-MM-DD (optional, defaults to tomorrow)
 * - endDate: YYYY-MM-DD (optional, defaults to 30 days from start)
 * - date: YYYY-MM-DD (optional, get detailed slots for specific day)
 * 
 * Returns availability map or detailed slots for a day
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const specificDate = searchParams.get('date');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const hasGoogleCredentials = Boolean(
      calendarId && 
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET && 
      process.env.GOOGLE_REFRESH_TOKEN
    );
    
    // Debug logging
    const now = new Date();
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    logger.debug('\n=== AVAILABILITY API REQUEST ===');
    logger.debug('Time:', now.toLocaleTimeString());
    logger.debug('3-hour buffer cutoff:', threeHoursFromNow.toLocaleTimeString());
    logger.debug('Has Google credentials:', hasGoogleCredentials);
    logger.debug('Data source:', hasGoogleCredentials ? '🟢 REAL Google Calendar' : '🔴 MOCK data');
    logger.debug('Request params:', { specificDate, startDateParam, endDateParam });
    
    // If requesting specific date slots
    if (specificDate) {
      // Parse as local date, not UTC to avoid timezone issues
      const [year, month, day] = specificDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }
      
      let slots;
      
      if (hasGoogleCredentials) {
        try {
          logger.debug('📅 Fetching slots from Google Calendar for:', date.toDateString());
          const timeRanges = await getDetailedDaySlots(calendarId!, date);
          slots = timeRanges.map(slot => ({
            id: `${slot.start.getTime()}`,
            start: slot.start,
            end: slot.end,
            time: formatTime(slot.start),
          }));
          logger.debug('✅ Google Calendar returned', slots.length, 'available slots');
          if (slots.length > 0) {
            logger.debug('First slot:', slots[0].time);
            logger.debug('Last slot:', slots[slots.length - 1].time);
          }
        } catch (error) {
          logger.error('❌ Google Calendar error, falling back to mock data:', error);
          slots = generateMockTimeSlots(date);
        }
      } else {
        logger.debug('⚠️  Google Calendar not configured, using mock data');
        slots = generateMockTimeSlots(date);
      }
      
      return NextResponse.json({
        slots: slots.map(slot => ({
          id: slot.id,
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
          time: slot.time,
        })),
      });
    }
    
    // Otherwise, return availability map
    const startDate = startDateParam 
      ? (() => {
          const [year, month, day] = startDateParam.split('-').map(Number);
          return new Date(year, month - 1, day);
        })()
      : getNextBusinessDay();
    
    const endDate = endDateParam
      ? (() => {
          const [year, month, day] = endDateParam.split('-').map(Number);
          return new Date(year, month - 1, day);
        })()
      : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    let availabilityMap: Map<string, number>;
    
    if (hasGoogleCredentials) {
      try {
        logger.debug('📅 Calculating availability from Google Calendar');
        availabilityMap = await calculateAvailability(calendarId!, {
          startDate,
          endDate,
          appointmentDuration: 120, // 2 hours
          bufferTime: 45, // 45 minutes
          businessHours: { start: 9, end: 17 },
        });
        logger.debug('✅ Google Calendar returned', availabilityMap.size, 'days with availability');
      } catch (error) {
        logger.error('❌ Google Calendar error, falling back to mock data:', error);
        availabilityMap = generateMockAvailabilityMap(startDate, endDate);
      }
    } else {
      logger.debug('⚠️  Google Calendar not configured, using mock data');
      availabilityMap = generateMockAvailabilityMap(startDate, endDate);
    }
    
    // Convert Map to array format expected by hooks
    const availabilityArray = Array.from(availabilityMap.entries()).map(([date, availableSlots]) => ({
      date,
      availableSlots,
    }));
    
    return NextResponse.json(availabilityArray);
    
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getNextBusinessDay(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // If Saturday, move to Monday
  if (tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 2);
  }
  // If Sunday, move to Monday
  else if (tomorrow.getDay() === 0) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  
  return tomorrow;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}


