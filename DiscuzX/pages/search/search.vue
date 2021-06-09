<template>
	<view>
		<view class="padding">
			<u-search placeholder="请输入搜索帖子" v-model="keyword" focus @search="search"></u-search>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: ''
			}
		},
		methods: {
			search: async function() {

			}
		}
	}
</script>

<style>

</style>
