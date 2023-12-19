<template>
	<view>
		<u-tabs-swiper v-if="tabList.length > 0" ref="tabs" :list="tabList" name="classificationType_name"
			:current="tabIndex" @change="tabChange">
		</u-tabs-swiper>
		<div v-if="classified && classified.length > 0" class="padding-lr-sm padding-top-sm">
			<scroll-view class="margin-bottom-sm" v-for="(item,index) in classified" :key="index" scroll-x>
				<text>{{item.classifiedTitle}}:</text>
				<block v-if="item.classifiedRules && item.classifiedRules.choices">
					<button v-for="(btnItem,btnIndex) in item.classifiedRules.choices" :key="btnItem.value"
						class="cu-btn sm margin-left-sm">{{btnItem.name}}</button>
				</block>
			</scroll-view>
		</div>
		<swiper class="swiper" :current="currentIndex" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
				<dx-post-paging :params="{
					r:'forum/topiclist',
					boardId : board_id,
					filterType: 'typeid',
					filterId: item.classificationType_id,
					isImageList:3
				}" :tabIndex="tabIndex" :currentIndex="currentIndex"></dx-post-paging>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				board_id: 0,
				tabList: [],
				tabIndex: 0,
				currentIndex: 0,
				classified: []
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
		},
		onLoad: async function(options) {
			this.board_id = options.board_id
			const result = await this.$http.get({
				r: 'forum/topiclist',
				boardId: this.board_id,
				page: 1
			}, {
				custom: {
					auth: false
				}
			})
			uni.setNavigationBarTitle({
				title: result.forumInfo.title
			});
			let _tabList = [{
				classificationType_id: 0,
				classificationType_name: '全部'
			}]
			if (result.classificationType_list && result.classificationType_list.length > 0) {
				_tabList.push(...result.classificationType_list)
			}
			this.tabList = _tabList;

			// TODO 根据分类信息查询
			// if (result.classificationTop_list && result.classificationTop_list.length > 0) {
			// 	const classificationTop_info = await this.$http.get({
			// 		r: 'forum/classification',
			// 		sortid: result.classificationTop_list[0].classificationTop_id
			// 	})
			// 	if (classificationTop_info && classificationTop_info.body) {
			// 		this.classified = classificationTop_info.body.classified
			// 	}
			// }
		}
	}
</script>

<style scoped>
	.swiper {
		height: calc(100vh - 80rpx - var(--status-bar-height));
	}
</style>