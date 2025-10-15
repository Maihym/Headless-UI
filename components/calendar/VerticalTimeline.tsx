'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { DayAvailability, TimeSlot } from '@/lib/mock-availability';

interface VerticalTimelineProps {
  availability: DayAvailability[];
  onSelectSlot?: (slot: TimeSlot) => void;
}

export default function VerticalTimeline({ availability, onSelectSlot }: VerticalTimelineProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  const currentDay = availability[selectedDayIndex];
  
  const handlePrevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  };
  
  const handleNextDay = () => {
    if (selectedDayIndex < availability.length - 1) {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  };
  
  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot.id);
      onSelectSlot?.(slot);
    }
  };

  const handleDayQuickSelect = (index: number) => {
    setSelectedDayIndex(index);
    // Find first available slot for this day
    const day = availability[index];
    const firstAvailableSlot = day?.slots.find(s => s.available);
    if (firstAvailableSlot) {
      handleSlotClick(firstAvailableSlot);
    }
  };
  
  // Group slots by hour for visual grouping
  const slotsByHour: { [hour: string]: TimeSlot[] } = {};
  currentDay?.slots.forEach(slot => {
    const hour = slot.start.getHours();
    const hourLabel = formatHourLabel(hour);
    if (!slotsByHour[hourLabel]) {
      slotsByHour[hourLabel] = [];
    }
    slotsByHour[hourLabel].push(slot);
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-secondary mb-2">Design B: Vertical Timeline</h3>
        <p className="text-sm text-gray-600">Scrollable timeline with visual time blocks</p>
      </div>
      
      {/* Day Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevDay}
            disabled={selectedDayIndex === 0}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5 text-secondary" />
          </button>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-secondary">{currentDay?.dayName}</p>
              <p className="text-sm text-gray-600">{currentDay?.dateString}</p>
            </div>
          </div>
          
          <button
            onClick={handleNextDay}
            disabled={selectedDayIndex === availability.length - 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5 text-secondary" />
          </button>
        </div>
        
        {/* Quick Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availability.slice(0, 10).map((day, index) => (
            <button
              key={day.dateString}
              onClick={() => handleDayQuickSelect(index)}
              onDoubleClick={() => handleDayQuickSelect(index)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all
                ${index === selectedDayIndex
                  ? 'bg-primary text-white font-semibold'
                  : 'bg-gray-100 hover:bg-gray-200 text-secondary'
                }
              `}
              title="Click to select this day and first available slot"
            >
              <div className="text-xs">{day.dayName.slice(0, 3)}</div>
              <div className="font-semibold">{day.date.getDate()}</div>
              <div className="text-xs mt-1 opacity-75">
                {day.slots.filter(s => s.available).length}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Timeline View */}
      <div className="max-h-96 overflow-y-auto space-y-4">
        {Object.entries(slotsByHour).map(([hourLabel, slots]) => (
          <div key={hourLabel} className="relative">
            {/* Hour Label */}
            <div className="flex items-start gap-4 mb-2">
              <div className="w-20 flex-shrink-0 pt-1">
                <span className="text-sm font-semibold text-gray-600">{hourLabel}</span>
              </div>
              
              {/* Time Slots */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!slot.available}
                    className={`
                      relative p-4 rounded-lg text-left transition-all
                      ${slot.available 
                        ? slot.id === selectedSlot
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300'
                        : 'bg-gray-50 border-2 border-gray-200 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className={`
                      text-sm font-semibold mb-1
                      ${slot.available 
                        ? slot.id === selectedSlot ? 'text-white' : 'text-green-700'
                        : 'text-gray-400'
                      }
                    `}>
                      {slot.time}
                    </div>
                    <div className={`
                      text-xs
                      ${slot.available 
                        ? slot.id === selectedSlot ? 'text-white/90' : 'text-green-600'
                        : 'text-gray-400'
                      }
                    `}>
                      {slot.available ? (
                        <>
                          <span className="inline-block w-2 h-2 bg-current rounded-full mr-1"></span>
                          Available
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 bg-current rounded-full mr-1"></span>
                          Booked
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {currentDay?.slots.filter(s => s.available).length}
            </p>
            <p className="text-xs text-gray-600">Available Slots</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-400">
              {currentDay?.slots.filter(s => !s.available).length}
            </p>
            <p className="text-xs text-gray-600">Booked Slots</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}


