import React from 'react';
import { Search, MapPin, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Header({ searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen }) {
  const { getTotalCount, setIsCartOpen, tableNumber, isTableFromQr } = useCartStore();
  const totalCount = getTotalCount();

  return (
    <header className="sticky top-0 z-30 bg-[#121214] text-white shadow-md">
      <div className="max-w-md mx-auto">
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#232328]">
          {/* Seamless Blended Tile Hause Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/tilehause-logo-transparent.png"
              alt="Tile Hause"
              className="h-10 w-auto object-contain drop-shadow-xs"
            />
            {tableNumber && (
              <span className="bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-300" /> Meja {tableNumber}
              </span>
            )}
          </div>

          {/* Action Icons (Search & Cart Only for Customer) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl bg-[#1E1E22] hover:bg-[#28282D] text-slate-200 transition-colors"
              aria-label="Cari Menu"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white shadow-xs active:scale-95 transition-transform"
              aria-label="Keranjang"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-slate-900 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="p-3 bg-[#18181B] border-b border-[#232328] flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kopi, dimsum, paket combat..."
                className="w-full bg-[#121214] text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-8 py-2 outline-none border border-[#232328] focus:border-slate-500"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Outlet Location Info Card & Active Table Pill */}
        <div className="bg-white text-slate-900 px-4 py-2.5 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-slate-800 shrink-0" />
              <div className="truncate">
                <h3 className="font-extrabold text-xs text-slate-900 leading-tight truncate">
                  Tile Hause - Purwokerto
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Buka Jam, 09:00 - 00:00
                </p>
              </div>
            </div>

            {/* Active Scanned Table Badge Indicator */}
            {tableNumber ? (
              <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 text-xs font-black shadow-xs">
                <span>Meja {tableNumber}</span>
                {isTableFromQr && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Terverifikasi dari QR Meja" />
                )}
              </div>
            ) : (
              <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 text-[11px] font-extrabold">
                <span>Dine-In</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
