/**
 * Calendar and date utilities for booking system
 */

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;
  isAvailable: boolean;
  availableSlotCount: number;
}

export interface CalendarMonth {
  month: number; // 0-11
  year: number;
  monthName: string;
  weeks: CalendarDay[][];
}

/**
 * Generate calendar grid for a given month
 */
export function generateCalendarMonth(
  year: number,
  month: number,
  availabilityMap?: Map<string, number>
): CalendarMonth {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Get the day of week for the first day (0 = Sunday)
  const startDay = firstDay.getDay();
  
  // Get days from previous month to fill the first week
  const daysFromPrevMonth = startDay;
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  // Get days from next month to fill the last week
  const daysInMonth = lastDay.getDate();
  const endDay = lastDay.getDay();
  const daysFromNextMonth = endDay === 6 ? 0 : 6 - endDay;
  
  const days: CalendarDay[] = [];
  
  // Previous month days
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    days.push(createCalendarDay(date, false, today, availabilityMap));
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push(createCalendarDay(date, true, today, availabilityMap));
  }
  
  // Next month days
  for (let day = 1; day <= daysFromNextMonth; day++) {
    const date = new Date(year, month + 1, day);
    days.push(createCalendarDay(date, false, today, availabilityMap));
  }
  
  // Group into weeks (7 days each)
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  return {
    month,
    year,
    monthName,
    weeks,
  };
}

function createCalendarDay(
  date: Date,
  isCurrentMonth: boolean,
  today: Date,
  availabilityMap?: Map<string, number>
): CalendarDay {
  const dayDate = new Date(date);
  dayDate.setHours(0, 0, 0, 0);
  
  const isToday = dayDate.getTime() === today.getTime();
  const isPast = dayDate < today;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  const dateKey = formatDateKey(date);
  const availableSlotCount = availabilityMap?.get(dateKey) || 0;
  
  // Day is available if: not past, not weekend, in current month, has available slots
  const isAvailable = !isPast && !isWeekend && isCurrentMonth && availableSlotCount > 0;
  
  return {
    date,
    dayNumber: date.getDate(),
    isCurrentMonth,
    isToday,
    isPast,
    isWeekend,
    isAvailable,
    availableSlotCount,
  };
}

/**
 * Format date as YYYY-MM-DD for use as key
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display (e.g., "Monday, January 15, 2024")
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date short (e.g., "Jan 15, 2024")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time (e.g., "9:00 AM")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get next business day (skip weekends)
 */
export function getNextBusinessDay(fromDate: Date = new Date()): Date {
  const next = new Date(fromDate);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  
  // If Saturday, move to Monday
  if (next.getDay() === 6) {
    next.setDate(next.getDate() + 2);
  }
  // If Sunday, move to Monday
  else if (next.getDay() === 0) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
}

/**
 * Check if date is a business day (Mon-Fri)
 */
export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

/**
 * Generate week data (Monday-Friday only) for a given start date
 */
export function generateWeekDays(
  startDate: Date,
  availabilityMap?: Map<string, number>
): CalendarDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find the Monday of the week containing startDate
  const weekStart = new Date(startDate);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, otherwise go to Monday
  weekStart.setDate(weekStart.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  
  const days: CalendarDay[] = [];
  
  // Generate Monday through Friday (5 business days)
  for (let i = 0; i < 5; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    days.push(createCalendarDay(date, true, today, availabilityMap));
  }
  
  return days;
}

/**
 * Get week range string (e.g., "Oct 13-17, 2025")
 */
export function getWeekRangeString(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4); // Friday
  
  const monthStart = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const monthEnd = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const year = weekStart.getFullYear();
  
  // Same month
  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${monthStart} ${weekStart.getDate()}-${weekEnd.getDate()}, ${year}`;
  }
  // Different months
  return `${monthStart} ${weekStart.getDate()} - ${monthEnd} ${weekEnd.getDate()}, ${year}`;
}

/**
 * Get the Monday of the week containing the given date
 */
export function getWeekStart(date: Date): Date {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, otherwise go to Monday
  weekStart.setDate(weekStart.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * Generate mock availability map for testing
 * Returns map of date keys to available slot counts
 */
export function generateMockAvailabilityMap(startDate: Date, endDate: Date): Map<string, number> {
  const map = new Map<string, number>();
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isBusinessDay(current)) {
      // Randomly assign 0-8 available slots for demo
      const slots = Math.floor(Math.random() * 9);
      map.set(formatDateKey(current), slots);
    }
    current.setDate(current.getDate() + 1);
  }
  
  return map;
}


