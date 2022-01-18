<template>
	<view>
		<u-cell-group>
			<u-cell-item hover-class="none" title="允许访问位置" icon="map" :arrow="false">
				<u-switch slot="right-icon" v-model="locationChecked" @change="locationChange"></u-switch>
			</u-cell-item>
			<u-cell-item hover-class="none" title="消息通知" icon="volume-up" :arrow="false">
				<u-switch slot="right-icon" v-model="noticeChecked" @change="noticeChange"></u-switch>
			</u-cell-item>
			<u-cell-item @click="showShare = true" icon="share" title="分享"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('/pages/feedback/feedback', true)" icon="question-circle" title="意见反馈"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group><u-cell-item @click="navTo()" icon="info-circle" title="隐私政策"></u-cell-item></u-cell-group>
		<u-popup v-model="showShare" mode="bottom" safe-area-inset-bottom><dx-share></dx-share></u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			locationChecked: true,
			noticeChecked: true,
			showShare: false
		};
	},
	methods: {
		locationChange(e) {
			getApp().globalData.location = null;

			uni.setStorageSync('location', this.locationChecked);
		},
		noticeChange(e) {
			clearInterval(getApp().globalData.heartInterval);
			getApp().globalData.heartInterval = null;
			this.$store.commit('clearHeart');

			uni.setStorageSync('notice', this.noticeChecked);
		},
		navTo() {
			uni.navigateTo({
				url: '/pages/wv/wv?url=' + encodeURIComponent('https://www.undsky.com')
			});
		}
	}
};
</script>

<style></style>
