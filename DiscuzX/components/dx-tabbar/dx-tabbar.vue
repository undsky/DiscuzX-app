<template>
	<view>
		<u-tabbar v-model="index" :list="tabbar" :mid-button="true" @change="tabbarChange"></u-tabbar>
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
		name: "dx-tabbar",
		props: {
			currentTab: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				index: this.currentTab,
				popupShow: false
			};
		},
		computed: {
			...mapState({
				tabbar: state => state.tabbar.tabbar
			})
		},
		methods: {
			tabbarChange(index) {
				if (2 == index) {
					this.popupShow = true
				}
				this.index = index
			},
			popupClose() {
				this.index = this.currentTab
			},
			gridClick(index) {
				this.popupShow = false
			}
		}
	}
</script>

<style>

</style>
