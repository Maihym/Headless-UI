import { Clock } from 'lucide-react';
import { formatDateLong, formatTime } from '@/lib/date-utils';
import type { TimeSlot } from '@/types/booking';

interface TimeSlotPickerProps {
  selectedDate: Date;
  timeSlots: TimeSlot[];
  selectedTimeSlot?: TimeSlot;
  onSelectTimeSlot: (slot: TimeSlot) => void;
}

export default function TimeSlotPicker({
  selectedDate,
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot,
}: TimeSlotPickerProps) {
  // Sort all slots chronologically first
  const sortedSlots = [...timeSlots].sort((a, b) => a.start.getTime() - b.start.getTime());
  
  // Then filter into morning and afternoon
  const morningSlots = sortedSlots.filter(slot => slot.start.getHours() < 12);
  const afternoonSlots = sortedSlots.filter(slot => slot.start.getHours() >= 12);
  
  const SlotButton = ({ slot }: { slot: TimeSlot }) => {
    const isSelected = selectedTimeSlot?.id === slot.id;
    
    return (
      <button
        onClick={() => onSelectTimeSlot(slot)}
        className={`
          relative p-4 rounded-lg text-center transition-all font-semibold
          min-h-[64px] flex items-center justify-center gap-2
          ${isSelected
            ? 'bg-primary text-white shadow-lg ring-4 ring-primary/20 scale-105'
            : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary/50 shadow-sm hover:shadow-md hover:scale-102'
          }
        `}
      >
        <Clock className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
        <span className="text-lg">{slot.time}</span>
        
        {isSelected && (
          <div className="absolute top-2 right-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </button>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
          Choose your time
        </h2>
        <p className="text-gray-600 mb-4">
          {formatDateLong(selectedDate)}
        </p>
      </div>
      
      {selectedTimeSlot && (
        <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Selected Time</p>
          <p className="text-lg font-bold text-secondary">
            {selectedTimeSlot.time}
          </p>
        </div>
      )}
      
      {timeSlots.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No available time slots for this date</p>
          <p className="text-gray-400 text-sm mt-2">Please select a different date</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Morning slots */}
          {morningSlots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <span className="text-yellow-500">☀️</span>
                Morning
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {morningSlots.map((slot) => (
                  <SlotButton key={slot.id} slot={slot} />
                ))}
              </div>
            </div>
          )}
          
          {/* Afternoon slots */}
          {afternoonSlots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <span className="text-orange-500">🌤️</span>
                Afternoon
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {afternoonSlots.map((slot) => (
                  <SlotButton key={slot.id} slot={slot} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


