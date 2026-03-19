'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShieldCheck, Loader2, X, Image as ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function VerificationButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    schoolName: '',
    studentId: '',
  });
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setIdImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idImage) return alert('Please upload your ID card');
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          idImage
        })
      });

      if (res.ok) {
        setShowModal(false);
        router.refresh();
      } else {
        alert('Verification request failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deepIndigo/40 backdrop-blur-sm">
        <GlassCard className="w-full max-w-md p-8 bg-white/95 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-deepIndigo flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-electricPurple" /> Verify Student Identity
            </h3>
            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
               <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">University Name</label>
              <input 
                type="text" 
                placeholder="e.g. University of Lagos"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Matric / Student ID</label>
              <input 
                type="text" 
                placeholder="e.g. 190802044"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">ID Card Photo</label>
              <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group hover:border-electricPurple/40 transition-all">
                {idImage ? (
                  <>
                    <img src={idImage} alt="ID Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setIdImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer text-gray-400 font-bold hover:text-electricPurple transition-colors">
                     <ImagePlus className="w-8 h-8" />
                     <span className="text-[10px] uppercase">Upload ID Card</span>
                     <input type="file" required accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full py-7 font-black text-lg gap-2 mt-4 shadow-xl shadow-electricPurple/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit for Review'}
            </Button>
            <p className="text-[10px] text-center text-gray-400 font-medium italic">
              Verification typically takes 12-24 hours. Your ID is used only for trust purposes.
            </p>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => setShowModal(true)} 
      variant="secondary" 
      className="px-8 shadow-xl gap-2 h-14 font-bold"
    >
      <ShieldCheck className="w-5 h-5" /> Complete Verification
    </Button>
  );
}
