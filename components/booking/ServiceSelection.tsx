import { Wrench, ClipboardCheck, Building2 } from 'lucide-react';
import type { Service } from '@/types/booking';
import { SERVICES } from '@/types/booking';

interface ServiceSelectionProps {
  selectedService?: Service;
  onSelectService: (service: Service) => void;
}

const SERVICE_ICONS = {
  service: Wrench,
  'residential-inspection': ClipboardCheck,
  'commercial-inspection': Building2,
};

export default function ServiceSelection({ selectedService, onSelectService }: ServiceSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
          What do you need?
        </h2>
        <p className="text-gray-600">
          Select the service you&apos;d like to book
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = SERVICE_ICONS[service.id];
          const isSelected = selectedService?.id === service.id;
          
          return (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`
                group relative p-6 rounded-xl text-left transition-all
                min-h-[200px] flex flex-col
                ${isSelected
                  ? 'bg-primary text-white shadow-xl ring-4 ring-primary/20'
                  : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary/30 shadow-md hover:shadow-lg'
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
                  ${isSelected ? 'bg-white/20' : 'bg-primary/10 group-hover:bg-primary/20'}
                `}
              >
                <Icon
                  className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-primary'}`}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-secondary'}`}>
                  {service.name}
                </h3>
                <p className={`text-sm mb-3 ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  {service.description}
                </p>
              </div>
              
              {/* Price */}
              <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-primary'}`}>
                {service.price}
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


