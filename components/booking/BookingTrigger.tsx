'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from './BookingModal';
import type { BookingData, Service } from '@/types/booking';

interface BookingTriggerProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  preSelectedService?: Service['id'];
  onComplete?: (booking: BookingData) => void;
}

export default function BookingTrigger({
  variant = 'primary',
  size = 'md',
  text = 'Book Now',
  className = '',
  preSelectedService,
  onComplete,
}: BookingTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl',
    outline: 'bg-white hover:bg-gray-50 text-primary border-2 border-primary shadow-md hover:shadow-lg',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleComplete = (booking: BookingData) => {
    setIsModalOpen(false);
    if (onComplete) {
      onComplete(booking);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`
          inline-flex items-center gap-2 font-bold rounded-lg transition-all
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
      >
        <Calendar className="w-5 h-5" />
        {text}
      </button>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedService={preSelectedService}
        onComplete={handleComplete}
      />
    </>
  );
}

