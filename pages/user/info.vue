<template>
	<view>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group :border="false">
			<u-cell-item @click="$util.helper.goto('./post/post', true)" icon="file-text" title="我的发表"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./reply/reply', true)" icon="chat" title="我的回复"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./star/star', true)" icon="heart" title="我的收藏"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style></style>
