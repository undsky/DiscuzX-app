<template>
	<view style="height: 100vh;">
		<dx-user-paging auth :params="params"></dx-user-paging>
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
				poi: 'user',
				radius: 100000,
				longitude,
				latitude
			}
		}
	};
</script>

<style></style>
