'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['All', 'Textbooks', 'Electronics', 'Dorm Essentials', 'Fashion', 'Services'];

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('search', searchTerm);
  };

  return (
    <div className="space-y-10">
      {/* Search Bar in Hero (conceptual, we'll place it in page.tsx) */}
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/40 flex items-center">
        <form onSubmit={handleSearch} className="flex-1 flex items-center px-4">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Search for textbooks, electronics, tutors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-deepIndigo placeholder:text-gray-400 py-3"
          />
        </form>
        <Button onClick={handleSearch} size="lg" className="rounded-xl px-4 md:px-8 shadow-md shrink-0">
          Search
        </Button>
      </div>

      {/* Categories & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {CATEGORIES.map((category) => (
            <button 
              key={category}
              onClick={() => updateParams('category', category)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                currentCategory === category 
                  ? 'bg-deepIndigo text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <Button variant="secondary" className="shrink-0 rounded-xl gap-2">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>
    </div>
  );
}
