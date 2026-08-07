import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, MessageSquare } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function ItemDetailModal({ item, isOpen, onClose }) {
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedTemp, setSelectedTemp] = useState('');
  const [selectedSugar, setSelectedSugar] = useState('');
  const [selectedIce, setSelectedIce] = useState('');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
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

  const calculateUnitPrice = () => {
    const toppingTotal = selectedToppings.reduce((acc, t) => acc + t.price, 0);
    return item.price + toppingTotal;
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
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col z-10 shadow-2xl text-slate-900"
        >
          {/* Drag Handle */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

          {/* Header Image & Floating Close */}
          <div className="relative h-48 w-full shrink-0 bg-slate-100 border-b border-slate-200">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />

            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-4 right-4 space-y-0.5">
              <div className="flex items-center gap-1.5">
                {item.badges?.map((b, i) => (
                  <span key={i} className="bg-[#FF5500] text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">
                    {b}
                  </span>
                ))}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 uppercase font-display leading-tight">{item.name}</h2>
            </div>
          </div>

          {/* Options Content */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {item.description}
            </p>

            {/* Suhu Penyajian */}
            {item.temperatureOptions?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Suhu Penyajian
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {item.temperatureOptions.map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setSelectedTemp(temp)}
                      className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${selectedTemp === temp
                          ? 'bg-[#FFF6F0] text-[#FF5500] border-[#FF5500] shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <span>{temp}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level Manis */}
            {item.sugarOptions?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Level Manis (Sugar)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {item.sugarOptions.map((sugar) => (
                    <button
                      key={sugar}
                      type="button"
                      onClick={() => setSelectedSugar(sugar)}
                      className={`py-2 px-2 rounded-xl border text-xs font-extrabold text-center transition-all ${selectedSugar === sugar
                          ? 'bg-[#FFF6F0] text-[#FF5500] border-[#FF5500] shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {sugar}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level Es */}
            {item.iceOptions?.length > 0 && selectedTemp !== 'Hot' && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Jumlah Es (Ice Level)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {item.iceOptions.map((ice) => (
                    <button
                      key={ice}
                      type="button"
                      onClick={() => setSelectedIce(ice)}
                      className={`py-2 px-2 rounded-xl border text-xs font-extrabold text-center transition-all ${selectedIce === ice
                          ? 'bg-[#FFF6F0] text-[#FF5500] border-[#FF5500] shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {ice}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Topping Tambahan */}
            {item.toppingOptions?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Topping / Add-on
                </label>
                <div className="space-y-1.5">
                  {item.toppingOptions.map((topping) => {
                    const isChecked = selectedToppings.some(t => t.id === topping.id);
                    return (
                      <button
                        key={topping.id}
                        type="button"
                        onClick={() => toggleTopping(topping)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${isChecked
                            ? 'bg-[#FFF6F0] text-[#FF5500] border-[#FF5500]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-[#FF5500] border-[#FF5500] text-white' : 'border-slate-300 bg-white'
                            }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{topping.name}</span>
                        </div>
                        <span className="font-extrabold text-slate-900">+ {formatIDR(topping.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Catatan Khusus */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#FF5500]" />
                Catatan Khusus Barista
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Pisahkan es, sedikit gula..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5500] rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 shrink-0">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="w-8 text-center text-xs font-black text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#FF5500] text-white font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-between shadow-md active:scale-95 transition-all"
            >
              <span>Tambah ke Pesanan</span>
              <span>{formatIDR(calculateTotalPrice())}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
