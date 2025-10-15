export type ServiceType = 'service' | 'residential-inspection' | 'commercial-inspection';

export interface Service {
  id: ServiceType;
  name: string;
  price: string;
  description: string;
  duration: number; // in minutes
}

export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  time: string; // formatted time string
}

export interface BookingData {
  service?: Service;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
  customerInfo?: CustomerInfo;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  aptSuite?: string;
  notes?: string;
  referralSource?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  service: Service;
  date: Date;
  timeSlot: TimeSlot;
  customer: CustomerInfo;
  calendarEventId?: string;
}

export const SERVICES: Service[] = [
  {
    id: 'service',
    name: 'Service Call',
    price: '$189',
    description: 'Standard electrical service call with 2-hour service window',
    duration: 120,
  },
  {
    id: 'residential-inspection',
    name: 'Residential Inspection',
    price: '$350',
    description: 'Comprehensive electrical inspection for residential properties',
    duration: 120,
  },
  {
    id: 'commercial-inspection',
    name: 'Commercial Inspection',
    price: 'Custom Quote',
    description: 'Electrical inspection for commercial properties - pricing varies by size',
    duration: 120,
  },
];


