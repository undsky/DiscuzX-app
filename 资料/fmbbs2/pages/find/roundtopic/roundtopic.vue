<template>
	<scroll-view class="page" scroll-y="true" @scrolltoupper="reloadTopic" @scrolltolower="loadMoreTopic">
		<view v-if="topics.length > 0" class="cu-list menu-avatar">
			<item-topic v-for="item in topics" :key="item.topic_id" :board_name="item.board_name" :topic_id="item.topic_id"
			 :user_nick_name="item.user_nick_name" :replies="item.replies" :hits="item.hits" :last_reply_date="item.last_reply_date"
			 :userAvatar="item.userAvatar" :title="item.title" :subject="item.subject"></item-topic>
		</view>
		<empty v-else />
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				location: {},
				topics: [],
				allowLoad: true,
				hasMore: true,
				page: 1,
			}
		},
		methods: {
			reloadTopic: async function() {
				if (this.allowLoad) {
					this.allowLoad = false
					this.page = 1
					let data = await this.$tool.getData({
						r: this.$api.round,
						longitude: this.location.longitude,
						latitude: this.location.latitude,
						poi: 'topic',
						page: this.page
					})
					this.topics = data && data.pois ? data.pois : []
					this.allowLoad = true
				}
			},
			loadMoreTopic: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false
					this.page++
					let data = await this.$tool.getData({
						r: this.$api.round,
						longitude: this.location.longitude,
						latitude: this.location.latitude,
						poi: 'topic',
						page: this.page
					})
					if (data && data.pois) {
						this.topics.push(...data.pois)
						this.hasMore = data.pois.length == this.$config.pageSize
					} else {
						this.hasMore = false
					}
					this.allowLoad = true
				}
			}
		},
		created: function() {
			uni.setNavigationBarTitle({
				title: '周边帖子'
			})

			this.location = getApp().globalData.location || {};
		},
		onLoad: function() {
			this.reloadTopic()
			uni.$on('refresh', () => {
				this.reloadTopic()
			})
		}
	}
</script>

<style>
	.page {
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
	}
</style>
