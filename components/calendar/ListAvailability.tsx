'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react';
import type { DayAvailability, TimeSlot } from '@/lib/mock-availability';

interface ListAvailabilityProps {
  availability: DayAvailability[];
  onSelectSlot?: (slot: TimeSlot) => void;
}

export default function ListAvailability({ availability, onSelectSlot }: ListAvailabilityProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set([availability[0]?.dateString]));
  
  const toggleDay = (dateString: string, autoSelectFirst: boolean = false) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dateString)) {
      newExpanded.delete(dateString);
    } else {
      newExpanded.add(dateString);
      
      // Auto-select first available slot if requested
      if (autoSelectFirst) {
        const day = availability.find(d => d.dateString === dateString);
        const firstAvailableSlot = day?.slots.find(s => s.available);
        if (firstAvailableSlot) {
          handleSlotClick(firstAvailableSlot);
        }
      }
    }
    setExpandedDays(newExpanded);
  };
  
  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot.id);
      onSelectSlot?.(slot);
    }
  };
  
  // Group by week for organization
  const weeks: DayAvailability[][] = [];
  for (let i = 0; i < availability.length; i += 5) {
    weeks.push(availability.slice(i, i + 5));
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-secondary mb-2">Design C: List-Based Availability</h3>
        <p className="text-sm text-gray-600">Simple expandable list format - most mobile-friendly</p>
      </div>
      
      {/* Week Sections */}
      <div className="space-y-6">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="border-b pb-6 last:border-b-0">
            <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
              Week of {week[0]?.dateString}
            </h4>
            
            <div className="space-y-2">
              {week.map((day) => {
                const isExpanded = expandedDays.has(day.dateString);
                const availableCount = day.slots.filter(s => s.available).length;
                
                return (
                  <div key={day.dateString} className="border rounded-lg overflow-hidden">
                    {/* Day Header - Clickable to expand/collapse */}
                    <button
                      onClick={() => toggleDay(day.dateString, false)}
                      onDoubleClick={() => toggleDay(day.dateString, true)}
                      className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                      title="Click to expand, double-click to select first available slot"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-secondary">{day.dayName}</p>
                          <p className="text-sm text-gray-600">{day.dateString}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {availableCount > 0 ? (
                          <span className="text-sm font-medium text-green-600">
                            {availableCount} slots available
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">
                            Fully booked
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {/* Time Slots - Shown when expanded */}
                    {isExpanded && (
                      <div className="p-4 bg-white">
                        {availableCount > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {day.slots.filter(s => s.available).map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => handleSlotClick(slot)}
                                className={`
                                  group relative px-4 py-3 rounded-lg text-sm font-medium transition-all
                                  ${slot.id === selectedSlot
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 hover:border-green-300'
                                  }
                                `}
                              >
                                <div className="flex items-center gap-2 justify-center">
                                  {slot.id === selectedSlot ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Clock className="w-4 h-4" />
                                  )}
                                  {slot.time}
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No available slots for this day</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Selection Summary */}
      {selectedSlot && (
        <div className="mt-6 p-4 bg-primary/10 border-l-4 border-primary rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-secondary">Time Slot Selected</p>
              <p className="text-sm text-gray-600 mt-1">
                {availability.find(d => d.slots.some(s => s.id === selectedSlot))?.dayName},{' '}
                {availability.find(d => d.slots.some(s => s.id === selectedSlot))?.dateString} at{' '}
                {availability.flatMap(d => d.slots).find(s => s.id === selectedSlot)?.time}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-secondary">
              {availability.length}
            </p>
            <p className="text-xs text-gray-600">Business Days</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">
              {availability.reduce((sum, day) => sum + day.slots.filter(s => s.available).length, 0)}
            </p>
            <p className="text-xs text-gray-600">Available Slots</p>
          </div>
          <div>
            <p className="text-xl font-bold text-primary">
              {weeks.length}
            </p>
            <p className="text-xs text-gray-600">Weeks Shown</p>
          </div>
        </div>
      </div>
    </div>
  );
}


