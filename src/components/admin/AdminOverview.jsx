import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, LayoutGrid, Award, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    todayIncome: 0,
    todayOrders: 0,
    activeTables: 0,
    topMenu: 'Belum Ada',
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    fetchOverviewStats();

    // Setup Realtime Sync: Otomatis memperbarui data saat ada pesanan baru
    const channel = supabase
      .channel('overview-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOverviewStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOverviewStats = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Ambil data pesanan & pendapatan hari ini
      const { data: todayOrdersData, error: todayError } = await supabase
        .from('orders')
        .select('id, total_amount, table_number, payment_status, order_status, status, created_at')
        .gte('created_at', today.toISOString())
        .neq('order_status', 'Cancelled')
        .neq('status', 'cancelled');

      if (todayError) throw todayError;

      let income = 0;
      if (todayOrdersData) {
        todayOrdersData.forEach(order => {
          if (
            order.payment_status === 'Paid' || 
            order.order_status === 'Completed' || 
            order.status === 'completed'
          ) {
            income += Number(order.total_amount || 0);
          }
        });
      }

      // 2. Hitung MEJA AKTIF (Pesanan yang sedang aktif/berlangsung)
      const { data: activeOrdersData, error: activeError } = await supabase
        .from('orders')
        .select('table_number, order_status, status')
        .not('order_status', 'in', '("Completed","Cancelled")')
        .not('status', 'in', '("completed","cancelled")');

      if (activeError) console.error('Error active tables:', activeError);

      const activeTablesSet = new Set();
      if (activeOrdersData) {
        activeOrdersData.forEach(o => {
          if (o.table_number) activeTablesSet.add(o.table_number);
        });
      }

      // 3. Hitung MENU TERLARIS secara aktual dari order_items
      let topItemName = 'Belum Ada';
      const { data: orderItemsData } = await supabase
        .from('order_items')
        .select('item_name, product_name, quantity');

      if (orderItemsData && orderItemsData.length > 0) {
        const itemCounts = {};
        orderItemsData.forEach(item => {
          const name = item.item_name || item.product_name;
          if (name) {
            itemCounts[name] = (itemCounts[name] || 0) + (item.quantity || 1);
          }
        });

        let maxCount = 0;
        Object.keys(itemCounts).forEach(name => {
          if (itemCounts[name] > maxCount) {
            maxCount = itemCounts[name];
            topItemName = name;
          }
        });
      }

      setStats({
        todayIncome: income,
        todayOrders: todayOrdersData ? todayOrdersData.length : 0,
        activeTables: activeTablesSet.size,
        topMenu: topItemName,
      });

      // Simpan 5 pesanan terbaru untuk ringkasan aktivitas
      if (todayOrdersData) {
        const sorted = [...todayOrdersData]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentOrders(sorted);
      }

    } catch (err) {
      console.error('Error fetching overview stats:', err);
    } finally {
      setIsLoading(false);
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
      <div className="border-b border-zinc-800 pb-5 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wide font-display">
            Overview & Ringkasan
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Pantau aktivitas kafe dan statistik utama hari ini secara akurat.
          </p>
        </div>
        <button 
          onClick={fetchOverviewStats} 
          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg font-mono transition-colors"
        >
          {isLoading ? 'Memuat...' : 'Refresh Data'}
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-amber-950/50 border border-amber-800/80 p-4 rounded-xl text-amber-400 text-sm font-medium">
          Supabase belum dikonfigurasi. Silakan isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pendapatan */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Pendapatan Hari Ini</span>
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mt-4">{formatIDR(stats.todayIncome)}</h3>
        </div>

        {/* Total Pesanan */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Total Pesanan (Hari Ini)</span>
            <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mt-4">{stats.todayOrders} Orders</h3>
        </div>

        {/* Meja Aktif */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Meja Aktif</span>
            <div className="w-8 h-8 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mt-4">{stats.activeTables} Meja</h3>
        </div>

        {/* Menu Terlaris */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-zinc-400 font-mono font-bold uppercase">Menu Terlaris</span>
            <div className="w-8 h-8 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white mt-4 truncate" title={stats.topMenu}>
            {stats.topMenu}
          </h3>
        </div>
      </div>

      {/* Ringkasan Pesanan Terbaru (Activity Feed) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            Aktivitas Pesanan Hari Ini
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">5 Pesanan Terakhir</span>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-zinc-800/60">
            {recentOrders.map((order) => {
              const isPaid = order.payment_status === 'Paid';
              const timeString = new Date(order.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 px-2.5 py-1 rounded-lg text-white font-mono font-bold">
                      Meja {order.table_number || '-'}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-200">ID: #{order.id.toString().slice(-5)}</div>
                      <div className="text-[10px] text-zinc-500">{timeString} WIB</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-white">{formatIDR(order.total_amount)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      isPaid 
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                    }`}>
                      {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {isPaid ? 'Lunas' : 'Belum Bayar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-zinc-500 text-xs">
            Belum ada pesanan masuk hari ini.
          </div>
        )}
      </div>
    </div>
  );
}