<template>
	<view>
		<uni-search-bar @confirm="search" placeholder="请输入搜索用户" />
		<scroll-view class="page" scroll-y="true" @scrolltoupper="reload" @scrolltolower="loadMore">
			<view v-if="users.length > 0" class="cu-list menu-avatar">
				<item-user v-for="item in users" :key="item.uid" :uid="item.uid" :nickname="item.name" :icon="item.icon" :gender="item.gender"
				 :lastLogin="item.lastLogin"></item-user>
			</view>
			<empty v-else />
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				kw: '',
				users: [],
				allowLoad: true,
				hasMore: true,
				page: 1
			}
		},
		methods: {
			search: function(e) {
				this.kw = e.value
				if (this.kw) {
					this.reload()
				} else {
					this.$tool.modal('请输入搜索用户')
				}
			},
			reload: async function() {
				if (this.allowLoad) {
					this.allowLoad = false
					this.page = 1
					const data = await this.$tool.getData({
						r: this.$api.userlist,
						type: 'all',
						orderBy: 'search',
						kw: this.kw,
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
					const data = await this.$tool.getData({
						r: this.$api.userlist,
						type: 'all',
						orderBy: 'search',
						kw: this.kw,
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
				title: '搜索用户'
			})
			// this.reload()
		}
	}
</script>

<style>
	.page {
		/* #ifdef H5 */
		height: calc(100vh - 52px - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: calc(100vh - 52px);
		/* #endif */
	}
</style>
