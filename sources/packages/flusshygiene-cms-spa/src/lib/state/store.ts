import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import throttle from 'lodash.throttle';
import { loadState, saveState } from './persistance/local-storage';

import thunkMiddleware from 'redux-thunk';

import RootReducer from './reducers/root-reducer';

const middleware = applyMiddleware(thunkMiddleware);
const persistedState = loadState();

const store = createStore(
  RootReducer,
  // persistedState,
  composeWithDevTools(middleware),
);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 10000),
);
export default store;
