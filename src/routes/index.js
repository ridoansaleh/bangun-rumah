import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './Home/HomeView';
import CategoryScreen from './Category/CategoryView';
import ShoppingCartScreen from './ShoppingCart/ShoppingCartView';
import ProfileScreen from './Profile/ProfileView';

const AppNavigator = createStackNavigator(
	{
		Home: HomeScreen,
		Category: CategoryScreen,
		ShoppingCart: ShoppingCartScreen,
		Profile: ProfileScreen,
	},
	{
		initialRouteName: 'Home',
	}
);

export default createAppContainer(AppNavigator);
