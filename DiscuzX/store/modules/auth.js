export default {
	state: {
		token: null
	},
	getters: {

	},
	mutations: {
		setToken(state, token) {
			state.token = token
		},
		clearToken(state) {
			uni.removeStorageSync('token')
			state.token = null
		}
	},
	actions: {

	}
}
