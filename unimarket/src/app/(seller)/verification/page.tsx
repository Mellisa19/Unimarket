import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, Mail, CreditCard, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerificationPage() {
  return (
    <div className="min-h-screen pb-20 bg-soft-bg flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 flex-1 flex items-center justify-center pt-32">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Informational Column */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electricPurple to-neonBlue flex items-center justify-center text-white mb-6 shadow-lg shadow-electricPurple/30">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-deepIndigo mb-4">
              Get Verified to Sell
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              UniMarket is a completely trusted ecosystem. To keep our community safe, we require all sellers to verify their student status. 
            </p>

            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-electricPurple/10 flex items-center justify-center shrink-0 text-electricPurple">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deepIndigo text-sm">1. University Email</h3>
                    <p className="text-xs text-gray-500 mt-1">We require a valid .edu email address.</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deepIndigo text-sm">2. Student ID Upload</h3>
                    <p className="text-xs text-gray-500 mt-1">Front and back picture of your physical student ID.</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deepIndigo text-sm">3. Liveness Check</h3>
                    <p className="text-xs text-gray-500 mt-1">A quick selfie to match your ID.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Interactive Flow */}
          <div className="md:col-span-3">
             <GlassCard className="p-8 bg-white/80 border-t-4 border-t-electricPurple">
                {/* Progress Indicators */}
                <div className="flex justify-between items-center mb-10 relative">
                   <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
                   <div className="w-8 h-8 rounded-full bg-electricPurple text-white flex items-center justify-center text-xs font-bold border-4 border-white shadow-sm">
                      1
                   </div>
                   <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold border-4 border-white shadow-sm">
                      2
                   </div>
                   <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold border-4 border-white shadow-sm">
                      3
                   </div>
                </div>

                {/* Step 1 Content - Mock */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-deepIndigo mb-2">Verify Student Email</h2>
                  <p className="text-sm text-gray-500">Enter your university-issued email below.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-deepIndigo mb-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. jdoe@university.edu"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-deepIndigo outline-none focus:border-electricPurple focus:ring-1 focus:ring-electricPurple transition-all"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      Make sure you have access to this inbox right now. We will send a 6-digit verification code to confirm ownership.
                    </p>
                  </div>

                  <Button size="lg" className="w-full shadow-lg h-12 text-[15px]">
                    Send Verification Code
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center">
                  <div className="flex items-center text-xs font-semibold text-gray-400">
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    Data securely handled by UniMarket Identity
                  </div>
                </div>

             </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
