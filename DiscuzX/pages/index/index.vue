<template>
	<view>
		<u-tabbar v-model="currentTab" :list="tabbar" :mid-button="true" @change="tabbarChange"></u-tabbar>
		<u-popup v-model="popupShow" mode="bottom" :safe-area-inset-bottom="true" @close="popupClose">
			<u-grid :col="2" @click="gridClick">
				<u-grid-item>
					<u-icon name="file-text-fill" :size="46"></u-icon>
					<view class="grid-text">发帖</view>
				</u-grid-item>
				<u-grid-item>
					<u-icon name="edit-pen-fill" :size="46"></u-icon>
					<view class="grid-text">签到</view>
				</u-grid-item>
			</u-grid>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				currentTab: 0,
				popupShow: false
			}
		},
		computed: {
			...mapState({
				tabbar: state => state.tabbar.tabbar
			})
		},
		onLoad: async function(options) {

		},
		methods: {
			tabbarChange(index) {
				if (2 == index) {
					this.popupShow = true
				}
				this.currentTab = index
			},
			popupClose() {
				this.currentTab = 0
			},
			gridClick(index) {
				this.popupShow = false
			}
		}
	}
</script>

<style scoped>
	.logo {
		width: 160rpx;
		height: 160rpx;
	}
</style>
