'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Review } from '@/types/review';

interface TestimonialCarouselProps {
  reviews: Review[];
}

export default function TestimonialCarousel({ reviews }: TestimonialCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Filter for quality reviews - show all reviews with meaningful content
  const displayReviews = reviews
    .filter(review => review.rating >= 4 && review.text.length > 50)
    .sort((a, b) => b.rating - a.rating); // Sort by rating (highest first)

  return (
    <div className="relative px-4 md:px-0">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayReviews.map((review, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] min-w-0 px-2 md:px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col mx-auto max-w-md md:max-w-none">
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-primary"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 flex-grow">
                  &quot;{review.text.length > 200 ? review.text.substring(0, 200) + '...' : review.text}&quot;
                </p>

                {/* Author Info */}
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-secondary">— {review.author}</p>
                  {review.date && (
                    <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                  )}
                  {review.source && (
                    <p className="text-xs text-primary mt-1">via {review.source}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
      <button
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6 text-secondary" />
      </button>
      <button
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6 text-secondary" />
      </button>

      {/* Pagination Dots - Show count and position instead of all dots when there are many reviews */}
      {displayReviews.length <= 10 ? (
        <div className="flex justify-center gap-2 mt-8">
          {displayReviews.map((_, idx) => (
            <button
              key={idx}
              className={`h-2.5 rounded-full transition-all touch-manipulation ${
                idx === selectedIndex
                  ? 'bg-primary w-10'
                  : 'bg-gray-300 w-2.5 hover:bg-gray-400'
              }`}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="text-sm text-gray-600">
            Review {selectedIndex + 1} of {displayReviews.length}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 bg-gray-200 rounded-full w-32 md:w-48 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((selectedIndex + 1) / displayReviews.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

