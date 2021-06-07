<template>
	<view>
		<scroll-view scroll-y="true" class="has-tabbar">
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 margin-top">
				<view class="u-m-r-10">
					<u-avatar :src="pic" size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">uView ui</view>
					<view class="u-font-14 u-tips-color">微信号:helang_uView</view>
				</view>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item @click="goto('./friend/friend')" icon="man-add" title="我的好友"></u-cell-item>
					<u-cell-item @click="goto('./following/following')" icon="bookmark" title="我的关注"></u-cell-item>
					<u-cell-item @click="goto('./followers/followers')" icon="heart" title="我的粉丝"></u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item @click="goto('./post/post')" icon="file-text" title="我的发表"></u-cell-item>
					<u-cell-item @click="goto('./reply/reply')" icon="edit-pen" title="我的回复"></u-cell-item>
					<u-cell-item @click="goto('./star/star')" icon="heart" title="我的收藏"></u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item @click="goto('../setting/setting')" icon="setting" title="设置"></u-cell-item>
				</u-cell-group>
			</view>
		</scroll-view>
		<dx-tabbar :currentTab="4"></dx-tabbar>
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
	.has-tabbar {
		height: calc(100vh - 94px);
	}
</style>
