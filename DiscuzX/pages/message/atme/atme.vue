<template>
	<view><dx-post-paging usePageScroll :params="params"></dx-post-paging></view>
</template>

<script>
export default {
	data() {
		return {
			params: {
				r: 'message/notifylist',
				type: 'at'
			}
		};
	},
	methods: {}
};
</script>

<style></style>
