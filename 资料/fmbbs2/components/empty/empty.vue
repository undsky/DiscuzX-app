<template>
	<view class="empty flex">
		<image src="../../static/404.png"></image>
		<text class="info" :class=[fonttitle]>暂无结果</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
		}
	};
</script>

<style>
	.empty {
		padding-top: 45px;
		flex-direction: column;
		align-items: center;
	}

	.empty>image {
		width: 128px;
		height: 128px;
	}

	.empty .info {
		color: #cdcdcd;
	}
</style>
