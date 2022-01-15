import api from './api.js'
import config from './config.js'

function checkData(head) {
	if ('00000000' == head.errCode || '0000000' == head.errCode) {
		return true;
	} else if ('50000000' == head.errCode) {
		modal('登录授权过期，请重新登录', function() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		})
	} else if ('00100001' == head.errCode) {
		confirm(head.errInfo, function() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		}, function() {
			uni.navigateBack({

			})
		})
	} else {
		modal(head.errInfo, function() {
			if ('00300001' == head.errCode || '020000035' == head.errCode || '02000011' == head.errCode || "04000002" == head.errCode) {
				uni.navigateBack({

				})
			}
		})
		return false
	}
}

function mobcentBr(content) {
	return content.replace('/\[mobcent_br\]/g', '<br />');
}

function mobcentUrl(content) {
	return content.replace(/\[mobcent_url=(.*?)\(title=(.*?)\)\]/g, '<a href="$1">$2</a>');
}

function mobcentVideo(content) {
	return content.replace(/\[mobcent_video=(.*?)\]/g, '<video controls controlslist="nodownload" src="$1"></video>');
}

function mobcentAudio(content) {
	return content.replace(/\[mobcent_audio=(.*?)\]/g, '<audio controls controlslist="nodownload" src="$1"></audio>');
}

function mobcentAttachment(content) {
	return content.replace(/\[mobcent_attachment=(.*?)\(title=(.*?)\)\(desc=(.*?)\)\]/g, '<a href="$1">$2</a>');
}

function mobcentImage(content) {
	return content.replace(/\[mobcent_image=(.*?)\(aid=(.*?)\)\]/g, '<img class="img-emoji" src="$1"/>');
}

function mobcentPhiz(content) {
	content = content.replace(/\n/g, '<br/>')
	content = content.replace(/\[mobcent_phiz=(.*?)\]/g, '<img class="img-emoji" src="$1"/>');
	content = content.replace(/\[video\](.*?)\[\/video\]/g, '<video controls controlslist="nodownload" src="$1"></video>')
	for (var i = 0; i < config.emojis.length; i++) {
		var emoji = config.emojis[i];
		content = content.replace(new RegExp('\\' + emoji.substr(0, emoji.length - 1) + '\\]', 'g'),
			'<img style="width: 22px !important;height: 22px !important;" class="img-emoji" src="https://app.foodmate.net/update/bbs/emoji/' +
			(i < 10 ? '0' +
				i : i) + '.png"/>');
	}
	return content;
}

function mobcentContent(content) {
	let h = ''
	if (content) {
		for (let item of content) {
			if (0 == item.type && item.infor) {
				h += `<view>${mobcentPhiz(item.infor || '')}</view>`
			} else if (1 == item.type && item.infor) {
				if (item.infor.indexOf('//forum') == -1)
					h += `<img src="${item.infor}"/>`
			} else if (2 == item.type && item.infor) {
				h += `<video controls controlslist="nodownload" src="${item.infor}"></video>`
			} else if (3 == item.type && item.infor) {
				h += `<audio controls controlslist="nodownload" src="${item.infor}"></audio>`
			} else if ((4 == item.type || 5 == item.type) && item.infor) {
				if (['png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG', 'JPEG', 'GIF'].indexOf(item.infor.substr(item.infor.lastIndexOf('.') +
						1)) > -1) {
					// h += `<img src="${item.url}"/>`
				} else {
					h += `<a href="${item.url}">&nbsp;${item.infor}</a>`
				}
			}
		}
	}
	return h
}

function needLogin(callback) {
	const user = getApp().globalData.user || {}
	if (user.uid) {
		callback()
	} else {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	}
}

function compressImage(img) {
	return new Promise((resolve, reject) => {
		plus.zip.compressImage({
			src: img,
			dst: img,
			overwrite: true,
			quality: 50,
			width: '500px'
		}, function() {
			console.log('compress success')
			resolve()
		}, function(error) {
			log(error)
			console.log(error)
			reject()
		})
	})
}

async function upload(path, module, type, silent) {
	try {
		if (!silent)
			loading()
		const user = getApp().globalData.user || {}

		// #ifdef APP-PLUS
		try {
			if (!type || 'image' == type)
				await compressImage(path)
		} catch (e) {

		}
		// #endif

		return await uni.uploadFile({
			url: api.base,
			filePath: path,
			name: 'uploadFile[]',
			formData: {
				r: api.sendattachmentex,
				module: module || 'forum',
				type: type || 'image',
				accessToken: user.token,
				accessSecret: user.secret,
			}
		})
	} catch (e) {
		log(e)
		console.log(e)
		modal('访问异常')
		return null
	} finally {
		if (!silent)
			loaded()
	}
}

async function log(error) {
	try {
		await uni.request({
			url: 'http://app.foodmate.net/log',
			method: 'POST',
			header: {
				"content-type": "application/x-www-form-urlencoded"
			},
			data: {
				log: JSON.stringify(error)
			}
		});
	} catch (e) {
		//TODO handle the exception
	}
}

async function post(data) {
	const res = await uni.request({
		url: api.base,
		method: 'POST',
		header: {
			"content-type": "application/x-www-form-urlencoded"
		},
		data: data
	});
	console.log(res)
	if (res[0]) {
		// modal('访问异常')
		throw res[0]
	} else if (checkData(res[1].data.head)) {
		return res[1].data
	}
}

async function get(data) {
	const res = await uni.request({
		url: api.base,
		method: 'GET',
		data: data
	});
	if (res[0]) {
		// modal('访问异常')
		throw res[0]
	} else if (checkData(res[1].data.head)) {
		return res[1].data
	}
}

async function getData(data, method, silent) {
	try {
		if (!silent)
			loading()
		let _data = data || {}
		const user = getApp().globalData.user
		if (user && user.uid) {
			_data.accessToken = user.token
			_data.accessSecret = user.secret
		}
		if (_data.page && !_data.pageSize) {
			_data.pageSize = config.pageSize
		}
		if ('post' == method) {
			return await post(_data)
		} else {
			return await get(_data)
		}
	} catch (e) {
		console.log(e)
		if (!silent)
			modal('访问异常')
		return null
	} finally {
		if (!silent)
			loaded()
	}
}

function clearHeart() {
	if (config.heartInterval) {
		clearInterval(config.heartInterval)
		config.heartInterval = null
	}
}

function heart() {
	clearHeart()
	const user = getApp().globalData.user
	if (user && user.uid) {
		config.heartInterval = setInterval(() => {
			const reuser = getApp().globalData.user
			if (reuser && reuser.uid) {
				(async () => {
					try {
						const res = await getData({
							r: api.heart
						}, 'get', true)
						console.log(res)
						config.heart = res.body
						uni.$emit('heart', res.body)
					} catch (e) {
						//TODO handle the exception
					}
				})()
			} else {
				clearHeart()
			}
		}, 60000)
	}
}

function modal(content, ok) {
	uni.showModal({
		title: '',
		content: content,
		showCancel: false,
		success: ok
	});
}

function confirm(content, ok, cancel, confirmText, cancelText) {
	uni.showModal({
		title: '',
		content: content,
		confirmText: confirmText || '确定',
		cancelText: cancelText || '取消',
		success: res => {
			if (res.confirm) {
				if (ok)
					ok()
			} else if (res.cancel) {
				if (cancel)
					cancel()
			}
		}
	})
}

function loading(title) {
	uni.showLoading({
		title: title || '加载中...',
		mask: true
	});
}

function loaded() {
	uni.hideLoading();
}

function urlParse(url) {
	var res = {};
	if (url) {
		var search = url.split('?');
		var query = search[search.length - 1].split('#')
		var params = query[0].split('&');
		for (var i = 0; i < params.length; i++) {
			var str = params[i].split('=');
			if (str[0] != '') {
				res[str[0]] = decodeURIComponent(str[1]);
			}
		}
	}
	return res;
}

function urlParams(url, data) {
	if (typeof url == 'undefined' || url == null || url == '') {
		return ''
	}
	if (typeof data == 'undefined' || data == null || typeof data != 'object') {
		return ''
	}
	url += url.indexOf('?') != -1 ? '' : '?'
	for (var k in data) {
		url += (url.indexOf('=') != -1 ? '&' : '') + k + '=' + encodeURI(data[k])
	}
	return url
}

function addVideo(video) {
	return '<video class="item-media" controls controlslist="nodownload" src="' + video + '"></video>'
}

function addAudio(audio) {
	return '<audio class="item-media" controls controlslist="nodownload" src="' + audio + '"></audio>'
}

export default {
	compressImage,
	upload,
	post,
	get,
	getData,
	clearHeart,
	heart,
	modal,
	confirm,
	loading,
	loaded,
	mobcentBr,
	mobcentUrl,
	mobcentVideo,
	mobcentAudio,
	mobcentAttachment,
	mobcentImage,
	mobcentPhiz,
	mobcentContent,
	urlParse,
	urlParams,
	needLogin,
	addAudio,
	addVideo,
	log
}
