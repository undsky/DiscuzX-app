<template>
	<view>
		<u-grid :col="4">
			<u-grid-item @click="share('weixin', 'WXSceneSession')">
				<u-icon name="weixin-fill" color="#3FCF00" :size="46"></u-icon>
				<view class="grid-text">微信</view>
			</u-grid-item>
			<u-grid-item @click="share('weixin', 'WXSenceTimeline')">
				<u-icon name="moments" color="#40B4B2" :size="46"></u-icon>
				<view class="grid-text">朋友圈</view>
			</u-grid-item>
			<u-grid-item @click="share('qq')">
				<u-icon name="qq-fill" color="#66B8EF" :size="46"></u-icon>
				<view class="grid-text">QQ</view>
			</u-grid-item>
			<u-grid-item @click="share('sinaweibo')">
				<u-icon name="weibo" color="#E12202" :size="46"></u-icon>
				<view class="grid-text">微博</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
	export default {
		name: "dx-share",
		props: {
			title: String,
			summary: String,
			href: String
		},
		data() {
			return {

			};
		},
		methods: {
			share(provider, scene) {
				uni.share({
					provider,
					type: 'qq' == provider ? 1 : 0,
					scene: scene,
					title: this.title || 'DiscuzX',
					summary: this.summary || 'DiscuzX',
					href: this.href || 'https://www.undsky.com',
					imageUrl: 'https://www.undsky.com/public/img/logo.png',
					success: res => {},
					fail: err => {
						console.log(err)
					},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>

</style>
