<template>
	<view>
		<u-cell-group>
			<u-cell-item hover-class="none" title="允许访问位置" icon="map" :arrow="false">
				<u-switch slot="right-icon" v-model="locationChecked" @change="locationChange"></u-switch>
			</u-cell-item>
			<u-cell-item hover-class="none" title="消息通知" icon="volume-up" :arrow="false">
				<u-switch slot="right-icon" v-model="noticeChecked" @change="noticeChange"></u-switch>
			</u-cell-item>
			<u-cell-item icon="share" title="分享"></u-cell-item>
			<u-cell-item icon="question-circle" title="意见反馈"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group>
			<u-cell-item icon="info-circle" title="用户协议"></u-cell-item>
			<u-cell-item icon="info-circle" title="版权声明"></u-cell-item>
			<u-cell-item icon="info-circle" title="隐私政策"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
export default {
	data() {
		return {
			locationChecked: true,
			noticeChecked: true
		};
	},
	methods: {
		locationChange(e) {},
		noticeChange(e) {}
	}
};
</script>

<style></style>
