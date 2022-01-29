<template>
	<view>
		<dx-navbar title="消息"></dx-navbar>
		<view class="u-m-t-20">
			<u-cell-group :border="false">
				<u-cell-item @click="$util.helper.goto('./atme/atme', true)" icon="volume" title="提到我的">
					<u-badge v-if="heart" :count="heart.atMeInfo.count" :absolute="false" slot="right-icon"></u-badge>
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./comment/comment', true)" icon="chat" title="评论">
					<u-badge v-if="heart" :count="heart.replyInfo.count" :absolute="false" slot="right-icon"></u-badge>
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./friend/friend', true)" icon="man-add" title="好友申请">
					<u-badge v-if="heart" :count="heart.friendInfo.count" :absolute="false" slot="right-icon"></u-badge>
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./list/list', true)" icon="bell" title="消息">
					<u-badge v-if="heart" :count="heart.systemInfo.count" :absolute="false" slot="right-icon"></u-badge>
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./system/system', true)" icon="kefu-ermai" title="系统消息">
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./announcement/announcement')" icon="email" title="公告">
				</u-cell-item>
			</u-cell-group>
		</view>
		<dx-tabbar :currentTab="3"></dx-tabbar>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {};
		},
		computed: {
			...mapState({
				heart: state => state.heart.heart
			})
		},
		methods: {}
	};
</script>

<style></style>
