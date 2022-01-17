import Request from '@/js_sdk/luch-request/luch-request'
import store from '../store/index.js'

const mobcentURL = 'https://bbsapi.foodmate.net/' //'https://bbs.undsky.com/mobcent/'

const config = {
	mobcentURL,
	baseURL: mobcentURL + 'app/web/index.php',
	withCredentials: false,
	header: {
		"content-type": "application/x-www-form-urlencoded"
	},
	custom: {
		auth: true
	}
}

const http = new Request(config)

http.interceptors.request.use(async config => {
	if (config.custom.auth) {
		const user = store.state.auth.user
		if (!user) {
			uni.navigateTo({
				url: '/pages/auth/auth'
			})
			return Promise.reject(config)
		} else {
			const _data = ('GET' == config.method ? config.params : config.data) || {}
			Object.assign(_data, {
				uid: _data.uid || user.uid,
				accessToken: user.token,
				accessSecret: user.secret
			})
		}
	}
	return config
}, async config => {
	return Promise.reject(config)
})

http.interceptors.response.use(async response => {
	if ('development' === process.env.NODE_ENV) {
		console.log(JSON.parse(JSON.stringify(response)))
	}
	const data = response.data || {}
	const head = data.head
	if (head) {
		if ('00000000' == head.errCode || '0000000' == head.errCode) {
			return data
		} else if ('50000000' == head.errCode) {
			uni.showModal({
				title: '',
				content: '登录授权过期，请重新登录',
				showCancel: false,
				cancelText: '',
				confirmText: '确定',
				success: res => {
					uni.navigateTo({
						url: '/pages/auth/auth'
					})
				},
				fail: () => {},
				complete: () => {}
			});
		} else if ('00100001' == head.errCode) {
			uni.showModal({
				content: head.errInfo,
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/auth/auth'
						})
					} else if (res.cancel) {
						uni.navigateBack({
							delta: 1
						});
					}
				}
			});
		} else {
			uni.showModal({
				title: '',
				content: head.errInfo,
				showCancel: false,
				cancelText: '',
				confirmText: '确定',
				success: res => {
					if ('00300001' == head.errCode || '020000035' == head.errCode ||
						'02000011' ==
						head
						.errCode ||
						"04000002" == head.errCode) {
						uni.navigateBack({
							delta: 1
						});
					}
				},
				fail: () => {},
				complete: () => {}
			});
		}
	}
	return Promise.reject(response)
}, async response => {
	return Promise.reject(response)
})

function get(params, options) {
	return http.get('', Object.assign({}, options, {
		params
	}))
}

function post(data, options) {
	return http.post('', data, options)
}

function upload(options) {
	return http.upload('', options)
}

function download(options) {
	return http.download('', options)
}

function _compressImg(img) {
	return new Promise((resolve, reject) => {
		plus.zip.compressImage({
			src: img,
			dst: img,
			overwrite: true,
			quality: 50,
			width: '500px'
		}, function() {
			resolve()
		}, function(error) {
			console.log(error)
			reject()
		})
	})
}

async function uploadAttachment(path, module, type) {
	// #ifdef APP
	try {
		if (!type || 'image' == type)
			await _compressImg(path)
	} catch (e) {

	}
	// #endif

	const {
		token: accessToken,
		secret: accessSecret
	} = store.state.auth.user

	return http.upload('', {
		filePath: path,
		name: 'uploadFile[]',
		formData: {
			r: 'forum/sendattachmentex',
			module: module || 'forum',
			type: type || 'image',
			accessToken,
			accessSecret,
		}
	})
}

export default {
	config,
	get,
	post,
	upload,
	download,
	uploadAttachment
}
