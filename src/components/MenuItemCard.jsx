import React from 'react';
import { Plus, Minus, Info } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function MenuItemCard({ item, onSelectItem }) {
  const { getItemQuantityInCart, quickUpdateQuantity } = useCartStore();
  const quantity = getItemQuantityInCart(item.id);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    quickUpdateQuantity(item, -1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    quickUpdateQuantity(item, 1);
  };

  // Filter out unwanted badges like 'PAKET HEMAT' and 'BEST SELLER'
  const displayBadge = item.badges?.find(b => b !== 'PAKET HEMAT' && b !== 'BEST SELLER');

  return (
    <div
      onClick={() => onSelectItem(item)}
      className="bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-all shadow-xs relative group"
    >
      {/* Square Food Photo Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {displayBadge && (
          <div className="absolute bottom-1.5 left-1.5">
            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FF5500] text-white">
              {displayBadge}
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          <h3 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-2 uppercase">
            {item.name}
          </h3>
          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
            {item.description}
          </p>
        </div>

        {/* Customization Hint */}
        <div className="text-[9px] text-[#FF5500] font-bold flex items-center gap-1">
          <Info className="w-2.5 h-2.5 shrink-0" />
          <span>Tap kartu untuk custom</span>
        </div>

        {/* Pricing & Stepper Button */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
          <div className="font-black text-xs text-slate-900">
            {formatIDR(item.price)}
          </div>

          {/* Full-width NihLoh Orange Stepper */}
          {quantity === 0 ? (
            <button
              onClick={handleIncrement}
              className="w-full border border-[#FF5500] text-[#FF5500] font-extrabold text-xs py-1.5 rounded-xl hover:bg-[#FF5500] hover:text-white transition-colors active:scale-95 text-center flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tambah</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#FF5500] text-white rounded-xl font-black p-0.5">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
                aria-label="Kurangi"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="text-xs font-black px-2">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors"
                aria-label="Tambah"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
