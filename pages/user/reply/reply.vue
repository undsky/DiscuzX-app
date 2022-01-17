<template>
	<view style="height: 100vh;"><dx-post-paging auth :hasAvatar="false" :params="params"></dx-post-paging></view>
</template>

<script>
export default {
	data() {
		return {
			params: null
		};
	},
	onLoad: function(options) {
		this.params = {
			r: 'user/topiclist',
			type: 'reply',
			uid: JSON.parse(options.uid)
		};
	}
};
</script>

<style></style>
