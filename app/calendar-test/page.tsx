'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Sparkles } from 'lucide-react';
import { useAvailability } from '@/lib/hooks/useAvailability';
import { getNextBusinessDay } from '@/lib/date-utils';
import { type DayAvailability } from '@/lib/mock-availability';
import CompactWeekGrid from '@/components/calendar/CompactWeekGrid';
import VerticalTimeline from '@/components/calendar/VerticalTimeline';
import ListAvailability from '@/components/calendar/ListAvailability';
import BookingTrigger from '@/components/booking/BookingTrigger';

export default function CalendarTestPage() {
  const [mounted, setMounted] = useState(false);
  
  // Only run on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch real availability data
  const startDate = useMemo(() => getNextBusinessDay(), []);
  const endDate = useMemo(() => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 28); // 4 weeks ahead
    return end;
  }, [startDate]);
  
  const { availabilityMap, isLoading } = useAvailability(startDate, endDate);
  
  // Convert Map to array format for legacy components
  // Note: slots are empty - real data is fetched from Google Calendar API on demand
  const mockAvailability = useMemo(() => {
    const availability: DayAvailability[] = [];
    availabilityMap.forEach((count, dateStr) => {
      // Only include days with available slots
      if (count > 0) {
        const date = new Date(dateStr);
        availability.push({
          date: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dateString: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          }),
          slots: [], // Empty - components show count only, real slots from Google Calendar
        });
      }
    });
    return availability;
  }, [availabilityMap]);
  
  // Show loading state while mounting or fetching data
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-6"></div>
            <h2 className="text-2xl font-bold text-secondary mb-2">Loading Calendar Data...</h2>
            <p className="text-gray-600">Fetching real-time availability from API</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 text-primary hover:text-accent mb-4 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Contact
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Calendar Booking Design Options
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-secondary mb-1">Test Page - Design Review</p>
                <p className="text-sm text-gray-700">
                  This page shows three different calendar booking interface designs. Each uses mock data to demonstrate 
                  how availability would be displayed. The selected design will be integrated with real Google Calendar data.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Rules */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-secondary mb-4">Booking Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-secondary mb-2">Business Hours</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Monday - Friday: 9:00 AM - 5:00 PM</li>
                <li>• Saturday: By appointment only (call in)</li>
                <li>• Sunday: Emergency only (call in)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-secondary mb-2">Appointment Details</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Duration: 2 hours per appointment</li>
                <li>• Buffer: 45 minutes between appointments</li>
                <li>• Time slots: Every 30 minutes</li>
                <li>• Booking window: Next business day to 1 month ahead</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* NEW Mobile-First Wizard */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary via-accent to-primary p-1 rounded-2xl">
            <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-semibold mb-4">
                  <Sparkles className="w-5 h-5" />
                  NEW - Mobile-First Design
                </div>
                <h2 className="text-3xl font-bold text-secondary mb-3">
                  Step-by-Step Booking Wizard
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Simple, intuitive, mobile-optimized booking flow with Google Places autocomplete, validation, and smart auto-scrolling. Click below to experience the modal!
                </p>
                <BookingTrigger
                  variant="primary"
                  size="lg"
                  text="Open Booking Modal"
                  onComplete={(booking) => {
                    console.log('Booking completed:', booking);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-16 pt-8">
          <h3 className="text-2xl font-bold text-secondary mb-3 text-center">
            Previous Design Options
          </h3>
          <p className="text-center text-gray-600 mb-8">
            For reference - these were the original calendar views
          </p>
        </div>
        
        {/* Design Options */}
        <div className="space-y-8">
          {/* Design A: Compact Week Grid */}
          <section id="design-a">
            <CompactWeekGrid 
              availability={mockAvailability}
              onSelectSlot={(slot) => console.log('Design A - Selected:', slot)}
            />
          </section>
          
          {/* Design B: Vertical Timeline */}
          <section id="design-b">
            <VerticalTimeline 
              availability={mockAvailability}
              onSelectSlot={(slot) => console.log('Design B - Selected:', slot)}
            />
          </section>
          
          {/* Design C: List-Based Availability */}
          <section id="design-c">
            <ListAvailability 
              availability={mockAvailability}
              onSelectSlot={(slot) => console.log('Design C - Selected:', slot)}
            />
          </section>
        </div>
        
        {/* Comparison Table */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-secondary mb-6">Design Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-secondary">Feature</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary">Design A: Grid</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary">Design B: Timeline</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary">Design C: List</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium">Desktop Experience</td>
                  <td className="py-3 px-4 text-green-600">Excellent - See whole week</td>
                  <td className="py-3 px-4 text-green-600">Good - Day-by-day view</td>
                  <td className="py-3 px-4 text-yellow-600">Fair - Lots of scrolling</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Mobile Experience</td>
                  <td className="py-3 px-4 text-yellow-600">Fair - Requires adaptation</td>
                  <td className="py-3 px-4 text-green-600">Good - Swipe-friendly</td>
                  <td className="py-3 px-4 text-green-600">Excellent - Native feel</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Visual Density</td>
                  <td className="py-3 px-4">High - Lots of info at once</td>
                  <td className="py-3 px-4">Medium - Focused on one day</td>
                  <td className="py-3 px-4">Low - Expandable sections</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Learning Curve</td>
                  <td className="py-3 px-4">Medium - Grid requires understanding</td>
                  <td className="py-3 px-4">Low - Intuitive timeline</td>
                  <td className="py-3 px-4">Very Low - Familiar list pattern</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Best For</td>
                  <td className="py-3 px-4">Power users, desktop booking</td>
                  <td className="py-3 px-4">Visual users, balanced experience</td>
                  <td className="py-3 px-4">Mobile-first, simplicity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="mt-8 bg-primary/10 border-l-4 border-primary rounded-lg p-6">
          <h2 className="text-xl font-bold text-secondary mb-3">Next Steps</h2>
          <p className="text-gray-700 mb-4">
            Choose which design best fits your business needs. Consider:
          </p>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li>• Which design do your customers find most intuitive?</li>
            <li>• Does your customer base primarily book from mobile or desktop?</li>
            <li>• Do you want to show multiple weeks at once or focus on day-by-day?</li>
            <li>• How important is seeing the full schedule overview?</li>
          </ul>
          <p className="text-sm text-gray-600">
            Once you select a design, we&apos;ll integrate it with your real Google Calendar for live availability checking.
          </p>
        </div>
      </div>
    </div>
  );
}

