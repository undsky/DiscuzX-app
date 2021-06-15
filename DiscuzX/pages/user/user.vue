<template>
	<view>
		<dx-navbar title="我的" :showUser="false"></dx-navbar>
		<scroll-view scroll-y="true" class="wrapper">
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 margin-top">
				<view class="u-m-r-10">
					<u-avatar size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<template v-if="user">
						<view class="u-font-18 u-p-b-20">uView ui</view>
						<view class="u-font-14 u-tips-color">微信号:helang_uView</view>
					</template>
					<u-cell-item v-else @click="$util.helper.goto('../auth/auth')" title="登录" :arrow="false"
						:title-style="titleStyle"></u-cell-item>
				</view>
			</view>

			<view class="u-m-t-20">
				<u-cell-group :border="false">
					<u-cell-item @click="$util.helper.goto('./friend/friend', true)" icon="man-add" title="我的好友">
					</u-cell-item>
					<u-cell-item @click="$util.helper.goto('./following/following', true)" icon="bookmark" title="我的关注">
					</u-cell-item>
					<u-cell-item @click="$util.helper.goto('./followers/followers', true)" icon="heart" title="我的粉丝">
					</u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group :border="false">
					<u-cell-item @click="$util.helper.goto('./post/post', true)" icon="file-text" title="我的发表">
					</u-cell-item>
					<u-cell-item @click="$util.helper.goto('./reply/reply', true)" icon="edit-pen" title="我的回复">
					</u-cell-item>
					<u-cell-item @click="$util.helper.goto('./star/star', true)" icon="heart" title="我的收藏">
					</u-cell-item>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group :border="false">
					<u-cell-item @click="$util.helper.goto('../setting/setting')" icon="setting" title="设置">
					</u-cell-item>
				</u-cell-group>
			</view>
			<view v-if="user" class="margin-top-lg padding">
				<u-button @click="logout">退出登录</u-button>
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
			logout() {

			}
		}
	};
</script>

<style scoped>
	.wrapper {
		height: calc(100vh - 94px - var(--status-bar-height));
	}
</style>
