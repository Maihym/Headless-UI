'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { User, Phone, Mail, MapPin, Home, FileText } from 'lucide-react';
import type { CustomerInfo } from '@/types/booking';

interface CustomerFormProps {
  customerInfo: Partial<CustomerInfo>;
  onUpdateInfo: (info: Partial<CustomerInfo>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function CustomerForm({ 
  customerInfo, 
  onUpdateInfo,
  onValidationChange 
}: CustomerFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerInfo, boolean>>>({});
  const addressInputRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  
  // Validation functions (must be defined before handleChange)
  const validateFirstName = (value: string): string | undefined => {
    if (!value || value.trim().length === 0) {
      return 'First name is required';
    }
    if (value.trim().length < 2) {
      return 'First name must be at least 2 characters';
    }
    if (value.length > 50) {
      return 'First name is too long (max 50 characters)';
    }
    return undefined;
  };

  const validateLastName = (value: string): string | undefined => {
    if (!value || value.trim().length === 0) {
      return 'Last name is required';
    }
    if (value.trim().length < 2) {
      return 'Last name must be at least 2 characters';
    }
    if (value.length > 50) {
      return 'Last name is too long (max 50 characters)';
    }
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    if (!value || value.trim().length === 0) {
      return 'Phone number is required';
    }
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) {
      return 'Phone number must be 10 digits';
    }
    // Validate US area code (not 0 or 1)
    if (digits[0] === '0' || digits[0] === '1') {
      return 'Invalid area code';
    }
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value || value.trim().length === 0) {
      return 'Email is required';
    }
    // More robust email validation (RFC 5322 compliant)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    if (value.length > 254) { // RFC 5321
      return 'Email address is too long';
    }
    return undefined;
  };

  const validateAddress = (value: string): string | undefined => {
    if (!value || value.trim().length === 0) {
      return 'Service address is required';
    }
    if (value.trim().length < 5) {
      return 'Please enter a complete address (street, city, state, ZIP)';
    }
    if (!value.includes(',')) {
      return 'Please use the address suggestions for a complete address';
    }
    if (value.length > 255) {
      return 'Address is too long (max 255 characters)';
    }
    return undefined;
  };

  // Event handlers (must be defined before useEffect that uses them)
  const handleChange = useCallback((field: keyof CustomerInfo, value: string) => {
    onUpdateInfo({ [field]: value });
    
    // Mark field as touched (use functional update to avoid stale state)
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate field
    let error: string | undefined;
    switch (field) {
      case 'firstName':
        error = validateFirstName(value);
        break;
      case 'lastName':
        error = validateLastName(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
    }
    
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, [onUpdateInfo]);

  const handleBlur = useCallback((field: keyof CustomerInfo) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Auto-focus first field on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      firstNameRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-focus first error field when errors occur
  useEffect(() => {
    const firstErrorField = Object.keys(errors).find(key => errors[key as keyof typeof errors]);
    if (firstErrorField && touched[firstErrorField as keyof typeof touched]) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors, touched]);

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (!addressInputRef.current) return;

    let autocompleteInstance: any = null;

    const initAutocomplete = () => {
      // Wait for Google Maps to be available
      if (typeof (window as any).google === 'undefined' || !(window as any).google.maps || !(window as any).google.maps.places) {
        console.log('[Autocomplete] Google Maps not loaded yet, retrying...');
        setTimeout(initAutocomplete, 100);
        return;
      }

      try {
        console.log('[Autocomplete] Initializing Google Places Autocomplete');
        
        // Create Autocomplete on the input element
        autocompleteInstance = new (window as any).google.maps.places.Autocomplete(
          addressInputRef.current!,
          {
            componentRestrictions: { country: 'us' },
            fields: ['formatted_address'],
            strictBounds: false,
          }
        );

        console.log('[Autocomplete] Autocomplete instance created');

        // Listen for place selection
        autocompleteInstance.addListener('place_changed', () => {
          console.log('[Autocomplete] Place changed event fired');
          const place = autocompleteInstance.getPlace();
          console.log('[Autocomplete] Selected place:', place);
          if (place.formatted_address) {
            handleChange('address', place.formatted_address);
          }
        });
      } catch (error) {
        console.error('[Autocomplete] Error initializing:', error);
      }
    };

    initAutocomplete();

    // Monitor pac-container for comprehensive debugging
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.classList.contains('pac-container')) {
                console.log('[PAC] pac-container added to DOM');
                
                // Log detailed pac-container info
                setTimeout(() => {
                  const pacContainer = document.querySelector('.pac-container') as HTMLElement;
                  if (pacContainer) {
                    const computedStyle = window.getComputedStyle(pacContainer);
                    const rect = pacContainer.getBoundingClientRect();
                    
                    console.log('[PAC] Container details:', {
                      display: computedStyle.display,
                      visibility: computedStyle.visibility,
                      opacity: computedStyle.opacity,
                      zIndex: computedStyle.zIndex,
                      position: computedStyle.position,
                      pointerEvents: computedStyle.pointerEvents,
                      top: computedStyle.top,
                      left: computedStyle.left,
                      width: computedStyle.width,
                      height: computedStyle.height,
                      rect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        visible: rect.height > 0 && rect.width > 0
                      },
                      itemCount: pacContainer.querySelectorAll('.pac-item').length,
                      parentElement: pacContainer.parentElement?.tagName
                    });
                  }
                }, 100);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Track clicks on pac-container items
    const handleDocumentClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const pacItem = target.closest('.pac-item');
      const pacContainer = target.closest('.pac-container');
      
      if (pacItem || pacContainer) {
        console.log('[PAC] Click detected:', {
          isPacItem: !!pacItem,
          isPacContainer: !!pacContainer,
          target: target.tagName,
          classList: target.classList.value
        });
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    document.addEventListener('mousedown', handleDocumentClick, true);
    document.addEventListener('touchstart', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('mousedown', handleDocumentClick, true);
      document.removeEventListener('touchstart', handleDocumentClick, true);
      observer.disconnect();
      
      if (autocompleteInstance && (window as any).google?.maps?.event) {
        (window as any).google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [handleChange]);

  // Check if form is valid
  const checkFormValidity = useCallback(() => {
    const firstNameError = validateFirstName(customerInfo.firstName || '');
    const lastNameError = validateLastName(customerInfo.lastName || '');
    const phoneError = validatePhone(customerInfo.phone || '');
    const emailError = validateEmail(customerInfo.email || '');
    const addressError = validateAddress(customerInfo.address || '');
    
    const isValid = !firstNameError && !lastNameError && !phoneError && !emailError && !addressError;
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
    
    return isValid;
  }, [customerInfo, onValidationChange]);

  // Check validity whenever customer info changes
  useEffect(() => {
    checkFormValidity();
  }, [customerInfo, checkFormValidity]);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleChange('phone', formatted);
  };

  const showError = (field: keyof CustomerInfo) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
          Your information
        </h2>
        <p className="text-gray-600">
          We&apos;ll use this to confirm your appointment
        </p>
      </div>
      
      <div className="space-y-5">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-secondary mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={firstNameRef}
              type="text"
              id="firstName"
              value={customerInfo.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              aria-label="First name"
              aria-invalid={!!showError('firstName')}
              aria-describedby={showError('firstName') ? 'firstName-error' : undefined}
              className={`
                w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 transition-colors
                ${showError('firstName')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-primary focus:ring-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-20
              `}
              placeholder="John"
            />
          </div>
          {showError('firstName') && (
            <p id="firstName-error" role="alert" className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-secondary mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="lastName"
              value={customerInfo.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              aria-label="Last name"
              aria-invalid={!!showError('lastName')}
              aria-describedby={showError('lastName') ? 'lastName-error' : undefined}
              className={`
                w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 transition-colors
                ${showError('lastName')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-primary focus:ring-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-20
              `}
              placeholder="Smith"
            />
          </div>
          {showError('lastName') && (
            <p id="lastName-error" role="alert" className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-secondary mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              value={customerInfo.phone || ''}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => handleBlur('phone')}
              aria-label="Phone number"
              aria-invalid={!!showError('phone')}
              aria-describedby={showError('phone') ? 'phone-error' : undefined}
              className={`
                w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 transition-colors
                ${showError('phone')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-primary focus:ring-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-20
              `}
              placeholder="(555) 123-4567"
            />
          </div>
          {showError('phone') && (
            <p id="phone-error" role="alert" className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={customerInfo.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              aria-label="Email address"
              aria-invalid={!!showError('email')}
              aria-describedby={showError('email') ? 'email-error' : undefined}
              className={`
                w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 transition-colors
                ${showError('email')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-primary focus:ring-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-20
              `}
              placeholder="john@example.com"
            />
          </div>
          {showError('email') && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Address with Google Places Autocomplete */}
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-secondary mb-2">
            Service Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={addressInputRef}
              type="text"
              id="address"
              value={customerInfo.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              aria-label="Service address"
              aria-invalid={!!showError('address')}
              aria-describedby={showError('address') ? 'address-error' : undefined}
              className={`
                w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 transition-colors
                ${showError('address')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-primary focus:ring-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-20
              `}
              placeholder="Start typing your address..."
            />
          </div>
          {showError('address') && (
            <p id="address-error" role="alert" className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
          <p className="mt-1.5 text-xs text-gray-500">
            Start typing and select your address from the suggestions
          </p>
        </div>

        {/* Apt/Suite/Unit (optional) */}
        <div>
          <label htmlFor="aptSuite" className="block text-sm font-semibold text-secondary mb-2">
            Apt / Suite / Unit <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Home className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="aptSuite"
              value={customerInfo.aptSuite || ''}
              onChange={(e) => handleChange('aptSuite', e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-primary focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors"
              placeholder="Apt 4B"
            />
          </div>
        </div>
        
        {/* How did you hear about us (optional) */}
        <div>
          <label htmlFor="referralSource" className="block text-sm font-semibold text-secondary mb-2">
            How did you hear about us? <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <select
            id="referralSource"
            value={customerInfo.referralSource || ''}
            onChange={(e) => handleChange('referralSource', e.target.value)}
            className="w-full px-4 py-4 text-lg rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-primary focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors appearance-none bg-white cursor-pointer"
          >
            <option value="">Select one...</option>
            <option value="google">Google Search</option>
            <option value="yelp">Yelp</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="referral">Referral from friend/family</option>
            <option value="nextdoor">Nextdoor</option>
            <option value="repeat">Repeat customer</option>
            <option value="other">Other</option>
          </select>
          <p className="mt-1.5 text-xs text-gray-500">
            Help us understand how customers find us
          </p>
        </div>

        {/* Notes (optional) */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-secondary mb-2">
            Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-4 left-0 pl-4 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="notes"
              value={customerInfo.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-primary focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors resize-none"
              placeholder="Any specific details about your electrical issue or preferences..."
            />
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Note:</span> All fields marked with <span className="text-red-500">*</span> are required to complete your booking.
        </p>
      </div>
    </div>
  );
}
