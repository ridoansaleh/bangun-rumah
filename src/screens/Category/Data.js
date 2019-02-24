const categories = [
  {
    name: 'Atap',
    status: 'main',
  },
  {
    name: 'Aluminium Foil',
    status: 'child',
  },
  {
    name: 'Furing',
    status: 'child',
  },
  {
    name: 'Penutup Atap',
    status: 'child',
  },
  {
    name: 'Rangka Atap',
    status: 'child',
  },
  {
    name: 'Aksesoris',
    status: 'child',
  },
  {
    name: 'Akses Panel',
    status: 'child',
  },
  {
    name: 'Genteng',
    status: 'child',
  },
  {
    name: 'Plafon',
    status: 'child',
  },
  {
    name: 'Ventilasi',
    status: 'child',
  },
  {
    name: 'Dinding',
    status: 'main',
  },
  {
    name: 'Bata',
    status: 'child',
  },
  {
    name: 'Fibersemen',
    status: 'child',
  },
  {
    name: 'Insulasi',
    status: 'child',
  },
  {
    name: 'Mineral Fiber',
    status: 'child',
  },
  {
    name: 'Perekat Bata',
    status: 'child',
  },
  {
    name: 'Profil',
    status: 'child',
  },
  {
    name: 'Rangka Dinding',
    status: 'child',
  },
  {
    name: 'Sealant',
    status: 'child',
  },
  {
    name: 'Compound',
    status: 'child',
  },
  {
    name: 'Hollow',
    status: 'child',
  },
  {
    name: 'Lambersering Kayu',
    status: 'child',
  },
  {
    name: 'Papan Gypsum',
    status: 'child',
  },
  {
    name: 'Plywood',
    status: 'child',
  },
  {
    name: 'PVC',
    status: 'child',
  },
  {
    name: 'Roving yarn',
    status: 'child',
  },
  {
    name: 'Aksesoris',
    status: 'child',
  },
  {
    name: 'Furnishing & Dekorasi',
    status: 'main',
  },
  {
    name: 'Acrylic',
    status: 'child',
  },
  {
    name: 'Aluminium Composite Panel',
    status: 'child',
  },
  {
    name: 'Besi & Beton',
    status: 'child',
  },
  {
    name: 'HPL & Laminating',
    status: 'child',
  },
  {
    name: 'Polycarbonate',
    status: 'child',
  },
  {
    name: 'Wallpaper',
    status: 'child',
  },
  {
    name: 'Aluminium',
    status: 'child',
  },
  {
    name: 'Bak Cuci Piring',
    status: 'child',
  },
  {
    name: 'Casting',
    status: 'child',
  },
  {
    name: 'PE Foam',
    status: 'child',
  },
  {
    name: 'Stainless Steel',
    status: 'child',
  },
  {
    name: 'Aksesoris',
    status: 'child',
  },
  {
    name: 'Lantai & Dek',
    status: 'main',
  },
  {
    name: 'Batu Alam',
    status: 'child',
  },
  {
    name: 'Floordeck',
    status: 'child',
  },
  {
    name: 'Karpet',
    status: 'child',
  },
  {
    name: 'Marmer',
    status: 'child',
  },
  {
    name: 'Pasir & Splite',
    status: 'child',
  },
  {
    name: 'Perekat',
    status: 'child',
  },
  {
    name: 'Vynil',
    status: 'child',
  },
  {
    name: 'Aksesoris',
    status: 'child',
  },
  {
    name: 'Campuran Semen',
    status: 'child',
  },
  {
    name: 'Granit',
    status: 'child',
  },
  {
    name: 'Keramik',
    status: 'child',
  },
  {
    name: 'Parkit Kayu',
    status: 'child',
  },
  {
    name: 'Paving Block',
    status: 'child',
  },
  {
    name: 'Semen',
    status: 'child',
  },
  {
    name: 'Wood Plastic Composite',
    status: 'child',
  },
  {
    name: 'Pintu & Jendela',
    status: 'main',
  },
  {
    name: 'Pintu Aluminium',
    status: 'child',
  },
  {
    name: 'Pintu PVC',
    status: 'child',
  },
  {
    name: 'Jendela Aluminium',
    status: 'child',
  },
  {
    name: 'Jendela PVC',
    status: 'child',
  },
  {
    name: 'Kunci Pintu & Jendela',
    status: 'child',
  },
  {
    name: 'AKsesoris Jendela',
    status: 'child',
  },
  {
    name: 'Pintu Kayu',
    status: 'child',
  },
  {
    name: 'Pintu UPVC',
    status: 'child',
  },
  {
    name: 'Jendela Kayu',
    status: 'child',
  },
  {
    name: 'Jendela UPVC',
    status: 'child',
  },
  {
    name: 'Aksesoris Pintu',
    status: 'child',
  },
  {
    name: 'Sanitari & Plumbing',
    status: 'main',
  },
  {
    name: 'Bak Mandi',
    status: 'child',
  },
  {
    name: 'Kloset',
    status: 'child',
  },
  {
    name: 'Pengering Tangan',
    status: 'child',
  },
  {
    name: 'Pompa Air',
    status: 'child',
  },
  {
    name: 'Tangki Air',
    status: 'child',
  },
  {
    name: 'Wastafel',
    status: 'child',
  },
  {
    name: 'Keran',
    status: 'child',
  },
  {
    name: 'Pemanas Air',
    status: 'child',
  },
  {
    name: 'Pipa',
    status: 'child',
  },
  {
    name: 'Shower',
    status: 'child',
  },
  {
    name: 'Urinoir',
    status: 'child',
  },
  {
    name: 'Aksesoris',
    status: 'child',
  },
];

export default categories;
