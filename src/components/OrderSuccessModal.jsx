import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, QrCode, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore } from '../store/useCartStore';

export default function OrderSuccessModal() {
  const { isOrderSuccess, setIsOrderSuccess, lastOrderData } = useCartStore();

  useEffect(() => {
    if (isOrderSuccess) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FF7700', '#FF3300', '#FFFFFF']
      });
    }
  }, [isOrderSuccess]);

  if (!isOrderSuccess || !lastOrderData) return null;

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] text-slate-900"
        >
          {/* Header */}
          <div className="p-6 text-center bg-gradient-to-b from-[#FFF6F0] to-white space-y-2 border-b border-slate-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="w-14 h-14 bg-[#FF5500] text-white rounded-full flex items-center justify-center mx-auto shadow-md"
            >
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </motion.div>

            <h2 className="text-lg font-black text-slate-900 uppercase">Pesanan Berhasil</h2>
            <p className="text-xs text-slate-500 font-medium">
              Pesanan sedang diproses oleh dapur NihLoh Café.
            </p>

            <div className="inline-block bg-[#FFF6F0] border border-[#FFD4C2] text-[#FF5500] text-xs font-black px-3 py-1 rounded-full">
              ID Pesanan: {lastOrderData.orderId}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4 overflow-y-auto no-scrollbar">
            {/* Live Order Status Tracker */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Status Pesanan Live
              </div>

              <div className="relative pl-6 space-y-3.5 text-xs">
                <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-slate-200" />

                {/* Step 1 */}
                <div className="relative flex items-center gap-2">
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-black text-[9px]">
                    ✓
                  </div>
                  <span className="font-extrabold text-slate-900">Pesanan Diterima</span>
                  <span className="text-[10px] text-slate-400">{lastOrderData.timestamp}</span>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center gap-2">
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-[9px] animate-pulse">
                    ✓
                  </div>
                  <span className="font-extrabold text-amber-600">Sedang Disiapkan Dapur</span>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center gap-2 text-slate-400">
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px]">
                    •
                  </div>
                  <span>Siap Diantar ke Meja {lastOrderData.tableNumber}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center space-y-1.5">
              <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="text-[10px] font-extrabold text-slate-700">
                Struk ini tersimpan otomatis untuk Meja {lastOrderData.tableNumber}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-700 pb-1 border-b border-slate-200">
                <span>Detail Pesanan ({lastOrderData.customerName})</span>
                <span>Meja {lastOrderData.tableNumber}</span>
              </div>

              {lastOrderData.items.map((entry, idx) => (
                <div key={idx} className="flex justify-between text-slate-600 text-[11px]">
                  <span>{entry.quantity}x {entry.item.name}</span>
                  <span className="font-bold text-slate-900">{formatIDR(entry.unitPrice * entry.quantity)}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Dibayar ({lastOrderData.paymentMethod})</span>
                <span className="text-[#FF5500]">{formatIDR(lastOrderData.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => setIsOrderSuccess(false)}
              className="w-full bg-[#FF5500] text-white font-black text-xs py-3.5 rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Pesan Menu Lain</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
