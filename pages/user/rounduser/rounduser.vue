<template>
	<view style="height: 100vh;"><dx-user-paging auth :params="params"></dx-user-paging></view>
</template>

<script>
export default {
	data() {
		return {
			params: {
				r: 'square/surrounding',
				poi: 'user',
				longitude: getApp().globalData.location.longitude,
				latitude: getApp().globalData.location.latitude
			}
		};
	}
};
</script>

<style></style>
