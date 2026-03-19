import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Package, 
  ShieldCheck, 
  LogOut,
  Mail,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { VerificationButton } from '@/components/profile/VerificationButton';

async function getUserData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
        products: { take: 5, orderBy: { createdAt: 'desc' } },
        orders: { take: 5, orderBy: { createdAt: 'desc' }, include: { product: true } }
    }
  });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = await getUserData(session.user.id);
  if (!user) return null;

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
    <div className="min-h-screen pb-20 bg-soft-bg">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 lg:pt-40 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Sidebar / User Info */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-8 text-center shadow-xl border-white/40 bg-white/70 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-electricPurple/10 to-neonBlue/10"></div>
              
              <div className="relative mt-8 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-white shadow-2xl mx-auto flex items-center justify-center text-electricPurple border-4 border-white overflow-hidden">
                   <User className="w-12 h-12" />
                </div>
                {user.isVerified && (
                  <div className="absolute -bottom-2 right-1/2 translate-x-12 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-black text-deepIndigo mb-1">{user.name}</h2>
              <p className="text-gray-500 text-sm font-medium mb-6 uppercase tracking-wider">{user.role}</p>
              
              <div className="flex flex-col gap-3">
                <Button variant="secondary" className="w-full gap-2 text-sm">
                  <Settings className="w-4 h-4" /> Edit Profile
                </Button>
                <form action="/api/auth/signout" method="POST">
                   <Button variant="ghost" type="submit" className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                     <LogOut className="w-4 h-4" /> Sign Out
                   </Button>
                </form>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                 <div className="text-center">
                    <div className="text-xl font-black text-deepIndigo">{user.products.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Listings</div>
                 </div>
                 <div className="text-center">
                    <div className="text-xl font-black text-deepIndigo">{user.orders.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Orders</div>
                 </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-white/40">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Contact Info</h4>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                     <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                        <Mail className="w-4 h-4" />
                     </div>
                     <span className="text-gray-600 font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                     <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 shadow-sm">
                        <Calendar className="w-4 h-4" />
                     </div>
                     <span className="text-gray-600 font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>
            </GlassCard>
          </div>

          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Overview */}
            <h3 className="text-xl font-black text-deepIndigo">Marketplace Activity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Listings */}
                <GlassCard className="p-6 bg-white/70 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-deepIndigo flex items-center gap-2">
                             <Package className="w-5 h-5 text-electricPurple" /> My Listings
                        </h4>
                        <Link href="/dashboard" className="text-xs font-bold text-electricPurple hover:underline">View All</Link>
                    </div>
                    
                    <div className="space-y-4">
                        {user.products.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No active listings.</p>
                        ) : (
                            user.products.map((p: any) => {
                                const images = parseImages(p.images);
                                return (
                                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl border border-gray-50 hover:bg-white/50 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                            <Image 
                                                src={images[0]} 
                                                fill 
                                                alt={p.title} 
                                                className="object-cover" 
                                                unoptimized={images[0].startsWith('data:')}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-sm font-bold text-deepIndigo truncate">{p.title}</h5>
                                            <p className="text-xs text-gray-500">₦{p.price.toLocaleString()}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </GlassCard>

                {/* Recent Purchases */}
                <GlassCard className="p-6 bg-white/70 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-deepIndigo flex items-center gap-2">
                             <ShoppingBag className="w-5 h-5 text-neonBlue" /> Recent Orders
                        </h4>
                        <Link href="#" className="text-xs font-bold text-neonBlue hover:underline">View All</Link>
                    </div>
                    
                    <div className="space-y-4">
                        {user.orders.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No recent purchases.</p>
                        ) : (
                            user.orders.map((o: any) => {
                                const images = parseImages(o.product.images);
                                return (
                                    <div key={o.id} className="flex items-center gap-3 p-2 rounded-xl border border-gray-50 hover:bg-white/50 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                            <Image 
                                                src={images[0]} 
                                                fill 
                                                alt={o.product.title} 
                                                className="object-cover" 
                                                unoptimized={images[0].startsWith('data:')}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-sm font-bold text-deepIndigo truncate">{o.product.title}</h5>
                                            <p className="text-xs text-green-600 font-semibold">{o.status}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Profile Settings */}
            <h3 className="text-xl font-black text-deepIndigo">Profile Settings</h3>
            <GlassCard className="p-8 bg-white/70 overflow-hidden">
                <ProfileForm initialName={user.name!} />
            </GlassCard>

            {/* Verification Banner */}
            {!user.isVerified && (
              <GlassCard className="p-8 bg-gradient-to-r from-electricPurple to-neonBlue text-white shadow-xl shadow-electricPurple/20 border-none relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-700"></div>
                 <div className="relative z-10">
                    <h4 className="text-2xl font-black mb-2 flex items-center gap-3">
                       <ShieldCheck className="w-8 h-8" /> Get Verified
                    </h4>
                    <p className="text-indigo-100 font-medium mb-6 max-w-lg">
                       Verified students sell 3x faster. Complete your student verification with a .edu email and student ID to unlock premium features.
                    </p>
                    <VerificationButton />
                 </div>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
