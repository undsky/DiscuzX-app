import queryParams from './queryParams.js'

function parse(url) {
	let params = {}
	if (url)
		url.replace(/[?&]([^=#]+)=([^&#]*)/gi, function(m, key, value) {
			params[key] = value
		});

	return params
}

export default {
	parse,
	stringify: queryParams
}
