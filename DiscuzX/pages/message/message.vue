<template>
	<view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="goto('./atme/atme')" icon="volume" title="提到我的"></u-cell-item>
				<u-cell-item @click="goto('./comment/comment')" icon="chat" title="评论"></u-cell-item>
				<u-cell-item @click="goto('./friend/friend')" icon="man-add" title="好友"></u-cell-item>
				<u-cell-item @click="goto('./chat/chat')" icon="bell" title="消息"></u-cell-item>
			</u-cell-group>
		</view>
		<dx-tabbar :currentTab="3"></dx-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url
				});
			}
		}
	}
</script>

<style>

</style>
