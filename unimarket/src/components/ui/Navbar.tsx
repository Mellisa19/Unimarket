"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { Menu, X, ShoppingBag, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-glassDark/80 backdrop-blur-lg border-b border-white/10 shadow-lg py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electricPurple to-neonBlue flex items-center justify-center shadow-lg group-hover:shadow-electricPurple/50 transition-all duration-300">
              <ShoppingBag className="text-white h-5 w-5" />
            </div>
            <span className={cn(
              "text-xl font-bold tracking-tight transition-colors duration-300",
              isScrolled ? "text-white" : "text-deepIndigo"
            )}>
              UniMarket<span className="text-electricPurple">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={cn(
              "text-sm font-medium transition-colors hover:text-electricPurple",
              isScrolled ? "text-gray-200" : "text-gray-600"
            )}>Marketplace</Link>
            <Link href="/dashboard" className={cn(
              "text-sm font-medium transition-colors hover:text-electricPurple",
              isScrolled ? "text-gray-200" : "text-gray-600"
            )}>Sell Items</Link>
            <Link href="/profile" className={cn(
              "text-sm font-medium transition-colors hover:text-electricPurple",
              isScrolled ? "text-gray-200" : "text-gray-600"
            )}>Profile</Link>
            <Link href="/messages" className={cn(
              "relative text-sm font-medium transition-colors hover:text-electricPurple",
              isScrolled ? "text-gray-200" : "text-gray-600"
            )}>
              Messages
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-electricPurple rounded-full animate-pulse"></span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild className={cn(
               isScrolled ? "text-white hover:text-electricPurple hover:bg-white/10" : "text-deepIndigo"
            )}>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="shadow-lg shadow-electricPurple/20" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={cn("h-6 w-6", isScrolled ? "text-white" : "text-deepIndigo")} />
            ) : (
              <Menu className={cn("h-6 w-6", isScrolled ? "text-white" : "text-deepIndigo")} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-deepIndigo py-2 border-b border-gray-100">Marketplace</Link>
          <Link href="/seller/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-deepIndigo py-2 border-b border-gray-100">Sell Items</Link>
          <Link href="/messages" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-deepIndigo py-2 border-b border-gray-100 flex items-center justify-between">
            Messages
            <Badge variant="secondary" className="bg-electricPurple/10 text-electricPurple border-none">New</Badge>
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-deepIndigo py-2 border-b border-gray-100">About</Link>
          <div className="flex flex-col gap-3 mt-4">
            <Button variant="secondary" className="w-full justify-center">Log in</Button>
            <Button className="w-full justify-center">Sign up</Button>
          </div>
        </div>
      )}
    </header>
  );
}
