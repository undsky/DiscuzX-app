<template>
	<view>
		<u-tabbar v-model="index" :list="tabbar" :mid-button="true" @change="tabbarChange"></u-tabbar>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		name: 'dx-tabbar',
		props: {
			currentTab: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				index: this.currentTab
			};
		},
		computed: {
			...mapState({
				tabbar: state => state.tabbar.tabbar,
				user: state => state.auth.user
			})
		},
		methods: {
			tabbarChange(index) {
				if (2 == index) {
					if (this.$util.helper.checkAuth()) {
						uni.navigateTo({
							url: '/pages/post/post'
						});
					}
				}
				this.index = index;
			}
		}
	};
</script>

<style></style>
