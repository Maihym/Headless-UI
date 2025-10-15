import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const serviceAreas = [
    'La Mirada',
    'Whittier',
    'Santa Fe Springs',
    'Norwalk',
    'Buena Park',
    'Fullerton',
    'La Habra',
    'Cerritos',
    'Artesia',
    'Pico Rivera',
  ];

  return (
    <footer className="bg-secondary text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">First Electric</h3>
            <p className="text-gray-300 mb-4">
              Licensed, bonded, and insured electrical contractor serving La Mirada and surrounding areas.
            </p>
            <p className="text-sm text-gray-400">CA C-10 #1120441</p>
            <p className="text-sm text-gray-400">Since 2024</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:6572396331" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Phone className="h-5 w-5" />
                <span>(657) 239-6331</span>
              </a>
              <a href="mailto:contact@firstelectric.pro" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span>contact@firstelectric.pro</span>
              </a>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span className="text-gray-300">La Mirada, CA</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">24/7 Emergency Service</p>
              <p className="text-sm text-gray-400">Mon–Fri: 9AM–5PM</p>
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Service Areas</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              {serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} First Electric. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            {' · '}
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            {' · '}
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

