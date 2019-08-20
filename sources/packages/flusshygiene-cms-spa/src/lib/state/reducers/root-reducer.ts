import { combineReducers } from 'redux';
import ui from './ui-reducer';
import data from './spots-reducer';
import detailSpot from './single-spot-reducer';
import postSpot from './spot-post-reducer';
const rootReducer = combineReducers({
  ui,
  data,
  detailSpot,
  postSpot,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
