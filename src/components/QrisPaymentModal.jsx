import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldCheck, MapPin, User, Lock, Copy, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function QrisPaymentModal() {
  const { isQrisModalOpen, setIsQrisModalOpen, getTotalPrice, checkoutOrder, customerName, tableNumber } = useCartStore();

  const [timeLeft, setTimeLeft] = useState(300);
  const [copiedNominal, setCopiedNominal] = useState(false);

  const totalPrice = getTotalPrice();

  useEffect(() => {
    let timer;
    if (isQrisModalOpen) {
      setTimeLeft(300);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQrisModalOpen]);

  if (!isQrisModalOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(totalPrice.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  const handleConfirmPaid = () => {
    checkoutOrder('QRIS');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsQrisModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh] text-slate-900 border border-slate-100"
        >
          {/* Official Merchant Header */}
          <div className="p-3.5 bg-[#121214] text-white border-b border-[#232328] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/nihloh-logo-transparent.png"
                alt="NihLoh Coffee & Eatery"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[170px]">
                  NihLoh - Jatisari, Sumampir
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsQrisModalOpen(false)}
              className="w-7 h-7 rounded-full bg-[#232328] text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 overflow-y-auto no-scrollbar bg-slate-50/50">
            {/* Live Countdown Bar */}
            <div className="bg-[#FFF5EE] border border-[#FF5A00]/20 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
                <Clock className="w-4 h-4 text-[#FF5A00]" />
                <span>Sisa Waktu Pembayaran:</span>
              </div>
              <div className={`text-xs font-black px-2.5 py-1 rounded-xl font-mono transition-colors ${
                timeLeft < 60 ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#FF5A00] text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Customer & Table Tag */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between text-xs font-bold text-slate-700 shadow-xs">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF5A00]" />
                {customerName || 'Pelanggan'}
              </span>
              <span className="flex items-center gap-1 bg-[#FFF5EE] px-2.5 py-1 rounded-xl border border-[#FF5A00]/20 text-[#FF5A00] font-black">
                <MapPin className="w-3 h-3" />
                Meja {tableNumber || '-'}
              </span>
            </div>

            {/* Locked Nominal Input Section */}
            <div className="bg-white border border-[#FF5A00]/30 rounded-2xl p-3.5 space-y-2 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-[#FF5A00] uppercase tracking-wider">
                <Lock className="w-3 h-3 text-[#FF5A00]" />
                <span>Nominal Pembayaran (Terkunci Pas)</span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={formatIDR(totalPrice)}
                  className="w-full bg-[#FFF5EE] text-center font-black text-xl text-[#FF5A00] py-2.5 px-3 rounded-xl border border-[#FF5A00]/30 outline-none cursor-not-allowed select-all font-display"
                />
                <button
                  type="button"
                  onClick={handleCopyNominal}
                  className="absolute right-2 p-1.5 bg-white border border-[#FF5A00]/20 hover:bg-[#FFF5EE] text-[#FF5A00] rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                  title="Salin Angka Nominal"
                >
                  {copiedNominal ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-bold leading-tight">
                🔒 Nominal terkunci otomatis, bayar pas sesuai angka di atas saat scan QRIS.
              </p>
            </div>

            {/* Official QR Code Poster Display */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-3 shadow-xs text-center">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-slate-800 tracking-wider">QRIS RESMI GPN</span>
                <span className="text-[9px] bg-[#FF5A00] text-white font-black px-2 py-0.5 rounded-full">Kebab Hikmal</span>
              </div>

              {/* Official QR Poster Image Container */}
              <div className="relative w-full max-w-[230px] mx-auto bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <img
                  src="/official-qris.jpg"
                  alt="QRIS Pembayaran Resmi"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>

              <div className="text-[10px] text-slate-600 font-extrabold leading-relaxed">
                Scan via GoPay, OVO, ShopeePay, DANA, BCA, Mandiri, BRI, BNI & E-Wallet / Mobile Banking.
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifikasi pembayaran otomatis oleh kasir</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <button
              onClick={handleConfirmPaid}
              className="w-full bg-[#FF5A00] hover:bg-[#E55000] text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl flex items-center justify-center active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25"
            >
              <span>Saya Sudah Bayar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

