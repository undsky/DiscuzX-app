<template>
	<view><web-view style="z-index: 9;" :src="url"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			url: undefined
		};
	},
	methods: {},
	onLoad: function(options) {
		const { title, url } = options;

		if (title) {
			uni.setNavigationBarTitle({
				title
			});
		}

		this.url = decodeURIComponent(url);

		const params = this.$util.helper.urlParse(this.url);
		const deltaNum = 'delete' == params.act || 'move' == params.act ? 2 : 1;

		// #ifdef APP-PLUS
		const currentWebview = this.$scope.$getAppWebview();
		
		setTimeout(() => {
			let wv = currentWebview.children()[0];
			wv.setStyle({
				zindex: 9
			});
			// console.log(wv.getURL());
			wv.addEventListener('loaded', e => {
				const url = wv.getURL();
				if (url.indexOf('returnmobileview') > -1) {
					wv.close();
					setTimeout(() => {
						if (2 == deltaNum) {
							uni.$emit('refresh');
						}
						uni.navigateBack({
							delta: deltaNum
						});
					}, 500);
				}
			});
		}, 1000);
		// #endif
	}
};
</script>

<style></style>
