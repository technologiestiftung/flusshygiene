import { combineReducers } from "redux";
import data from "./spots-reducer";
import detailSpot from "./single-spot-reducer";
import postSpot from "./spot-post-reducer";
const rootReducer = combineReducers({
  data,
  detailSpot,
  postSpot,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
