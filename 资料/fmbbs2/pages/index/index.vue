<template>
	<view>
		<uni-nav-bar @clickRight="gotoSearch" right-icon="search" title="食品论坛" status-bar fixed backgroundColor="#39b54a"
		 color="#ffffff">
			<view slot="left">
				<navigator v-if="user.avatar" hover-class="none" url="/pages/self/self" class="cu-avatar sm round" :style="{backgroundImage:'url('+user.avatar+')'}"></navigator>
				<navigator v-else hover-class="none" url="/pages/login/login" class="cuIcon-peoplefill text-white"></navigator>
			</view>
		</uni-nav-bar>
		<view v-show="'home' === tab">
			<home></home>
		</view>
		<view v-show="'board' === tab">
			<board></board>
		</view>
		<view v-show="'message' === tab">
			<message></message>
		</view>
		<view v-show="'find' === tab">
			<find></find>
		</view>
		<view class="cu-bar tabbar bg-white shadow foot" style="height: 50px;">
			<view @click="changeTab" data-tab="home" class="action" :class="'home' == tab ? 'text-green' : 'text-gray'">
				<view class="cuIcon-home"></view>
				首页
			</view>
			<view @click="changeTab" data-tab="board" class="action" :class="'board' == tab ? 'text-green' : 'text-gray'">
				<view class="cuIcon-similar"></view>
				板块
			</view>
			<view @click="openTool" class="action text-gray add-action">
				<button class="cu-btn cuIcon-add bg-green shadow"></button>
				工具
			</view>
			<view @click="changeTab" data-tab="message" class="action" :class="'message' == tab ? 'text-green' : 'text-gray'">
				<view class="cuIcon-message">
					<view v-show="count > 0" class="cu-tag badge">{{count}}</view>
				</view>
				消息
			</view>
			<view @click="changeTab" data-tab="find" class="action" :class="'find' == tab ? 'text-green' : 'text-gray'">
				<view class="cuIcon-searchlist"></view>
				我的
			</view>
		</view>
		<uni-popup ref="tool" type="bottom">
			<view class="cu-list grid col-3 no-border popup-content">
				<view class="cu-item" :class="[toggleDelay?'animation-slide-top':'']" :style="[{animationDelay: (0 + 1)*0.1 + 's'}]"
				 @click="gotoPub" data-type="text">
					<view class="cuIcon-font text-blue"></view>
					<text :class=[fontcontent]>文字</text>
				</view>
				<view class="cu-item" :class="[toggleDelay?'animation-slide-top':'']" :style="[{animationDelay: (1 + 1)*0.1 + 's'}]"
				 @click="gotoPub" data-type="img">
					<view class="cuIcon-pic text-green"></view>
					<text :class=[fontcontent]>图片</text>
				</view>
				<view class="cu-item" :class="[toggleDelay?'animation-slide-top':'']" :style="[{animationDelay: (2 + 1)*0.1 + 's'}]"
				 @click="gotoPub" data-type="camera">
					<view class="cuIcon-camera text-orange"></view>
					<text :class=[fontcontent]>拍照</text>
				</view>
				<!-- #ifndef H5 -->
				<view class="cu-item" :class="[toggleDelay?'animation-slide-top':'']" :style="[{animationDelay: (3 + 1)*0.1 + 's'}]"
				 @click="gotoPub" data-type="voice">
					<view class="cuIcon-voice text-mauve"></view>
					<text :class=[fontcontent]>语音</text>
				</view>
				<!-- #endif -->
				<view @click="sign" class="cu-item" :class="[toggleDelay?'animation-slide-top':'']" :style="[{animationDelay: (4 + 1)*0.1 + 's'}]">
					<view class="cuIcon-edit text-brown"></view>
					<text :class=[fontcontent]>签到</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {},
				tab: 'home',
				showTool: false,
				count: 0,
				toggleDelay: false,
				fontsize: 'normal'
			};
		},
		onNavigationBarButtonTap: function(button) {
			if (0 == button.index) {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		},
		methods: {
			gotoSearch(e) {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			gotoPub: function(e) {
				const type = e.currentTarget.dataset.type
				this.toggleTool()
				uni.navigateTo({
					url: '/pages/pub/pub?type=' + type
				})
			},
			sign: async function() {
				// const uid = getApp().globalData.user.uid
				// if (uid) {
				const data = await this.$tool.getData({
					r: this.$api.sign
				});
				if (data && data.head) {
					this.$tool.modal(data.head.errInfo);
				}
				// } else {
				// 	uni.navigateTo({
				// 		url: '/pages/login/login'
				// 	})
				// }
				this.toggleTool();
			},
			changeTab: function(e) {
				this.tab = e.currentTarget.dataset.tab;
				this.toggleTool(true);
			},
			openTool: function(e) {
				this.$tool.needLogin(() => {
					this.toggleTool();
				});
			},
			toggleTool: function(close) {
				if (this.showTool) {
					this.$refs.tool.close();
					this.showTool = false;
				} else if (!close) {
					this.$refs.tool.open();
					this.showTool = true;
					this.toggleDelay = true;
					setTimeout(() => {
						this.toggleDelay = false
					}, 1000)
				}
			}
		},
		computed: {
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			this.user = getApp().globalData.user
		},
		onLoad: function() {
			uni.$on('login', data => {
				this.user = getApp().globalData.user
			})
			uni.$on('logout', data => {
				this.user = {}
			})
			uni.$on('heart', data => {
				this.count = data.replyInfo.count + data.atMeInfo.count + data.friendInfo.count + data.systemInfo.count
			})
		}
	};
</script>

<style>
	.cu-avatar {
		margin-left: 9px;
	}

	.cuIcon-peoplefill {
		font-size: 21px;
		margin-left: 9px;
	}

	.popup-content {
		margin-bottom: 50px;
		justify-content: center;
	}
</style>
