import { create } from 'zustand';

export const WEATHER_MODES = [
  {
    id: 'hot',
    label: 'Cuaca Terik ☀️',
    temp: '33°C',
    tagline: 'Panas banget di luar!',
    recommendation: 'Es Kopi Aren Signature',
    recommendItemId: 'kopi-1',
    bannerText: 'Cuaca panas 33°C, segerin pakai Es Kopi Aren Signature dingin!',
    badge: 'COLD REFRESHER ⚡',
    gradient: 'from-amber-500/20 via-rose-500/10 to-brand-lime/20',
    accentColor: '#E2FF6F'
  },
  {
    id: 'rainy',
    label: 'Hujan Syahdu 🌧️',
    temp: '22°C',
    tagline: 'Dingin & Butuh Kehangatan',
    recommendation: 'Matcha Uji Latte Supreme',
    recommendItemId: 'nonkopi-1',
    bannerText: 'Suasana hujan dingin, pas banget disruput hangat Matchatime!',
    badge: 'WARM & COZY 🍵',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    accentColor: '#10B981'
  },
  {
    id: 'morning',
    label: 'Morning Rush ☀️',
    temp: '26°C',
    tagline: 'Booster Semangat Pagi',
    recommendation: 'Butter Croissant + Americano',
    recommendItemId: 'pastry-1',
    bannerText: 'Semangat pagi! Pairing Croissant crispy + Kopi Hitam fresh!',
    badge: 'MORNING BUNDLE 🥐',
    gradient: 'from-orange-500/20 via-amber-500/10 to-yellow-400/20',
    accentColor: '#FF5500'
  },
  {
    id: 'night',
    label: 'Midnight Vibe 🌙',
    temp: '24°C',
    tagline: 'Nongkrong Malam',
    recommendation: 'Caramel Macchiato Cloud',
    recommendItemId: 'kopi-3',
    bannerText: 'Malam makin asik, chill & ngopi Caramel Macchiato manis!',
    badge: 'NIGHT CHILL ☕',
    gradient: 'from-purple-600/20 via-indigo-600/10 to-pink-500/20',
    accentColor: '#9D4EDD'
  }
];

export const useBannerStore = create((set) => ({
  activeWeatherId: 'hot',
  setWeatherId: (id) => set({ activeWeatherId: id }),
  getActiveConfig: () => {
    return WEATHER_MODES.find(m => m.id === useBannerStore.getState().activeWeatherId) || WEATHER_MODES[0];
  }
}));
