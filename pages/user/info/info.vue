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
import { mapState } from 'vuex';

export default {
	data() {
		return {
			uid: null,
			userInfo: {
				body: {
					profileList: [],
					creditList: []
				}
			}
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	methods: {},
	onLoad: async function(options) {
		this.uid = JSON.parse(options.uid);

		this.userInfo = await this.$http.post({
			r: 'user/userinfo',
			userId: this.uid || this.user.uid
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
