import { combineReducers } from "redux";
import editorReducer from "./editor";
import categoryReducer from "./category";
import directoryReducer from "./directory";

export default combineReducers({
  editorReducer,
  categoryReducer,
  directoryReducer
});
