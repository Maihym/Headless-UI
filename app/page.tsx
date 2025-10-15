import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, Zap, Home, Building2, Cpu, CheckCircle, Shield, DollarSign, Clock } from 'lucide-react';
import type { Review } from '@/types/review';
import reviewsData from '@/data/reviews.json';
import TestimonialCarousel from '@/components/TestimonialCarousel';

const reviews = reviewsData as Review[];

export const metadata: Metadata = {
  title: 'Trusted Electricians in La Mirada—Fast, Clean, Done Right',
  description: 'Licensed, bonded, and insured. Residential, commercial, and emergency electrical service with a lifetime workmanship guarantee.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-gray-900 to-secondary text-white py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trusted Electricians in La Mirada—Fast, Clean, Done Right.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Licensed, bonded, and insured. Residential, commercial, and emergency electrical service with a lifetime workmanship guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:6572396331" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                <Phone className="h-6 w-6 mr-2" />
                Call for Free Estimate
              </a>
              <Link href="/contact?type=service" className="bg-white text-secondary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-md hover:shadow-lg inline-flex items-center justify-center">
                Book Service Call - $189
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Available 24/7 | Or <Link href="/contact?type=service" className="text-primary hover:text-accent font-semibold">book online</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-secondary">Licensed, Bonded & Insured</h3>
                <p className="text-sm text-gray-600">CA C-10 #1120441</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-secondary">Lifetime Workmanship Guarantee</h3>
                <p className="text-sm text-gray-600">Work you can trust</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-secondary">Upfront Pricing</h3>
                <p className="text-sm text-gray-600">No Hidden Fees</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-secondary">24/7 Emergency Service</h3>
                <p className="text-sm text-gray-600">Always available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From residential repairs to commercial installations, we handle all your electrical needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Residential */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
              <Home className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-3">Residential</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Panel Upgrades</li>
                <li>• Outlet & Lighting Installation</li>
                <li>• Electrical Repairs</li>
                <li>• Whole-Home Rewiring</li>
              </ul>
              <Link href="/services#residential" className="text-primary hover:text-accent font-semibold">
                Learn More →
              </Link>
            </div>

            {/* Commercial */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
              <Building2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-3">Commercial</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Tenant Improvements</li>
                <li>• Preventive Maintenance</li>
                <li>• Code Compliance</li>
                <li>• Emergency Service</li>
              </ul>
              <Link href="/services#commercial" className="text-primary hover:text-accent font-semibold">
                Learn More →
              </Link>
            </div>

            {/* Specialty */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
              <Cpu className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-3">Specialty</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• EV Charger Installation</li>
                <li>• Smart Home Wiring</li>
                <li>• Automation & Controls</li>
                <li>• Future-Ready Systems</li>
              </ul>
              <Link href="/services#specialty" className="text-primary hover:text-accent font-semibold">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8 text-center">
              Why Choose First Electric?
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                First Electric is dedicated to serving our clients before, during, and after every project is completed. We understand that electrical work can be stressful and disruptive, which is why we&apos;ve built our business around making the experience hassle-free. From the moment you contact us, we provide thorough diagnostics, upfront pricing with no surprise costs, and a range of options—from the most permanent and comprehensive solutions to economical and temporary fixes—so you have total control over your budget and timeline.
              </p>

              <p>
                What sets First Electric apart is our unwavering commitment to customer satisfaction and excellence in every job. We don&apos;t consider a project complete until you&apos;re completely satisfied. Our technicians maintain clean, organized work sites, communicate clearly throughout the process, and hold themselves to the highest standards of workmanship. We believe in giving you choices and transparency, not pressure or hidden fees.
              </p>

              <p>
                &quot;First choice today, worry-free tomorrow&quot; isn&apos;t just our tagline—it&apos;s our promise. We back every installation and repair with a lifetime workmanship guarantee and proactive follow-up to ensure everything is functioning perfectly. Whether you&apos;re facing an electrical emergency or planning a major upgrade, First Electric is here to serve the La Mirada community with reliable, code-compliant work that stands the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-0 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 text-center px-6 md:px-0">
            What Our Customers Say
          </h2>
          <p className="text-center text-gray-600 mb-12 px-6 md:px-0">
            Over {reviews.filter(r => r.rating >= 4).length} satisfied customers
          </p>
          
          <TestimonialCarousel reviews={reviews} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Call now for a free quote or book a service call online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:6572396331" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg inline-flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              Call for Free Estimate
            </a>
            <Link href="/contact?type=service" className="bg-secondary text-white hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
              Book Service Call - $189
            </Link>
          </div>
          <p className="text-gray-100 mt-6">
            Available 24/7: <a href="tel:6572396331" className="font-bold hover:text-gray-200 underline">(657) 239-6331</a>
          </p>
        </div>
      </section>
    </>
  );
}

