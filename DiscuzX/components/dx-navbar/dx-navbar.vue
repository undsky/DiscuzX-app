<template>
	<u-navbar :background="background" :is-back="false">
		<view class="flex flex-justify-between">
			<view v-if="showUser" class="navbar-left">
				<u-image v-if="user" :src="user.avatar" shape="circle" width="44" height="44">
				</u-image>
				<navigator v-else url="../../pages/auth/auth" hover-class="none">
					<u-icon name="account" color="#FFFFFF" size="38"></u-icon>
				</navigator>
			</view>
			<view class="navbar-title flex flex-justify-center">
				{{title}}
			</view>
			<navigator url="../../pages/search/search" hover-class="none" class="navbar-right">
				<u-icon name="search" color="#FFFFFF" size="38"></u-icon>
			</navigator>
		</view>
	</u-navbar>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		name: "dx-navbar",
		props: {
			title: String,
			showUser: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				background: {
					backgroundColor: "#606266"
				}
			};
		},
		computed: {
			...mapState({
				user: state => state.auth.user
			})
		}
	}
</script>

<style scoped>
	.navbar-left {
		margin-left: 24rpx;
		display: flex;
	}

	.navbar-right {
		margin-right: 24rpx;
		display: flex;
	}

	.navbar-title {
		font-size: 32rpx;
		font-weight: bold;
		color: white;
	}
</style>
