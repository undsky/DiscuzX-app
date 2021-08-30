<template>
	<view>
		<scroll-view v-if="classificationType_list.length > 0" scroll-x class="bg-white nav" scroll-with-animation
		 :scroll-left="scrollLeft">
			<view class="cu-item" :class="[index == TabCur ? 'text-green cur' : '',fonttitle]" v-for="(item, index) in classificationType_list"
			 :key="item.classificationType_id" @tap="tabSelect" :data-index="index" :data-id="item.classificationType_id">
				{{ item.classificationType_name }}
			</view>
		</scroll-view>
		<!-- <scroll-view v-show="classificationType_id == item.classificationType_id" :class="{ page: classificationType_list.length > 0 }"
		 v-for="item in classificationType_list" :key="item.classificationType_id" scroll-y="true">
			{{ item.classificationType_name }}
		</scroll-view> -->
		<scroll-view refresher-enabled @refresherrefresh="reloadTopic" :refresher-triggered="reloadTriggered" :scroll-top="scrollTop"
		 @scroll="scroll" scroll-y="true" :class="[classificationType_list.length > 0 ? 'page' : 'page-full']" @scrolltolower="loadMoreTopic">
			<view v-if="topics.length > 0" class="cu-list menu-avatar">
				<item-topic v-for="item in topics" :key="item.topic_id" :board_name="item.board_name" :topic_id="item.topic_id"
				 :user_nick_name="item.user_nick_name" :replies="item.replies" :hits="item.hits" :last_reply_date="item.last_reply_date"
				 :userAvatar="item.userAvatar" :title="item.title" :subject="item.subject"></item-topic>
			</view>
			<empty v-else />
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				board_id: 0,
				TabCur: 0,
				scrollLeft: 0,
				classificationType_list: [],
				classificationType_id: 0,
				topics: [],
				allowLoadTopic: true,
				hasMoreTopic: true,
				pageTopic: 1,
				fontsize: 'normal',
				reloadTriggered: false,
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
		onNavigationBarButtonTap: function(button) {
			if (0 == button.index) {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			} else if (1 == button.index) {
				uni.navigateTo({
					url: '/pages/pub/pub?board_id=' + this.board_id
				});
			}
		},
		methods: {
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop;
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop;
				this.$nextTick(function() {
					this.scrollTop = 0;
				});
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.index;
				this.scrollLeft = (e.currentTarget.dataset.index - 1) * 60;
				this.classificationType_id = e.currentTarget.dataset.id;
				if (0 == this.old.scrollTop) {
					this.reloadTopic();
				} else {
					this.goTop();
				}
			},
			reloadTopic: async function() {
				if (this.old.scrollTop > 45) {
					this.reloadTriggered = false
					return
				}
				if (this.allowLoadTopic) {
					this.allowLoadTopic = false;
					this.pageTopic = 1;
					this.reloadTriggered = true
					this.$tool.loading()
					let data = await this.$tool.getData({
						r: this.$api.topiclist,
						boardId: this.board_id,
						filterType: 'typeid',
						filterId: this.classificationType_id,
						page: this.pageTopic
					});
					this.topics = data && data.list ? data.list : [];
					setTimeout(() => {
						this.reloadTriggered = false
						this.$tool.loaded()
					}, 500)
					this.allowLoadTopic = true;
				}
			},
			loadMoreTopic: async function() {
				if (this.allowLoadTopic && this.hasMoreTopic) {
					this.allowLoadTopic = false;
					this.pageTopic++;
					let data = await this.$tool.getData({
						r: this.$api.topiclist,
						boardId: this.board_id,
						filterType: 'typeid',
						filterId: this.classificationType_id,
						page: this.pageTopic
					});
					if (data && data.list) {
						this.topics.push(...data.list);
						this.hasMoreTopic = data.list.length == this.$config.pageSize;
					} else {
						this.hasMoreTopic = false;
					}
					this.allowLoadTopic = true;
				}
			}
		},
		onLoad: async function(options) {
			uni.setNavigationBarTitle({
				title: options.board_name
			});

			uni.$on('refresh', () => {
				this.reloadTopic()
			})

			this.board_id = options.board_id;
			const data = await this.$tool.getData({
				r: this.$api.topiclist,
				boardId: this.board_id,
				page: 1
			});
			if (data.classificationType_list && data.classificationType_list.length > 0) {
				data.classificationType_list.unshift({
					classificationType_id: 0,
					classificationType_name: '全部'
				});
				this.classificationType_list = data.classificationType_list;
			}
			this.topics = data && data.list ? data.list : [];
		}
	};
</script>

<style>
	.nav .cu-item {
		height: 45px !important;
		line-height: 45px !important;
	}

	.page {
		/* #ifdef H5 */
		height: calc(100vh - 45px - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: calc(100vh - 45px);
		/* #endif */
	}

	.page-full {
		height: 100vh;
	}
</style>
