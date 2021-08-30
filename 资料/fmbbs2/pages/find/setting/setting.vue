<template>
	<view class="cu-list menu">
		<view class="cu-form-group cu-item">
			<view class="content">
				<text class="cuIcon-noticefill text-green"></text>
				<text class="text-grey" :class=[fonttitle]>允许访问位置</text>
			</view>
			<switch @change="location" :class="{checked : openLocation}" :checked="openLocation?true:false"></switch>
		</view>
		<view class="cu-form-group cu-item">
			<view class="content">
				<text class="cuIcon-noticefill text-orange"></text>
				<text class="text-grey" :class=[fonttitle]>消息通知</text>
			</view>
			<switch @change="notice" :class="{checked : openNotice}" :checked="openNotice?true:false"></switch>
		</view>
		<mc-item icon="cuIcon-font" iconColor="grey" color="grey" :size="fontsize" text="字体大小">
			<mc-action type="radio" :radioClass="['green']" :radios="fontsizes" @change="radioChange"></mc-action>
		</mc-item>
		<view class="cu-item arrow">
			<view @click="openShare" class="content">
				<text class="cuIcon-forwardfill text-pink"></text>
				<text class="text-grey" :class=[fonttitle]>分享</text>
			</view>
		</view>
		<view class="cu-item arrow">
			<navigator class="content" hover-class="none" url="/pages/find/setting/feedback/feedback" open-type="navigate">
				<text class="cuIcon-questionfill text-blue"></text>
				<text class="text-grey" :class=[fonttitle]>意见反馈</text>
			</navigator>
		</view>
		<view @click="xieyi" class="cu-item arrow margin-top">
			<view class="content">
				<text class="cuIcon-infofill text-grey"></text>
				<text class="text-grey" :class=[fonttitle]>用户协议</text>
			</view>
		</view>
		<view @click="shengming" class="cu-item arrow">
			<view class="content">
				<text class="cuIcon-infofill text-grey"></text>
				<text class="text-grey" :class=[fonttitle]>版权声明</text>
			</view>
		</view>
		<view @click="yinsi" class="cu-item arrow">
			<view class="content">
				<text class="cuIcon-infofill text-grey"></text>
				<text class="text-grey" :class=[fonttitle]>隐私政策</text>
			</view>
		</view>
		<uni-popup ref="share" type="bottom">
			<share></share>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showShare: false,
				openNotice: true,
				openLocation: true,
				fontsizes: [{
						value: 'normal',
						text: '正常',
						checked: true
					},
					{
						value: 'lg',
						text: '大',
						checked: false
					}
				],
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
			radioChange(e) {
				uni.setStorage({
					key: 'fontsize',
					data: e
				})
				this.fontsize = e
				getApp().globalData.fontsize = e
				this.fontsizeChange()
				uni.$emit('fontsize')
			},
			notice: function(e) {
				this.openNotice = e.detail.value
				uni.setStorage({
					key: 'notice',
					data: this.openNotice
				})
				if (this.openNotice) {
					this.$tool.heart()
				}
			},
			location: function(e) {
				this.openLocation = e.detail.value
				uni.setStorage({
					key: 'location',
					data: this.openLocation
				})
				if (!this.openLocation) {
					getApp().globalData.location = {}
				}
			},
			openShare: function(e) {
				this.toggleShare()
			},
			toggleShare: function(close) {
				if (this.showShare) {
					this.$refs.share.close();
					this.showShare = false;
				} else if (!close) {
					this.$refs.share.open();
					this.showShare = true
				}
			},
			xieyi: function() {
				uni.navigateTo({
					url: '/pages/wv/wv?title=用户协议&url=' + encodeURIComponent('https://app.foodmate.net/update/bbs/license.html')
				});
			},
			shengming: function() {
				uni.navigateTo({
					url: '/pages/wv/wv?title=版权声明&url=' + encodeURIComponent('http://bbs.foodmate.net/shengming/')
				});
			},
			yinsi: function() {
				uni.navigateTo({
					url: '/pages/wv/wv?title=隐私政策&url=' + encodeURIComponent('http://bbs.foodmate.net/yinsi.html')
				});
			},
			fontsizeChange() {
				const _fontsizes = JSON.parse(JSON.stringify(this.fontsizes))
				_fontsizes[0].checked = 'lg' != this.fontsize
				_fontsizes[1].checked = 'lg' == this.fontsize
				this.fontsizes = _fontsizes
			}
		},
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.setNavigationBarTitle({
				title: '设置'
			})
			uni.getStorage({
				key: 'notice',
				success: (res) => {
					this.openNotice = res.data
				}
			})
			uni.getStorage({
				key: 'location',
				success: (res) => {
					this.openLocation = res.data
				}
			})
			uni.getStorage({
				key: 'fontsize',
				success: res => {
					this.fontsize = res.data || 'normal'
					this.fontsizeChange()
				}
			})
		}
	}
</script>

<style>

</style>
