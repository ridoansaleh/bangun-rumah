let loginMenus = [
  {
    name: 'Riwayat Pemesanan',
    route: 'OrderHistory',
    icon: 'paper',
    bg: '#C5F442',
  },
  {
    name: 'Pesan',
    route: 'PersonalMessage',
    icon: 'mail',
    bg: '#477EEA',
  },
  {
    name: 'Diskusi',
    route: 'Discussion',
    icon: 'chatboxes',
    bg: '#DA4437',
  },
  {
    name: 'Review',
    route: 'PersonalReview',
    icon: 'repeat',
    bg: '#C5F442',
  },
  {
    name: 'Syarat dan Ketentuan',
    route: 'Terms',
    icon: 'book',
    bg: '#477EEA',
  },
  {
    name: 'FAQ',
    route: 'Faq',
    icon: 'help-circle-outline',
    bg: '#DA4437',
  },
  {
    name: 'Keluar',
    route: 'Logout',
    icon: 'log-out',
    bg: '#C5F442',
  },
];

let nonLoginMenus = [
  {
    name: 'Syarat dan Ketentuan',
    route: 'Terms',
    icon: 'book',
    bg: '#477EEA',
  },
  {
    name: 'FAQ',
    route: 'Faq',
    icon: 'help-circle-outline',
    bg: '#DA4437',
  },
  {
    name: 'Daftar',
    route: 'Register',
    icon: 'person-add',
    bg: '#DA4437',
  },
  {
    name: 'Login',
    route: 'Login',
    icon: 'log-in',
    bg: '#DA4437',
  },
];

let user = [
  '_id',
  '_nama',
  '_alamat',
  '_email',
  '_jenisKelamin',
  '_tanggalLahir',
  '_photo',
  '_verfikasiEmail',
];

const urls = {
  drawer: 'Drawer',
  home: 'Home',
  login: 'Login',
  logout: 'Logout',
  register: 'Register',
  category: 'Category',
  cart: 'ShoppingCart',
  dashboard_profile: 'DashboardProfile',
  profile: 'Profile',
  edit_profile: 'EditProfile',
  order_history: 'OrderHistory',
  shop: 'Shop',
  change_password: 'ChangePassword',
  logs: 'Logs',
  search: 'SearchProduct',
  product: 'Product',
  review: 'Review',
  discussion: 'Discussion',
};

const nonAuthenticatedUrls = [
  urls.drawer,
  urls.home,
  urls.register,
  urls.login,
  urls.category,
  urls.search,
  urls.product,
  urls.shop,
  urls.review,
  urls.discussion,
];

export { loginMenus, nonLoginMenus, user, urls, nonAuthenticatedUrls };
