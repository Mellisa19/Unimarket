import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { AuthForm } from '@/components/auth/AuthForm';
import Link from 'next/link';
import { ShieldCheck, Sparkles, UserCircle, ShoppingBag } from 'lucide-react';

export default function SignupPage() {

  return (
    <div className="min-h-screen bg-soft-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 lg:pt-40 flex justify-center items-center pb-20">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl mb-6 text-neonBlue">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-deepIndigo mb-2">Join UniMarket</h1>
            <p className="text-gray-500">Start buying and selling with trust on campus</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <GlassCard className="p-8 shadow-2xl border-white/40 bg-white/70 backdrop-blur-2xl relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-neonBlue/10 rounded-full blur-3xl"></div>
               
               <div className="mb-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-deepIndigo">Buyer or Seller?</h4>
                    <p className="text-xs text-gray-500">You can be both! Just choose your primary role.</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                     <button className="px-3 py-1.5 rounded-lg bg-electricPurple text-white text-xs font-bold shadow-sm">Buyer</button>
                     <button className="px-3 py-1.5 rounded-lg bg-white text-gray-600 text-xs font-bold border border-gray-100 hover:border-indigo-200">Seller</button>
                  </div>
               </div>

               <AuthForm type="signup" />
               
               <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">
                    Already part of the community?{' '}
                    <Link href="/login" className="text-electricPurple font-bold hover:underline">
                      Sign In
                    </Link>
                  </p>
               </div>
            </GlassCard>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-white/30 px-6 py-3 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Verified .edu email required for all accounts
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
