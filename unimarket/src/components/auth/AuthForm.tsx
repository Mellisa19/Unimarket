'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'BUYER' as 'BUYER' | 'SELLER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          router.push('/');
          router.refresh();
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Something went wrong');
        } else {
          // Auto login after signup
          const loginResult = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });

          if (loginResult?.error) {
            router.push('/login?registered=true');
          } else {
            router.push('/');
            router.refresh();
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
          {error}
        </div>
      )}

      {type === 'signup' && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 px-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all"
            />
          </div>
          
          <div className="p-1 bg-gray-50 rounded-xl border border-gray-100 flex gap-1 mb-4">
             <button 
               type="button"
               onClick={() => setFormData({ ...formData, role: 'BUYER' })}
               className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${formData.role === 'BUYER' ? 'bg-white shadow-sm text-electricPurple' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Buyer
             </button>
             <button 
               type="button"
               onClick={() => setFormData({ ...formData, role: 'SELLER' })}
               className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${formData.role === 'SELLER' ? 'bg-white shadow-sm text-electricPurple' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Seller
             </button>
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600 px-1">University Email</label>
        <input 
          type="email" 
          placeholder="yourname@university.edu"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-sm font-semibold text-gray-600">Password</label>
          {type === 'login' && (
            <button type="button" className="text-xs font-semibold text-electricPurple hover:underline">
              Forgot?
            </button>
          )}
        </div>
        <input 
          type="password" 
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all"
        />
      </div>

      {type === 'signup' && (
        <div className="flex items-center gap-2 px-1 py-1">
          <input type="checkbox" id="terms" required className="rounded border-gray-300 text-electricPurple focus:ring-electricPurple" />
          <label htmlFor="terms" className="text-xs text-gray-500">
            I agree to the <span className="text-electricPurple font-semibold cursor-pointer">Terms of Service</span>
          </label>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full font-bold shadow-lg shadow-electricPurple/20" disabled={isLoading}>
        {isLoading ? 'Processing...' : type === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  );
}
