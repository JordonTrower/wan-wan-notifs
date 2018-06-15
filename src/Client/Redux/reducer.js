import axios from 'axios';
import _ from 'lodash';

const initalState = {
	user: {},
	sites: []
};

const GET_USER_INFO = 'GET_USER_INFO';
const GET_USER_SITES = 'GET_USER_SITES'

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

export function getUserSites(userId) {
	const userSites = axios.get(`/user/${userId}/get-sites`).then(res => {

		console.log(res);
		if (res.data.res === "success") {
			return _.map(res.data.data, 'site');
		}

		return []

	})

	return {
		type: GET_USER_SITES,
		payload: userSites
	}
}

export default function reducer(state = initalState, action) {
	switch (action.type) {
		case `${GET_USER_INFO  }_FULFILLED`:
			return Object.assign({}, state, {
				user: action.payload
			})

		case `${GET_USER_SITES  }_FULFILLED`:
			return Object.assign({}, state, {
				sites: action.payload
			})

		default:
			return state;
	}
}