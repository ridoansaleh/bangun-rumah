import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import LoginScreen from './Login/LoginMain';
import RegisterScreen from './Register/RegisterMain';
import HomeScreen from './Home/HomeMain';
import CategoryScreen from './Category/CategoryMain';
import ShoppingCartScreen from './ShoppingCart/ShoppingCartMain';
import SearchProductScreen from './Navbar/SearchProduct/SearchProductMain';
import NotificationScreen from './Navbar/Notifications/NotificationsMain';
import OrderHistoryScreen from './Sidebar/OrderHistory/OrderHistoryMain';
import MessageScreen from './Sidebar/Messages/MessagesMain';
import MessageDetailScreen from './Sidebar/MessageDetail/MessageDetailMain';
import ReviewListScreen from './Sidebar/ReviewList/ReviewListMain';
import DiscussionListScreen from './Sidebar/DiscussionList/DiscussionListMain';
import TermsAndConditionScreen from './Sidebar/TermsAndCondition/TermsAndConditionMain';
import FAQScreen from './Sidebar/FAQ/FAQMain';
import DashboardProfileScreen from './DashboardProfile/DashboardProfileMain';
import ShopScreen from './DashboardProfile/Shop/ShopMain';
import ProfileScreen from './DashboardProfile/Profile/ProfileMain';
import EditProfileScreen from './DashboardProfile/EditProfile/EditProfileMain';
import ShopOrderScreen from './DashboardProfile/ShopOrderHistory/ShopOrderMain';
import ShopAnalyzeScreen from './DashboardProfile/Shop/ShopAnalyzes/ShopAnalyzesMain';
import ShopEditScreen from './DashboardProfile/ShopEditForm/ShopEditMain';
import ChangePasswordScreen from './DashboardProfile/ChangePassword/ChangePasswordMain';
import LogScreen from './DashboardProfile/Logs/LogsMain';
import ProductFormScreen from './DashboardProfile/Shop/ProductForm/ProductFormMain';
import ProductScreen from './DashboardProfile/Shop/Product/ProductMain';
import OrderScreen from './DashboardProfile/Shop/Product/Order/OrderMain';
import ReviewScreen from './DashboardProfile/Shop/Product/Review/ReviewMain';
import DiscussionScreen from './DashboardProfile/Shop/Product/Discussion/DiscussionMain';
import SideBar from '../components/SideBar';

dayjs.locale('id');

const DrawerNav = createDrawerNavigator(
  {
    Home: HomeScreen,
    ReviewList: ReviewListScreen,
    DiscussionList: DiscussionListScreen,
    TermsAndCondition: TermsAndConditionScreen,
    Faq: FAQScreen,
    Login: LoginScreen,
    Register: RegisterScreen,
    Category: CategoryScreen,
    ShoppingCart: ShoppingCartScreen,
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => <SideBar {...props} />,
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: DrawerNav,
    SearchProduct: SearchProductScreen,
    Product: ProductScreen,
    Order: OrderScreen,
    Review: ReviewScreen,
    Discussion: DiscussionScreen,
    DashboardProfile: DashboardProfileScreen,
    Profile: ProfileScreen,
    EditProfile: EditProfileScreen,
    OrderHistory: OrderHistoryScreen,
    Shop: ShopScreen,
    Messages: MessageScreen,
    MessageDetail: MessageDetailScreen,
    ShopOrder: ShopOrderScreen,
    ShopAnalyzes: ShopAnalyzeScreen,
    ShopEdit: ShopEditScreen,
    ProductForm: ProductFormScreen,
    ChangePassword: ChangePasswordScreen,
    Logs: LogScreen,
    Notification: NotificationScreen,
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none',
  }
);

export default createAppContainer(AppNavigator);
