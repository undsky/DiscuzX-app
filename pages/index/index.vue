<template>
	<view>
		<dx-navbar title="首页"></dx-navbar>
		<u-tabs-swiper ref="tabs" :list="tabList" :is-scroll="false" :current="tabIndex" @change="tabChange">
		</u-tabs-swiper>
		<swiper class="swiper" :current="currentIndex" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
				<dx-post-paging :params="{
						r: 'forum/topiclist',
						boardId: 0,
						filterType: 'typeid',
						filterId: 0,
						sortby: item.sortby,
						isImageList:3
					}" :tabIndex="tabIndex" :currentIndex="currentIndex"></dx-post-paging>
			</swiper-item>
		</swiper>
		<dx-tabbar :currentTab="0"></dx-tabbar>
		<u-modal v-model="show" @cancel="cancel" @confirm="confirm" show-cancel-button confirm-text="同意并继续"
			cancel-text="不同意" title="服务协议和隐私政策">
			<view class="slot-content padding text-gray">
				欢迎使用本APP。我们非常重视您的个人信息和隐私保护，在您使用服务之前，请您务必审慎阅读<text class="text-blue"
					@click="navTo('https://www.undsky.com')">《用户协议》</text>和<text class="text-blue"
					@click="navTo('https://www.undsky.com')">《隐私政策》</text>，并充分理解所有条款内容。我们将严格按照您同意的各项条款使用您的个人信息，以便更好的为您提供服务。
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				tabList: [{
						name: '全部',
						sortby: 'all'
					}, {
						name: '最新',
						sortby: 'new'
					},
					{
						name: '精华',
						sortby: 'marrow'
					},
					{
						name: '置顶',
						sortby: 'top'
					},
					// {
					// 	name: '图文',
					// 	sortby: 'photo'
					// }
				],
				tabIndex: 0,
				currentIndex: 0
			};
		},
		methods: {
			cancel() {
				plus.os.name == "Android" ? plus.runtime.quit() : plus.ios.import("UIApplication").sharedApplication()
					.performSelector("exit");
			},
			confirm() {
				uni.setStorageSync("agree", true)
			},
			navTo(url) {
				uni.navigateTo({
					url: '/pages/wv/wv?url=' + encodeURIComponent(url)
				});
			},
			tabChange(index) {
				this.currentIndex = index;
			},
			transition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.tabIndex = current;
			}
		},
		onLoad: function() {
			// #ifdef APP
			const agree = uni.getStorageSync("agree");
			if (!agree) {
				this.show = true;
			}
			// #endif
		}
	};
</script>

<style scoped>
	.swiper {
		height: calc(100vh - 158px - var(--status-bar-height));
	}
</style>