<template>
	<scroll-view class="page" scroll-y="true" @scrolltoupper="reload" @scrolltolower="loadMore">
		<view v-if="users.length > 0" class="cu-card dynamic">
			<item-message v-for="item in users" :key="item.reply_remind_id" :reply_remind_id="item.reply_remind_id" :icon="item.icon"
			 :reply_nick_name="item.reply_nick_name" :replied_date="item.replied_date" :topic_subject="item.topic_subject"
			 :topic_content="item.topic_content" :reply_content="item.reply_content" :topic_id="item.topic_id" :board_id="item.board_id"></item-message>
		</view>
		<empty v-else />
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				users: [],
				allowLoad: true,
				hasMore: true,
				page: 1,
				fontsize: 'normal'
			};
		},
		methods: {
			reload: async function() {
				if (this.allowLoad) {
					this.allowLoad = false;
					this.page = 1;
					let data = await this.$tool.getData({
						r: this.$api.notifylist,
						type: 'at',
						page: this.page
					});
					this.users = data && data.list ? data.list : [];
					this.allowLoad = true;
				}
			},
			loadMore: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false;
					this.page++;
					let data = await this.$tool.getData({
						r: this.$api.notifylist,
						type: 'at',
						page: this.page
					});
					if (data && data.list) {
						this.users.push(...data.list);
						this.hasMore = data.list.length == this.$config.pageSize;
					} else {
						this.hasMore = false;
					}
					this.allowLoad = true;
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
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			uni.setNavigationBarTitle({
				title: '提到我的'
			});
			this.reload();
			uni.$on('refresh', () => {
				this.reload()
			})
		}
	};
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
