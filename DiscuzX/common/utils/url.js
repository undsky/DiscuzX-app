function parse(url) {
	let params = {}
	// #ifdef H5
	if (!url)
		url = window.location.href
	// #endif
	if (url)
		url.replace(/[?&]([^=#]+)=([^&#]*)/gi, function(m, key, value) {
			params[key] = value
		});

	return params
}

export default {
	parse
}
