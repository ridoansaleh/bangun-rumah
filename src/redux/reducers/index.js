import { combineReducers } from 'redux';
import { profileReducer } from './profile_reducer';
import { productsListReducer } from './product_list_reducer';

const reducers = combineReducers({
  profile: profileReducer,
  products_list: productsListReducer,
});

export default reducers;
