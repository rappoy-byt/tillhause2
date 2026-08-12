export const CATEGORIES = [
  { id: 'beverages', label: 'BEVERAGES' },
  { id: 'iced-coffee', label: 'ICED COFFEE' },
  { id: 'iced-choc-matcha', label: 'ICED CHOCOLATE & MATCHA' },
  { id: 'hot-choc-matcha', label: 'HOT CHOCOLATE & MATCHA' },
  { id: 'tea-series', label: 'TEA SERIES' },
  { id: 'rice-bowl', label: 'RICE BOWL' },
  { id: 'pasta', label: 'PASTA' },
  { id: 'snack', label: 'SNACK' },
  { id: 'pastry', label: 'PASTRY' },
  { id: 'weekend-menu', label: 'WEEKEND MENU' },
];

export const products = [
  // ==========================================
  // KATEGORI 1: BEVERAGES (HOT & ICE IN 1 ITEM)
  // ==========================================
  {
    id: 'bev-1',
    name: 'Espresso',
    category: 'beverages',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
    description: 'Single/Double shot espresso murni dengan crema tebal dan bodi kaya cita rasa khas Tile Hause. (Reguler 18k / Seasonal 26k)',
    badges: ['MUST TRY'],
    temperatureOptions: ['Hot'],
    sugarOptions: [],
    iceOptions: [],
    beanOptions: [
      { id: 'reguler', name: 'Reguler', price: 0 },
      { id: 'seasonal', name: 'Seasonal', price: 8000 }
    ],
    toppingOptions: []
  },
  {
    id: 'bev-2',
    name: 'Americano',
    category: 'beverages',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'Seduhan espresso murni berpadu air jernih menyegarkan. Pilihan sempurna dalam sajian Panas (Hot) maupun Dingin (Ice). (Reguler 24k / Seasonal 27k)',
    badges: ['RECOMMENDED'],
    temperatureOptions: ['Ice', 'Hot'],
    sugarOptions: ['No Sugar', 'Less Sugar', 'Normal'],
    iceOptions: ['Normal Ice', 'Less Ice', 'Extra Ice'],
    toppingOptions: [
      { id: 'seasonal', name: 'Beans Seasonal (Upgrade)', price: 3000 }
    ]
  },
  {
    id: 'bev-3',
    name: 'Caffe Latte',
    category: 'beverages',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    description: 'Perpaduan sempurna espresso khas Tile Hause dengan steamed milk / fresh milk dingin yang creamy dan seimbang. Available Hot & Ice.',
    badges: ['FAVORIT'],
    temperatureOptions: ['Ice', 'Hot'],
    sugarOptions: ['Normal', 'Less Sugar', 'No Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: [
      { id: 'seasonal', name: 'Beans Seasonal (Upgrade)', price: 4000 }
    ]
  },
  {
    id: 'bev-4',
    name: 'Cappuccino',
    category: 'beverages',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    description: 'Kopi espresso berpadu susu segar dan lapisan milk foam bertekstur lembut dengan taburan bubuk cokelat khas. Available Hot & Ice.',
    badges: ['CLASSIC'],
    temperatureOptions: ['Ice', 'Hot'],
    sugarOptions: ['Normal', 'Less Sugar', 'No Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: [
      { id: 'seasonal', name: 'Beans Seasonal (Upgrade)', price: 4000 }
    ]
  },
  {
    id: 'bev-5',
    name: 'Magic',
    category: 'beverages',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?auto=format&fit=crop&w=800&q=80',
    description: 'Double ristretto dipadu dengan steamed milk takaran khusus untuk rasa kopi lebih kuat dan intense. Sajian Panas (Hot).',
    badges: ['BARISTA PICK'],
    temperatureOptions: ['Hot'],
    sugarOptions: ['No Sugar', 'Less Sugar', 'Normal'],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'bev-6',
    name: 'Split Shot',
    category: 'beverages',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    description: 'Paket dua cangkir sajian espresso murni dan single latte hangat untuk penikmat kopi sejati. Sajian Panas (Hot).',
    badges: ['SPECIAL'],
    temperatureOptions: ['Hot'],
    sugarOptions: ['No Sugar', 'Less Sugar'],
    iceOptions: [],
    toppingOptions: [
      { id: 'seasonal', name: 'Beans Seasonal (Upgrade)', price: 6000 }
    ]
  },
  {
    id: 'bev-7',
    name: 'Dirty Latte',
    category: 'beverages',
    price: 36000,
    image: 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80',
    description: 'Susu dingin kental manis berlapis espresso panas pekat murni yang menetes perlahan. Varian khas Tile Hause.',
    badges: ['SIGNATURE', 'BEST SELLER'],
    temperatureOptions: ['Ice', 'Hot'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['No Ice', 'Less Ice', 'Normal Ice'],
    toppingOptions: [
      { id: 'shot', name: 'Extra Shot Espresso', price: 6000 }
    ]
  },

  // ==========================================
  // KATEGORI 3: ICED COFFEE
  // ==========================================
  {
    id: 'ic-1',
    name: 'Palm Sugar Coffee',
    category: 'iced-coffee',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=800&q=80',
    description: 'Es kopi susu aren legendaris khas Tile Hause dengan rasa manis gurih alami.',
    badges: ['BEST SELLER'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar', 'Extra Sweet'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: [
      { id: 'jelly', name: 'Extra Grass Jelly', price: 4000 }
    ]
  },
  {
    id: 'ic-2',
    name: 'Butterscotch Coffee',
    category: 'iced-coffee',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    description: 'Paduan es kopi susu creamy dengan sirup butterscotch manis karamel yang harum.',
    badges: ['RECOMMENDED'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'ic-3',
    name: 'Cheese Coffee',
    category: 'iced-coffee',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    description: 'Es kopi susu espresso nikmat dilapisi foam keju gurih meledak di lidah.',
    badges: ['UNIQUE', 'FAVORIT'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: [
      { id: 'extra-cheese', name: 'Extra Cheese Foam', price: 5000 }
    ]
  },
  {
    id: 'ic-4',
    name: 'Hazelnut Coffee',
    category: 'iced-coffee',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    description: 'Es kopi susu dengan aroma dan cita rasa kacang hazelnut yang harum gurih.',
    badges: ['POPULAR'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'ic-5',
    name: 'Caramel Coffee',
    category: 'iced-coffee',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    description: 'Es kopi espresso susu dingin berpadu sirup karamel lumer manis gurih.',
    badges: ['FAVORIT'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },

  // ==========================================
  // KATEGORI 4: ICED CHOCOLATE & MATCHA
  // ==========================================
  {
    id: 'icm-1',
    name: 'Chocolate',
    category: 'iced-choc-matcha',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
    description: 'Minuman es cokelat kental kaya rasa dengan rasa manis seimbang dan susu segar.',
    badges: ['FAVORIT'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'icm-2',
    name: 'Chocolate Cacao',
    category: 'iced-choc-matcha',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    description: 'Cokelat kakao murni racikan spesial dengan sensasi rasa pahit manis mewah.',
    badges: ['PREMIUM'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'icm-3',
    name: 'Matcha',
    category: 'iced-choc-matcha',
    price: 27000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    description: 'Es matcha latte khas Jepang beraroma harum otentik dan creamy.',
    badges: ['BEST SELLER'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'icm-4',
    name: 'Ceremonial Matcha',
    category: 'iced-choc-matcha',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1515823689205-d368819d9b6c?auto=format&fit=crop&w=800&q=80',
    description: 'Bubuk ceremonial matcha grade tertinggi diseduh dengan susu segar kaya umami.',
    badges: ['CEREMONIAL GRADE', 'MUST TRY'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar', 'No Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },

  // ==========================================
  // KATEGORI 5: HOT CHOCOLATE & MATCHA
  // ==========================================
  {
    id: 'hcm-1',
    name: 'Chocolate',
    category: 'hot-choc-matcha',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    description: 'Cokelat hangat lembut creamy untuk menghangatkan hari Anda.',
    badges: ['COMFORT'],
    temperatureOptions: ['Hot'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'hcm-2',
    name: 'Chocolate Cacao',
    category: 'hot-choc-matcha',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1517578239113-b03992ba353c?auto=format&fit=crop&w=800&q=80',
    description: 'Seduhan kakao cokelat murni hangat bertekstur pekat nan mewah.',
    badges: ['PREMIUM'],
    temperatureOptions: ['Hot'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'hcm-3',
    name: 'Matcha',
    category: 'hot-choc-matcha',
    price: 27000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Matcha latte hangat dengan aroma teh hijau khas Jepang dan foam susu sutra.',
    badges: ['RECOMMENDED'],
    temperatureOptions: ['Hot'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: [],
    toppingOptions: []
  },

  // ==========================================
  // KATEGORI 6: TEA SERIES
  // ==========================================
  {
    id: 'ts-1',
    name: 'Lychee Tea',
    category: 'tea-series',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Teh dingin manis menyegarkan dengan ekstrak dan buah lychee segar.',
    badges: ['BEST SELLER'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'ts-2',
    name: 'Peach Tea',
    category: 'tea-series',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80',
    description: 'Teh persik dingin dengan sensasi rasa manis asam buah peach segar.',
    badges: ['FRESH'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'ts-3',
    name: 'Mango Tea',
    category: 'tea-series',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    description: 'Kombinasi teh seduh dingin beraroma mangga tropis menyegarkan dahaga.',
    badges: ['TROPICAL'],
    temperatureOptions: ['Ice'],
    sugarOptions: ['Normal', 'Less Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },
  {
    id: 'ts-4',
    name: 'Ice Tea',
    category: 'tea-series',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Teh manis dingin klasik penyegar dahaga khas Tile Hause.',
    badges: ['CLASSIC'],
    temperatureOptions: ['Ice', 'Hot'],
    sugarOptions: ['Normal', 'Less Sugar', 'No Sugar'],
    iceOptions: ['Normal Ice', 'Less Ice'],
    toppingOptions: []
  },

  // ==========================================
  // KATEGORI 7: RICE BOWL
  // ==========================================
  {
    id: 'rb-1',
    name: 'Chicken Black Pepper',
    category: 'rice-bowl',
    price: 31000,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    description: 'Nasi hangat dengan potongan ayam renyah ditumis saus lada hitam pedas gurih.',
    badges: ['POPULAR'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Extra Telur Ceplok', price: 5000 }
    ]
  },
  {
    id: 'rb-2',
    name: 'Chicken Teriyaki',
    category: 'rice-bowl',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    description: 'Daging ayam crispy dengan saus teriyaki khas Tile Hause manis gurih bertabur wijen.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Extra Telur Ceplok', price: 5000 }
    ]
  },
  {
    id: 'rb-3',
    name: 'Chicken Sambal Matah',
    category: 'rice-bowl',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    description: 'Ayam goreng garing disiram sambal matah Bali segar dengan irisan cabai dan serai.',
    badges: ['SPICY FAVORITE'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Extra Telur Ceplok', price: 5000 }
    ]
  },
  {
    id: 'rb-4',
    name: 'Beef Black Pepper',
    category: 'rice-bowl',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Irisan daging sapi empuk tumis saus lada hitam mantap dan paprika harum.',
    badges: ['CHEF RECOMMENDATION'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Extra Telur Ceplok', price: 5000 }
    ]
  },
  {
    id: 'rb-5',
    name: 'Beef Teriyaki',
    category: 'rice-bowl',
    price: 37000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    description: 'Daging sapi tumis saus teriyaki Jepang manis gurih disajikan dengan nasi hangat.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Extra Telur Ceplok', price: 5000 }
    ]
  },
  {
    id: 'rb-6',
    name: 'Beef Sambal Matah',
    category: 'rice-bowl',
    price: 37000,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description: 'Daging sapi tumis empuk disiram sambal matah serai segar khas Nusantara.',
    badges: ['SPICY PREMIUM'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Extra Telur Ceplok', price: 5000 }
    ]
  },

  // ==========================================
  // KATEGORI 8: PASTA
  // ==========================================
  {
    id: 'pst-1',
    name: 'Aglio Olio',
    category: 'pasta',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
    description: 'Spaghetti tumis minyak zaitun, bawang putih, cabai kering, dan taburan oregano gurih.',
    badges: ['CLASSIC'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'cheese', name: 'Extra Parmesan Cheese', price: 5000 }
    ]
  },
  {
    id: 'pst-2',
    name: 'Bolognese',
    category: 'pasta',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    description: 'Pasta spaghetti dengan saus tomat daging cincang sapi gurih nan kaya rempah.',
    badges: ['POPULAR'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'cheese', name: 'Extra Parmesan Cheese', price: 5000 }
    ]
  },
  {
    id: 'pst-3',
    name: 'Carbonara',
    category: 'pasta',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
    description: 'Pasta spaghetti cream kental gurih dengan potongan smoked beef dan keju melimpah.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'cheese', name: 'Extra Cheese', price: 5000 }
    ]
  },

  // ==========================================
  // KATEGORI 9: SNACK
  // ==========================================
  {
    id: 'snk-1',
    name: 'Fish Sticks',
    category: 'snack',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    description: 'Stik ikan olahan crispy renyah disajikan dengan dipping saus tartar gurih.',
    badges: ['CRISPY'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'snk-2',
    name: 'Potato Wedges',
    category: 'snack',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    description: 'Potongan kentang berbumbu rempah panggang renyah di luar, lembut di dalam.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'snk-3',
    name: 'Mix Platter',
    category: 'snack',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description: 'Kombo snack lengkap porsi besar (Potato wedges, fish sticks, chicken pop) pas untuk nongkrong.',
    badges: ['BIG PLATTER', 'BEST VALUE'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },

  // ==========================================
  // KATEGORI 10: PASTRY
  // ==========================================
  {
    id: 'pstry-1',
    name: 'New York Cheese Cake',
    category: 'pastry',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    description: 'Kue keju khas New York yang ultra lembut, lumer, dan manis gurih sempurna.',
    badges: ['MUST TRY', 'BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'pstry-2',
    name: 'Matilda Cokelat Cheese Cake',
    category: 'pastry',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Kue cokelat ganache tebal dipadu lapisan keju gurih khas Matilda Cake.',
    badges: ['PREMIUM DESSERT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'pstry-3',
    name: 'Eggtart',
    category: 'pastry',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: 'Pastry custard telur panggang ala Portugis garing renyah di luar, lembut di dalam.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },

  // ==========================================
  // KATEGORI 11: WEEKEND MENU
  // ==========================================
  {
    id: 'wknd-1',
    name: 'Sourdough Cheese',
    category: 'weekend-menu',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: 'Roti sourdough panggang artisanal bertabur keju lumer manis gurih edisi akhir pekan.',
    badges: ['WEEKEND ONLY'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'wknd-2',
    name: 'Sourdough Chocolate',
    category: 'weekend-menu',
    price: 33000,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
    description: 'Roti sourdough panggang hangat dengan isian cokelat lumer melimpah edisi akhir pekan.',
    badges: ['WEEKEND ONLY', 'SPECIAL'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  }
];

export const PROMO_CODES = {
  'TILEHAUSE20': { discountPercent: 20, label: 'Diskon Tile Hause 20%' },
  'GACOAN': { discountAmount: 10000, label: 'Potongan Rp 10.000' }
};
