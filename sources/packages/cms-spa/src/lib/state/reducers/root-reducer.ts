import { combineReducers } from 'redux';
import ui from './ui-reducer';
import data from './spots-reducer';
import detailSpot from './single-spot-reducer';
import postSpot from './spot-post-reducer';
import questionaire from './questionnaire-reducer';
const rootReducer = combineReducers({
  ui,
  data,
  detailSpot,
  postSpot,
  questionaire,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
