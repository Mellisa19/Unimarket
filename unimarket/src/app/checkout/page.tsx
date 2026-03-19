'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, MapPin, Truck, Smartphone, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState('meetup');
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
  });

  useEffect(() => {
    if (!productId) {
      router.push('/');
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products`); // We should ideally have a single product fetch
        const data = await res.json();
        const foundProduct = data.find((p: any) => p.id === productId);
        
        if (!foundProduct) {
          router.push('/');
        } else {
          setProduct(foundProduct);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handlePaystackPayment = async () => {
    if (!product) return;
    
    setIsLoading(true);

    try {
      // 1. Create Order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price + (deliveryMethod === 'dorm' ? 1000 : 0),
          deliveryMethod,
          address: formData.address,
          phone: formData.phone,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // 2. Trigger Paystack
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: 'customer@university.edu', // Replace with user email from session
        amount: (product.price + (deliveryMethod === 'dorm' ? 1000 : 0)) * 100, // Paystack works in kobo (cents)
        currency: 'NGN',
        ref: `order_${orderData.id}_${Date.now()}`,
        callback: async (response: any) => {
          // 3. Verify Payment
          await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: response.reference,
              orderId: orderData.id,
            }),
          });
          
          router.push(`/profile?payment=success&orderId=${orderData.id}`);
        },
        onClose: () => {
          setIsLoading(false);
          alert('Payment cancelled');
        },
      });

      handler.openIframe();
    } catch (err: any) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-bg">
        <div className="w-10 h-10 border-4 border-electricPurple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-soft-bg">
      <Navbar />
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <main className="container mx-auto px-4 pt-32 lg:pt-40 max-w-5xl">
        <Link href={`/product/${product.id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-electricPurple transition-colors mb-8">
           <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product
        </Link>

        <h1 className="text-3xl font-black text-deepIndigo mb-10 flex items-center gap-3">
           Secure Checkout
           <ShieldCheck className="w-8 h-8 text-green-500" />
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <GlassCard className="p-8 bg-white/70">
              <h3 className="text-xl font-bold text-deepIndigo mb-6 flex items-center gap-2">
                 <Truck className="w-5 h-5 text-electricPurple" /> Delivery Method
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <button 
                   onClick={() => setDeliveryMethod('meetup')}
                   className={`p-4 rounded-2xl border transition-all text-left group ${deliveryMethod === 'meetup' ? 'border-electricPurple bg-electricPurple/5 shadow-md shadow-electricPurple/10' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                 >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${deliveryMethod === 'meetup' ? 'bg-electricPurple text-white' : 'bg-white text-gray-400 group-hover:text-electricPurple'}`}>
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-deepIndigo">Campus Meetup</div>
                    <div className="text-xs text-gray-500">Free • Secure Public Spot</div>
                 </button>
                 
                 <button 
                   onClick={() => setDeliveryMethod('dorm')}
                   className={`p-4 rounded-2xl border transition-all text-left group ${deliveryMethod === 'dorm' ? 'border-electricPurple bg-electricPurple/5 shadow-md shadow-electricPurple/10' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                 >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${deliveryMethod === 'dorm' ? 'bg-electricPurple text-white' : 'bg-white text-gray-400 group-hover:text-electricPurple'}`}>
                       <Truck className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-deepIndigo">Dorm Delivery</div>
                    <div className="text-xs text-gray-500">₦1,000 • Faster & Easy</div>
                 </button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-deepIndigo px-1">Delivery Address / Meetup Point</label>
                    <input 
                      type="text" 
                      placeholder={deliveryMethod === 'meetup' ? "e.g. Student Union, Main Library" : "e.g. Building B, Room 402"}
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-deepIndigo px-1 flex items-center gap-2">
                       <Smartphone className="w-4 h-4" /> Contact Phone
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+234..."
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-electricPurple focus:ring-2 focus:ring-electricPurple/20 outline-none transition-all font-medium"
                    />
                 </div>
              </div>
            </GlassCard>
            
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium bg-white/30 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/40">
               <ShieldCheck className="w-5 h-5 text-green-500" />
               Your payment is secured with Paystack. UniMarket never stores your card details.
            </div>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-5">
             <div className="sticky top-40 space-y-6">
                <GlassCard className="p-8 bg-white/80 border-white/50 shadow-2xl">
                    <h3 className="text-xl font-black text-deepIndigo mb-6">Order Summary</h3>
                    
                    {(() => {
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
                            <div className="flex gap-4 mb-8">
                               <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden relative shadow-sm border border-gray-200/50">
                                  <Image 
                                    src={images[0]} 
                                    fill 
                                    alt={product.title} 
                                    className="object-cover" 
                                    unoptimized={images[0].startsWith('data:')}
                                  />
                               </div>
                               <div className="flex-1">
                                  <h4 className="font-bold text-deepIndigo line-clamp-2 leading-snug mb-1">{product.title}</h4>
                                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none">{product.category}</Badge>
                               </div>
                            </div>
                        );
                    })()}
                    
                    <div className="space-y-4 border-t border-gray-100 pt-6">
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Subtotal</span>
                          <span className="text-deepIndigo font-bold">₦{product.price.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Delivery</span>
                          <span className="text-green-600 font-bold">{deliveryMethod === 'dorm' ? '₦1,000' : 'FREE'}</span>
                       </div>
                       <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-2">
                          <span className="text-lg font-black text-deepIndigo">Total</span>
                          <span className="text-2xl font-black text-electricPurple">₦{(product.price + (deliveryMethod === 'dorm' ? 1000 : 0)).toLocaleString()}</span>
                       </div>
                    </div>
                    
                    <Button 
                      onClick={handlePaystackPayment}
                      size="lg" 
                      className="w-full mt-8 font-black text-lg py-7 rounded-2xl shadow-xl shadow-electricPurple/20 group overflow-hidden relative"
                    >
                       <span className="relative z-10 flex items-center justify-center gap-2">
                          <CreditCard className="w-6 h-6" /> Pay with Paystack
                       </span>
                    </Button>
                    
                    <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-50 contrast-125">
                       <Image src="https://ui-avatars.com/api/?name=Visa&background=003399&color=fff" width={40} height={25} alt="Visa" className="rounded-sm" />
                       <Image src="https://ui-avatars.com/api/?name=MC&background=eb001b&color=fff" width={40} height={25} alt="Mastercard" className="rounded-sm" />
                       <Image src="https://ui-avatars.com/api/?name=Pay&background=000&color=fff" width={40} height={25} alt="Others" className="rounded-sm" />
                    </div>
                </GlassCard>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
