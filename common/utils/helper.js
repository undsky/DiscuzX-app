import store from '@/store/index.js'

function goto(url, auth) {
	uni.navigateTo({
		url: auth && !store.state.auth.user ? '/pages/auth/auth' : url
	});
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

export default {
	goto,
	urlParse
}
