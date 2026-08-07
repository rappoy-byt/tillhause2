import { create } from 'zustand';
import { MENU_ITEMS, PROMO_CODES } from '../data/menuData';

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
  lastOrderData: null,

  // Actions
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setIsQrisModalOpen: (isOpen) => set({ isQrisModalOpen: isOpen }),
  setIsOrderSuccess: (isSuccess) => set({ isOrderSuccess: isSuccess }),
  setOrderType: (type) => set({ orderType: type }),
  setTableNumber: (num) => set({ tableNumber: num }),
  setCustomerName: (name) => set({ customerName: name }),
  setWhatsappNumber: (num) => set({ whatsappNumber: num }),

  addItem: (item, options = {}) => {
    set((state) => {
      const quantity = options.quantity || 1;
      const selectedTemp = options.selectedTemp || (item.temperatureOptions?.[0] || '');
      const selectedSugar = options.selectedSugar || (item.sugarOptions?.[0] || '');
      const selectedIce = options.selectedIce || (item.iceOptions?.[0] || '');
      const selectedToppings = options.selectedToppings || [];
      const notes = options.notes || '';

      const toppingPrice = selectedToppings.reduce((acc, t) => acc + t.price, 0);
      const unitPrice = item.price + toppingPrice;

      const cartItemId = `${item.id}-${selectedTemp}-${selectedSugar}-${selectedIce}-${selectedToppings.map(t => t.id).sort().join(',')}`;

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
    return MENU_ITEMS.filter(m => !cartItemIds.includes(m.id)).slice(0, 2);
  },

  checkoutOrder: (paymentMethod = 'QRIS') => {
    const state = get();
    const orderData = {
      orderId: `NL-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: state.customerName || 'Pelanggan',
      tableNumber: state.tableNumber || '-',
      items: [...state.cart],
      total: state.getTotalPrice(),
      paymentMethod,
      orderType: state.orderType,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    set({
      lastOrderData: orderData,
      isCartOpen: false,
      isQrisModalOpen: false,
      isOrderSuccess: true,
      cart: [],
      appliedVoucher: null
    });
  }
}));
