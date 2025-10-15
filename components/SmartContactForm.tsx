'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, User, Calendar, Clock, MessageSquare, DollarSign } from 'lucide-react';

type FormData = {
  requestType: string;
  name: string;
  phone: string;
  email: string;
  serviceType?: string;
  preferredDate?: string;
  preferredTime?: string;
  subject?: string;
  message: string;
};

export default function SmartContactForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const hasInitialized = useRef(false);
  
  const [requestType, setRequestType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const watchRequestType = watch('requestType');

  // Pre-select form type based on URL parameter (only on initial load)
  useEffect(() => {
    if (typeParam && !hasInitialized.current) {
      let formType = '';
      switch (typeParam) {
        case 'quote':
          formType = 'quote';
          break;
        case 'service':
          formType = 'service-call';
          break;
        case 'inspection-residential':
          formType = 'inspection-residential';
          break;
        case 'inspection-commercial':
          formType = 'inspection-commercial';
          break;
        case 'emergency':
          formType = 'emergency';
          break;
      }
      if (formType) {
        setValue('requestType', formType);
        setRequestType(formType);
        hasInitialized.current = true;
      }
    }
  }, [typeParam, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Route to appropriate API based on request type
      const endpoint = data.requestType === 'quote' ? '/api/contact' : '/api/booking';
      
      // Format data based on type
      const payload = data.requestType === 'quote' 
        ? {
            name: data.name,
            phone: data.phone,
            email: data.email,
            subject: data.subject || `Quote Request - ${data.serviceType}`,
            message: data.message,
          }
        : {
            name: data.name,
            phone: data.phone,
            email: data.email,
            serviceType: data.serviceType,
            preferredDate: data.preferredDate,
            preferredTime: data.preferredTime,
            message: data.message,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setRequestType('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setRequestType(newValue);
    setValue('requestType', newValue);
    setSubmitStatus('idle');
    
    // Clear form fields when switching types
    setValue('serviceType', '');
    setValue('preferredDate', '');
    setValue('preferredTime', '');
    setValue('subject', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Request Type Selection */}
      <div>
        <label htmlFor="requestType" className="block text-lg font-semibold text-secondary mb-3">
          How can we help you today? *
        </label>
        <select
          id="requestType"
          {...register('requestType', { required: 'Please select how we can help you' })}
          onChange={handleRequestTypeChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
        >
          <option value="">Select a service...</option>
          <option value="quote">Free Project Quote (Panel, EV Charger, Rewiring, etc.)</option>
          <option value="service-call">Book Service Call - $189</option>
          <option value="inspection-residential">Book Residential Inspection - $350</option>
          <option value="inspection-commercial">Request Commercial Inspection Quote</option>
          <option value="emergency">Emergency Service (Call Now)</option>
        </select>
        {errors.requestType && <p className="mt-1 text-sm text-red-600">{errors.requestType.message}</p>}
      </div>

      {/* Emergency Message */}
      {watchRequestType === 'emergency' && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold text-red-600 mb-3">Call Us Immediately</h3>
          <p className="text-gray-700 mb-4">For emergency electrical service, please call us directly:</p>
          <a
            href="tel:6572396331"
            className="inline-flex items-center bg-red-600 text-white hover:bg-red-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            <Phone className="h-6 w-6 mr-2" />
            (657) 239-6331
          </a>
          <p className="text-sm text-gray-600 mt-3">Available 24/7 for emergencies</p>
        </div>
      )}

      {/* Show form only if not emergency */}
      {watchRequestType && watchRequestType !== 'emergency' && (
        <>
          {/* Pricing Info */}
          {(watchRequestType === 'service-call' || watchRequestType === 'inspection-residential') && (
            <div className="bg-primary/10 border border-primary rounded-lg p-4 flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-secondary">
                  {watchRequestType === 'service-call' ? 'Service Call: $189' : 'Residential Inspection: $350'}
                </p>
                <p className="text-sm text-gray-600">Payment due at time of service</p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Service Type - For Quote Requests */}
          {watchRequestType === 'quote' && (
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                What project do you need a quote for? *
              </label>
              <input
                id="serviceType"
                type="text"
                {...register('serviceType', { required: 'Please describe your project' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Panel upgrade, EV charger installation, etc."
              />
              {errors.serviceType && <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>}
            </div>
          )}

          {/* Date & Time - For Bookings */}
          {(watchRequestType === 'service-call' || watchRequestType === 'inspection-residential') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="preferredDate"
                    type="date"
                    {...register('preferredDate', { required: 'Preferred date is required' })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.preferredDate && <p className="mt-1 text-sm text-red-600">{errors.preferredDate.message}</p>}
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="preferredTime"
                    type="time"
                    {...register('preferredTime', { required: 'Preferred time is required' })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {errors.preferredTime && <p className="mt-1 text-sm text-red-600">{errors.preferredTime.message}</p>}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              {watchRequestType === 'quote' ? 'Project Details *' : 'Additional Notes (Optional)'}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="message"
                rows={5}
                {...register('message', watchRequestType === 'quote' ? { required: 'Please provide project details' } : {})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={
                  watchRequestType === 'quote'
                    ? 'Tell us about your project, timeline, and any specific requirements...'
                    : 'Any specific issues or requirements we should know about?'
                }
              />
            </div>
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
            >
              {isSubmitting
                ? 'Sending...'
                : watchRequestType === 'quote' || watchRequestType === 'inspection-commercial'
                ? 'Request Quote'
                : 'Book Appointment'}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {watchRequestType === 'quote' || watchRequestType === 'inspection-commercial' ? (
                <>Thank you! We&apos;ve received your quote request and will contact you within 24 hours.</>
              ) : (
                <>Thank you! Your appointment request has been received. We&apos;ll send you a confirmation shortly.</>
              )}
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              Sorry, something went wrong. Please call us at (657) 239-6331 instead.
            </div>
          )}
        </>
      )}
    </form>
  );
}

