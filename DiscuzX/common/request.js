import Request from '../js_sdk/luch-request/luch-request/index.js';
import store from '../store/index.js'

const http = new Request({
	baseURL: '',
	withCredentials: true,
	custom: {
		auth: true
	}
})

http.interceptors.request.use(async config => {
	if (config.custom.auth) {
		if (store.state.token) {
			config.header.Authorization = 'Bearer ' + store.state.token
		} else {
			uni.navigateTo({
				url: '/pages/auth/auth.vue'
			})
			return Promise.reject(config)
		}
	}
	return config
}, async config => {
	return Promise.reject(config)
})

http.interceptors.response.use(async response => {
	return response
}, async response => {
	if (response.data && ['credentials_required', 'invalid_token', 'revoked_token'].includes(response
			.data.code)) {
		store.commit('clearToken')
		uni.navigateTo({
			url: '/pages/auth/auth.vue'
		})
	}
	return Promise.reject(response)
})

export default http
