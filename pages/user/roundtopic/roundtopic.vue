<template>
	<view style="height: 100vh;">
		<dx-post-paging auth :hasAvatar="false" :params="params"></dx-post-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: null
			};
		},
		onLoad: function() {
			const {
				longitude,
				latitude
			} = getApp().globalData.location

			this.params = {
				r: 'square/surrounding',
				poi: 'topic',
				radius: 100000,
				longitude,
				latitude
			}
		}
	};
</script>

<style></style>
