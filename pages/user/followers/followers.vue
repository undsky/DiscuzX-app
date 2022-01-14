<template>
	<view style="height: 100vh;"><dx-user-paging auth :params="params"></dx-user-paging></view>
</template>

<script>
export default {
	data() {
		return {
			params: {
				r: 'user/userlist',
				type: 'followed'
			}
		};
	}
};
</script>

<style></style>
