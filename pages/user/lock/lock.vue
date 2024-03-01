<template>
	<view class="padding">
		<view class="text-gray text-df">我们很遗憾您做出注销帐号的决定，在提交申请前请您仔细阅读以下内容 :</view>
		<view class="cu-list menu">
			<view class="cu-item lock-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-index bg-blue text-white margin-right-xs">1</text>
						<text class="text-lg">确保账号拥有者</text>
					</view>
					<view class="text-info text-gray text-df">
						您应确保您有权决定该账户的注销事宜，不侵犯任何第三方的合法权益，如因此引发任何投诉争议，由您自行承担。
					</view>
				</view>

			</view>
			<view class="cu-item lock-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-index bg-blue text-white margin-right-xs">2</text>
						<text class="text-lg">注销账号不免责</text>
					</view>
					<view class="text-info text-gray text-df">
						如您已被国家机关调查或正处于诉讼、仲裁程序中，请注意，注销您的帐号并不代表此帐号注销前的帐号行为和相关责任得到豁免或减轻。
					</view>
				</view>

			</view>
			<view class="cu-item lock-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-index bg-blue text-white margin-right-xs">3</text>
						<text class="text-lg">帐号不可找回</text>
					</view>
					<view class="text-info text-gray text-df">
						注销后账号不可找回，请谨慎操作。
					</view>
				</view>

			</view>
			<view class="cu-item lock-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-index bg-blue text-white margin-right-xs">4</text>
						<text class="text-lg">失去账号权益</text>
					</view>
					<view class="text-info text-gray text-df">
						注销账号后您的VIP、积分等权益将失去。
					</view>
				</view>

			</view>
			<view class="cu-item lock-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-index bg-blue text-white margin-right-xs">5</text>
						<text class="text-lg">手机号码解除绑定</text>
					</view>
					<view class="text-info text-gray text-df">
						注销后该账号不可用手机号码登录。
					</view>
				</view>

			</view>
			<view class="cu-item lock-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-index bg-blue text-white margin-right-xs">6</text>
						<text class="text-lg">微信、QQ解除绑定</text>
					</view>
					<view class="text-info text-gray text-df">
						注销后该账号不可用微信号、QQ号快捷登录。
					</view>
				</view>

			</view>
			<view class="cu-item lock-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="text-index bg-blue text-white margin-right-xs">7</text>
						<text class="text-lg">APP、网站的帐号解绑</text>
					</view>
					<view class="text-info text-gray text-df">
						该帐号将解除与APP、网站的授权登录或绑定关系。
					</view>
				</view>

			</view>
		</view>
		<view class="margin-top-lg padding">
			<u-button type="warning" @click="lock">注销账号</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			async lock() {
				uni.showModal({
					content: '确定注销吗？',
					success: async (res) => {
						if (res.confirm) {
							await this.$http.get({
								r: 'user/updateuserinfo',
								type: 'lock'
							});

							await this.$http.get({
								r: 'user/login',
								type: 'logout'
							});

							this.$store.commit('clearUser');
							this.userInfo = null;

							clearInterval(getApp().globalData.heartInterval);
							getApp().globalData.heartInterval = null;
							this.$store.commit('clearHeart');

							this.$util.helper.modal('注销成功', res => {
								uni.reLaunch({
									url: '/pages/index/index'
								})
							})


						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.lock-item {
		padding: 0 !important;
	}

	.lock-item .text-index {
		width: 20px;
		text-align: center;
		border-radius: 50%;
		height: 20px;
		line-height: 20px;
	}

	.lock-item .text-info {
		padding-left: 20px;
	}
</style>