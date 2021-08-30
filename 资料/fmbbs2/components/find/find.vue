<template>
	<view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/self/self' : '/pages/login/login'" open-type="navigate">
					<text v-if="!uid" class="cuIcon-peoplefill text-purple"></text>
					<image v-if="uid" class="cu-avatar sm round" :src="user.avatar" mode="widthFix"></image>
					<text class="text-grey" :class=[fonttitle]>{{uid ? user.userName : '个人主页'}}</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/find/rounduser/rounduser' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-friendfill text-yellow"></text>
					<text class="text-grey" :class=[fonttitle]>周边用户</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/find/roundtopic/roundtopic' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-locationfill text-blue"></text>
					<text class="text-grey" :class=[fonttitle]>周边帖子</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/find/recommend/recommend' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-appreciatefill text-red"></text>
					<text class="text-grey" :class=[fonttitle]>推荐用户</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" :url="uid ? '/pages/find/searchuser/searchuser' : '/pages/login/login'"
				 open-type="navigate">
					<text class="cuIcon-explorefill text-green"></text>
					<text class="text-grey" :class=[fonttitle]>搜索用户</text>
				</navigator>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="/pages/find/setting/setting" open-type="navigate">
					<text class="cuIcon-settingsfill text-grey"></text>
					<text class="text-grey" :class=[fonttitle]>设置</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {},
				uid: null,
				fontsize: 'normal'
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
		methods: {

		},
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			this.user = getApp().globalData.user
			this.uid = this.user.uid
			uni.$on('login', data => {
				this.user = getApp().globalData.user
				this.uid = this.user.uid
			})
			uni.$on('logout', data => {
				this.user = {}
				this.uid = null
			})
		}
	}
</script>

<style>

</style>
