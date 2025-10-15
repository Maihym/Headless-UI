'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DayAvailability, TimeSlot } from '@/lib/mock-availability';

interface CompactWeekGridProps {
  availability: DayAvailability[];
  onSelectSlot?: (slot: TimeSlot) => void;
}

export default function CompactWeekGrid({ availability, onSelectSlot }: CompactWeekGridProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  
  // Group days by week (5 business days per week)
  const weeks: DayAvailability[][] = [];
  for (let i = 0; i < availability.length; i += 5) {
    weeks.push(availability.slice(i, i + 5));
  }
  
  const currentWeek = weeks[currentWeekIndex] || [];
  
  // Get all unique time slots
  const timeSlots = currentWeek[0]?.slots.map(s => s.time) || [];
  
  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };
  
  const handleNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };
  
  const handleSlotClick = (day: DayAvailability, slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot.id);
      onSelectSlot?.(slot);
    }
  };

  const handleDayClick = (day: DayAvailability) => {
    // Find first available slot for this day
    const firstAvailableSlot = day.slots.find(s => s.available);
    if (firstAvailableSlot) {
      handleSlotClick(day, firstAvailableSlot);
      // Scroll to time slots section
      const timeSlotSection = document.querySelector('[data-timeslots]');
      timeSlotSection?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-secondary mb-2">Design A: Compact Week Grid</h3>
        <p className="text-sm text-gray-600">Desktop-optimized grid view with time rows and day columns</p>
      </div>
      
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevWeek}
          disabled={currentWeekIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Week
        </button>
        
        <div className="text-center">
          <p className="font-semibold text-secondary">
            {currentWeek[0]?.dateString} - {currentWeek[currentWeek.length - 1]?.dateString}
          </p>
          <p className="text-xs text-gray-500">Week {currentWeekIndex + 1} of {weeks.length}</p>
        </div>
        
        <button
          onClick={handleNextWeek}
          disabled={currentWeekIndex === weeks.length - 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next Week
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Desktop Grid View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row - Days */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="text-xs font-semibold text-gray-500 text-right pr-2">Time</div>
            {currentWeek.map((day) => (
              <div 
                key={day.dateString} 
                className="text-center cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors"
                onClick={() => handleDayClick(day)}
                onDoubleClick={() => handleDayClick(day)}
                title="Click to select first available slot"
              >
                <div className="text-sm font-semibold text-secondary">{day.dayName}</div>
                <div className="text-xs text-gray-500">{day.date.getDate()}</div>
                <div className="text-xs text-green-600 font-medium mt-1">
                  {day.slots.filter(s => s.available).length} slots
                </div>
              </div>
            ))}
          </div>
          
          {/* Time Slot Rows */}
          <div className="space-y-1" data-timeslots>
            {timeSlots.map((time, timeIndex) => (
              <div key={`time-${timeIndex}-${time}`} className="grid grid-cols-6 gap-2">
                <div className="text-xs text-gray-600 text-right pr-2 pt-2">{time}</div>
                {currentWeek.map((day) => {
                  const slot = day.slots[timeIndex];
                  return (
                    <button
                      key={`${day.dateString}-${slot.id}`}
                      onClick={() => handleSlotClick(day, slot)}
                      disabled={!slot.available}
                      className={`
                        py-2 px-1 text-xs rounded transition-all
                        ${slot.available 
                          ? slot.id === selectedSlot
                            ? 'bg-primary text-white font-semibold'
                            : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {slot.available ? 'Open' : 'Booked'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile: Day Selector + Time List */}
      <div className="lg:hidden">
        {currentWeek.map((day) => (
          <div key={day.dateString} className="mb-6">
            <h4 className="font-semibold text-secondary mb-3">
              {day.dayName}, {day.dateString}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {day.slots.filter(s => s.available).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotClick(day, slot)}
                  className={`
                    py-3 px-2 text-sm rounded-lg transition-all
                    ${slot.id === selectedSlot
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                    }
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-6 border-t flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-gray-600">Booked</span>
        </div>
      </div>
    </div>
  );
}


