import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Clock, ShieldCheck, MapPin, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function QrisPaymentModal() {
  const { isQrisModalOpen, setIsQrisModalOpen, getTotalPrice, checkoutOrder, customerName, tableNumber } = useCartStore();

  const [timeLeft, setTimeLeft] = useState(300);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText('00020101021126580014ID.LINKAJA.WWW0118936009110020698129021500000000000000050303360540000053033605802ID5908KOPIKITA6007JAKARTA61051219062070703A0163049F2D');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[92vh] text-slate-900"
        >
          {/* Official Merchant Header */}
          <div className="p-3 bg-[#121214] text-white border-b border-[#232328] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/nihloh-logo-transparent.png"
                alt="NihLoh Coffee & Eatery"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[170px]">
                  NihLoh - Jatisari, Sumampir - Purwokerto
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
          <div className="p-4 space-y-3.5 overflow-y-auto no-scrollbar">
            {/* Live 5-Minute Countdown Bar */}
            <div className="bg-[#FFF6F0] border border-[#FFD4C2] rounded-2xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
                <Clock className="w-4 h-4 text-[#FF5A00]" />
                <span>Sisa Waktu Pembayaran:</span>
              </div>
              <div className={`text-sm font-black px-2.5 py-1 rounded-lg font-mono transition-colors ${
                timeLeft < 60 ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#FF5A00] text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Customer & Table Tag */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#FF5A00]" />
                {customerName || 'Pelanggan'}
              </span>
              <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-[#FF5A00] font-black">
                <MapPin className="w-3 h-3" />
                Meja {tableNumber || '-'}
              </span>
            </div>

            {/* Total Billing Display */}
            <div className="text-center py-1 space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
                Total Tagihan Pembayaran
              </div>
              <div className="text-2xl font-black text-[#FF5A00]">
                {formatIDR(totalPrice)}
              </div>
            </div>

            {/* Official QR Code Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-300 space-y-3 shadow-xs text-center">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-black text-slate-800 tracking-wider">STANDAR QRIS GPN</span>
                <span className="text-[9px] bg-slate-900 text-white font-black px-1.5 py-0.5 rounded">QRIS INSTANT</span>
              </div>

              {/* QR Barcode Canvas Box */}
              <div className="w-44 h-44 mx-auto bg-white p-1 rounded-xl flex items-center justify-center relative border border-slate-200">
                <QrCode className="w-full h-full text-slate-900" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img
                    src="/nihloh-logo-transparent.png"
                    alt="Logo Badge"
                    className="w-10 h-10 object-contain p-0.5 drop-shadow-xs"
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-extrabold leading-tight">
                Scan menggunakan GoPay, OVO, ShopeePay, Dana, BCA, Mandiri, dll.
              </div>
            </div>

            {/* Copy QRIS String Button */}
            <button
              onClick={handleCopy}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center transition-colors"
            >
              <span>{copied ? '✓ Kode String QRIS Disalin!' : 'Salin Kode String QRIS'}</span>
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A00]" />
              <span>Verifikasi otomatis setelah pembayaran</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              onClick={handleConfirmPaid}
              className="w-full bg-[#FF5A00] text-white font-black text-xs py-3.5 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md"
            >
              <span>Saya Sudah Bayar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
