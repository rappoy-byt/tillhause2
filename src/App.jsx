import React, { useState } from 'react';
import Header from './components/Header';
import DynamicBanner from './components/DynamicBanner';
import CategoryTabs from './components/CategoryTabs';
import MenuItemCard from './components/MenuItemCard';
import ItemDetailModal from './components/ItemDetailModal';
import CartBottomBar from './components/CartBottomBar';
import CartDrawer from './components/CartDrawer';
import QrisPaymentModal from './components/QrisPaymentModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import { MENU_ITEMS, CATEGORIES } from './data/menuData';
import { SearchX, Flame } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('signature');
  const [selectedModalItem, setSelectedModalItem] = useState(null);

  // Filter items by active category and search query
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.badges && item.badges.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const activeCategoryObject = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="bg-slate-200 text-slate-900 min-h-screen font-sans selection:bg-[#FF5A00] selection:text-white">
      {/* Mobile-first container (Mie Gacoan App Frame) */}
      <main className="max-w-md mx-auto bg-slate-100 min-h-screen relative flex flex-col shadow-2xl pb-32 border-x border-slate-200">
        
        {/* Top Header & Direct Table Input */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />

        {/* Dynamic Food Hero Showcase Banner */}
        <DynamicBanner
          onSelectItem={(item) => setSelectedModalItem(item)}
        />

        {/* Category Pill Navbar */}
        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Category Header */}
        <div className="px-3 pt-3 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF5A00]" />
            <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 font-display">
              {activeCategoryObject ? activeCategoryObject.label : activeCategory}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {filteredItems.length} menu
          </span>
        </div>

        {/* 2-Column Product Grid (Mie Gacoan Layout) */}
        <div className="px-3 grid grid-cols-2 gap-2.5 flex-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelectItem={(itm) => setSelectedModalItem(itm)}
              />
            ))
          ) : (
            <div className="col-span-2 py-12 text-center space-y-2 bg-white border border-slate-200 rounded-2xl p-4">
              <SearchX className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-xs">Menu Tidak Ditemukan</h3>
              <p className="text-[11px] text-slate-500">
                Menu "{searchQuery}" belum tersedia di kategori ini.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('signature');
                }}
                className="text-xs font-bold text-[#FF5A00] hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Footer Brand Credit */}
        <footer className="mt-8 px-4 text-center py-6 border-t border-slate-200 text-slate-500 text-xs space-y-1">
          <p className="font-extrabold text-slate-700">NihLoh Coffee & Eatery ☕</p>
          <p className="text-[10px]">Purwokerto • Direct Table Ordering</p>
        </footer>

        {/* Item Detail Modal */}
        <ItemDetailModal
          item={selectedModalItem}
          isOpen={!!selectedModalItem}
          onClose={() => setSelectedModalItem(null)}
        />

        {/* Cart Bottom Bar (Sticky) */}
        <CartBottomBar />

        {/* Cart Bottom-Sheet Drawer */}
        <CartDrawer />

        {/* QRIS Payment Countdown Modal */}
        <QrisPaymentModal />

        {/* Order Success Modal */}
        <OrderSuccessModal />
      </main>
    </div>
  );
}
