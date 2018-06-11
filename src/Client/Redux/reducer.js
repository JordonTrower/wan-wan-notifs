import axios from 'axios';

const initalState = {
	user: {}
};

const GET_USER_INFO = 'GET_USER_INFO';

export function getUserInfo() {
	const userInfo = axios.get('/login/is-logged-in').then(res => {

		if (res.data.res === "success") {
			return res.data.user;
		}

		return {
			id: 'not-logged'
		};

	})

	return {
		type: GET_USER_INFO,
		payload: userInfo
	}
}

export default function reducer(state = initalState, action) {
	switch (action.type) {
		case `${GET_USER_INFO  }_FULFILLED`:
			return Object.assign({}, state, {
				user: action.payload
			})
		default:
			return state;
	}
}