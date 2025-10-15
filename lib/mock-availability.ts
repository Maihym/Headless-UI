export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  available: boolean;
  dayOfWeek: string;
  time: string;
}

export interface DayAvailability {
  date: Date;
  dayName: string;
  dateString: string;
  slots: TimeSlot[];
}

/**
 * Generate mock availability for testing calendar designs
 * Business hours: M-F 9am-5pm, 30-minute slots
 * Randomly marks some slots as booked for realistic demo
 */
export function generateMockAvailability(weeksAhead: number = 4): DayAvailability[] {
  const availability: DayAvailability[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Start from next business day
  const startDate = getNextBusinessDay(today);
  
  // Generate slots for the specified number of weeks
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (weeksAhead * 7));
  
  const currentDate = new Date(startDate);
  
  while (currentDate < endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const daySlots = generateDaySlots(currentDate);
      availability.push({
        date: new Date(currentDate),
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        dateString: currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        }),
        slots: daySlots,
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return availability;
}

function getNextBusinessDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  
  // If it's Saturday, skip to Monday
  if (next.getDay() === 6) {
    next.setDate(next.getDate() + 2);
  }
  // If it's Sunday, skip to Monday
  else if (next.getDay() === 0) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
}

export function generateDaySlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const now = new Date();
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  
  console.log('🔴 === GENERATING MOCK DATA ===');
  console.log('Date:', date.toDateString());
  console.log('Current time:', now.toLocaleTimeString());
  console.log('3-hour buffer cutoff:', threeHoursFromNow.toLocaleTimeString());
  
  // Generate 30-minute slots from 9:00 AM to 5:00 PM
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, minute, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);
      
      // Skip slots after 5pm
      if (slotStart.getHours() >= 17) continue;
      
      // Check if slot is in the past or within 3 hours
      const isPastOrTooSoon = slotStart < threeHoursFromNow;
      
      // Randomly mark some future slots as unavailable for realistic demo
      // About 30% of slots are booked
      const isRandomlyBooked = Math.random() > 0.7;
      const isAvailable = !isPastOrTooSoon && !isRandomlyBooked;
      
      const timeString = formatTime(slotStart);
      
      slots.push({
        id: `${date.toISOString().split('T')[0]}-${hour}-${minute}`,
        start: slotStart,
        end: slotEnd,
        available: isAvailable,
        dayOfWeek,
        time: timeString,
      });
    }
  }
  
  const availableCount = slots.filter(s => s.available).length;
  console.log(`Generated ${slots.length} total slots, ${availableCount} available`);
  
  return slots;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Group availability by week for easier rendering
 */
export function groupByWeek(availability: DayAvailability[]): DayAvailability[][] {
  const weeks: DayAvailability[][] = [];
  let currentWeek: DayAvailability[] = [];
  
  availability.forEach((day, index) => {
    currentWeek.push(day);
    
    // Start a new week on Friday or at the last item
    if (day.dayName === 'Friday' || index === availability.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  return weeks;
}

/**
 * Get availability for a specific week starting from a date
 */
export function getWeekAvailability(
  availability: DayAvailability[], 
  weekStartDate: Date
): DayAvailability[] {
  const weekStart = new Date(weekStartDate);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  return availability.filter(day => {
    const dayDate = new Date(day.date);
    return dayDate >= weekStart && dayDate < weekEnd;
  });
}

/**
 * Generate a mock availability map for a date range
 * Returns Map<dateString, availableSlotCount>
 */
export function generateMockAvailabilityMap(startDate: Date, endDate: Date): Map<string, number> {
  const availabilityMap = new Map<string, number>();
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  
  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const daySlots = generateDaySlots(currentDate);
      const availableCount = daySlots.filter(slot => slot.available).length;
      availabilityMap.set(dateKey, availableCount);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return availabilityMap;
}

/**
 * Generate mock time slots for a specific date
 * Returns only available slots (for booking UI)
 */
export function generateMockTimeSlots(date: Date): TimeSlot[] {
  const allSlots = generateDaySlots(date);
  return allSlots.filter(slot => slot.available);
}


