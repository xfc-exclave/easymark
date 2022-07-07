import { ADD_EDITOR, SAVE_EDITORS } from "../constant";

export const addEditor = data => ({ type: ADD_EDITOR, data });
export const saveEditors = data => ({ type: SAVE_EDITORS, data });