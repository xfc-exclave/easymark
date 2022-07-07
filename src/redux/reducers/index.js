import { combineReducers } from "redux";
import editorReducer from "./editor";
import categoryReducer from "./category";

export default combineReducers({
  editorReducer,
  categoryReducer
});
