import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import HomeScreen from './Home/HomeView';
import CategoryScreen from './Category/CategoryView';
import ShoppingCartScreen from './ShoppingCart/ShoppingCartView';
import ProfileScreen from './Profile/ProfileView';
import SideBar from '../components/SideBar';
import LoginScreen from '../routes/Login/LoginView';

const DrawerNav = createDrawerNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => <SideBar {...props} />,
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: DrawerNav,
    Category: CategoryScreen,
    ShoppingCart: ShoppingCartScreen,
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none',
  }
);

export default createAppContainer(AppNavigator);
