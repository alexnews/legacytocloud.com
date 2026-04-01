'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setDemoOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDemoOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;
  const isDemoActive = pathname.startsWith('/demo');

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-blue-400'
        : 'text-slate-300 hover:text-white'
    }`;

  const handleDemoEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDemoOpen(true);
  };

  const handleDemoLeave = () => {
    timeoutRef.current = setTimeout(() => setDemoOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            L2C
          </div>
          <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            LegacyToCloud
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkClass('/')}>
            Home
          </Link>

          {/* Demo Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleDemoEnter}
            onMouseLeave={handleDemoLeave}
          >
            <button
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                isDemoActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setDemoOpen(!demoOpen)}
              aria-expanded={demoOpen}
              aria-haspopup="true"
            >
              Demo
              <svg
                className={`w-4 h-4 transition-transform ${demoOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {demoOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2">
                <Link
                  href="/demo/dashboard"
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isActive('/demo/dashboard')
                      ? 'text-blue-400 bg-slate-700/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className="font-medium">Dashboard</span>
                  <span className="block text-xs text-slate-400 mt-0.5">Live stock analytics</span>
                </Link>
                <Link
                  href="/demo/architecture"
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isActive('/demo/architecture')
                      ? 'text-blue-400 bg-slate-700/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className="font-medium">Architecture</span>
                  <span className="block text-xs text-slate-400 mt-0.5">System design overview</span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/news" className={linkClass('/news')}>
            News
          </Link>
          <Link href="/chat" className={linkClass('/chat')}>
            Chat
          </Link>
          <Link href="/analytics" className={linkClass('/analytics')}>
            Analytics
          </Link>
          <Link href="/services" className={linkClass('/services')}>
            Services
          </Link>
          <Link href="/#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            About
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 backdrop-blur">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive('/') ? 'text-blue-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </Link>

            {/* Mobile Demo Section */}
            <button
              onClick={() => setDemoOpen(!demoOpen)}
              className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                isDemoActive ? 'text-blue-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Demo
              <svg
                className={`w-4 h-4 transition-transform ${demoOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {demoOpen && (
              <div className="pl-4 space-y-1">
                <Link
                  href="/demo/dashboard"
                  className={`block px-3 py-2 rounded-lg text-sm ${
                    isActive('/demo/dashboard') ? 'text-blue-400 bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/demo/architecture"
                  className={`block px-3 py-2 rounded-lg text-sm ${
                    isActive('/demo/architecture') ? 'text-blue-400 bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Architecture
                </Link>
              </div>
            )}

            <Link
              href="/news"
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive('/news') ? 'text-blue-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              News
            </Link>
            <Link
              href="/chat"
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive('/chat') ? 'text-blue-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Chat
            </Link>
            <Link
              href="/analytics"
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive('/analytics') ? 'text-blue-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/services"
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive('/services') ? 'text-blue-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Services
            </Link>
            <Link
              href="/#about"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
