import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';

const makeStore = initialState => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware));
  const store = createStore(reducers, initialState, enhancer);
  return store;
};

export default makeStore;
