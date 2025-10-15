'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import MobileBookingWizard from './MobileBookingWizard';
import type { BookingData, Service } from '@/types/booking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: Service['id'];
  onComplete?: (booking: BookingData) => void;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  preSelectedService,
  onComplete 
}: BookingModalProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Prevent modal from closing when clicking on Google Places autocomplete
  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pacContainer = target.closest('.pac-container');
      
      if (pacContainer) {
        console.log('[Modal] Preventing modal close from pac-container click');
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    // Capture phase to intercept before Dialog's listener
    document.addEventListener('mousedown', handleDocumentMouseDown, true);
    document.addEventListener('click', handleDocumentMouseDown, true);
    document.addEventListener('touchstart', handleDocumentMouseDown, true);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown, true);
      document.removeEventListener('click', handleDocumentMouseDown, true);
      document.removeEventListener('touchstart', handleDocumentMouseDown, true);
    };
  }, [isOpen]);

  const handleClose = () => {
    if (hasStarted) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    setHasStarted(false);
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmClose(false);
  };

  const handleComplete = (booking: BookingData) => {
    setHasStarted(false);
    if (onComplete) {
      onComplete(booking);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-0 md:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-screen md:h-auto md:max-h-[90vh] md:max-w-5xl transform overflow-y-auto md:rounded-2xl bg-gray-50 shadow-xl transition-all">
                  {/* Header */}
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 md:px-6">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-xl md:text-2xl font-bold text-secondary">
                        Book Your Appointment
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                        onClick={handleClose}
                      >
                        <span className="sr-only">Close</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <MobileBookingWizard
                      preSelectedService={preSelectedService}
                      onComplete={handleComplete}
                      onStepChange={(step) => {
                        if (step > 1) {
                          setHasStarted(true);
                        }
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Confirm Close Dialog */}
      <Transition appear show={showConfirmClose} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={cancelClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold text-secondary mb-2">
                    Close booking form?
                  </Dialog.Title>
                  <p className="text-sm text-gray-600 mb-6">
                    Your progress will be lost if you close this form. Are you sure you want to continue?
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-secondary font-semibold rounded-lg transition-colors"
                      onClick={cancelClose}
                    >
                      Keep Editing
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                      onClick={confirmClose}
                    >
                      Yes, Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

