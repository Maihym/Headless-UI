import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import SmartContactForm from '@/components/SmartContactForm';
import { generateBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Contact Us | Book Appointment or Request Quote',
  description: 'Contact First Electric for electrical service in La Mirada. Call (657) 239-6331 for 24/7 emergency service or book online.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://firstelectric.pro' },
    { name: 'Contact', url: 'https://firstelectric.pro/contact' },
  ]);

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact First Electric',
    description: 'Contact First Electric for electrical services in La Mirada and surrounding areas.',
    url: 'https://firstelectric.pro/contact',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-gray-900 to-secondary text-white py-16">
        <div className="container-custom">
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-400 hover:text-primary">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Ready to start your electrical project? Contact us today for a free estimate or emergency service.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2">Phone</h3>
                <a href="tel:6572396331" className="text-lg text-primary hover:text-accent font-semibold">
                  (657) 239-6331
                </a>
                <p className="text-sm text-gray-600 mt-1">24/7 for emergencies</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2">Email</h3>
                <a href="mailto:contact@firstelectric.pro" className="text-lg text-primary hover:text-accent font-semibold">
                  contact@firstelectric.pro
                </a>
                <p className="text-sm text-gray-600 mt-1">We respond within 24 hours</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2">Service Area</h3>
                <p className="text-gray-700">La Mirada, CA</p>
                <p className="text-sm text-gray-600 mt-1">10-mile radius coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-center space-x-3">
            <Clock className="h-6 w-6 text-primary" />
            <div className="text-center">
              <p className="text-secondary font-semibold">
                Mon–Fri: 9:00 AM – 5:00 PM | Saturday: By Appointment | Sunday: Emergency Only
              </p>
              <p className="text-sm text-gray-600 mt-1">Phones available 24/7 for emergencies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Get Started</h2>
              <p className="text-lg text-gray-600">
                Tell us what you need and we&apos;ll take care of the rest. Fast, professional, and reliable.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 md:p-8 shadow-md">
              <Suspense fallback={<div className="text-center py-12">Loading form...</div>}>
                <SmartContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area Details */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Our Service Area</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 text-center">
              We proudly serve La Mirada and nearby areas within 10 miles, including Whittier, Santa Fe Springs, Norwalk, Buena Park, Fullerton, La Habra, Cerritos, Artesia, Pico Rivera, and East Whittier.
            </p>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-secondary mb-4">Service Notes:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Free estimates within our local service area</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Minimum service charge may apply for diagnostic calls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>24/7 emergency service available for urgent electrical issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Call for immediate service. Text or email for quick quotes with photos.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Electrical Emergency?</h2>
          <p className="text-xl mb-8">We&apos;re available 24/7 for urgent electrical issues. Don&apos;t wait—call now!</p>
          <a
            href="tel:6572396331"
            className="inline-flex items-center bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            <Phone className="h-6 w-6 mr-2" />
            Call Emergency Line: (657) 239-6331
          </a>
        </div>
      </section>
    </>
  );
}

