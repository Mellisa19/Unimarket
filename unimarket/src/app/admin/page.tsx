'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, XCircle, CheckCircle, ExternalLink, User, Loader2, Search, Filter } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/verifications');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        // Optimistic update
        setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredRequests = requests.filter(r => filter === 'ALL' || r.status === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-bg">
        <Loader2 className="w-10 h-10 animate-spin text-electricPurple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-soft-bg text-deepIndigo">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 lg:pt-40 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              Admin Hub <ShieldCheck className="w-8 h-8 text-electricPurple" />
            </h1>
            <p className="text-gray-500 font-medium">Moderate marketplace listings and verify student identities.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/50 p-1.5 rounded-2xl shadow-inner border border-white">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-deepIndigo text-white shadow-lg' : 'text-gray-400 hover:text-deepIndigo'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRequests.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200">
                 <Filter className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-400">No requests found for this category</h3>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <GlassCard key={request.id} className="overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 border-white/40">
                {/* ID Image Preview */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-zoom-in">
                  <Image 
                    src={request.idImage} 
                    alt="Student ID Card" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized={request.idImage.startsWith('data:')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-xl leading-tight">{request.user.name}</h3>
                      <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{request.user.email}</p>
                    </div>
                    <Badge variant={request.status === 'APPROVED' ? 'verified' : request.status === 'REJECTED' ? 'cancelled' : 'pending'}>
                      {request.status}
                    </Badge>
                  </div>

                  <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 space-y-1">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Institution</div>
                    <div className="font-bold text-sm text-deepIndigo">{request.schoolName}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">Matric Number</div>
                    <div className="font-mono text-sm font-bold text-electricPurple">{request.studentId}</div>
                  </div>

                  {request.status === 'PENDING' && (
                    <div className="flex gap-3 pt-2">
                       <Button 
                         variant="secondary" 
                         className="flex-1 bg-red-50 text-red-600 border-red-100 hover:bg-red-500 hover:text-white group"
                         onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                       >
                         <XCircle className="w-4 h-4 mr-2 group-hover:animate-pulse" /> Reject
                       </Button>
                       <Button 
                         className="flex-1 shadow-lg shadow-green-200 bg-green-500 hover:bg-green-600"
                         onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                       >
                         <CheckCircle className="w-4 h-4 mr-2" /> Approve
                       </Button>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
