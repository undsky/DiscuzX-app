<template>
	<!-- <gesture @slideLeft="slideLeft" @slideRight="slideRight"> -->
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="[index == TabCur ? 'text-green cur' : '',fonttitle]" v-for="(item, index) in tabs"
				 :key="index" @tap="tabSelect" :data-id="index">
					{{ item }}
				</view>
			</view>
		</scroll-view>
		<scroll-view v-show="0 == TabCur" class="page" scroll-y="true" refresher-enabled @refresherrefresh="reloadTopic"
		 :refresher-triggered="reloadTopicTriggered" @scrolltolower="loadMoreTopic" @scroll="topicScroll">
			<view v-if="topics.length > 0" class="cu-list menu-avatar">
				<item-topic v-for="item in topics" :key="item.topic_id" :board_name="item.board_name" :topic_id="item.topic_id"
				 :user_nick_name="item.user_nick_name" :replies="item.replies" :hits="item.hits" :last_reply_date="item.last_reply_date"
				 :userAvatar="item.userAvatar" :title="item.title" :subject="item.subject"></item-topic>
			</view>
			<empty v-else />
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<scroll-view v-show="1 == TabCur" class="page" scroll-y="true" refresher-enabled @refresherrefresh="reloadReply"
		 :refresher-triggered="reloadReplyTriggered" @scrolltolower="loadMoreReply" @scroll="replyScroll">
			<view v-if="replys.length > 0" class="cu-list menu-avatar">
				<item-topic v-for="item in replys" :key="item.topic_id" :board_name="item.board_name" :topic_id="item.topic_id"
				 :user_nick_name="item.user_nick_name" :replies="item.replies" :hits="item.hits" :last_reply_date="item.last_reply_date"
				 :userAvatar="item.userAvatar" :title="item.title" :subject="item.subject"></item-topic>
			</view>
			<empty v-else />
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
	<!-- </gesture> -->
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['最新主题', '最新回复'],
				TabCur: 0,
				// scrollLeft: 0,
				topics: [],
				allowLoadTopic: true,
				hasMoreTopic: true,
				pageTopic: 1,
				replys: [],
				allowLoadReply: true,
				hasMoreReply: true,
				pageReply: 1,
				reloadTopicTriggered: false,
				reloadReplyTriggered: false,
				topicScrollTop: 0,
				relyScrollTop: 0,
				fontsize: 'normal'
			};
		},
		methods: {
			topicScroll(e) {
				this.topicScrollTop = e.detail.scrollTop
			},
			replyScroll(e) {
				this.relyScrollTop = e.detail.scrollTop
			},
			slideLeft: function() {
				if (this.TabCur == 0) {
					this.TabCur = 1
					if (0 == this.replys.length) {
						this.reloadReply()
					}
				}
			},
			slideRight: function() {
				if (this.TabCur == 1) {
					this.TabCur = 0
				}
			},
			tabSelect: function(e) {
				this.TabCur = e.currentTarget.dataset.id;
				// this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				if (1 == this.TabCur && 0 == this.replys.length) {
					this.reloadReply();
				}
			},
			reloadTopic: async function() {
				if (this.topicScrollTop > 45) {
					this.reloadTopicTriggered = false
					return
				}
				if (this.allowLoadTopic) {
					this.allowLoadTopic = false;
					this.pageTopic = 1;
					this.reloadTopicTriggered = true
					this.$tool.loading()
					let data = await this.$tool.getData({
						r: this.$api.topiclist,
						sortby: 'new',
						boardId: 0,
						filterType: 'typeid',
						filterId: 0,
						page: this.pageTopic
					}, 'get', true);
					this.topics = []
					setTimeout(() => {
						if (data && data.list)
							this.topics = JSON.parse(JSON.stringify(data.list))
						setTimeout(() => {
							this.reloadTopicTriggered = false
							this.$tool.loaded()
						}, 500)
						this.allowLoadTopic = true;
					}, 500)
				}
			},
			reloadReply: async function() {
				if (this.relyScrollTop > 45) {
					this.reloadReplyTriggered = false
					return
				}
				if (this.allowLoadReply) {
					this.allowLoadReply = false;
					this.pageReply = 1;
					this.reloadReplyTriggered = true
					let data = await this.$tool.getData({
						r: this.$api.topiclist,
						sortby: 'all',
						boardId: 0,
						filterType: 'typeid',
						filterId: 0,
						page: this.pageReply
					});
					this.reloadReplyTriggered = false
					this.replys = data && data.list ? data.list : [];
					this.allowLoadReply = true;
				}
			},
			loadMoreTopic: async function() {
				if (this.allowLoadTopic && this.hasMoreTopic) {
					this.allowLoadTopic = false;
					this.pageTopic++;
					let data = await this.$tool.getData({
						r: this.$api.topiclist,
						sortby: 'new',
						boardId: 0,
						filterType: 'typeid',
						filterId: 0,
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
			},
			loadMoreReply: async function() {
				if (this.allowLoadReply && this.hasMoreReply) {
					this.allowLoadReply = false;
					this.pageReply++;
					let data = await this.$tool.getData({
						r: this.$api.topiclist,
						sortby: 'all',
						boardId: 0,
						filterType: 'typeid',
						filterId: 0,
						page: this.pageReply
					});
					if (data && data.list) {
						this.replys.push(...data.list);
						this.hasMoreReply = data.list.length == this.$config.pageSize;
					} else {
						this.hasMoreReply = false;
					}
					this.allowLoadReply = true;
				}
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
		created: async function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			await this.reloadTopic();
			uni.$on('refresh', async () => {
				if (0 == this.TabCur) {
					await this.reloadTopic();
				} else {
					await this.reloadReply()
				}
			})
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
</style>
