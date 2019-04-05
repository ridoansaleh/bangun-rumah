import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import HomeScreen from './Home/HomeMain';
import ReviewListScreen from './ReviewList/ReviewListMain';
import DiscussionListScreen from './DiscussionList/DiscussionListMain';
import TermsAndConditionScreen from './TermsAndCondition/TermsAndConditionMain';
import FAQScreen from './FAQ/FAQMain';
import CategoryScreen from './Category/CategoryMain';
import ShoppingCartScreen from './ShoppingCart/ShoppingCartMain';
import DashboardProfileScreen from './DashboardProfile/DashboardProfileMain';
import ProfileScreen from './Profile/ProfileMain';
import EditProfileScreen from './EditProfile/EditProfileMain';
import OrderHistoryScreen from './OrderHistory/OrderHistoryMain';
import ShopScreen from './Shop/ShopMain';
import MessageScreen from './Messages/MessagesMain';
import MessageDetailScreen from './MessageDetail/MessageDetailMain';
import ShopOrderScreen from './ShopOrderHistory/ShopOrderMain';
import ShopAnalyzeScreen from './ShopAnalyzes/ShopAnalyzesMain';
import ShopEditScreen from './ShopEditForm/ShopEditMain';
import ProductFormScreen from './ProductForm/ProductFormMain';
import ChangePasswordScreen from './ChangePassword/ChangePasswordMain';
import LogScreen from './Logs/LogsMain';
import SideBar from '../components/SideBar';
import LoginScreen from './Login/LoginMain';
import RegisterScreen from './Register/RegisterMain';
import SearchProductScreen from './SearchProduct/SearchProductMain';
import ProductScreen from './Product/ProductMain';
import OrderScreen from './Order/OrderMain';
import ReviewScreen from './Review/ReviewMain';
import DiscussionScreen from './Discussion/DiscussionMain';
import NotificationScreen from './Notifications/NotificationsMain';

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
