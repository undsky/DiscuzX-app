<template>
	<view class="cu-list grid col-4 no-border share">
		<view @click="shareWechat" class="cu-item share-item">
			<image src="/static/share/wechat.png"></image>
			<text :class=[fontcontent]>微信</text>
		</view>
		<view @click="shareFriend" class="cu-item share-item">
			<image src="/static/share/friend.png"></image>
			<text :class=[fontcontent]>朋友圈</text>
		</view>
		<view @click="shareQQ" class="cu-item share-item">
			<image src="/static/share/qq.png"></image>
			<text :class=[fontcontent]>QQ</text>
		</view>
		<view @click="shareWeibo" class="cu-item share-item">
			<image src="/static/share/weibo.png"></image>
			<text :class=[fontcontent]>微博</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['title', 'href', 'summary'],
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
		},
		methods: {
			shareUrl: function(provider, scene) {
				console.log(this.title)
				uni.share({
					provider: provider,
					type: 'qq' == provider ? 1 : 0,
					title: this.title || '食品论坛',
					summary: this.title || '食品论坛，食品行业社区，关注食品安全、食品技术、食品质量、检测技术等',
					href: this.href || 'http://app.foodmate.net/download?id=7',
					imageUrl: 'https://app.foodmate.net/update/bbs/logo.png',
					scene: scene || '',
					success: res => {},
					fail: err => {
						console.log(err)
					},
					complete: () => {}
				});
			},
			shareWechat: function() {
				this.shareUrl('weixin', 'WXSceneSession')
			},
			shareFriend: function() {
				this.shareUrl('weixin', 'WXSenceTimeline')
			},
			shareQQ: function() {
				this.shareUrl('qq')
			},
			shareWeibo: function() {
				this.shareUrl('sinaweibo')
			}
		}
	}
</script>

<style scoped>
	.share .share-item {
		justify-content: center;
		align-items: center;
	}

	.share .share-item image {
		width: 27px;
		height: 27px;
	}
</style>
