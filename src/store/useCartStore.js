import { create } from 'zustand';
import { products, PROMO_CODES } from '../data/menuData';
import { supabase } from '../lib/supabase';

export const useCartStore = create((set, get) => ({
  cart: [],
  orderType: 'dine-in', // 'dine-in' | 'takeaway' | 'delivery'
  tableNumber: '', // Strictly empty default so user must enter table number
  customerName: '', // Strictly empty default so user must enter customer name
  whatsappNumber: '',

  appliedVoucher: null,
  voucherError: null,

  isCartOpen: false,
  isQrisModalOpen: false,
  isOrderSuccess: false,
  isQrModalOpen: false,
  isTableFromQr: false,
  lastOrderData: null,

  // Actions
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setIsQrisModalOpen: (isOpen) => set({ isQrisModalOpen: isOpen }),
  setIsOrderSuccess: (isSuccess) => set({ isOrderSuccess: isSuccess }),
  setIsQrModalOpen: (isOpen) => set({ isQrModalOpen: isOpen }),
  setOrderType: (type) => set({ orderType: type }),
  setTableNumber: (num) => set({ tableNumber: num, isTableFromQr: false }),
  setCustomerName: (name) => set({ customerName: name }),
  setWhatsappNumber: (num) => set({ whatsappNumber: num }),

  initTableFromUrl: () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mejaParam = params.get('meja') || params.get('table') || params.get('t');
      if (mejaParam) {
        set({ tableNumber: mejaParam, isTableFromQr: true });
      }
    }
  },

  addItem: (item, options = {}) => {
    set((state) => {
      const quantity = options.quantity || 1;
      const selectedBean = options.selectedBean || (item.beanOptions?.[0] || null);
      const selectedTemp = options.selectedTemp || (item.temperatureOptions?.[0] || '');
      const selectedSugar = options.selectedSugar || (item.sugarOptions?.[0] || '');
      const selectedIce = options.selectedIce || (item.iceOptions?.[0] || '');
      const selectedToppings = options.selectedToppings || [];
      const notes = options.notes || '';

      const beanPrice = selectedBean ? selectedBean.price : 0;
      const toppingPrice = selectedToppings.reduce((acc, t) => acc + t.price, 0);
      const unitPrice = item.price + beanPrice + toppingPrice;

      const beanIdStr = selectedBean ? selectedBean.id : '';
      const cartItemId = `${item.id}-${beanIdStr}-${selectedTemp}-${selectedSugar}-${selectedIce}-${selectedToppings.map(t => t.id).sort().join(',')}`;

      const existingIndex = state.cart.findIndex(c => c.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += quantity;
        if (notes) updatedCart[existingIndex].notes = notes;
        return { cart: updatedCart };
      } else {
        return {
          cart: [
            ...state.cart,
            {
              cartItemId,
              item,
              quantity,
              selectedBean,
              selectedTemp,
              selectedSugar,
              selectedIce,
              selectedToppings,
              notes,
              unitPrice
            }
          ]
        };
      }
    });
  },

  quickUpdateQuantity: (item, delta) => {
    set((state) => {
      const existingItems = state.cart.filter(c => c.item.id === item.id);

      if (existingItems.length === 0 && delta > 0) {
        // Add default item
        const defaultTemp = item.temperatureOptions?.[0] || '';
        const defaultSugar = item.sugarOptions?.[0] || '';
        const defaultIce = item.iceOptions?.[0] || '';
        const cartItemId = `${item.id}-${defaultTemp}-${defaultSugar}-${defaultIce}-`;

        return {
          cart: [
            ...state.cart,
            {
              cartItemId,
              item,
              quantity: 1,
              selectedTemp: defaultTemp,
              selectedSugar: defaultSugar,
              selectedIce: defaultIce,
              selectedToppings: [],
              notes: '',
              unitPrice: item.price
            }
          ]
        };
      } else if (existingItems.length > 0) {
        const targetItem = existingItems[existingItems.length - 1];
        const newQty = targetItem.quantity + delta;

        if (newQty <= 0) {
          return { cart: state.cart.filter(c => c.cartItemId !== targetItem.cartItemId) };
        } else {
          return {
            cart: state.cart.map(c =>
              c.cartItemId === targetItem.cartItemId ? { ...c, quantity: newQty } : c
            )
          };
        }
      }
      return { cart: state.cart };
    });
  },

  updateQuantity: (cartItemId, delta) => {
    set((state) => {
      const updatedCart = state.cart.map(c => {
        if (c.cartItemId === cartItemId) {
          const newQty = c.quantity + delta;
          return newQty > 0 ? { ...c, quantity: newQty } : null;
        }
        return c;
      }).filter(Boolean);

      return { cart: updatedCart };
    });
  },

  updateItemNote: (cartItemId, notes) => {
    set((state) => ({
      cart: state.cart.map(c => c.cartItemId === cartItemId ? { ...c, notes } : c)
    }));
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter(c => c.cartItemId !== cartItemId)
    }));
  },

  clearCart: () => set({ cart: [], appliedVoucher: null }),

  applyVoucher: (code) => {
    const promo = PROMO_CODES[code.toUpperCase()];
    if (promo) {
      set({ appliedVoucher: { code: code.toUpperCase(), ...promo }, voucherError: null });
    } else {
      set({ voucherError: 'Kode voucher tidak valid!' });
    }
  },

  removeVoucher: () => set({ appliedVoucher: null, voucherError: null }),

  // Computed Values
  getTotalCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getItemQuantityInCart: (itemId) => {
    return get().cart
      .filter(c => c.item.id === itemId)
      .reduce((sum, c) => sum + c.quantity, 0);
  },

  getSubtotalPrice: () => {
    return get().cart.reduce((sum, c) => sum + (c.unitPrice * c.quantity), 0);
  },

  getDiscountAmount: () => {
    const { appliedVoucher } = get();
    if (!appliedVoucher) return 0;
    const subtotal = get().getSubtotalPrice();

    if (appliedVoucher.discountPercent) {
      return (subtotal * appliedVoucher.discountPercent) / 100;
    }
    if (appliedVoucher.discountAmount) {
      return Math.min(appliedVoucher.discountAmount, subtotal);
    }
    return 0;
  },

  getTotalPrice: () => {
    const subtotal = get().getSubtotalPrice();
    if (subtotal === 0) return 0;
    const discount = get().getDiscountAmount();
    const serviceFee = 2000;
    return Math.max(0, subtotal - discount + serviceFee);
  },

  getCrossSellSuggestions: () => {
    const cartItemIds = get().cart.map(c => c.item.id);
    return products.filter(m => !cartItemIds.includes(m.id)).slice(0, 2);
  },

  checkoutOrder: async (paymentMethod = 'QRIS') => {
    const state = get();
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

    const orderCode = `NL-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = state.getTotalPrice();

    if (isSupabaseConfigured) {
      try {
        // 1. Insert into orders table
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            order_code: orderCode,
            customer_name: state.customerName || 'Pelanggan',
            table_number: state.tableNumber || '-',
            whatsapp_number: state.whatsappNumber || '',
            total_amount: totalAmount,
            payment_status: paymentMethod === 'Cash' ? 'Pending' : 'Pending', // Typically pending until verified by admin
            order_status: 'Pending',
          }])
          .select('id')
          .single();

        if (orderError) throw orderError;

        // 2. Insert into order_items table
        const orderItemsPayload = state.cart.map(c => ({
          order_id: orderData.id,
          product_id: c.item.id,
          quantity: c.quantity,
          price_per_item: c.unitPrice,
          subtotal: c.unitPrice * c.quantity,
          notes: `${c.notes || ''} ${c.selectedTemp ? `(${c.selectedTemp}, ${c.selectedSugar}, ${c.selectedIce})` : ''}`.trim()
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) throw itemsError;

      } catch (err) {
        console.error('Error submitting order to Supabase:', err);
        alert('Gagal mengirim pesanan. Silakan coba lagi.');
        return;
      }
    }

    // Regardless of Supabase, update UI state
    const localOrderData = {
      orderId: orderCode,
      customerName: state.customerName || 'Pelanggan',
      tableNumber: state.tableNumber || '-',
      whatsappNumber: state.whatsappNumber || '',
      items: [...state.cart],
      total: totalAmount,
      paymentMethod,
      orderType: state.orderType,
      timestamp: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: formattedDate
    };

    set({
      lastOrderData: localOrderData,
      isCartOpen: false,
      isQrisModalOpen: false,
      isOrderSuccess: true,
      cart: [],
      appliedVoucher: null
    });
  }
}));
