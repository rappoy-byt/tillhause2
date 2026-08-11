import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function CartBottomBar() {
  const { getTotalCount, getTotalPrice, setIsCartOpen, isCartOpen } = useCartStore();

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  if (totalCount === 0 || isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between font-black shadow-lg cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-slate-900 w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-xs">
                {totalCount}
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-white/90 font-black">
                  {totalCount} Item Terpilih
                </div>
                <div className="text-sm font-black text-white leading-none">
                  {formatIDR(totalPrice)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-xl text-xs font-black">
              <span>Lanjut Pembayaran</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </motion.button>
        </div>
      </div>
    </AnimatePresence>
  );
}
