<template>
	<view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/message/tiwo/tiwo' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-favorfill text-orange"></text>
					<text class="text-grey" :class=[fonttitle]>提到我的<text v-show="atMeInfoCount" class="cu-tag round bg-red sm">{{atMeInfoCount}}</text></text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/message/pinglun/pinglun' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-commentfill text-blue"></text>
					<text class="text-grey" :class=[fonttitle]>评论<text v-show="replyInfoCount" class="cu-tag round bg-red sm">{{replyInfoCount}}</text></text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/message/friend/friend' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-friendaddfill text-mauve"></text>
					<text class="text-grey" :class=[fonttitle]>好友<text v-show="friendInfoCount" class="cu-tag round bg-red sm">{{friendInfoCount}}</text></text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/message/xiaoxi/xiaoxi' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-infofill text-brown"></text>
					<text class="text-grey" :class=[fonttitle]>消息<text v-show="systemInfoCount" class="cu-tag round bg-red sm">{{systemInfoCount}}</text></text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/message/tixing/tixing' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-notificationfill text-cyan"></text>
					<text class="text-grey" :class=[fonttitle]>系统提醒</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: null,
				replyInfoCount: 0,
				atMeInfoCount: 0,
				friendInfoCount: 0,
				systemInfoCount: 0,
				fontsize: 'normal'
			};
		},
		computed: {
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		methods: {
			bindCount: function(data) {
				this.replyInfoCount = data.replyInfo.count
				this.atMeInfoCount = data.atMeInfo.count
				this.friendInfoCount = data.friendInfo.count
				this.systemInfoCount = data.systemInfo.count
			}
		},
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			if (this.$config.heart) {
				this.bindCount(data)
			}
			this.uid = getApp().globalData.user.uid;
			uni.$on('login', data => {
				this.uid = getApp().globalData.user.uid;
			});
			uni.$on('logout', data => {
				this.uid = null;
			});
			uni.$on('heart', data => {
				this.bindCount(data)
			})
		}
	};
</script>

<style></style>
