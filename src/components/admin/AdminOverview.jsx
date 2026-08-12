import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, LayoutGrid, Award } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    todayIncome: 0,
    todayOrders: 0,
    activeTables: 0,
    topMenu: null,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      // 1. Get today's income & orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, total_amount, table_number')
        .gte('created_at', today.toISOString())
        .eq('payment_status', 'Paid')
        .neq('order_status', 'Cancelled');

      if (error) throw error;

      let income = 0;
      let tables = new Set();
      if (orders) {
        orders.forEach(order => {
          income += Number(order.total_amount);
          if (order.table_number) tables.add(order.table_number);
        });
      }

      // 2. Mock Top Selling Menu for now (requires complex join grouping in Supabase RPC normally)
      // We will just fetch a recommended or popular item
      const { data: topItem } = await supabase
        .from('products')
        .select('name')
        .limit(1);

      setStats({
        todayIncome: income,
        todayOrders: orders ? orders.length : 0,
        activeTables: tables.size,
        topMenu: topItem && topItem.length > 0 ? topItem[0].name : 'Belum Ada',
      });
    } catch (err) {
      console.error('Error fetching overview stats:', err);
    }
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-5">
        <h2 className="text-xl font-black text-white uppercase tracking-wide font-display">
          Overview & Ringkasan
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Pantau aktivitas kafe dan statistik utama hari ini.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-amber-950/50 border border-amber-800/80 p-4 rounded-xl text-amber-400 text-sm font-medium">
          Supabase belum dikonfigurasi. Silakan isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Pendapatan Hari Ini</span>
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mt-4">{formatIDR(stats.todayIncome)}</h3>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Total Pesanan (Hari Ini)</span>
            <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mt-4">{stats.todayOrders} Orders</h3>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Meja Aktif</span>
            <div className="w-8 h-8 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mt-4">{stats.activeTables} Meja</h3>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Menu Terlaris</span>
            <div className="w-8 h-8 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white mt-4 truncate">{stats.topMenu}</h3>
        </div>
      </div>
    </div>
  );
}
