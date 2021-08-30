<template>
	<view>
		<view class="cu-list menu-avatar">
			<navigator class="cu-item" hover-class="none" :url="'/pages/self/edit/edit?gender=' + userInfo.gender" open-type="navigate">
				<view class="cu-avatar round lg" :style="{backgroundImage:'url('+ userInfo.icon + ')'}"></view>
				<view class="content">
					<view class="flex justify-between">
						<text class="text-grey" :class=[fonttitle]>{{userInfo.name}}</text>
					</view>
					<view class="flex text-gray" :class=[fontcontent]>
						<view class="margin-right-xs">积分：{{userInfo.body ? userInfo.body.creditShowList[0].data : 0}}</view>
						<view class="margin-right-xs">金币：{{userInfo.body ? userInfo.body.creditShowList[1].data : 0}}</view>
					</view>
					<view class="text-gray" :class=[fontcontent]>
						<view class="text-orange">{{userInfo.userTitle}}</view>
					</view>
				</view>
			</navigator>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/ziliao/ziliao" open-type="navigate">
					<text class="cuIcon-infofill text-mauve"></text>
					<text class="text-grey" :class=[fonttitle]>我的资料</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/xiangce/xiangce" open-type="navigate">
					<text class="cuIcon-picfill text-olive"></text>
					<text class="text-grey" :class=[fonttitle]>我的相册</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/haoyou/haoyou" open-type="navigate">
					<text class="cuIcon-friendfill text-blue"></text>
					<text class="text-grey" :class=[fonttitle]>我的好友</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/guanzhu/guanzhu" open-type="navigate">
					<text class="cuIcon-favorfill text-pink"></text>
					<text class="text-grey" :class=[fonttitle]>我的关注</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/fensi/fensi" open-type="navigate">
					<text class="cuIcon-likefill text-orange"></text>
					<text class="text-grey" :class=[fonttitle]>我的粉丝</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/fabiao/fabiao" open-type="navigate">
					<text class="cuIcon-roundaddfill text-green"></text>
					<text class="text-grey" :class=[fonttitle]>我的发表</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/huifu/huifu" open-type="navigate">
					<text class="cuIcon-notificationfill text-purple"></text>
					<text class="text-grey" :class=[fonttitle]>我的回复</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/shoucang/shoucang" open-type="navigate">
					<text class="cuIcon-shopfill text-brown"></text>
					<text class="text-grey" :class=[fonttitle]>我的收藏</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/self/pwd/pwd" open-type="navigate">
					<text class="cuIcon-writefill text-cyan"></text>
					<text class="text-grey" :class=[fonttitle]>修改密码</text>
				</navigator>
			</view>
			<view class="cu-item">
				<view @click="logout" class="content">
					<text class="cuIcon-forwardfill text-grey"></text>
					<text class="text-grey" :class=[fonttitle]>注销</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				fontsize: 'normal'
			}
		},
		methods: {
			logout: function() {
				this.$tool.confirm('确定要注销吗？', () => {
					uni.removeStorageSync('user')
					getApp().globalData.user = {}
					this.$tool.clearHeart()
					uni.$emit('logout')
					uni.navigateBack({

					})
				})
			},
			loadUserInfo: async function() {
				const user = getApp().globalData.user
				this.userInfo = await this.$tool.getData({
					r: this.$api.userinfo,
					userId: user.uid
				})
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
		created: async function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			uni.setNavigationBarTitle({
				title: '我的主页'
			})
			await this.loadUserInfo()
		},
		onReady: async function() {
			uni.$on('updateuser', async () => {
				await this.loadUserInfo()
			})
		}
	}
</script>

<style>

</style>
