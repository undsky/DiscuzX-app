<template>
	<view style="height: 100vh;"><dx-post-paging auth :hasAvatar="false" :params="params"></dx-post-paging></view>
</template>

<script>
export default {
	data() {
		return {
			params: {
				r: 'square/surrounding',
				poi: 'topic',
				longitude: getApp().globalData.location.longitude,
				latitude: getApp().globalData.location.latitude
			}
		};
	}
};
</script>

<style></style>
