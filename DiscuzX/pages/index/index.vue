<template>
	<view>
		<dx-navbar title="首页"></dx-navbar>
		<dx-tabbar :currentTab="0"></dx-tabbar>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {},
	onLoad: async function(options) {
		const res = await this.$http.get({
			custom: {
				auth: false
			},
			params: {
				r: 'forum/topiclist',
				sortby: 'new',
				boardId: 0,
				filterType: 'typeid',
				filterId: 0,
				page: 1
			}
		});
	},
	methods: {}
};
</script>

<style scoped></style>
