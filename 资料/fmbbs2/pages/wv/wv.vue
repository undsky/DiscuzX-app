<template>
	<view>
		<web-view style="z-index: 9;" :src="url"></web-view>
	</view>
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
			this.url = decodeURIComponent(options.url);

			const params = this.$tool.urlParse(this.url)
			const deltaNum = 'delete' == params.act || 'move' == params.act ? 2 : 1

			// #ifdef APP-PLUS
			const currentWebview = this.$scope.$getAppWebview();
			console.log(currentWebview.children())
			setTimeout(() => {
				let wv = currentWebview.children()[0];
				if (wv.getURL().indexOf('subnvue/back') > -1) {
					wv = currentWebview.children()[1];
				}
				wv.setStyle({
					zindex: 9
				})
				console.log(wv.getURL())
				wv.addEventListener('loaded', e => {
					const url = wv.getURL();
					if (url.indexOf('returnmobileview') > -1) {
						wv.close();
						setTimeout(() => {
							if (2 == deltaNum) {
								uni.$emit('refresh')
							}
							uni.navigateBack({
								delta: deltaNum
							});
						}, 500);
					}
				});
				uni.getSystemInfo({
					success: function(res) {
						if ('ios' == res.platform) {
							const subNVue = uni.getSubNVueById('back');
							subNVue.show()
						}
					}
				});
			}, 1000);
			// #endif
		}
	};
</script>

<style></style>
