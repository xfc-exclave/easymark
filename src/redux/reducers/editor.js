import { ADD_EDITOR, SAVE_EDITORS } from "../constant";

const initialEditors = []

const editorReducer = (state = initialEditors, { type, data }) => {
  switch (type) {
    case ADD_EDITOR:
      return [...state, data];
    case SAVE_EDITORS:
      return data
    default:
      return state;
  }
};
export default editorReducer;