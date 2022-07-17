import { SET_ACTIVE_KEY } from "../constant";

const initialActive = '0'

const activeReducer = (state = initialActive, { type, data }) => {
	switch (type) {
		case SET_ACTIVE_KEY:
			state = data
			return data;
		default:
			return state;
	}
};
export default activeReducer;