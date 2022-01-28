import store from '@/store/index.js'

function goto(url, auth) {
	uni.navigateTo({
		url: auth && !store.state.auth.user ? '/pages/auth/auth' : url
	});
}

function checkAuth() {
	if (store.state.auth.user) {
		return true
	} else {
		goto(null, true)
	}
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

function modal(content, success, complete, fail) {
	uni.showModal({
		title: '',
		content,
		showCancel: false,
		cancelText: '',
		confirmText: '确定',
		success,
		fail,
		complete
	});
}

export default {
	goto,
	checkAuth,
	urlParse,
	modal
}
