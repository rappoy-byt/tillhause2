export const CATEGORIES = [
  { id: 'signature', label: 'SIGNATURE' },
  { id: 'tarizza', label: 'TARIZZA SERIES' },
  { id: 'sandwich', label: 'SANDWICH' },
  { id: 'munchies', label: 'MUNCHIES' },
  { id: 'nihloh-dessert', label: 'NIHLOH DESSERT' },
];

export const MENU_ITEMS = [
  // KATEGORI SIGNATURE
  {
    id: 'sig-1',
    name: 'Chicken Pop Teriyaki',
    category: 'signature',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    description: 'Potongan ayam crispy renyah disiram saus teriyaki manis gurih khas NihLoh.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 },
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'sig-2',
    name: 'Chicken Pop Mushroom',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    description: 'Ayam pop renyah dengan siraman saus krim jamur tiram lezat melimpah.',
    badges: ['RECOMMENDED'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 },
      { id: 'keju', name: 'Extra Keju Melted', price: 6000 }
    ]
  },
  {
    id: 'sig-3',
    name: 'Chicken Pop Salted Egg',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    description: 'Ayam pop krispi dibalut saus telur asin creamy dan harum daun jeruk.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-4',
    name: 'Chicken Pop Nashville',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1625938146369-ad8024139230?auto=format&fit=crop&w=800&q=80',
    description: 'Ayam pop gaya Nashville dengan bumbu rempah pedas membakar selera.',
    badges: ['SPICY'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 },
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'sig-5',
    name: 'Wings Korean Spicy',
    category: 'signature',
    price: 27000,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    description: 'Sayap ayam goreng krispi dilumuri saus gochujang Korea pedas manis bertabur wijen.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'sig-6',
    name: 'Katsu Sambal Matah',
    category: 'signature',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    description: 'Chicken katsu tebal krispi disiram sambal matah serai segar pedas nikmat.',
    badges: ['HEAD MENU'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-7',
    name: 'Katsu Sambal Bawang',
    category: 'signature',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Chicken katsu garing dengan topping sambal bawang ulek pedas mantap.',
    badges: ['SPICY'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 },
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'sig-8',
    name: 'Katsu BBQ',
    category: 'signature',
    price: 27000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    description: 'Chicken katsu disiram saus smoky barbecue gurih manis lezat.',
    badges: ['RECOMMENDED'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-9',
    name: 'Katsu Nanban',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    description: 'Chicken katsu Jepang saus nanban asam gurih dipadu dengan saus tartar creamy.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-10',
    name: 'Katsu Butter Garlic Parmesan',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
    description: 'Katsu krispi dilumuri racikan mentega bawang putih dan taburan keju parmesan gurih.',
    badges: ['NEW'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-11',
    name: 'Beef Teriyaki',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Irisan daging sapi empuk tumis saus teriyaki manis gurih dan bawang bombay.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 },
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'sig-12',
    name: 'Beef Nashville',
    category: 'signature',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    description: 'Daging sapi pilihan berbalut bumbu rempah pedas khas Nashville membakar selera.',
    badges: ['HEAD MENU'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-13',
    name: 'Beef Sambal Matah',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Tumis daging sapi empuk disajikan dengan sambal matah harum dan gurih.',
    badges: ['RECOMMENDED'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-14',
    name: 'Beef Sambal Bawang',
    category: 'signature',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    description: 'Daging sapi olahan krispi disiram sambal bawang ulek panas khas Nusantara.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 },
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'sig-15',
    name: 'Beef BBQ',
    category: 'signature',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    description: 'Irisan daging sapi tumis saus BBQ smoky manis gurih disajikan dengan nasi hangat.',
    badges: ['SAVORY'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },
  {
    id: 'sig-16',
    name: 'Beef Korean Spicy',
    category: 'signature',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    description: 'Daging sapi empuk bumbu gochujang pedas khas Korea dengan wijen dan daun bawang.',
    badges: ['NEW'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'nasi', name: 'Extra Nasi Putih', price: 5000 }
    ]
  },

  // KATEGORI TARIZZA SERIES
  {
    id: 'tar-1',
    name: 'Kwetiaw',
    category: 'tarizza',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    description: 'Kwetiaw goreng spesial dengan racikan bumbu gurih wangi aromatik khas Tarizza Series.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 },
      { id: 'bakso', name: 'Extra Bakso Sapi (3 Pcs)', price: 5000 }
    ]
  },
  {
    id: 'tar-2',
    name: 'Beef Fried Noodle',
    category: 'tarizza',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    description: 'Mie goreng lezat dengan irisan daging sapi empuk khas racikan wajan Tarizza.',
    badges: ['RECOMMENDED'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'tar-3',
    name: 'Tektek Noodle',
    category: 'tarizza',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    description: 'Mie tek-tek tradisional berkuah/goreng gurih hangat dengan telur & sayuran segar.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'tar-4',
    name: 'Javanese Fried Rice',
    category: 'tarizza',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    description: 'Nasi goreng Jawa bumbu rempah ulek asli beraroma manis gurih menggugah selera.',
    badges: ['POPULAR'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },
  {
    id: 'tar-5',
    name: 'Beef Fried Rice',
    category: 'tarizza',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    description: 'Nasi goreng beraroma smoky disajikan dengan tumisan irisan daging sapi gurih lezat.',
    badges: ['HEAD MENU'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },

  // KATEGORI SANDWICH
  {
    id: 'sdw-1',
    name: 'Tunacado',
    category: 'sandwich',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    description: 'Roti panggang krispi dengan isian tuna mayo gurih, alpukat segar, tomat, dan saus pesto harum.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'keju', name: 'Extra Keju Melted', price: 6000 }
    ]
  },
  {
    id: 'sdw-2',
    name: 'Katsu Sando',
    category: 'sandwich',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    description: 'Sandwich gaya Jepang berlapis chicken katsu tebal garing dengan saus tonkatsu dan kol renyah.',
    badges: ['RECOMMENDED'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'keju', name: 'Extra Keju Melted', price: 6000 }
    ]
  },
  {
    id: 'sdw-3',
    name: 'American Sando',
    category: 'sandwich',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=800&q=80',
    description: 'Sandwich lapis klasik gaya Amerika dengan daging asap (smoked beef), keju melted, dan saus spesial.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'telur', name: 'Tambah Telur Ceplok', price: 4000 }
    ]
  },

  // KATEGORI MUNCHIES
  {
    id: 'mnc-1',
    name: 'Chicken Pop',
    category: 'munchies',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    description: 'Potongan ayam bite-size goreng garing dengan bumbu gurih renyah.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'sauce', name: 'Extra Saus Dip', price: 3000 }
    ]
  },
  {
    id: 'mnc-2',
    name: 'French Fries',
    category: 'munchies',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    description: 'Kentang goreng renyah bumbu gurih khas disajikan hangat dengan saus cocolan.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'cheese', name: 'Extra Saus Keju', price: 4000 }
    ]
  },
  {
    id: 'mnc-3',
    name: 'Katsu Stick',
    category: 'munchies',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    description: 'Stik chicken katsu balur tepung panko krispi nikmat gurih.',
    badges: ['RECOMMENDED'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'mnc-4',
    name: 'Velvet Bite / Silken Broth Dumpling',
    category: 'munchies',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    description: 'Dumpling lembut berisi olahan daging gurih disiram kuah kaldusilky aromatik hangat.',
    badges: ['HEAD MENU'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'mnc-5',
    name: 'Pop Mozarella',
    category: 'munchies',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=80',
    description: 'Bola-bola keju mozarella goreng krispi dengan keju mulur gurih melted di dalam.',
    badges: ['CHEESY'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'mnc-6',
    name: 'Dimsum Mix',
    category: 'munchies',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    description: 'Kombinasi dimsum kukus hangat aneka rasa (ayam, udang, kepiting) disajikan dengan chili oil.',
    badges: ['POPULAR'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'mnc-7',
    name: 'Korean Wings',
    category: 'munchies',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    description: 'Sayap ayam goreng krispi bumbu Korea pedas manis bertabur biji wijen.',
    badges: ['SPICY'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'mnc-8',
    name: 'Dumpling Bolognese / Tomato Ragu Dumpling',
    category: 'munchies',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    description: 'Dumpling olahan daging lembut disiram saus bolognese tomat ragu ala Italia.',
    badges: ['NEW'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },
  {
    id: 'mnc-9',
    name: 'Mix Platter',
    category: 'munchies',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description: 'Piring kombo cemilan lengkap (French fries, chicken pop, katsu stick, & pop mozarella) cocok untuk sharing.',
    badges: ['BIG PLATTER', 'BEST VALUE'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: []
  },

  // KATEGORI NIHLOH DESSERT
  {
    id: 'dst-1',
    name: 'Choco Pan-zza',
    category: 'nihloh-dessert',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Pizza panggangan lembut bertabur cokelat lumer manis gurih dan topping krim spesial khas NihLoh.',
    badges: ['BEST SELLER'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'icecream', name: 'Extra Es Krim Vanilla', price: 5000 }
    ]
  },
  {
    id: 'dst-2',
    name: 'Strawberry Pan-zza',
    category: 'nihloh-dessert',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    description: 'Pan-zza hangat dengan irisan buah stroberi segar dan saus krim manis asam menyegarkan.',
    badges: ['RECOMMENDED'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'icecream', name: 'Extra Es Krim Vanilla', price: 5000 }
    ]
  },
  {
    id: 'dst-3',
    name: 'Brulee Banana',
    category: 'nihloh-dessert',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80',
    description: 'Pisang bakar Karamel Crème Brûlée garing di luar dengan krim karamel lumer di dalam.',
    badges: ['FAVORIT'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'icecream', name: 'Extra Es Krim Vanilla', price: 5000 }
    ]
  },
  {
    id: 'dst-4',
    name: 'Choco Cheese Banana',
    category: 'nihloh-dessert',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1607920592519-bab4d7db727d?auto=format&fit=crop&w=800&q=80',
    description: 'Pisang panggang hangat disiram cokelat lumer melimpah dan parutan keju gurih melimpah.',
    badges: ['NEW'],
    temperatureOptions: [],
    sugarOptions: [],
    iceOptions: [],
    toppingOptions: [
      { id: 'icecream', name: 'Extra Es Krim Vanilla', price: 5000 }
    ]
  }
];

export const PROMO_CODES = {
  'NIHLOH20': { discountPercent: 20, label: 'Diskon NihLoh 20%' },
  'GACOAN': { discountAmount: 10000, label: 'Potongan Rp 10.000' }
};
