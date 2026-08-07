import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Tag, Check, ArrowRight, ShoppingBag, Sparkles, User, Phone, MapPin, MessageSquareText, AlertCircle, QrCode, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    updateItemNote,
    removeItem,
    clearCart,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    whatsappNumber,
    setWhatsappNumber,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    voucherError,
    getSubtotalPrice,
    getDiscountAmount,
    getTotalPrice,
    getCrossSellSuggestions,
    addItem,
    checkoutOrder,
    setIsQrisModalOpen
  } = useCartStore();

  const [voucherInput, setVoucherInput] = useState('');
  
  // Validation Alert State
  const [formError, setFormError] = useState('');
  const [invalidField, setInvalidField] = useState('');

  const nameInputRef = useRef(null);
  const tableInputRef = useRef(null);

  if (!isCartOpen) return null;

  const subtotal = getSubtotalPrice();
  const discount = getDiscountAmount();
  const serviceFee = subtotal > 0 ? 2000 : 0;
  const totalPrice = getTotalPrice();

  const crossSellItems = getCrossSellSuggestions();

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (voucherInput) {
      applyVoucher(voucherInput);
    }
  };

  const handleNameChange = (val) => {
    setCustomerName(val);
    if (invalidField === 'customerName' && val.trim()) {
      setFormError('');
      setInvalidField('');
    }
  };

  const handleTableChange = (val) => {
    setTableNumber(val);
    if (invalidField === 'tableNumber' && val.trim()) {
      setFormError('');
      setInvalidField('');
    }
  };

  const handleProcessCheckout = () => {
    // 1. Check Customer Name
    if (!customerName.trim()) {
      setFormError('Mohon isi Nama Pemesan terlebih dahulu!');
      setInvalidField('customerName');
      nameInputRef.current?.focus();
      return;
    }

    // 2. Check Table Number
    if (!tableNumber.trim()) {
      setFormError('Mohon isi Nomor Meja kamu (lihat stiker di meja)!');
      setInvalidField('tableNumber');
      tableInputRef.current?.focus();
      return;
    }

    // Validation Passed -> Clear Error
    setFormError('');
    setInvalidField('');

    // Launch QRIS Modal
    setIsQrisModalOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Bottom-Sheet Drawer Panel */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[92vh] max-h-[92vh] flex flex-col z-10 shadow-2xl overflow-hidden text-slate-900"
        >
          {/* Top Handle Bar */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#FF5500]" />
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">Konfirmasi Pembayaran</h2>
                <p className="text-[10px] text-slate-500 font-medium">Lengkapi data meja & bayar via QRIS</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 font-bold px-2 py-1 rounded hover:bg-rose-50"
                >
                  Kosongkan
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* Inline Animated Alert Banner */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-rose-50 border-2 border-rose-500 text-rose-700 p-3 rounded-2xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs font-black">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
                    <span>{formError}</span>
                  </div>
                  <button
                    onClick={() => { setFormError(''); setInvalidField(''); }}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">Keranjang Masih Kosong</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Pilih menu kopi atau dimsum favoritmu terlebih dahulu.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-1 bg-[#FF5500] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs"
                >
                  Pilih Menu Sekarang
                </button>
              </div>
            ) : (
              <>
                {/* 1. Ringkasan Pesanan & Catatan per Item */}
                <div className="space-y-2.5">
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Ringkasan Pesanan ({cart.reduce((s, c) => s + c.quantity, 0)} item)
                  </div>

                  {cart.map((cartEntry) => (
                    <div
                      key={cartEntry.cartItemId}
                      className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2 shadow-xs"
                    >
                      <div className="flex gap-3">
                        <img
                          src={cartEntry.item.image}
                          alt={cartEntry.item.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-extrabold text-xs text-slate-900 truncate">
                              {cartEntry.item.name}
                            </h4>
                            <button
                              onClick={() => removeItem(cartEntry.cartItemId)}
                              className="text-slate-400 hover:text-rose-500 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1 text-[10px] text-slate-500">
                            {cartEntry.selectedTemp && (
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {cartEntry.selectedTemp}
                              </span>
                            )}
                            {cartEntry.selectedSugar && (
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {cartEntry.selectedSugar}
                              </span>
                            )}
                            {cartEntry.selectedToppings?.map((t) => (
                              <span key={t.id} className="bg-[#FFF6F0] text-[#FF5500] px-1.5 py-0.5 rounded border border-[#FFD4C2]">
                                +{t.name}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="font-black text-xs text-slate-900">
                              {formatIDR(cartEntry.unitPrice * cartEntry.quantity)}
                            </span>

                            <div className="flex items-center bg-[#FF5500] text-white rounded-lg p-0.5 font-black">
                              <button
                                onClick={() => updateQuantity(cartEntry.cartItemId, -1)}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/10"
                              >
                                <Minus className="w-3 h-3 stroke-[3]" />
                              </button>
                              <span className="w-5 text-center text-xs font-black">
                                {cartEntry.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(cartEntry.cartItemId, 1)}
                                className="w-5 h-5 flex items-center justify-center rounded hover:bg-black/10"
                              >
                                <Plus className="w-3 h-3 stroke-[3]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inline Per-Item Note Input */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <MessageSquareText className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                        <input
                          type="text"
                          value={cartEntry.notes || ''}
                          onChange={(e) => updateItemNote(cartEntry.cartItemId, e.target.value)}
                          placeholder="Catatan item (contoh: less sugar, pisahkan es)..."
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF5500] text-[11px] text-slate-800 placeholder-slate-400 rounded-lg px-2.5 py-1 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Menu Saran Pendamping */}
                {crossSellItems.length > 0 && (
                  <div className="bg-[#FFF6F0] border border-[#FFD4C2] p-3 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                        Mau Sekalian Tambah Pendamping?
                      </span>
                      <span className="text-[9px] bg-[#FF5500] text-white font-black px-1.5 py-0.5 rounded uppercase">
                        PAIRING
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {crossSellItems.map((cItem) => (
                        <div
                          key={cItem.id}
                          className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col justify-between shadow-xs"
                        >
                          <div className="space-y-1">
                            <img
                              src={cItem.image}
                              alt={cItem.name}
                              className="w-full h-16 rounded-lg object-cover"
                            />
                            <h5 className="font-extrabold text-[11px] text-slate-900 truncate uppercase">
                              {cItem.name}
                            </h5>
                            <span className="text-[10px] font-black text-[#FF5500] block">
                              {formatIDR(cItem.price)}
                            </span>
                          </div>

                          <button
                            onClick={() => addItem(cItem)}
                            className="mt-1.5 w-full border border-[#FF5500] text-[#FF5500] hover:bg-[#FF5500] hover:text-white font-black text-[10px] py-1 rounded-lg flex items-center justify-center gap-0.5 transition-colors active:scale-95"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                            <span>Tambah (+)</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Single Payment Badge Card (QRIS Only) */}
                <div className="bg-[#FFF6F0] border border-[#FFD4C2] p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF5500] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                      QR
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>Bayar Online via QRIS</span>
                        <Check className="w-3.5 h-3.5 text-[#FF5500] stroke-[3]" />
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold">
                        BCA, Mandiri, GoPay, OVO, ShopeePay, Dana, dll.
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] bg-[#FF5500] text-white font-black px-2 py-1 rounded-full uppercase tracking-wider">
                    INSTAN & OTOMATIS
                  </span>
                </div>

                {/* 4. Formulir Data Pemesan & Input Nomor Meja */}
                <div className={`p-3.5 rounded-2xl space-y-3 transition-colors ${
                  invalidField ? 'bg-rose-50/70 border-2 border-rose-400' : 'bg-[#FFF6F0] border border-[#FFD4C2]'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-[#FF5500] uppercase tracking-wider flex items-center gap-1">
                      <span>Input Nama & Nomor Meja</span>
                    </div>
                    <span className="text-[10px] bg-[#FF5500] text-white font-bold px-1.5 py-0.5 rounded">
                      Wajib Diisi
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Nama Pemesan */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#FF5500]" /> Nama Pemesan
                      </label>
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={customerName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className={`w-full bg-white text-xs text-slate-900 placeholder-slate-400 placeholder:italic rounded-xl px-3 py-2.5 outline-none font-bold transition-all ${
                          invalidField === 'customerName'
                            ? 'border-2 border-rose-500 ring-2 ring-rose-200 bg-rose-50/50'
                            : 'border border-slate-300 focus:border-[#FF5500]'
                        }`}
                      />
                      {invalidField === 'customerName' && (
                        <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> * Nama Pemesan wajib diisi
                        </p>
                      )}
                    </div>

                    {/* Nomor Meja */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF5500]" /> Nomor Meja (Lihat stiker di meja kamu)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          ref={tableInputRef}
                          type="text"
                          value={tableNumber}
                          onChange={(e) => handleTableChange(e.target.value)}
                          placeholder="Contoh: 31"
                          className={`bg-white font-black text-sm rounded-xl px-3 py-2 outline-none text-center shadow-xs placeholder-slate-400 placeholder:italic placeholder:font-normal transition-all ${
                            invalidField === 'tableNumber'
                              ? 'border-2 border-rose-500 text-rose-600 ring-2 ring-rose-200 bg-rose-50/50'
                              : 'border-2 border-[#FF5500] text-[#FF5500]'
                          }`}
                        />

                        <select
                          value={orderType}
                          onChange={(e) => setOrderType(e.target.value)}
                          className="bg-white text-xs font-bold text-slate-800 border border-slate-300 rounded-xl px-2 py-2 outline-none"
                        >
                          <option value="dine-in">Dine-in</option>
                          <option value="takeaway">Takeaway</option>
                          <option value="delivery">Delivery</option>
                        </select>
                      </div>
                      {invalidField === 'tableNumber' && (
                        <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 pt-0.5">
                          <AlertCircle className="w-3 h-3" /> * Nomor Meja wajib diisi
                        </p>
                      )}
                    </div>

                    {/* Nomor WhatsApp */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#FF5500]" /> Nomor WhatsApp (Opsional)
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-white border border-slate-300 focus:border-[#FF5500] text-xs text-slate-900 placeholder-slate-400 placeholder:italic rounded-xl px-3 py-2 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Voucher */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#FF5500]" />
                      Voucher Promo
                    </span>
                    <span className="text-[10px] text-slate-500">Coba: NIHLOH20</span>
                  </div>

                  {appliedVoucher ? (
                    <div className="flex items-center justify-between bg-[#FFF6F0] border border-[#FFD4C2] p-2 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#FF5500]" />
                        <div>
                          <div className="font-black text-[#FF5500]">{appliedVoucher.code}</div>
                          <div className="text-[10px] text-slate-600">{appliedVoucher.label}</div>
                        </div>
                      </div>
                      <button onClick={removeVoucher} className="text-xs font-bold text-rose-500">
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyVoucher} className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                        placeholder="Kode promo..."
                        className="flex-1 bg-white border border-slate-200 focus:border-[#FF5500] text-xs text-slate-800 uppercase placeholder-slate-400 rounded-xl px-3 py-2 outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#FF5500] text-white font-extrabold text-xs px-3 py-2 rounded-xl"
                      >
                        Pakai
                      </button>
                    </form>
                  )}
                </div>

                {/* Rincian Tagihan */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Menu</span>
                    <span className="font-bold text-slate-900">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Layanan</span>
                    <span className="font-bold text-slate-900">{formatIDR(serviceFee)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#FF5500] font-bold">
                      <span>Diskon Promo</span>
                      <span>- {formatIDR(discount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Total Tagihan</span>
                    <span className="text-[#FF5500] text-base">{formatIDR(totalPrice)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CTA Action Button */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
              <button
                onClick={handleProcessCheckout}
                className="w-full bg-[#FF5500] text-white font-black text-sm py-3.5 rounded-2xl flex items-center justify-between px-4 shadow-md active:scale-95 transition-all"
              >
                <span>Bayar Sekarang dengan QRIS (5 Menit)</span>
                <div className="flex items-center gap-1">
                  <span>{formatIDR(totalPrice)}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
