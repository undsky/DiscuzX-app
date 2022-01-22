<template>
	<view>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 margin-top">
			<view @click="uid ? void 0 : changeAvatar()" class="u-m-r-10">
				<u-avatar
					:show-sex="!!userInfo && 0 != userInfo.gender"
					:sex-icon="!!userInfo && 1 == userInfo.gender ? 'man' : 'woman'"
					:show-level="!!userInfo"
					level-icon="camera-fill"
					:src="!!userInfo ? userInfo.icon + '&t=' + new Date().getTime() : ''"
					size="140"
				></u-avatar>
			</view>
			<view v-if="userInfo" @click="edit" class="u-flex-1 margin-left-sm">
				<view class="u-font-18 u-p-b-20">{{ userInfo.name }}</view>
				<view class="margin-bottom-xs text-gray text-sm">
					<text v-for="item in userInfo.body.creditShowList" :key="item.type">
						{{ item.title }}:
						<text class="text-green margin-lr-xs">{{ item.data }}</text>
					</text>
				</view>
				<view class="text-sm text-orange">{{ userInfo.userTitle }}</view>
			</view>
			<!-- <template v-if="!uid">
				<view @click="edit" class="u-m-l-10 u-p-10"><u-icon name="edit-pen" label="编辑" size="47"></u-icon></view>
				<view @click="edit" class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="47"></u-icon></view>
			</template> -->
		</view>
		<u-cell-group :border="false">
			<u-cell-item @click="$util.helper.goto('./info/info?uid=' + uid, true)" icon="account" :title="role + '的资料'"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./album/album?uid=' + uid, true)" icon="photo" :title="role + '的相册'"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group :border="false">
			<u-cell-item @click="$util.helper.goto('./post/post?uid=' + uid, true)" icon="file-text" :title="role + '的发表'"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./reply/reply?uid=' + uid, true)" icon="chat" :title="role + '的回复'"></u-cell-item>
			<u-cell-item v-if="!uid" @click="$util.helper.goto('./star/star', true)" icon="star" title="我的收藏"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group :border="false">
			<u-cell-item v-if="!uid" @click="$util.helper.goto('./friend/friend', true)" icon="man-add" title="我的好友"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./following/following?uid=' + uid, true)" icon="eye" :title="role + '的关注'"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('./followers/followers?uid=' + uid, true)" icon="heart" :title="role + '的粉丝'"></u-cell-item>
		</u-cell-group>
		<template v-if="!uid">
			<u-gap :bg-color="$u.color['infoLight']"></u-gap>
			<u-cell-group :border="false"><u-cell-item @click="$util.helper.goto('./password/password', true)" icon="lock" title="修改密码"></u-cell-item></u-cell-group>
		</template>
		<view v-if="uid" class="cu-bar tabbar bg-white shadow foot">
			<view @click="handleFriend" class="action" :class="[friend ? 'text-blue' : 'text-gray']">
				<view class="cuIcon-friendfill"></view>
				<view>{{ friend ? '删除好友' : '加好友' }}</view>
			</view>
			<view @click="handleFollow" class="action" :class="[follow ? 'text-blue' : 'text-gray']">
				<view class="cuIcon-favorfill"></view>
				<view>{{ follow ? '取消关注' : '关注' }}</view>
			</view>
			<view @click="handleBlack" class="action" :class="[black ? 'text-blue' : 'text-gray']">
				<view class="cuIcon-attentionforbidfill"></view>
				<view>{{ black ? '取消拉黑' : '拉黑' }}</view>
			</view>
			<navigator class="action text-gray" hover-class="none" open-type="navigate" :url="'/pages/chat/chat?fromUid=' + uid">
				<view class="cuIcon-messagefill text-gray"></view>
				<view>发送消息</view>
			</navigator>
			<navigator class="action text-gray" hover-class="none" open-type="navigate" :url="'/pages/report/report?type=user&id=' + uid">
				<view class="cuIcon-dianhua text-gray"></view>
				<view>举报</view>
			</navigator>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			uid: null,
			role: '我',
			userInfo: null,
			friend: false,
			follow: false,
			black: false
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	methods: {
		edit() {
			// if (!this.uid) {
			// 	uni.navigateTo({
			// 		url:
			// 			'/pages/wv/wv?title=编辑&url=' +
			// 			encodeURIComponent(`${this.$http.config.baseURL}?r=user/userinfoadminview&accessToken=${this.user.token}&accessSecret=${this.user.secret}`)
			// 	});
			// 	// this.$util.helper.goto('./edit/edit', true)
			// }
		},
		changeAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: async res => {
					uni.showLoading({
						mask: true
					});
					try {
						const result = await this.$http.uploadAttachment(res.tempFilePaths[0], 'avatar');
						const newAvatar = result.pic_path + '&t=' + new Date().getTime();
						this.userInfo.icon = newAvatar;
						this.$store.commit(
							'setUser',
							Object.assign(this.user, {
								avatar: newAvatar
							})
						);
					} catch (e) {
					} finally {
						uni.hideLoading();
					}
				}
			});
		},
		handleFriend: function() {
			uni.navigateTo({
				url:
					'/pages/wv/wv?url=' +
					encodeURIComponent(
						this.$http.config.baseURL +
							this.$u.queryParams({
								r: 'user/useradminview',
								uid: this.uid,
								act: this.friend ? 'ignore' : 'add',
								accessToken: this.user.token,
								accessSecret: this.user.secret
							})
					),
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		handleFollow: async function() {
			const result = await this.$http.get({
				r: 'user/useradmin',
				uid: this.uid,
				type: this.follow ? 'unfollow' : 'follow'
			});

			this.follow = !this.follow;
		},
		handleBlack: async function() {
			const result = await this.$http.get({
				r: 'user/useradmin',
				uid: this.uid,
				type: this.black ? 'delblack' : 'black'
			});

			this.black = !this.black;
		}
	},
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

		if (uid) {
			this.friend = !!this.userInfo.isFriend;
			this.follow = !!this.userInfo.is_follow;
			this.black = !!this.userInfo.is_black;
		}
	}
};
</script>

<style></style>
