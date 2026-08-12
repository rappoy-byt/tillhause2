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
    }).format(num || 0);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    quickUpdateQuantity(item, -1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    quickUpdateQuantity(item, 1);
  };

  // 1. Penyesuaian Status Sold Out dari Supabase (is_available)
  const isSoldOut = item.is_available === false || Boolean(item.isSoldOut);

  // 2. Gambar produk dari Supabase (image_url) atau Gambar Default jika kosong
  const imageUrl = item.image_url || item.image || 'https://via.placeholder.com/300?text=No+Image';

  // Safe navigation jika badges belum diisi di Supabase
  const displayBadge = item.badges?.find(b => b !== 'PAKET HEMAT' && b !== 'BEST SELLER');

  return (
    <div
      onClick={() => !isSoldOut && onSelectItem && onSelectItem(item)}
      className={`bg-white border rounded-2xl p-2.5 flex flex-col justify-between transition-all shadow-xs relative group ${
        isSoldOut ? 'border-slate-200 opacity-80 cursor-not-allowed bg-slate-50' : 'border-slate-200 hover:border-slate-300 cursor-pointer'
      }`}
    >
      {/* Container Foto Makanan */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
        <img
          src={imageUrl}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${isSoldOut ? 'grayscale contrast-75' : 'group-hover:scale-105'}`}
          loading="lazy"
        />

        {isSoldOut ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-rose-600 text-white shadow-md">
              SOLD OUT
            </span>
          </div>
        ) : (
          displayBadge && (
            <div className="absolute bottom-1.5 left-1.5">
              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-white">
                {displayBadge}
              </span>
            </div>
          )
        )}
      </div>

      {/* Informasi Produk */}
      <div className="flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          <h3 className={`font-extrabold text-xs leading-snug line-clamp-2 uppercase ${isSoldOut ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
            {item.name}
          </h3>
          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
            {item.description || 'Tidak ada deskripsi'}
          </p>
        </div>

        {/* Customization Hint */}
        {!isSoldOut && (
          <div className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
            <Info className="w-2.5 h-2.5 shrink-0" />
            <span>Tap kartu untuk custom</span>
          </div>
        )}

        {/* Harga & Tombol Stepper */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
          <div className={`font-black text-xs ${isSoldOut ? 'text-slate-400' : 'text-slate-900'}`}>
            {formatIDR(item.price)}
          </div>

          {/* Stepper / Tombol Status */}
          {isSoldOut ? (
            <button
              disabled
              className="w-full bg-slate-200 text-slate-400 font-extrabold text-[10px] py-1.5 rounded-xl cursor-not-allowed uppercase tracking-wider"
            >
              Stok Habis
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={handleIncrement}
              className="w-full border border-slate-800 text-slate-800 font-extrabold text-xs py-1.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors active:scale-95 text-center flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tambah</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl font-black p-0.5">
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