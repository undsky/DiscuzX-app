<template>
	<view>
		<view @click="uid ? void 0 : $util.helper.goto('./edit/edit', true)" class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 margin-top">
			<view class="u-m-r-10">
				<u-avatar
					:show-sex="!!userInfo && 0 != userInfo.gender"
					:sex-icon="!!userInfo && 1 == userInfo.gender ? 'man' : 'woman'"
					:src="!!userInfo ? userInfo.icon : ''"
					size="140"
				></u-avatar>
			</view>
			<view v-if="userInfo" class="u-flex-1 margin-left-sm">
				<view class="u-font-18 u-p-b-20">{{ userInfo.name }}</view>
				<view class="margin-bottom-xs text-gray text-sm">
					<text v-for="item in userInfo.body.creditShowList" :key="item.type">
						{{ item.title }}:
						<text class="text-green margin-lr-xs">{{ item.data }}</text>
					</text>
				</view>
				<view class="text-sm text-orange">{{ userInfo.userTitle }}</view>
			</view>
			<template v-if="!uid">
				<view class="u-m-l-10 u-p-10"><u-icon name="edit-pen" label="编辑" size="47"></u-icon></view>
				<view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="47"></u-icon></view>
			</template>
		</view>
		<u-cell-group :border="false">
			<u-cell-item @click="$util.helper.goto('./info/info', true)" icon="account" title="我的资料"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./album/album', true)" icon="photo" title="我的相册"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group :border="false">
			<u-cell-item @click="$util.helper.goto('./post/post', true)" icon="file-text" title="我的发表"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./reply/reply', true)" icon="chat" title="我的回复"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./star/star', true)" icon="star" title="我的收藏"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group :border="false">
			<u-cell-item @click="$util.helper.goto('./friend/friend', true)" icon="man-add" title="我的好友"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./following/following', true)" icon="eye" title="我的关注"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./followers/followers', true)" icon="heart" title="我的粉丝"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group :border="false"><u-cell-item @click="$util.helper.goto('./password/password', true)" icon="lock" title="修改密码"></u-cell-item></u-cell-group>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			uid: null,
			role: '我',
			userInfo: null
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	methods: {},
	onLoad: async function(options) {
		const { uid } = options;
		if (uid) {
			this.role = '他';
			this.uid = uid;
		}

		uni.setNavigationBarTitle({
			title: this.role + '的主页'
		});

		this.userInfo = await this.$http.get({
			r: 'user/userinfo',
			userId: this.uid
		});
	}
};
</script>

<style></style>
