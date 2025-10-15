'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { Menu as HeadlessMenu } from '@headlessui/react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.svg"
              alt="First Electric - Licensed Electrician CA C-10 #1120441"
              width={144}
              height={144}
              className="h-24 md:h-32 lg:h-36"
              style={{ width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-secondary hover:text-primary font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <a
              href="tel:6572396331"
              className="flex items-center space-x-2 text-primary hover:text-accent font-semibold"
            >
              <Phone className="h-5 w-5" />
              <span>(657) 239-6331</span>
            </a>
            <Link href="/contact" className="btn-primary">
              Get Free Estimate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-secondary hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="tel:6572396331"
              className="flex items-center space-x-2 text-primary font-semibold py-2"
            >
              <Phone className="h-5 w-5" />
              <span>(657) 239-6331</span>
            </a>
            <Link href="/contact" className="btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
              Get Free Estimate
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

