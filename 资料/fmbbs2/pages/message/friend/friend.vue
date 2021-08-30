<template>
	<scroll-view class="page" scroll-y="true" @scrolltoupper="reload" @scrolltolower="loadMore">
		<view v-if="users.length > 0" class="cu-list menu-avatar">
			<item-user v-for="item in users" :key="item.dateline" :uid="item.authorId" :nickname="item.author" :icon="item.authorAvatar"
			 :note="item.note"></item-user>
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
				page: 1
			};
		},
		methods: {
			reload: async function() {
				if (this.allowLoad) {
					this.allowLoad = false;
					this.page = 1;
					let data = await this.$tool.getData({
						r: this.$api.notifylist,
						type: 'friend',
						page: this.page
					});
					this.users = data && data.body.data ? data.body.data : [];
					this.allowLoad = true;
				}
			},
			loadMore: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false;
					this.page++;
					let data = await this.$tool.getData({
						r: this.$api.notifylist,
						type: 'friend',
						page: this.page
					});
					if (data && data.body.data) {
						this.users.push(...data.body.data);
						this.hasMore = data.body.data.length == this.$config.pageSize;
					} else {
						this.hasMore = false;
					}
					this.allowLoad = true;
				}
			}
		},
		created: function() {
			uni.setNavigationBarTitle({
				title: '好友'
			});
			this.reload();
		}
	};
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
