import Request from '../js_sdk/luch-request/luch-request/index.js';
import store from '../store/index.js'

const http = new Request({
	baseURL: 'http://localhost:7001/api',
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
				url: '/pages/auth/auth'
			})
			return Promise.reject(config)
		}
	}
	return config
}, async config => {
	return Promise.reject(config)
})

http.interceptors.response.use(async response => {
	if ('development' === process.env.NODE_ENV) {
		console.log(response)
	}
	return response.data || {}
}, async response => {
	if (response.data && ['credentials_required', 'invalid_token', 'revoked_token'].includes(response
			.data.code)) {
		store.commit('clearToken')
		uni.navigateTo({
			url: '/pages/auth/auth'
		})
	}
	return Promise.reject(response)
})

export default http
