import React from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, DollarSign, Package, ShoppingBag, Plus, Activity, Clock } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getDashboardData() {
  // For demonstration, we fetch the first seller from the DB
  const seller = await prisma.user.findFirst({
    where: { role: 'SELLER' },
  });

  if (!seller) return null;

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
  });

  const orders = await prisma.order.findMany({
    where: { 
      product: { sellerId: seller.id } 
    },
    include: {
      buyer: true,
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalEarnings = orders
    .filter((o: any) => o.status === 'COMPLETED')
    .reduce((sum: number, o: any) => sum + o.amount, 0);

  const activeListings = products.length;
  const pendingOrders = orders.filter((o: any) => o.status === 'PENDING' || o.status === 'AWAITING_MEETUP').length;

  return {
    seller,
    totalEarnings,
    activeListings,
    pendingOrders,
    recentOrders: orders.slice(0, 5),
  };
}

export default async function SellerDashboard() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="min-h-screen bg-soft-bg flex items-center justify-center p-4">
        <GlassCard className="p-10 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">No Seller Profile Found</h1>
          <p className="text-gray-500 mb-6">Please set up your seller account to view the dashboard.</p>
          <Button asChild>
            <Link href="/">Return to Marketplace</Link>
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-soft-bg">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 lg:pt-40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-deepIndigo mb-1">Seller Dashboard</h1>
            <p className="text-gray-500">Welcome back, {data.seller.name}! Here's your shop overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="shadow-sm">View Shop</Button>
            <Button className="shadow-lg shadow-electricPurple/20" asChild>
              <Link href="/add-product">
                <Plus className="w-5 h-5 mr-2" /> Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Earnings */}
          <GlassCard className="p-6 bg-gradient-to-br from-electricPurple/10 to-neonBlue/5 border-none">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-electricPurple text-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <Badge className="bg-white text-green-600 border-none shadow-sm shadow-green-100 flex items-center gap-1 font-bold">
                <ArrowUpRight className="w-3 h-3" /> 0%
              </Badge>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Earnings</p>
            <h3 className="text-3xl font-black text-deepIndigo">₦{data.totalEarnings.toLocaleString()}</h3>
          </GlassCard>

          {/* Active Listings */}
          <GlassCard className="p-6 bg-white/60">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Active Listings</p>
            <h3 className="text-3xl font-black text-deepIndigo">{data.activeListings}</h3>
          </GlassCard>

          {/* Pending Orders */}
          <GlassCard className="p-6 bg-white/60">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              {data.pendingOrders > 0 && (
                <Badge className="bg-orange-100 text-orange-700 border-none">
                  Action Needed
                </Badge>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Pending Orders</p>
            <h3 className="text-3xl font-black text-deepIndigo">{data.pendingOrders}</h3>
          </GlassCard>

          {/* Profile Views */}
          <GlassCard className="p-6 bg-white/60">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                <Activity className="w-6 h-6" />
              </div>
              <Badge className="bg-white text-green-600 border-none shadow-sm shadow-green-100 flex items-center gap-1 font-bold">
                <ArrowUpRight className="w-3 h-3" /> 0%
              </Badge>
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Profile Views</p>
            <h3 className="text-3xl font-black text-deepIndigo">0</h3>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column - Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-deepIndigo flex items-center">
              Recent Orders
            </h2>
            
            <GlassCard className="bg-white/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 uppercase text-xs font-bold tracking-wider text-gray-400 bg-gray-50/50">
                      <th className="p-5">Item</th>
                      <th className="p-5">Buyer</th>
                      <th className="p-5">Amount</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-gray-500 font-medium">
                          No recent orders to show.
                        </td>
                      </tr>
                    ) : (
                      data.recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-5">
                            <div className="font-bold text-deepIndigo">{order.product.title}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1"/> {order.createdAt.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-5 font-medium text-gray-600">{order.buyer.name}</td>
                          <td className="p-5 font-bold text-deepIndigo">₦{order.amount.toLocaleString()}</td>
                          <td className="p-5">
                            <Badge variant={order.status === 'COMPLETED' ? 'verified' : 'pending'}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-5 text-right">
                            <Button variant="secondary" size="sm">Details</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Withdrawals & Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-deepIndigo">Withdraw Earnings</h2>
            <GlassCard className="p-6 bg-white/80">
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <p className="text-sm font-semibold text-gray-500 mb-1">Available for Withdrawal</p>
                <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-electricPurple to-neonBlue">
                  ₦{data.totalEarnings.toLocaleString()}
                </h3>
              </div>
              
              <Button className="w-full text-lg shadow-md shadow-electricPurple/20" disabled={data.totalEarnings === 0}>
                Withdraw Funds
              </Button>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
