import React from 'react';
import { CATEGORIES } from '../data/menuData';

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  return (
    <div className="sticky top-[106px] z-20 bg-white border-b border-slate-200 px-3 max-w-md mx-auto">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 text-xs tracking-tight transition-all pb-1 whitespace-nowrap ${
                isActive
                  ? 'text-[#FF5500] font-black border-b-2 border-[#FF5500]'
                  : 'text-slate-600 font-bold hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
