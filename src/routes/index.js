import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import HomeScreen from './Home/HomeMain';
import CategoryScreen from './Category/CategoryMain';
import ShoppingCartScreen from './ShoppingCart/ShoppingCartMain';
import ProfileScreen from './Profile/ProfileMain';
import SideBar from '../components/SideBar';
import LoginScreen from '../routes/Login/LoginMain';
import RegisterScreen from '../routes/Register/RegisterMain';

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
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none',
  }
);

export default createAppContainer(AppNavigator);
