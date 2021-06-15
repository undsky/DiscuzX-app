<template>
	<view>
		<u-tabs-swiper ref="tabs" :list="tabList" :current="tabIndex" @change="tabChange"></u-tabs-swiper>
		<swiper class="swiper" :current="currentIndex" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
				<dx-post-paging :params="params" :tabs="tabList" :tabKey="'classificationType_id'" :tabIndex="tabIndex"
					:currentIndex="currentIndex"></dx-post-paging>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {},
				tabList: [],
				tabIndex: 0,
				currentIndex: 0
			}
		},
		methods: {
			tabChange(index) {
				this.currentIndex = index
			},
			transition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.tabIndex = current;
			},
		}
	}
</script>

<style scoped>
	.swiper {
		height: calc(100vh - 80rpx - var(--status-bar-height));
	}
</style>
