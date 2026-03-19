import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Search, ShieldCheck, Filter, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { SearchFilter } from '@/components/products/SearchFilter';

async function getProducts(search?: string, category?: string) {
  let where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category && category !== 'All') {
    where.category = category;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      seller: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
}

export default async function Home({ searchParams }: { searchParams: { search?: string, category?: string } }) {
  const products = await getProducts(searchParams.search, searchParams.category);
  
  const parseImages = (imagesStr: string) => {
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch (e) {
      return imagesStr.split(',').filter(Boolean);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        <div className="absolute inset-0 z-0 bg-primary-gradient opacity-5"></div>
        {/* Abstract Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-electricPurple/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-neonBlue/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="container mx-auto relative z-10 text-center">
          <Badge variant="glass" className="mb-6 py-1.5 px-4 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-2 text-electricPurple" />
            Join 5,000+ students buying &amp; selling safely
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-deepIndigo">
            Campus Commerce, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricPurple to-neonBlue">
              Elevated.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            The premium, verified marketplace for university students. Buy and sell textbooks, electronics, and essentials with absolute trust.
          </p>

          <SearchFilter />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 -mt-10">
        {/* Product Grid */}
        {products.length === 0 ? (
          <GlassCard className="p-20 text-center bg-white/40">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-deepIndigo mb-2">No items found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any listings matching your search. Try adjusting your filters or search terms.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
              const images = parseImages(product.images);
              return (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <GlassCard hoverEffect className="h-full flex flex-col group overflow-hidden bg-white/60">
                    {/* Image Area */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image 
                        src={images[0]} 
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={images[0].startsWith('data:')}
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Badge className="bg-white/90 text-deepIndigo shadow-sm backdrop-blur-md border-none font-semibold">
                          ₦{product.price.toLocaleString()}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-xs font-semibold text-electricPurple mb-2 tracking-wide uppercase">
                        {product.category}
                      </div>
                      <h3 className="text-lg font-bold text-deepIndigo mb-1 line-clamp-1 group-hover:text-electricPurple transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-[10px] font-bold text-deepIndigo">
                            {product.seller.name?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{product.seller.name}</span>
                        </div>
                        {product.seller.isVerified && (
                          <div className="flex items-center text-green-600 gap-1 bg-green-50 px-2 py-1 rounded-md">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        )}
        
        {/* Load More */}
        {products.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button variant="secondary" size="lg" className="rounded-xl px-10">
              Load More Listings
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
