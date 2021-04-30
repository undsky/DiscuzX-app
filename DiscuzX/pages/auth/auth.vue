<template>
	<view>
		// TODO: 禁用返回，授权成功后跳转
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			setToken(token) {
				uni.setStorageSync('token', token)
				this.$store.commit('setToken', token)
			}
		},
		onBackPress: function() {
			return true;
		}
	}
</script>

<style>

</style>
