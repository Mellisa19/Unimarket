import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { AddProductForm } from '@/components/products/AddProductForm';
import { PackagePlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'SELLER') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen pb-20 bg-soft-bg">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 lg:pt-40 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-electricPurple transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-electricPurple">
            <PackagePlus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-deepIndigo mb-1">List a New Product</h1>
            <p className="text-gray-500 font-medium">Create a premium listing to attract more buyers.</p>
          </div>
        </div>

        <GlassCard className="p-8 lg:p-10 shadow-2xl border-white/40 bg-white/70 backdrop-blur-2xl">
          <AddProductForm />
        </GlassCard>
      </main>
    </div>
  );
}
