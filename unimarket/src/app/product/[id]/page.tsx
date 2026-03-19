import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, MessageCircle, ShoppingCart, Heart, Share2, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { MessageSellerButton } from '@/components/products/MessageSellerButton';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        include: {
          receivedReviews: true
        }
      },
    },
  });
  return product;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const parseImages = (imagesStr: string) => {
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch (e) {
      return imagesStr.split(',').filter(Boolean);
    }
  };

  const images = parseImages(product.images);

  return (
    <div className="min-h-screen pb-20 bg-soft-bg">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 lg:pt-40">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-electricPurple transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Images */}
          <div className="lg:w-3/5 space-y-4">
            <div className="relative h-[25rem] md:h-[35rem] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">
              <Image 
                src={images[0]} 
                alt={product.title}
                fill
                priority
                className="object-cover"
                unoptimized={images[0].startsWith('data:')}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-deepIndigo hover:bg-white hover:text-red-500 transition-all shadow-sm">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <div key={idx} className={`relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-2 ${idx === 0 ? 'border-electricPurple' : 'border-transparent'}`}>
                  <Image 
                    src={img} 
                    alt={`Gallery image ${idx+1}`} 
                    fill 
                    className="object-cover" 
                    unoptimized={img.startsWith('data:')}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-2/5 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="text-electricPurple bg-electricPurple/10 hover:bg-electricPurple/20 text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </Badge>
                <div className="flex items-center text-xs text-gray-500 gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {product.createdAt.toLocaleDateString()}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-deepIndigo mb-4 leading-tight">
                {product.title}
              </h1>
              
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-electricPurple to-neonBlue mb-6">
                ₦{product.price.toLocaleString()}
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Condition</span>
                  <span className="text-sm font-bold text-deepIndigo">{product.condition}</span>
                </div>
                {product.location && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-deepIndigo">{product.location}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1 text-base shadow-xl shadow-electricPurple/20" asChild>
                  <Link href={`/checkout?productId=${product.id}`}>
                    <ShoppingCart className="w-5 h-5 mr-2" /> Buy Now
                  </Link>
                </Button>
                <MessageSellerButton productId={product.id} />
              </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            {/* Description Area */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-deepIndigo mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <GlassCard className="p-5 mt-auto bg-white/60">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">About the Seller</h3>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xl font-bold text-electricPurple shrink-0">
                  {product.seller.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-deepIndigo">{product.seller.name}</h4>
                    {product.seller.isVerified && (
                      <div className="flex items-center text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-orange-500">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const reviews = product.seller.receivedReviews;
                        const avg = reviews.length > 0 ? reviews.reduce((a: any, b: any) => a + b.rating, 0) / reviews.length : 5;
                        return (
                          <svg key={star} className={`w-3.5 h-3.5 fill-current ${star <= Math.round(avg) ? 'text-orange-500' : 'text-gray-200'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-deepIndigo">
                      {product.seller.receivedReviews.length > 0 
                        ? (product.seller.receivedReviews.reduce((a: any, b: any) => a + b.rating, 0) / product.seller.receivedReviews.length).toFixed(1) 
                        : "5.0"}
                    </span>
                    <span className="text-[10px] text-gray-400">({product.seller.receivedReviews.length} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-500">Member since {product.seller.createdAt.getFullYear()}</p>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </main>
    </div>
  );
}
