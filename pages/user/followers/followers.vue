<template>
	<view style="height: 100vh;"><dx-user-paging auth :params="params"></dx-user-paging></view>
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
			r: 'user/userlist',
			type: 'followed',
			uid: JSON.parse(options.uid)
		};
	}
};
</script>

<style></style>
