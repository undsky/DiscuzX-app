<template>
	<view>
		<view class="padding">
			<u-search placeholder="请输入搜索帖子" v-model="keyword" focus @search="search"></u-search>
		</view>
		<view class="wrapper">
			<dx-post-paging :params="params"></dx-post-paging>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				params: {}
			}
		},
		methods: {
			search: async function() {
				this.params = this.$u.deepMerge(this.params, {
					keyword: this.keyword
				})
			}
		}
	}
</script>

<style scoped>
	.wrapper {
		height: calc(100vh - 94rpx - var(--status-bar-height));
	}
</style>
