'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRouter } from 'next/navigation';
import { Package, Plus, X, Tag, Info, MapPin, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = ['Textbooks', 'Electronics', 'Dorm Essentials', 'Fashion', 'Services'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

export function AddProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    condition: CONDITIONS[1],
    location: '',
    images: [] as string[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviews(prev => [...prev, base64]);
        setFormData(prev => ({ ...prev, images: [...prev.images, base64] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
        setError("Please upload at least one image");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            // Send as JSON string to support base64 (which contains commas)
            images: JSON.stringify(formData.images) 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 italic">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-deepIndigo flex items-center gap-2">
              <Package className="w-4 h-4" /> Product Title
            </label>
            <input 
              type="text" 
              placeholder="e.g. MacBook Pro M1 2020"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-deepIndigo flex items-center gap-2">
                ₦ Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                <input 
                  type="number" 
                  placeholder="0,000"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-deepIndigo flex items-center gap-2">
                <Tag className="w-4 h-4" /> Category
              </label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium appearance-none"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-deepIndigo flex items-center gap-2">
              <Info className="w-4 h-4" /> Condition
            </label>
            <div className="flex gap-2 flex-wrap">
              {CONDITIONS.map(cond => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: cond })}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                    formData.condition === cond 
                      ? 'bg-electricPurple text-white border-electricPurple shadow-md' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-deepIndigo flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Pickup Location
            </label>
            <input 
              type="text" 
              placeholder="e.g. Student Union, Library"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* Details & Images */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-deepIndigo flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Product Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previews.map((src, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                
                {previews.length < 6 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100/50 hover:border-electricPurple/40 transition-all text-gray-400 hover:text-electricPurple group">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                           <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-black">Add Photo</span>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden" 
                        />
                    </label>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-deepIndigo font-bold px-1">Detailed Description</label>
            <textarea 
              rows={5}
              placeholder="Describe your product (condition, features, reasons for selling)..."
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium resize-none shadow-inner bg-gray-50/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
        <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" size="lg" className="px-12 py-7 font-black text-lg shadow-xl shadow-electricPurple/20 rounded-2xl" disabled={isLoading}>
          {isLoading ? 'Publishing...' : 'Publish Listing'}
        </Button>
      </div>
    </form>
  );
}
