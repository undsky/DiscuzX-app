<template>
	<view>
		<view class="cu-list menu-avatar">
			<view class="cu-item">
				<view class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + userInfo.icon + ')' }"></view>
				<view class="ta-content content">
					<view class="flex justify-between">
						<text class="text-grey" :class=[fonttitle]>{{ userInfo.name }}</text>
					</view>
					<view class="flex text-gray text-sm" :class=[fontcontent]>
						<view class="margin-right-xs">积分：{{ userInfo.body ? userInfo.body.creditShowList[0].data : 0 }}</view>
						<view class="margin-right-xs">金币：{{ userInfo.body ? userInfo.body.creditShowList[1].data : 0 }}</view>
					</view>
					<view class="text-gray text-sm" :class=[fontcontent]>
						<view class="text-orange">{{ userInfo.userTitle }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="'/pages/ta/ziliao/ziliao?uid=' + uid" open-type="navigate">
					<text class="cuIcon-infofill text-mauve"></text>
					<text class="text-grey" :class=[fonttitle]>他的资料</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="'/pages/ta/xiangce/xiangce?uid=' + uid" open-type="navigate">
					<text class="cuIcon-picfill text-olive"></text>
					<text class="text-grey" :class=[fonttitle]>他的相册</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="'/pages/ta/guanzhu/guanzhu?uid=' + uid" open-type="navigate">
					<text class="cuIcon-favorfill text-pink"></text>
					<text class="text-grey" :class=[fonttitle]>他的关注</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="'/pages/ta/fensi/fensi?uid=' + uid" open-type="navigate">
					<text class="cuIcon-likefill text-orange"></text>
					<text class="text-grey" :class=[fonttitle]>他的粉丝</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="'/pages/ta/fabiao/fabiao?uid=' + uid" open-type="navigate">
					<text class="cuIcon-roundaddfill text-green"></text>
					<text class="text-grey" :class=[fonttitle]>他的发表</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="'/pages/ta/huifu/huifu?uid=' + uid" open-type="navigate">
					<text class="cuIcon-notificationfill text-purple"></text>
					<text class="text-grey" :class=[fonttitle]>他的回复</text>
				</navigator>
			</view>
		</view>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view @click="handleHaoyou" class="action" :class="[haoyou ? 'text-blue' : 'text-gray']">
				<view class="cuIcon-friendfill"></view>
				<view :class=[fontcontent]>{{haoyou ? '删除好友' : '加好友'}}</view>
			</view>
			<view @click="handleGuanzhu" class="action" :class="[guanzhu ? 'text-blue' : 'text-gray']">
				<view class="cuIcon-favorfill"></view>
				<view :class=[fontcontent]>{{guanzhu ? '取消关注' : '关注'}}</view>
			</view>
			<navigator class="action text-gray" hover-class="none" open-type="navigate" :url="'/pages/chat/chat?fromUid=' + uid">
				<view class="cuIcon-messagefill text-gray"></view>
				<view :class=[fontcontent]>发送消息</view>
			</navigator>
			<view @click="handleLahei" class="action" :class="[lahei ? 'text-blue' : 'text-gray']">
				<view class="cuIcon-attentionforbidfill"></view>
				<view :class=[fontcontent]>{{lahei ? '取消拉黑' : '拉黑'}}</view>
			</view>
			<navigator class="action text-gray" hover-class="none" open-type="navigate" :url="'/pages/jubao/jubao?type=user&id=' + uid">
				<view class="cuIcon-dianhua text-gray"></view>
				<view :class=[fontcontent]>举报</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: 0,
				userInfo: {},
				haoyou: false,
				guanzhu: false,
				lahei: false,
				uid: null,
				fontsize: 'normal'
			};
		},
		methods: {
			handleHaoyou: function() {
				const user = getApp().globalData.user || {}
				uni.navigateTo({
					url: '/pages/wv/wv?url=' + encodeURIComponent(this.$tool.urlParams(this.$api.base, {
						r: this.$api.useradminview,
						uid: this.uid,
						act: this.haoyou ? 'ignore' : 'add',
						accessToken: user.token,
						accessSecret: user.secret,
					}))
				})
			},
			handleGuanzhu: async function() {
				await this.$tool.getData({
					r: this.$api.useradmin,
					uid: this.uid,
					type: this.guanzhu ? 'unfollow' : 'follow'
				})
				this.guanzhu = !this.guanzhu
			},
			handleLahei: async function() {
				await this.$tool.getData({
					r: this.$api.useradmin,
					uid: this.uid,
					type: this.lahei ? 'delblack' : 'black'
				})
				this.lahei = !this.lahei
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
			uni.setNavigationBarTitle({
				title: '他的主页'
			});
		},
		onLoad: async function(options) {
			this.uid = options.uid;
			this.userInfo = await this.$tool.getData({
				r: this.$api.userinfo,
				userId: this.uid
			});

			if (this.userInfo) {
				this.haoyou = !!this.userInfo.isFriend
				this.guanzhu = !!this.userInfo.is_follow
				this.lahei = !!this.userInfo.is_black
			} else {
				this.userInfo = {}
			}
		}
	};
</script>

<style>
	.ta-content {
		width: calc(100% - 48px - 30px - 10px) !important;
	}
</style>
