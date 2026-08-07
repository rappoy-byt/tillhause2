import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { MENU_ITEMS } from '../data/menuData';

export default function DynamicBanner({ onSelectItem }) {
  const { addItem } = useCartStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const promoBanners = [
    {
      id: 'banner-1',
      title: 'CHICKEN POP TERIYAKI',
      subtitle: 'Ayam crispy renyah + Saus Teriyaki khas NihLoh',
      price: 25000,
      badge: 'BEST SELLER',
      item: MENU_ITEMS[0],
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'banner-2',
      title: 'KATSU SAMBAL MATAH',
      subtitle: 'Chicken Katsu tebal disiram Sambal Matah serai segar',
      price: 25000,
      badge: 'HEAD MENU',
      item: MENU_ITEMS[5],
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'banner-3',
      title: 'BEEF TERIYAKI SIGNATURE',
      subtitle: 'Irisan daging sapi empuk tumis teriyaki & bombay',
      price: 28000,
      badge: 'RECOMMENDED',
      item: MENU_ITEMS[10],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'
    }
  ];

  const currentBanner = promoBanners[activeSlide];

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % promoBanners.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
  };

  return (
    <div className="w-full bg-[#121214] relative overflow-hidden border-b border-slate-200">
      {/* Full Width Edge-to-Edge Banner Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onSelectItem(currentBanner.item)}
          className="relative w-full h-44 sm:h-52 cursor-pointer group"
        >
          {/* Edge-to-Edge Image */}
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex items-center px-4 sm:px-6">
            <div className="space-y-1.5 max-w-[70%] text-white">
              <span className="inline-block bg-[#FF5A00] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                {currentBanner.badge}
              </span>

              <h2 className="text-sm sm:text-base font-black text-white leading-tight uppercase font-display">
                {currentBanner.title}
              </h2>

              <p className="text-[11px] text-slate-300 line-clamp-1 font-medium">
                {currentBanner.subtitle}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-sm font-black text-[#FF5A00]">
                  {formatIDR(currentBanner.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(currentBanner.item);
            }}
            className="absolute bottom-3 right-4 bg-[#FF5A00] text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center justify-center active:scale-95 transition-transform border border-white/30"
          >
            <span>+ Tambah</span>
          </button>

          {/* Manual Arrow Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white font-black text-xs hover:bg-black/80 backdrop-blur-xs flex items-center justify-center transition-colors"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white font-black text-xs hover:bg-black/80 backdrop-blur-xs flex items-center justify-center transition-colors"
          >
            &gt;
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {promoBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSlide === idx ? 'bg-[#FF5A00] w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
