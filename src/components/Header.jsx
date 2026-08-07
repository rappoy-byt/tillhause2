import React from 'react';
import { Search, MapPin, ChevronRight, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Header({ searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen }) {
  const { getTotalCount, setIsCartOpen } = useCartStore();
  const totalCount = getTotalCount();

  return (
    <header className="sticky top-0 z-30 bg-[#121214] text-white shadow-md">
      <div className="max-w-md mx-auto">
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#232328]">
          {/* Seamless Blended NihLoh Coffee & Eatery Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/nihloh-logo-transparent.png"
              alt="NihLoh Coffee & Eatery"
              className="h-10 w-auto object-contain drop-shadow-xs"
            />
          </div>

          {/* Action Icons (Search & Cart Only) */}
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
              className="relative p-2 rounded-xl bg-[#FF5A00] text-white shadow-xs active:scale-95 transition-transform"
              aria-label="Keranjang"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#FF5A00] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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
                className="w-full bg-[#121214] text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-8 py-2 outline-none border border-[#232328] focus:border-[#FF5A00]"
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

        {/* Outlet Location Info Card */}
        <div className="bg-white text-slate-900 px-4 py-2.5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF5A00]" />
              <div>
                <h3 className="font-extrabold text-xs text-slate-900 leading-tight">
                  NihLoh - Jatisari, Sumampir - Purwokerto
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Buka Jam, 09:00 - 00:00
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
