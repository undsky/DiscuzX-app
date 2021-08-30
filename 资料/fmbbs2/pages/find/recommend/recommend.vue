<template>
	<scroll-view class="page" scroll-y="true" @scrolltoupper="reload" @scrolltolower="loadMore">
		<view v-if="users.length > 0" class="cu-list menu-avatar">
			<item-user v-for="item in users" :key="item.uid" :uid="item.uid" :nickname="item.name" :icon="item.icon" :gender="item.gender"
			 :lastLogin="item.lastLogin"></item-user>
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
			}
		},
		methods: {
			reload: async function() {
				if (this.allowLoad) {
					this.allowLoad = false
					this.page = 1
					let data = await this.$tool.getData({
						r: this.$api.userlist,
						type: 'recommend',
						page: this.page
					})
					this.users = data && data.list ? data.list : []
					this.allowLoad = true
				}
			},
			loadMore: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false
					this.page++
					let data = await this.$tool.getData({
						r: this.$api.userlist,
						type: 'recommend',
						page: this.page
					})
					if (data && data.list) {
						this.users.push(...data.list)
						this.hasMore = data.list.length == this.$config.pageSize
					} else {
						this.hasMore = false
					}
					this.allowLoad = true
				}
			}
		},
		created: function() {
			uni.setNavigationBarTitle({
				title: '推荐用户'
			})
			this.reload()
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
