import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Clock, CheckCircle, RefreshCcw, XCircle, ArrowRight } from 'lucide-react';

export default function AdminLiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    fetchOrders();

    // Subscribe to realtime orders changes
    const orderSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        console.log('Order changed:', payload);
        fetchOrders(); // Refresh fully to get joined items
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Limit to today's active orders or recent ones
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_per_item,
            subtotal,
            products (name)
          )
        `)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching live orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const updatePaymentStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Update payment error:', err);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 text-center text-zinc-500">
        Supabase belum dikonfigurasi.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wide font-display">
            Live Orders
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Daftar pesanan hari ini secara real-time.
          </p>
        </div>
        <button onClick={fetchOrders} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-zinc-500">Memuat pesanan...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-2xl">
          Belum ada pesanan hari ini.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
              {/* Header Card */}
              <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono">#{order.order_code}</span>
                  <div className="font-bold text-white text-sm">{order.customer_name || 'Pelanggan'}</div>
                </div>
                <div className="text-right">
                  <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-[10px] font-bold">
                    Meja {order.table_number || '-'}
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {formatTime(order.created_at)}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 flex-1 space-y-2">
                {(order.order_items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-zinc-300 border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                    <div className="flex gap-2">
                      <span className="font-bold text-white">{item.quantity}x</span>
                      <span>{item.products?.name || 'Item Terhapus'}</span>
                    </div>
                    <span className="font-mono text-zinc-400">{formatIDR(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Totals & Actions */}
              <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 space-y-3">
                <div className="flex justify-between items-center font-black">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider">Total</span>
                  <span className="text-white text-lg">{formatIDR(order.total_amount)}</span>
                </div>

                {/* Status Toggles */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <span className="block text-[10px] text-zinc-500 mb-1">Pembayaran</span>
                    <select
                      value={order.payment_status}
                      onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                      className={`w-full text-xs font-bold p-1.5 rounded-lg outline-none cursor-pointer border ${order.payment_status === 'Paid' ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-400' :
                          order.payment_status === 'Pending' ? 'bg-amber-950/30 border-amber-800/60 text-amber-400' :
                            'bg-rose-950/30 border-rose-800/60 text-rose-400'
                        }`}
                    >
                      <option value="Pending" className="bg-zinc-900 text-amber-400">Pending</option>
                      <option value="Paid" className="bg-zinc-900 text-emerald-400">Paid</option>
                      <option value="Failed" className="bg-zinc-900 text-rose-400">Failed</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <span className="block text-[10px] text-zinc-500 mb-1">Status Order</span>
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`w-full text-xs font-bold p-1.5 rounded-lg outline-none cursor-pointer border ${order.order_status === 'Completed' ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-400' :
                          order.order_status === 'Processing' ? 'bg-blue-950/30 border-blue-800/60 text-blue-400' :
                            order.order_status === 'Cancelled' ? 'bg-rose-950/30 border-rose-800/60 text-rose-400' :
                              'bg-zinc-800 border-zinc-700 text-zinc-300'
                        }`}
                    >
                      <option value="Pending" className="bg-zinc-900 text-zinc-300">Pending</option>
                      <option value="Processing" className="bg-zinc-900 text-blue-400">Processing</option>
                      <option value="Completed" className="bg-zinc-900 text-emerald-400">Completed</option>
                      <option value="Cancelled" className="bg-zinc-900 text-rose-400">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
