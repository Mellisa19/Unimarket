import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-soft-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 lg:pt-40 flex justify-center items-center pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl mb-6 text-electricPurple">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-deepIndigo mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your student account</p>
          </div>

          <GlassCard className="p-8 shadow-2xl border-white/40 bg-white/70 backdrop-blur-2xl">
            <AuthForm type="login" />
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/signup" className="text-electricPurple font-bold hover:underline">
                  Create one for free
                </Link>
              </p>
            </div>
          </GlassCard>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium bg-white/30 py-3 rounded-xl backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Secure Student Authentication
          </div>
        </div>
      </main>
    </div>
  );
}
