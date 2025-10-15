import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Building2, Zap, Lightbulb, Wrench, Cable, BatteryCharging, Cpu, Phone } from 'lucide-react';
import { generateBreadcrumbSchema, generateServiceSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Electrical Services | Residential, Commercial & Specialty',
  description: 'Professional electrical services in La Mirada. Panel upgrades, EV chargers, rewiring, commercial build-outs, and more. Licensed & insured.',
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://firstelectric.pro' },
    { name: 'Services', url: 'https://firstelectric.pro/services' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-gray-900 to-secondary text-white py-16">
        <div className="container-custom">
          <nav className="text-sm mb-6">
            <Link href="/" className="text-gray-400 hover:text-primary">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-white">Services</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            From routine repairs to complex installations, First Electric delivers quality electrical work for homes and businesses throughout La Mirada.
          </p>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-12 bg-primary/5 border-b-2 border-primary/20">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Book Online Now</h2>
            <p className="text-gray-600">Fast, easy scheduling for routine service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link href="/contact?type=service" className="bg-white rounded-lg p-6 hover:shadow-xl transition-shadow border-2 border-primary/20 hover:border-primary">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-secondary">Service Call</h3>
                <span className="text-2xl font-bold text-primary">$189</span>
              </div>
              <p className="text-gray-600 mb-4">Repairs, troubleshooting, and diagnostic visits</p>
              <span className="text-primary font-semibold">Book Now →</span>
            </Link>

            <Link href="/contact?type=inspection-residential" className="bg-white rounded-lg p-6 hover:shadow-xl transition-shadow border-2 border-primary/20 hover:border-primary">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-secondary">Residential Inspection</h3>
                <span className="text-2xl font-bold text-primary">$350</span>
              </div>
              <p className="text-gray-600 mb-4">Full electrical system inspection and safety check</p>
              <span className="text-primary font-semibold">Book Now →</span>
            </Link>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Need a quote for a project? <Link href="/contact?type=quote" className="text-primary hover:text-accent font-semibold">Request Free Quote</Link>
          </p>
        </div>
      </section>

      {/* Residential Services */}
      <section id="residential" className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <Home className="h-10 w-10 text-primary mr-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Residential Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Panel Upgrades */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-3">Electrical Panel Upgrades</h3>
              <p className="text-gray-700 mb-4">
                Increase capacity and safety with code-compliant panel upgrades and replacements. Perfect for remodels, EV chargers, and added circuits.
              </p>
              <Link href="/contact?type=quote" className="btn-primary inline-flex">
                Request Free Quote
              </Link>
            </div>

            {/* Outlet & Lighting */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Lightbulb className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-3">Outlet, Switch & Lighting Installation</h3>
              <p className="text-gray-700 mb-4">
                Add outlets, dimmers, and modern lighting—including recessed, under-cabinet, and exterior fixtures—installed safely and neatly.
              </p>
              <Link href="/contact?type=quote" className="btn-primary inline-flex">
                Request Free Quote
              </Link>
            </div>

            {/* Repairs */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Wrench className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-3">Electrical Repairs & Troubleshooting</h3>
              <p className="text-gray-700 mb-4">
                From tripped breakers to dead outlets and flickering lights, we diagnose the root cause and fix it right the first time.
              </p>
              <Link href="/contact?type=service" className="btn-primary inline-flex">
                Book Service Call - $189
              </Link>
            </div>

            {/* Rewiring */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Cable className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-3">Whole-Home Rewiring</h3>
              <p className="text-gray-700 mb-4">
                Replace outdated or unsafe wiring with modern, grounded circuits that meet today&apos;s safety standards.
              </p>
              <Link href="/contact?type=quote" className="btn-primary inline-flex">
                Request Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Services */}
      <section id="commercial" className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <Building2 className="h-10 w-10 text-primary mr-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Commercial Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tenant Improvements */}
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Building2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-3">Tenant Improvements & Build-Outs</h3>
              <p className="text-gray-700 mb-4">
                Complete electrical for offices, retail, and light industrial spaces—power, lighting, circuits, and permitting.
              </p>
              <Link href="/contact?type=quote" className="btn-primary inline-flex">
                Request Free Quote
              </Link>
            </div>

            {/* Maintenance */}
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Wrench className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-3">Preventive Maintenance</h3>
              <p className="text-gray-700 mb-4">
                Scheduled inspections and proactive repairs to reduce downtime and keep your operation safe and compliant.
              </p>
              <Link href="/contact?type=service" className="btn-primary inline-flex">
                Schedule Service
              </Link>
            </div>

            {/* Code Compliance */}
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Cable className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-3">Code Compliance & Corrections</h3>
              <p className="text-gray-700 mb-4">
                Violation corrections, panel labeling, load calculations, and documentation to pass inspection smoothly.
              </p>
              <Link href="/contact?type=inspection-commercial" className="btn-primary inline-flex">
                Request Commercial Inspection Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Services */}
      <section id="specialty" className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center mb-8">
            <Cpu className="h-10 w-10 text-primary mr-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Specialty Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* EV Charging */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <BatteryCharging className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-3">EV Charging Station Installation</h3>
              <p className="text-gray-700 mb-4">
                Level 1 & Level 2 home chargers installed, including dedicated circuits, permits, and panel upgrades if needed.
              </p>
              <Link href="/contact?type=quote" className="btn-primary inline-flex">
                Request Free Quote
              </Link>
            </div>

            {/* Smart Home */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Cpu className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-3">Smart Home Wiring</h3>
              <p className="text-gray-700 mb-4">
                Smart switches, occupancy sensors, low-voltage pre-wire, and networked lighting for a future-ready home.
              </p>
              <Link href="/contact?type=quote" className="btn-primary inline-flex">
                Request Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Electrical Work?</h2>
          <p className="text-xl mb-8">Contact us today for a free consultation and quote.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Get Free Estimate
            </Link>
            <a href="tel:6572396331" className="bg-secondary text-white hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              (657) 239-6331
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

