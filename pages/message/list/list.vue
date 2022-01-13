<template>
	<view style="height: 100vh;"><dx-user-paging auth :params="params"></dx-user-paging></view>
</template>

<script>
export default {
	data() {
		return {
			params: {
				r: 'message/pmsessionlist'
			}
		};
	},
	methods: {}
};
</script>

<style></style>
