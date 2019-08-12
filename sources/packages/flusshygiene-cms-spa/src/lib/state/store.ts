import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunkMiddleware from 'redux-thunk';

import RootReducer from './reducers/root-reducer';

const middleware = applyMiddleware(thunkMiddleware);

const Store = createStore(RootReducer, composeWithDevTools(middleware));

export default Store;
