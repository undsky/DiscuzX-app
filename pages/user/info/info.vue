<template>
	<form>
		<view v-for="item in userInfo.body.profileList" :key="item.type" class="info-group cu-form-group">
			<view class="title">{{ item.title }}</view>
			<view class="text-grey">{{ item.data }}</view>
		</view>
		<view v-for="item in userInfo.body.creditList" :key="item.type" class="info-group cu-form-group">
			<view class="title">{{ item.title }}</view>
			<view class="text-grey">{{ item.data }}</view>
		</view>
	</form>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				body: {
					profileList: [],
					creditList: []
				}
			}
		};
	},
	methods: {},
	onLoad: async function() {
		this.userInfo = await this.$http.post({
			r: 'user/userinfo'
		});
	}
};
</script>

<style scoped>
.info-group {
	justify-content: left;
}

.info-group .title {
	width: 100px !important;
}
</style>
