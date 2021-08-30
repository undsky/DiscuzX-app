<template>
	<scroll-view class="page" scroll-y="true" @scrolltoupper="reload" @scrolltolower="loadMore">
		<view v-if="users.length > 0" class="cu-list menu-avatar">
			<item-user v-for="item in users" :key="item.uid" :uid="item.uid" :nickname="item.nickname" :icon="item.icon" :gender="item.gender"
			 :location="item.location"></item-user>
		</view>
		<empty v-else />
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				location: {},
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
						r: this.$api.round,
						longitude: this.location.longitude,
						latitude: this.location.latitude,
						poi: 'user',
						page: this.page
					})
					this.users = data && data.pois ? data.pois : []
					this.allowLoad = true
				}
			},
			loadMore: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false
					this.page++
					let data = await this.$tool.getData({
						r: this.$api.round,
						longitude: this.location.longitude,
						latitude: this.location.latitude,
						poi: 'user',
						page: this.page
					})
					if (data && data.pois) {
						this.users.push(...data.pois)
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
				title: '周边用户'
			})

			this.location = getApp().globalData.location || {};
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
