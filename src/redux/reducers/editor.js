import { ADD_EDITOR, SAVE_EDITORS } from "../constant";
import { nanoid } from "nanoid";

// status === initialized-自动创建，temporary-自动创建修改未保存，saved-与本地保存文件一致，unsaved-与本地保存文件不一致
const initialEditors = [
  {
    key: nanoid(),
    title: 'untitled-z.md',
    content: '',
    status: 'initialized',
    pathname: ''
  }
]

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