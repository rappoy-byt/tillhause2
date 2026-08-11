import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const QUICK_NOTE_CHIPS = [
  'Pisahkan Saus',
  'Ekstra Pedas',
  'Sedikit Es',
  'Tanpa Gula',
  'Bungkus Rapi'
];

export default function ItemDetailModal({ item, isOpen, onClose }) {
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedBean, setSelectedBean] = useState(null);
  const [selectedTemp, setSelectedTemp] = useState('');
  const [selectedSugar, setSelectedSugar] = useState('');
  const [selectedIce, setSelectedIce] = useState('');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedBean(item.beanOptions?.[0] || null);
      setSelectedTemp(item.temperatureOptions?.[0] || '');
      setSelectedSugar(item.sugarOptions?.[0] || '');
      setSelectedIce(item.iceOptions?.[0] || '');
      setSelectedToppings([]);
      setNotes('');
    }
  }, [item]);

  if (!item || !isOpen) return null;

  const toggleTopping = (topping) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const addQuickNote = (chipText) => {
    if (!notes) {
      setNotes(chipText);
    } else if (!notes.includes(chipText)) {
      setNotes(`${notes}, ${chipText}`);
    }
  };

  const calculateUnitPrice = () => {
    const beanPrice = selectedBean ? selectedBean.price : 0;
    const toppingTotal = selectedToppings.reduce((acc, t) => acc + t.price, 0);
    return item.price + beanPrice + toppingTotal;
  };

  const calculateTotalPrice = () => {
    return calculateUnitPrice() * quantity;
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleAddToCart = () => {
    addItem(item, {
      quantity,
      selectedBean,
      selectedTemp,
      selectedSugar,
      selectedIce,
      selectedToppings,
      notes
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Soft Translucent Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Minimalist White Bottom Sheet / Modal */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden max-h-[92vh] flex flex-col z-10 shadow-2xl text-slate-900 border border-slate-100"
        >
          {/* Top Handle */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

          {/* Hero Header Area */}
          <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />

            {/* Floating Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 text-slate-700 hover:text-slate-900 rounded-full flex items-center justify-center shadow-md border border-slate-200/60 active:scale-90 transition-all"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Header Title & Price Info */}
          <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300">
                {item.category?.toUpperCase() || 'TILE HAUSE SPECIAL'}
              </span>
              <h2 className="text-xl font-black text-slate-900 font-display tracking-tight leading-snug">
                {item.name}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Harga</span>
              <span className="text-lg font-black text-slate-900">
                {formatIDR(item.price)}
              </span>
            </div>
          </div>

          {/* Options & Detail Scrollable Content */}
          <div className="p-5 space-y-5 overflow-y-auto flex-1 no-scrollbar bg-slate-50/50">
            {/* Description Card */}
            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
              {item.description}
            </p>

            {/* Pilihan Biji Kopi (Beans) */}
            {item.beanOptions?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Pilihan Biji Kopi (Beans)
                  </label>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Wajib</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {item.beanOptions.map((bean) => {
                    const isSelected = selectedBean?.id === bean.id;
                    const finalPrice = item.price + bean.price;
                    return (
                      <button
                        key={bean.id}
                        type="button"
                        onClick={() => setSelectedBean(bean)}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold text-center transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-2 border-slate-900 shadow-xs scale-[1.02]'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="uppercase tracking-wider">{bean.name}</div>
                        <div className={`text-[10px] font-black mt-0.5 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                          {formatIDR(finalPrice)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suhu Penyajian */}
            {item.temperatureOptions?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Suhu Penyajian
                  </label>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Wajib</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {item.temperatureOptions.map((temp) => {
                    const isSelected = selectedTemp === temp;
                    return (
                      <button
                        key={temp}
                        type="button"
                        onClick={() => setSelectedTemp(temp)}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold text-center transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-2 border-slate-900 shadow-xs scale-[1.02]'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {temp}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Level Manis */}
            {item.sugarOptions?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Level Manis (Sugar)
                  </label>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Wajib</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {item.sugarOptions.map((sugar) => {
                    const isSelected = selectedSugar === sugar;
                    return (
                      <button
                        key={sugar}
                        type="button"
                        onClick={() => setSelectedSugar(sugar)}
                        className={`py-2.5 px-2 rounded-2xl text-xs text-center transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-2 border-slate-900 font-black shadow-xs scale-[1.02]'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-extrabold'
                        }`}
                      >
                        {sugar}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Level Es */}
            {item.iceOptions?.length > 0 && selectedTemp !== 'Hot' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Jumlah Es (Ice Level)
                  </label>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Wajib</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {item.iceOptions.map((ice) => {
                    const isSelected = selectedIce === ice;
                    return (
                      <button
                        key={ice}
                        type="button"
                        onClick={() => setSelectedIce(ice)}
                        className={`py-2.5 px-2 rounded-2xl text-xs text-center transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-2 border-slate-900 font-black shadow-xs scale-[1.02]'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-extrabold'
                        }`}
                      >
                        {ice}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Topping / Add-on Options */}
            {item.toppingOptions?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Topping & Add-On
                  </label>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">Opsional</span>
                </div>
                <div className="space-y-2">
                  {item.toppingOptions.map((topping) => {
                    const isChecked = selectedToppings.some(t => t.id === topping.id);
                    return (
                      <button
                        key={topping.id}
                        type="button"
                        onClick={() => toggleTopping(topping)}
                        className={`w-full p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-slate-100 border-2 border-slate-800 text-slate-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-slate-50'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span>{topping.name}</span>
                        </div>
                        <span className="font-black text-slate-800 bg-slate-200 px-2 py-1 rounded-lg text-xs">
                          + {formatIDR(topping.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Catatan Khusus Barista */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Catatan Khusus Pesanan
              </label>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {QUICK_NOTE_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addQuickNote(chip)}
                    className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-xl border border-slate-200/70 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tulis catatan (misal: pisahkan saus, jangan pedas)..."
                className="w-full bg-white border border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/20 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center gap-3 shrink-0 shadow-lg">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center active:scale-90 transition-all shadow-xs"
                aria-label="Kurangi jumlah"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="w-8 text-center text-sm font-black text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center active:scale-90 transition-all shadow-sm"
                aria-label="Tambah jumlah"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

            {/* Add to Cart CTA Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-lg shadow-slate-900/20 transition-all"
            >
              <span>Tambah ke Pesanan</span>
              <span className="bg-black/15 px-2.5 py-1 rounded-xl text-white font-black text-xs">
                {formatIDR(calculateTotalPrice())}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}



