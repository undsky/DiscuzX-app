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
						sortby: item.sortby
					}" :tabIndex="tabIndex" :currentIndex="currentIndex"></dx-post-paging>
			</swiper-item>
		</swiper>
		<dx-tabbar :currentTab="0"></dx-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
		}
	};
</script>

<style scoped>
	.swiper {
		height: calc(100vh - 158px - var(--status-bar-height));
	}
</style>
