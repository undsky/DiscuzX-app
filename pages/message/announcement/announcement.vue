<template>
	<view style="height: 100vh;">
		<dx-post-paging :hasAvatar="false" :params="params"></dx-post-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					r: 'forum/topiclist',
					boardId: 1
				}
			};
		},
		methods: {}
	};
</script>

<style></style>
