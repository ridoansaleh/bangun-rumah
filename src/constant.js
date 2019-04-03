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
  review_list: 'ReviewList',
  discussion_list: 'DiscussionList',
  terms_and_condition: 'TermsAndCondition',
  faq: 'Faq',
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
  messages: 'Messages',
  message_detail: 'MessageDetail',
  shop_order: 'ShopOrder',
  shop_analyzes: 'ShopAnalyzes',
  shop_edit: 'ShopEdit',
  product_form: 'ProductForm',
  change_password: 'ChangePassword',
  logs: 'Logs',
  search: 'SearchProduct',
  product: 'Product',
  order: 'Order',
  review: 'Review',
  discussion: 'Discussion',
  notification: 'Notification',
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
  urls.product_form,
  urls.review,
  urls.discussion,
  urls.terms_and_condition,
  urls.faq,
];

let loginMenus = [
  {
    name: 'Riwayat Pemesanan',
    route: urls.order_history,
    icon: 'paper',
    bg: '#C5F442',
  },
  {
    name: 'Pesan',
    route: urls.messages,
    icon: 'mail',
    bg: '#477EEA',
  },
  {
    name: 'Diskusi',
    route: urls.discussion_list,
    icon: 'chatboxes',
    bg: '#DA4437',
  },
  {
    name: 'Review',
    route: urls.review_list,
    icon: 'repeat',
    bg: '#C5F442',
  },
  {
    name: 'Syarat dan Ketentuan',
    route: urls.terms_and_condition,
    icon: 'book',
    bg: '#477EEA',
  },
  {
    name: 'FAQ',
    route: urls.faq,
    icon: 'help-circle-outline',
    bg: '#DA4437',
  },
  {
    name: 'Keluar',
    route: urls.logout,
    icon: 'log-out',
    bg: '#C5F442',
  },
];

let nonLoginMenus = [
  {
    name: 'Syarat dan Ketentuan',
    route: urls.terms_and_condition,
    icon: 'book',
    bg: '#477EEA',
  },
  {
    name: 'FAQ',
    route: urls.faq,
    icon: 'help-circle-outline',
    bg: '#DA4437',
  },
  {
    name: 'Daftar',
    route: urls.register,
    icon: 'person-add',
    bg: '#DA4437',
  },
  {
    name: 'Login',
    route: urls.login,
    icon: 'log-in',
    bg: '#DA4437',
  },
];

export { loginMenus, nonLoginMenus, user, urls, nonAuthenticatedUrls };
