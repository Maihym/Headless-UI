import { google } from 'googleapis';
import { logger } from './logger';

interface TimeRange {
  start: Date;
  end: Date;
}

interface AvailabilityOptions {
  startDate: Date;
  endDate: Date;
  appointmentDuration: number; // in minutes (default 120)
  bufferTime: number; // in minutes (default 45)
  businessHours: {
    start: number; // hour 0-23 (default 9)
    end: number; // hour 0-23 (default 17)
  };
}

interface DayAvailability {
  date: string; // YYYY-MM-DD
  availableSlotCount: number;
  slots: TimeRange[];
}

/**
 * Calculate available appointment slots based on Google Calendar busy times
 */
export async function calculateAvailability(
  calendarId: string,
  options: AvailabilityOptions
): Promise<Map<string, number>> {
  const {
    startDate,
    endDate,
    appointmentDuration = 120,
    bufferTime = 45,
    businessHours = { start: 9, end: 17 },
  } = options;

  // Fetch busy times from Google Calendar
  const busyTimes = await fetchBusyTimes(calendarId, startDate, endDate);

  // Generate availability map
  const availabilityMap = new Map<string, number>();
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const dateKey = formatDateKey(currentDate);
    const daySlots = calculateDaySlots(
      currentDate,
      busyTimes,
      businessHours,
      appointmentDuration,
      bufferTime
    );

    availabilityMap.set(dateKey, daySlots.length);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availabilityMap;
}

/**
 * Get detailed time slots for a specific day
 */
export async function getDetailedDaySlots(
  calendarId: string,
  date: Date,
  appointmentDuration: number = 120,
  bufferTime: number = 45,
  businessHours = { start: 9, end: 17 }
): Promise<TimeRange[]> {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const busyTimes = await fetchBusyTimes(calendarId, dayStart, dayEnd);
  
  return calculateDaySlots(
    date,
    busyTimes,
    businessHours,
    appointmentDuration,
    bufferTime
  );
}

/**
 * Check if a specific time slot is available
 */
export async function isSlotAvailable(
  calendarId: string,
  slotStart: Date,
  slotEnd: Date
): Promise<boolean> {
  const busyTimes = await fetchBusyTimes(calendarId, slotStart, slotEnd);
  
  // Check if the requested slot overlaps with any busy time
  for (const busy of busyTimes) {
    if (slotsOverlap(slotStart, slotEnd, busy.start, busy.end)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Fetch busy times from Google Calendar
 */
async function fetchBusyTimes(
  calendarId: string,
  startDate: Date,
  endDate: Date
): Promise<TimeRange[]> {
  try {
    const auth = await getGoogleAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    const busySlots = response.data.calendars?.[calendarId]?.busy || [];
    
    return busySlots.map(slot => ({
      start: new Date(slot.start!),
      end: new Date(slot.end!),
    }));
  } catch (error) {
    console.error('Error fetching busy times:', error);
    throw new Error('Failed to fetch calendar availability');
  }
}

/**
 * Calculate available slots for a single day
 */
function calculateDaySlots(
  date: Date,
  busyTimes: TimeRange[],
  businessHours: { start: number; end: number },
  appointmentDuration: number,
  bufferTime: number
): TimeRange[] {
  const slots: TimeRange[] = [];
  const totalTimeNeeded = appointmentDuration + bufferTime; // e.g., 120 + 45 = 165 minutes
  
  // Get current time + 3 hours for buffer
  const now = new Date();
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  
  logger.debug(`  🔍 Calculating slots for ${date.toDateString()}`);
  logger.debug(`  📍 Current time: ${now.toLocaleTimeString()}`);
  logger.debug(`  ⏰ 3-hour cutoff: ${threeHoursFromNow.toLocaleTimeString()}`);
  logger.debug(`  🚫 Busy times from Google Calendar: ${busyTimes.length}`);
  
  // Generate 30-minute increment slots within business hours
  for (let hour = businessHours.start; hour < businessHours.end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, minute, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + totalTimeNeeded);
      
      // Skip slots in the past or within 3 hours
      if (slotStart < threeHoursFromNow) {
        continue;
      }
      
      // Allow appointments to start up to 1 hour before closing
      // (e.g., 4 PM start for 5 PM close, even though appointment ends at 6:45 PM)
      const lastStartTime = businessHours.end - 1; // One hour before closing
      if (slotStart.getHours() > lastStartTime || 
          (slotStart.getHours() === lastStartTime && slotStart.getMinutes() > 0)) {
        continue;
      }
      
      // Check if slot overlaps with any busy time (including buffer on both sides)
      let isAvailable = true;
      for (const busy of busyTimes) {
        // Add buffer before and after busy times to prevent back-to-back bookings
        const bufferedBusyStart = new Date(busy.start.getTime() - bufferTime * 60 * 1000);
        const bufferedBusyEnd = new Date(busy.end.getTime() + bufferTime * 60 * 1000);
        
        if (slotsOverlap(slotStart, slotEnd, bufferedBusyStart, bufferedBusyEnd)) {
          isAvailable = false;
          break;
        }
      }
      
      if (isAvailable) {
        // Store only the appointment time (not including buffer)
        const appointmentEnd = new Date(slotStart);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointmentDuration);
        
        slots.push({
          start: slotStart,
          end: appointmentEnd,
        });
      }
    }
  }
  
  logger.debug(`  ✅ Found ${slots.length} available slots for ${date.toDateString()}`);
  
  return slots;
}

/**
 * Check if two time ranges overlap
 */
function slotsOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && end1 > start2;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get Google Auth client
 */
async function getGoogleAuth() {
  const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  };

  if (!credentials.client_id || !credentials.client_secret || !credentials.refresh_token) {
    throw new Error('Missing required Google Calendar credentials');
  }

  const auth = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret
  );

  auth.setCredentials({
    refresh_token: credentials.refresh_token,
  });

  return auth;
}


