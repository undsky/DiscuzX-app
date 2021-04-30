<template>
	<view class="flex flex-column flex-align-center">
		<image class="logo margin-top-lg" src="/static/logo.png"></image>
		<view class="text-size-base text-color-grey margin-top">{{version}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version: ''
			}
		},
		onLoad: async function(options) {
			const result = await this.$http.post('', {}, {
				// custom: {
				// 	auth: false
				// }
			})
			if (200 == result.code)
				this.version = result.data.version
		},
		methods: {

		}
	}
</script>

<style scoped>
	.logo {
		width: 160rpx;
		height: 160rpx;
	}
</style>
