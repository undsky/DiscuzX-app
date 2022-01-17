<template>
	<view>
		<u-navbar :background="background" back-icon-color="#FFFFFF" title="相册" title-bold title-color="#FFFFFF">
			<view v-if="!uid" @click="$util.helper.goto('./upload/upload', true)" class="margin-right flex text-white cuIcon-upload" slot="right"></view>
		</u-navbar>
		<view v-if="album.length > 0" class="grid col-2 padding-sm">
			<view v-for="item in album" :key="item.album_id" class="cu-card case">
				<navigator hover-class="none" open-type="navigate" :url="'/pages/user/album/show/show?album_id=' + item.album_id + '&uid=' + uid" class="cu-item shadow">
					<view class="bg-img flex align-end" style="height: 414upx;" :style="{ backgroundImage: 'url(' + item.thumb_pic + ')' }">
						<view class="padding text-white">
							<view class="album-title text-df text-grey">{{ item.title }}</view>
						</view>
					</view>
				</navigator>
			</view>
		</view>
		<z-paging-empty-view v-else></z-paging-empty-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			uid: null,
			album: [],
			background: {
				backgroundColor: '#606266'
			}
		};
	},
	methods: {},
	onLoad: async function(options) {
		this.uid = JSON.parse(options.uid);

		const result = await this.$http.post({
			r: 'user/albumlist',
			uid: this.uid
		});
		this.album = result.list;
	}
};
</script>

<style scoped>
page {
	background-color: #f1f1f1;
}
.album-title {
	white-space: pre-wrap;
}
</style>
