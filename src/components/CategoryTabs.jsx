import React from 'react';
import { useMenuStore } from '../store/useMenuStore';

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  const { categories } = useMenuStore();

  return (
    <div className="sticky top-[106px] z-20 bg-white border-b border-slate-200 px-3 max-w-md mx-auto">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 text-xs tracking-tight transition-all pb-1 whitespace-nowrap ${
                isActive
                  ? 'text-slate-900 font-black border-b-2 border-slate-900'
                  : 'text-slate-500 font-bold hover:text-slate-900'
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
