<template>
	<form>
		<view v-for="item in userInfo.body.profileList" :key="item.type" class="ziliao-group cu-form-group">
			<view class="title" :class=[fonttitle]>{{item.title}}</view>
			<view class="text-grey" :class=[fontcontent]>{{item.data}}</view>
		</view>
		<view v-for="item in userInfo.body.creditList" :key="item.type" class="ziliao-group cu-form-group">
			<view class="title" :class=[fonttitle]>{{item.title}}</view>
			<view class="text-grey" :class=[fontcontent]>{{item.data}}</view>
		</view>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				user: {},
				userInfo: {
					body: {
						profileList: [],
						creditList: []
					}
				},
				fontsize: 'normal'
			}
		},
		onNavigationBarButtonTap: function(button) {
			if (0 == button.index) {
				uni.navigateTo({
					url: '/pages/wv/wv?url=' + encodeURIComponent(
						'https://bbsapi.foodmate.net/app/web/index.php?r=user/userinfoadminview&accessToken=' + this.user.token +
						'&accessSecret=' + this.user.secret
					)
				});
			}
		},
		methods: {

		},
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
				title: '我的资料'
			})
			this.user = getApp().globalData.user || {}
			this.userInfo = await this.$tool.getData({
				r: this.$api.userinfo,
				userId: this.user.uid
			})
		}
	}
</script>

<style>
	.ziliao-group {
		justify-content: left;
	}

	.ziliao-group .title {
		width: 100px !important;
	}
</style>
