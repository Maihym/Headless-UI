'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import ServiceSelection from './ServiceSelection';
import VisualCalendar from './VisualCalendar';
import TimeSlotPicker from './TimeSlotPicker';
import CustomerForm from './CustomerForm';
import BookingReview from './BookingReview';
import { useAvailability } from '@/lib/hooks/useAvailability';
import { useTimeSlots } from '@/lib/hooks/useTimeSlots';
import { getNextBusinessDay } from '@/lib/date-utils';
import type { BookingData, Service, CustomerInfo, TimeSlot } from '@/types/booking';

interface MobileBookingWizardProps {
  preSelectedService?: 'service' | 'residential-inspection' | 'commercial-inspection';
  onComplete?: (booking: BookingData) => void;
  onStepChange?: (step: number) => void;
}

export default function MobileBookingWizard({ preSelectedService, onComplete, onStepChange }: MobileBookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCustomerFormValid, setIsCustomerFormValid] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  const stepContentRef = useRef<HTMLDivElement>(null);
  const totalSteps = 5;
  
  // Fetch real availability data - memoize to prevent recalculation
  const startDate = useMemo(() => getNextBusinessDay(), []);
  const endDate = useMemo(() => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 30); // 1 month ahead
    return end;
  }, [startDate]);
  
  const { availabilityMap, isLoading: isLoadingAvailability } = useAvailability(startDate, endDate);
  const { timeSlots, isLoading: isLoadingTimeSlots } = useTimeSlots(bookingData.selectedDate);
  
  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData({ ...bookingData, ...updates });
  };
  
  const canAdvance = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!bookingData.service;
      case 2:
        return !!bookingData.selectedDate;
      case 3:
        return !!bookingData.selectedTimeSlot;
      case 4:
        return isCustomerFormValid;
      case 5:
        return true;
      default:
        return false;
    }
  };
  
  const scrollToContent = () => {
    // Small delay to ensure DOM has updated
    setTimeout(() => {
      if (stepContentRef.current) {
        stepContentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
        });
      }
    }, 100);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (onStepChange) {
      onStepChange(step);
    }
    scrollToContent();
  };
  
  const handleNext = () => {
    if (canAdvance() && currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onStepChange) {
        onStepChange(nextStep);
      }
      scrollToContent();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (onStepChange) {
        onStepChange(prevStep);
      }
      scrollToContent();
    }
  };
  
  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Transform wizard data to API format
          firstName: bookingData.customerInfo?.firstName,
          lastName: bookingData.customerInfo?.lastName,
          phone: bookingData.customerInfo?.phone,
          email: bookingData.customerInfo?.email,
          address: bookingData.customerInfo?.address,
          aptSuite: bookingData.customerInfo?.aptSuite,
          serviceType: bookingData.service?.id,
          serviceName: bookingData.service?.name,
          servicePrice: bookingData.service?.price,
          slotStart: bookingData.selectedTimeSlot?.start,
          slotEnd: bookingData.selectedTimeSlot?.end,
          notes: bookingData.customerInfo?.notes,
          referralSource: bookingData.customerInfo?.referralSource,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('This time slot is no longer available. Please select a different time.');
          goToStep(3); // Go back to time selection
          return;
        }
        throw new Error(data.error || 'Booking failed');
      }

      // Success!
      setIsSuccess(true);
      if (onComplete) {
        onComplete(bookingData);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Success screen
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Booking Confirmed!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Your appointment has been scheduled successfully. You&apos;ll receive a confirmation email shortly with all the details and a calendar invite.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-secondary mb-4">Appointment Summary</h3>
            <div className="space-y-2 text-left">
              <p><span className="font-semibold">Name:</span> {bookingData.customerInfo?.firstName} {bookingData.customerInfo?.lastName}</p>
              <p><span className="font-semibold">Service:</span> {bookingData.service?.name}</p>
              <p><span className="font-semibold">Date:</span> {bookingData.selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><span className="font-semibold">Time:</span> {bookingData.selectedTimeSlot?.time}</p>
              <p><span className="font-semibold">Price:</span> {bookingData.service?.price}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <a
              href="tel:6572396331"
              className="block w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              Call Us: (657) 239-6331
            </a>
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-secondary font-semibold py-4 px-6 rounded-lg transition-colors text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Step Content */}
        <div ref={stepContentRef} className="mt-8 mb-8">
          {currentStep === 1 && (
            <ServiceSelection
              selectedService={bookingData.service}
              onSelectService={(service: Service) => updateBookingData({ service })}
            />
          )}
          
          {currentStep === 2 && (
            <>
              {isLoadingAvailability ? (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-48" />
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <VisualCalendar
                  selectedDate={bookingData.selectedDate}
                  onSelectDate={(date: Date) => {
                    updateBookingData({ selectedDate: date, selectedTimeSlot: undefined });
                  }}
                  onDateDoubleClick={(date: Date) => {
                    updateBookingData({ selectedDate: date, selectedTimeSlot: undefined });
                    handleNext(); // Auto-advance to time slot selection
                  }}
                  availabilityMap={availabilityMap}
                />
              )}
            </>
          )}
          
          {currentStep === 3 && bookingData.selectedDate && (
            <>
              {isLoadingTimeSlots ? (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-64" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : (
                <TimeSlotPicker
                  selectedDate={bookingData.selectedDate}
                  timeSlots={timeSlots}
                  selectedTimeSlot={bookingData.selectedTimeSlot}
                  onSelectTimeSlot={(slot: TimeSlot) => updateBookingData({ selectedTimeSlot: slot })}
                />
              )}
            </>
          )}
          
          {currentStep === 4 && (
            <CustomerForm
              customerInfo={bookingData.customerInfo || {}}
              onUpdateInfo={(info: Partial<CustomerInfo>) => 
                updateBookingData({ customerInfo: { ...bookingData.customerInfo, ...info } as CustomerInfo })
              }
              onValidationChange={setIsCustomerFormValid}
            />
          )}
          
          {currentStep === 5 && (
            <BookingReview
              bookingData={bookingData}
              onEdit={goToStep}
              onConfirm={handleConfirm}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
        
        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex items-center gap-4 pt-6 border-t">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-4 text-gray-600 hover:text-secondary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!canAdvance() || !isOnline}
              className="ml-auto flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-md"
              aria-label={currentStep === totalSteps - 1 ? 'Review Booking' : 'Continue to next step'}
            >
              {currentStep === totalSteps - 1 ? 'Review Booking' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


