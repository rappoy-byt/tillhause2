import { create } from 'zustand';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';

const STORAGE_KEY = 'tilehause_custom_menu_v1';

// Load initial menu items from localStorage safely, merged with default MENU_ITEMS
const getInitialMenu = () => {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isValid = parsed.every(i => i && typeof i === 'object' && i.id && i.name && i.category);
          if (isValid) {
            const existingIds = new Set(parsed.map(i => i.id));
            const missingDefaults = MENU_ITEMS.filter(d => !existingIds.has(d.id));
            return [...parsed, ...missingDefaults];
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse saved menu, using default:", e);
  }
  return MENU_ITEMS;
};

export const useMenuStore = create((set, get) => ({
  menuItems: getInitialMenu(),
  categories: CATEGORIES,
  isLoading: false,

  // Save local state to localStorage
  saveToLocalStorage: (items) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  },

  // No-op for backward compatibility
  initRealtimeMenu: () => { },

  // Add new menu item
  addMenuItem: (newItemData) => {
    const newId = `menu-${Date.now()}`;
    const newItem = {
      id: newId,
      name: newItemData.name || 'Menu Baru',
      category: newItemData.category || 'hot-beverages',
      price: Number(newItemData.price) || 0,
      image: newItemData.image || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
      description: newItemData.description || '',
      badges: newItemData.badges || [],
      isSoldOut: Boolean(newItemData.isSoldOut),
      temperatureOptions: newItemData.temperatureOptions || ['Ice', 'Hot'],
      sugarOptions: newItemData.sugarOptions || ['Normal', 'Less Sugar', 'No Sugar'],
      iceOptions: newItemData.iceOptions || ['Normal Ice', 'Less Ice', 'No Ice'],
      toppingOptions: newItemData.toppingOptions || []
    };

    const updated = [newItem, ...get().menuItems];
    set({ menuItems: updated });
    get().saveToLocalStorage(updated);
  },

  // Update existing menu item
  updateMenuItem: (id, updatedFields) => {
    const currentItems = get().menuItems;
    const updated = currentItems.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    set({ menuItems: updated });
    get().saveToLocalStorage(updated);
  },

  // Toggle Sold Out status
  toggleSoldOut: (id) => {
    const item = get().menuItems.find(m => m.id === id);
    if (!item) return;

    const newSoldOut = !item.isSoldOut;
    get().updateMenuItem(id, { isSoldOut: newSoldOut });
  },

  // Delete menu item
  deleteMenuItem: (id) => {
    const updated = get().menuItems.filter(item => item.id !== id);
    set({ menuItems: updated });
    get().saveToLocalStorage(updated);
  },

  // Add new Category dynamically
  addCategory: (newCategory) => {
    if (!newCategory.id || !newCategory.label) return;
    const currentCats = get().categories;
    if (!currentCats.some(c => c.id === newCategory.id)) {
      set({ categories: [...currentCats, newCategory] });
    }
  }
}));
