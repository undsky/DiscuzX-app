<template>
	<view>
		<dx-navbar title="我的" :showUser="false"></dx-navbar>
		<scroll-view scroll-y="true" class="wrapper">
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 margin-top">
				<view @click="$util.helper.goto('./home', true)" class="u-m-r-10">
					<u-avatar :show-sex="!!userInfo && 0 != userInfo.gender"
						:sex-icon="!!userInfo && 1 == userInfo.gender ? 'man' : 'woman'"
						:src="!!userInfo ? userInfo.icon + '&t=' + new Date().getTime() : ''" size="140"></u-avatar>
				</view>
				<view class="u-flex-1 margin-left-sm">
					<view v-if="userInfo" @click="$util.helper.goto('./home', true)">
						<view class="u-font-18 u-p-b-20">{{ userInfo.name }}</view>
						<view class="margin-bottom-xs text-gray text-sm">
							<text v-for="item in userInfo.body.creditShowList" :key="item.type">
								{{ item.title }}:
								<text class="text-green margin-lr-xs">{{ item.data }}</text>
							</text>
						</view>
						<view class="text-sm text-orange">{{ userInfo.userTitle }}</view>
					</view>
					<u-cell-item v-if="!user" @click="$util.helper.goto('../auth/auth')" title="登录" :arrow="false"
						:title-style="titleStyle"></u-cell-item>
				</view>
				<view v-if="userInfo" class="u-m-l-10 u-p-10">
					<u-icon @click="qiandao()" name="edit-pen" label="签到" size="47"></u-icon>
				</view>
				<view v-if="userInfo" @click="$util.helper.goto('./home', true)" class="u-m-l-10 u-p-10">
					<u-icon name="arrow-right" color="#969799" size="47"></u-icon>
				</view>
			</view>
			<u-gap :bg-color="$u.color['infoLight']"></u-gap>
			<u-cell-group :border="false">
				<u-cell-item @click="$util.helper.goto('./roundtopic/roundtopic', true)" icon="file-text" title="周边帖子">
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./rounduser/rounduser', true)" icon="account" title="周边用户">
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./recommend/recommend', true)" icon="man-add" title="推荐用户">
				</u-cell-item>
				<u-cell-item @click="$util.helper.goto('./search/search', true)" icon="search" title="搜索用户">
				</u-cell-item>
			</u-cell-group>
			<u-gap :bg-color="$u.color['infoLight']"></u-gap>
			<u-cell-group :border="false">
				<u-cell-item @click="$util.helper.goto('./setting/setting', false)" icon="setting" title="设置">
				</u-cell-item>
			</u-cell-group>
			<view class="u-m-t-20 flex justify-center">
				<u-link href="https://www.undsky.com" :under-line="true">联系作者</u-link>
			</view>
			<view v-if="user" class="margin-top-lg padding">
				<u-button type="warning" @click="logout">退出登录</u-button>
			</view>
		</scroll-view>
		<dx-tabbar :currentTab="4"></dx-tabbar>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				userInfo: null,
				titleStyle: {
					fontWeight: 'bold',
					fontSize: '32rpx'
				}
			};
		},
		computed: {
			...mapState({
				user: state => state.auth.user
			})
		},
		methods: {
			qiandao: async function() {
				const result = await this.$http.post({
					r: 'user/sign'
				});

				if (result)
					this.$util.helper.modal(result.head.errInfo)
			},
			logout: async function() {
				this.$store.commit('clearUser');
				this.userInfo = null;

				clearInterval(getApp().globalData.heartInterval);
				getApp().globalData.heartInterval = null;
				this.$store.commit('clearHeart');

				try {
					await this.$http.get({
						r: 'user/login',
						type: 'logout'
					});
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		onShow: async function() {
			if (!this.userInfo && this.user) {
				this.userInfo = await this.$http.post({
					r: 'user/userinfo'
				});
			}
		}
	};
</script>

<style scoped>
	.wrapper {
		height: calc(100vh - 94px - var(--status-bar-height));
	}
</style>
