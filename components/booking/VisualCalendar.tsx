import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { 
  generateCalendarMonth, 
  generateWeekDays, 
  getWeekStart,
  getWeekRangeString,
  formatDateKey, 
  formatDateLong 
} from '@/lib/date-utils';
import type { CalendarMonth, CalendarDay } from '@/lib/date-utils';

type ViewMode = 'week' | 'month';

interface VisualCalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  onDateDoubleClick?: (date: Date) => void;
  availabilityMap: Map<string, number>;
}

export default function VisualCalendar({ selectedDate, onSelectDate, onDateDoubleClick, availabilityMap }: VisualCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(today));
  
  // Detect mobile and set default view
  const [viewMode, setViewMode] = useState<ViewMode>('week'); // Default to week
  
  // Load view preference from session storage
  useEffect(() => {
    const savedView = sessionStorage.getItem('calendarView') as ViewMode | null;
    if (savedView) {
      setViewMode(savedView);
    } else {
      // Default based on screen size
      const isMobile = window.innerWidth < 768;
      setViewMode(isMobile ? 'week' : 'month');
    }
  }, []);
  
  // Save view preference to session storage
  const toggleView = (newView: ViewMode) => {
    setViewMode(newView);
    sessionStorage.setItem('calendarView', newView);
  };
  
  // Generate calendar data based on view mode
  const calendar = viewMode === 'month' 
    ? generateCalendarMonth(currentYear, currentMonth, availabilityMap)
    : null;
  
  const weekDays = viewMode === 'week'
    ? generateWeekDays(currentWeekStart, availabilityMap)
    : null;
  
  // Month navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Week navigation
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };
  
  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };
  
  const handleDayClick = (day: CalendarDay) => {
    if (day.isAvailable) {
      onSelectDate(day.date);
    }
  };
  
  const handleDayDoubleClick = (day: CalendarDay) => {
    if (day.isAvailable && onDateDoubleClick) {
      onDateDoubleClick(day.date);
    }
  };
  
  const isSelected = (day: CalendarDay) => {
    if (!selectedDate || !day.isCurrentMonth) return false;
    return formatDateKey(day.date) === formatDateKey(selectedDate);
  };
  
  const getDayClasses = (day: CalendarDay) => {
    // Square cells with aspect-ratio (removed min-h to avoid conflicts)
    const baseClasses = 'aspect-square rounded-lg flex flex-col items-center justify-center text-center transition-all cursor-pointer p-1.5 md:p-2';
    
    // Not current month (for monthly view)
    if (!day.isCurrentMonth) {
      return `${baseClasses} text-gray-300 cursor-default`;
    }
    
    // Selected (gold)
    if (isSelected(day)) {
      return `${baseClasses} bg-primary text-white font-bold shadow-lg ring-4 ring-primary/20 scale-105`;
    }
    
    // Available (green)
    if (day.isAvailable) {
      return `${baseClasses} bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200 hover:border-green-300 font-semibold hover:scale-105 hover:shadow-md`;
    }
    
    // Past or weekend (light grey)
    if (day.isPast || day.isWeekend) {
      return `${baseClasses} bg-gray-50 text-gray-400 cursor-not-allowed`;
    }
    
    // Unavailable - no slots (grey)
    return `${baseClasses} bg-gray-100 text-gray-500 cursor-not-allowed`;
  };
  
  const getAvailabilityDots = (count: number) => {
    if (count === 0) return null;
    
    let dotCount = 1;
    if (count >= 7) dotCount = 3;
    else if (count >= 4) dotCount = 2;
    
    return (
      <div className="flex gap-1 mt-1">
        {Array.from({ length: dotCount }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-green-600"
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
          Pick a day
        </h2>
        <p className="text-gray-600">
          Green dates have available time slots
        </p>
      </div>
      
      {/* Selected date display with slot count */}
      {selectedDate && (
        <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Selected Date</p>
          <p className="text-lg font-bold text-secondary">{formatDateLong(selectedDate)}</p>
          {availabilityMap.get(formatDateKey(selectedDate)) !== undefined && (
            <p className="text-sm text-green-600 font-semibold mt-2">
              {availabilityMap.get(formatDateKey(selectedDate))} time slots available
            </p>
          )}
        </div>
      )}
      
      {/* View Toggle */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-lg border-2 border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => toggleView('week')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              viewMode === 'week'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => toggleView('month')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              viewMode === 'month'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
        </div>
      </div>
      
      {/* Calendar header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={viewMode === 'week' ? goToPreviousWeek : goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={viewMode === 'week' ? 'Previous week' : 'Previous month'}
        >
          <ChevronLeft className="w-6 h-6 text-secondary" />
        </button>
        
        <h3 className="text-lg md:text-xl font-bold text-secondary">
          {viewMode === 'week' 
            ? `Week of ${getWeekRangeString(currentWeekStart)}`
            : calendar?.monthName
          }
        </h3>
        
        <button
          onClick={viewMode === 'week' ? goToNextWeek : goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={viewMode === 'week' ? 'Next week' : 'Next month'}
        >
          <ChevronRight className="w-6 h-6 text-secondary" />
        </button>
      </div>
      
      {/* Weekly View */}
      {viewMode === 'week' && weekDays && (
        <div className="bg-white rounded-xl p-3 md:p-6 shadow-md">
          {/* Day headers */}
          <div className="grid grid-cols-5 gap-2 md:gap-3 mb-2 md:mb-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
              <div key={day} className="text-center text-sm md:text-base font-semibold text-gray-500 py-1 md:py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Week days */}
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {weekDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => handleDayClick(day)}
                onDoubleClick={() => handleDayDoubleClick(day)}
                disabled={!day.isAvailable}
                className={getDayClasses(day)}
              >
                <span className="text-2xl md:text-xl font-bold">{day.dayNumber}</span>
                {day.isAvailable && getAvailabilityDots(day.availableSlotCount)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Monthly View */}
      {viewMode === 'month' && calendar && (
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-md">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs md:text-sm font-semibold text-gray-500 py-1 md:py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="space-y-1.5 md:space-y-2">
            {calendar.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1.5 md:gap-2">
                {week.map((day, dayIndex) => (
                  <button
                    key={dayIndex}
                    onClick={() => handleDayClick(day)}
                    onDoubleClick={() => handleDayDoubleClick(day)}
                    disabled={!day.isAvailable}
                    className={getDayClasses(day)}
                  >
                    <span className="text-sm md:text-base font-semibold">{day.dayNumber}</span>
                    {day.isAvailable && day.isCurrentMonth && getAvailabilityDots(day.availableSlotCount)}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-3 md:p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 md:mb-3 text-center">
          Legend
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 flex-shrink-0 rounded bg-green-50 border-2 border-green-200 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
            </div>
            <span className="text-gray-600">Few slots</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 flex-shrink-0 rounded bg-green-50 border-2 border-green-200 flex items-center justify-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
            </div>
            <span className="text-gray-600">Some slots</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 flex-shrink-0 rounded bg-green-50 border-2 border-green-200 flex items-center justify-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
            </div>
            <span className="text-gray-600">Many slots</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-5 h-5 flex-shrink-0 rounded bg-gray-100"></div>
            <span className="text-gray-600">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}

