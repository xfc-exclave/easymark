import { GET_DIRECTORY } from "../constant";

const initialDirectory = [
];

const directoryReducer = (state = initialDirectory, { type, data }) => {
  switch (type) {
    case GET_DIRECTORY:
      return data;
    default:
      return state;
  }
};
export default directoryReducer;