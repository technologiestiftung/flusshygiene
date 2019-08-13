import { combineReducers } from 'redux';
import ui from './ui-reducer';
import data from './spots-reducer';
import detailSpot from './single-spot-reducer';

const rootReducer = combineReducers({
  ui,
  data,
  detailSpot,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
