<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 margin-top">
			<view class="u-m-r-10">
				<u-avatar
					@click="edit"
					:show-sex="!!user && 0 != user.gender"
					:sex-icon="!!user && 1 == user.gender ? 'man' : 'woman'"
					:show-level="!!user"
					level-icon="edit-pen-fill"
					:src="!!user ? user.avatar : ''"
					size="140"
				></u-avatar>
			</view>
			<view class="u-flex-1 margin-left-sm">
				<view class="u-font-18 u-p-b-20">{{ user.userName }}</view>
				<view class="margin-bottom-xs text-gray text-sm">
					<text v-for="item in user.creditShowList" :key="item.type">
						{{ item.title }}:
						<text class="text-green margin-lr-xs">{{ item.data }}</text>
					</text>
				</view>
				<view class="text-sm text-orange">{{ user.userTitle }}</view>
			</view>
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
		return {};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	methods: {
		edit() {
			if (this.user) {
				this.$util.helper.goto('./edit/edit', true);
			}
		}
	}
};
</script>

<style></style>
