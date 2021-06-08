import Request from 'luch-request'
import store from '../store/index.js'

const http = new Request({
	baseURL: 'http://www.qdh100.com/mobcent/app/web/index.php',
	withCredentials: true,
	custom: {
		auth: true
	}
})

http.interceptors.request.use(async config => {
	if (config.custom.auth) {
		if (!store.state.user) {
			uni.navigateTo({
				url: '/pages/auth/auth'
			})
			return Promise.reject(config)
		} else {
			config.data.accessToken = store.state.user.token
			config.data.accessSecret = store.state.user.secret
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
	// if ('00000000' == head.errCode || '0000000' == head.errCode) {
	// 	return true;
	// } else if ('50000000' == head.errCode) {
	// 	modal('登录授权过期，请重新登录', function() {
	// 		uni.navigateTo({
	// 			url: '/pages/login/login'
	// 		})
	// 	})
	// } else if ('00100001' == head.errCode) {
	// 	confirm(head.errInfo, function() {
	// 		uni.navigateTo({
	// 			url: '/pages/login/login'
	// 		})
	// 	}, function() {
	// 		uni.navigateBack({

	// 		})
	// 	})
	// } else {
	// 	modal(head.errInfo, function() {
	// 		if ('00300001' == head.errCode || '020000035' == head.errCode || '02000011' == head.errCode ||
	// 			"04000002" == head.errCode) {
	// 			uni.navigateBack({

	// 			})
	// 		}
	// 	})
	// 	return false
	// }
	return response.data || {}
}, async response => {
	return Promise.reject(response)
})

export default http
