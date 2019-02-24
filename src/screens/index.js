import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import HomeScreen from './Home/HomeMain';
import CategoryScreen from './Category/CategoryMain';
import ShoppingCartScreen from './ShoppingCart/ShoppingCartMain';
import DashboardProfileScreen from './DashboardProfile/DashboardProfileMain';
import ProfileScreen from './Profile/ProfileMain';
import EditProfileScreen from './EditProfile/EditProfileMain';
import OrderHistoryScreen from './OrderHistory/OrderHistoryMain';
import ShopScreen from './Shop/ShopMain';
import ChangePasswordScreen from './ChangePassword/ChangePasswordMain';
import LogScreen from './Logs/LogsMain';
import SideBar from '../components/SideBar';
import LoginScreen from './Login/LoginMain';
import RegisterScreen from './Register/RegisterMain';
import SearchProductScreen from './SearchProduct/SearchProductMain';
import ProductScreen from './Product/ProductMain';
import ReviewScreen from './Review/ReviewMain';
import DiscussionScreen from './Discussion/DiscussionMain';

const DrawerNav = createDrawerNavigator(
  {
    Home: HomeScreen,
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
    Review: ReviewScreen,
    Discussion: DiscussionScreen,
    DashboardProfile: DashboardProfileScreen,
    Profile: ProfileScreen,
    EditProfile: EditProfileScreen,
    OrderHistory: OrderHistoryScreen,
    Shop: ShopScreen,
    ChangePassword: ChangePasswordScreen,
    Logs: LogScreen,
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none',
  }
);

export default createAppContainer(AppNavigator);
