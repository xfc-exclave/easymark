import { combineReducers } from "redux";
import editorReducer from "./editor";
import categoryReducer from "./category";
import directoryReducer from "./directory";
import activeReducer from "./active"

export default combineReducers({
  editorReducer,
  categoryReducer,
  directoryReducer,
  activeReducer
});
