import { CheckCircle, Calendar, Clock, User, Phone, Mail, MapPin, FileText, Edit2 } from 'lucide-react';
import { formatDateLong } from '@/lib/date-utils';
import type { BookingData } from '@/types/booking';

interface BookingReviewProps {
  bookingData: BookingData;
  onEdit: (step: number) => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export default function BookingReview({ bookingData, onEdit, onConfirm, isSubmitting }: BookingReviewProps) {
  const { service, selectedDate, selectedTimeSlot, customerInfo } = bookingData;
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
          Review your booking
        </h2>
        <p className="text-gray-600">
          Please confirm all details are correct
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Service */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-secondary">Service</h3>
            <button
              onClick={() => onEdit(1)}
              className="text-primary hover:text-accent flex items-center gap-1 text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-secondary">{service?.name}</p>
            <p className="text-gray-600">{service?.description}</p>
            <p className="text-2xl font-bold text-primary">{service?.price}</p>
          </div>
        </div>
        
        {/* Date & Time */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-secondary">Date & Time</h3>
            <button
              onClick={() => onEdit(2)}
              className="text-primary hover:text-accent flex items-center gap-1 text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <p className="text-lg font-semibold text-secondary">
                {selectedDate && formatDateLong(selectedDate)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <p className="text-lg font-semibold text-secondary">
                {selectedTimeSlot?.time}
              </p>
            </div>
          </div>
        </div>
        
        {/* Customer Information */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2 border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-secondary">Your Information</h3>
            <button
              onClick={() => onEdit(4)}
              className="text-primary hover:text-accent flex items-center gap-1 text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-secondary">
                  {customerInfo?.firstName} {customerInfo?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-secondary">{customerInfo?.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-secondary">{customerInfo?.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Service Address</p>
                <p className="font-semibold text-secondary">
                  {customerInfo?.address}
                  {customerInfo?.aptSuite && (
                    <span className="block text-gray-600 text-sm mt-1">
                      {customerInfo.aptSuite}
                    </span>
                  )}
                </p>
              </div>
            </div>
            {customerInfo?.notes && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-semibold text-secondary">{customerInfo.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirm Button */}
      <div className="pt-4">
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              Confirm Booking
            </>
          )}
        </button>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-700">
          By confirming, you agree to our terms of service. You&apos;ll receive a confirmation email with appointment details and a calendar invite.
        </p>
      </div>
    </div>
  );
}


