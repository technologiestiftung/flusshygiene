import { combineReducers } from 'redux';
import ui from './ui-reducer';
import data from './spots-reducer';
const rootReducer = combineReducers({
  ui,
  data,
});

export default rootReducer;
