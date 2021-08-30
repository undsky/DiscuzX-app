<template>
	<form>
		<view v-for="item in userInfo.body.profileList" :key="item.type" class="ziliao-group cu-form-group">
			<view class="title" :class=[fonttitle]>{{ item.title }}</view>
			<view class="text-grey" :class=[fontcontent]>{{ item.data }}</view>
		</view>
		<view v-for="item in userInfo.body.creditList" :key="item.type" class="ziliao-group cu-form-group">
			<view class="title" :class=[fonttitle]>{{ item.title }}</view>
			<view class="text-grey" :class=[fontcontent]>{{ item.data }}</view>
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
					creditList: [],
					fontsize: 'normal'
				}
			}
		};
	},
	methods: {},
	computed: {
		fonttitle: function() {
			return 'diy-title-' + this.fontsize
		},
		fontcontent: function() {
			return 'diy-content-' + this.fontsize
		}
	},
	created: async function() {
		this.fontsize = getApp().globalData.fontsize
		uni.$on('fontsize', () => {
			this.fontsize = getApp().globalData.fontsize
		})
		uni.setNavigationBarTitle({
			title: '他的资料'
		});
	},
	onLoad: async function(options) {
		const user = getApp().globalData.user;
		this.userInfo = await this.$tool.getData({
			r: this.$api.userinfo,
			userId: options.uid
		});
	}
};
</script>

<style>
.ziliao-group {
	justify-content: left;
}

.ziliao-group .title {
	width: 100px !important;
}
</style>
