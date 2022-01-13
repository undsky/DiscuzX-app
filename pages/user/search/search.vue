<template>
	<view>
		<view class="padding"><u-search placeholder="请输入关键字" v-model="keyword" focus @search="search" @custom="search"></u-search></view>
		<view class="wrapper"><dx-user-paging auth :params="params" reload></dx-user-paging></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			params: {}
		};
	},
	methods: {
		search: async function(value) {
			this.params = {
				r: 'user/userlist',
				type: 'all',
				orderBy: 'search',
				kw: this.keyword
			};
		}
	}
};
</script>

<style scoped>
.wrapper {
	height: calc(100vh - 94rpx - var(--status-bar-height));
}
</style>
