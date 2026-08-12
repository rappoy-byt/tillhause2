import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';
import { Download, Calendar, Filter } from 'lucide-react';

export default function AdminReports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('today'); // 'today' | 'month' | 'all'

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchReport();
  }, [dateFilter]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          id,
          order_code,
          created_at,
          customer_name,
          table_number,
          total_amount,
          payment_status,
          order_status
        `)
        .eq('payment_status', 'Paid')
        .neq('order_status', 'Cancelled')
        .order('created_at', { ascending: false });

      if (dateFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      } else if (dateFilter === 'month') {
        const firstDay = new Date();
        firstDay.setDate(1);
        firstDay.setHours(0, 0, 0, 0);
        query = query.gte('created_at', firstDay.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setReportData(data || []);
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) {
      alert('Tidak ada data untuk di-export.');
      return;
    }

    const headers = ['Order ID', 'Tanggal', 'Pelanggan', 'Meja', 'Total', 'Payment Status', 'Order Status'];
    const rows = reportData.map(order => [
      order.order_code,
      new Date(order.created_at).toLocaleString('id-ID'),
      order.customer_name || 'Pelanggan',
      order.table_number || '-',
      order.total_amount,
      order.payment_status,
      order.order_status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tilehause_report_${dateFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const totalIncome = reportData.reduce((sum, order) => sum + Number(order.total_amount), 0);

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 text-center text-zinc-500">
        Supabase belum dikonfigurasi.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wide font-display">
            Laporan & Income
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Rekap transaksi valid yang sudah terbayar (Paid) dan tidak dibatalkan.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-3 rounded-2xl text-xs shadow-lg transition-transform active:scale-95"
        >
          <Download className="w-4 h-4 stroke-[3]" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl flex">
          <button onClick={() => setDateFilter('today')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${dateFilter === 'today' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Hari Ini</button>
          <button onClick={() => setDateFilter('month')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${dateFilter === 'month' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Bulan Ini</button>
          <button onClick={() => setDateFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${dateFilter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Semua Waktu</button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-400 font-mono font-bold uppercase">Total Income ({dateFilter})</span>
          <h3 className="text-3xl font-black text-white mt-1">{formatIDR(totalIncome)}</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400 font-mono font-bold uppercase">Total Transaksi</span>
          <h3 className="text-2xl font-black text-zinc-300 mt-1">{reportData.length} Orders</h3>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-zinc-950 z-10">
              <tr className="text-zinc-400 text-[11px] font-mono uppercase tracking-wider border-b border-zinc-800">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs">
              {loading ? (
                <tr><td colSpan="4" className="py-8 text-center text-zinc-500">Memuat data laporan...</td></tr>
              ) : reportData.length > 0 ? (
                reportData.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-400">#{order.order_code}</td>
                    <td className="py-3 px-4 text-zinc-300">{new Date(order.created_at).toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4 font-bold text-white">{order.customer_name || 'Pelanggan'} <span className="text-zinc-500 font-normal">(Meja {order.table_number || '-'})</span></td>
                    <td className="py-3 px-4 font-mono font-black text-emerald-400 text-right">{formatIDR(order.total_amount)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="py-8 text-center text-zinc-500">Tidak ada transaksi yang sesuai.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
