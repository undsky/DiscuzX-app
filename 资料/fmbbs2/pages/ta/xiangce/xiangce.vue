<template>
	<view>
	<view v-if="album.length > 0" class="grid col-2 padding-sm">
		<view v-for="item in album" :key="item.album_id" class="cu-card case">
			<navigator hover-class="none" open-type="navigate" :url="'/pages/ta/xiangce/show?album_id=' + item.album_id + '&uid=' + uid" class="cu-item shadow">
				<view class="bg-img flex align-end" style="height: 414upx;" :style="{ backgroundImage: 'url(' + item.thumb_pic + ')' }">
					<view class="padding text-white">
						<view class="xiangce-title text-df text-grey" :class=[fonttitle]>{{ item.title }}</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
	<empty v-else />	
	</view>
</template>

<script>
export default {
	data() {
		return {
			uid: 0,
			album: [],			
			fontsize: 'normal'
		};
	},
	computed: {
		fonttitle: function() {
			return 'diy-title-' + this.fontsize
		},
		fontcontent: function() {
			return 'diy-content-' + this.fontsize
		}
	},
	methods: {},
	created: async function() {
		this.fontsize = getApp().globalData.fontsize
		uni.$on('fontsize', () => {
			this.fontsize = getApp().globalData.fontsize
		})
		uni.setNavigationBarTitle({
			title: '他的相册'
		});
	},
	onLoad: async function(options) {
		this.uid = options.uid;
		const data = await this.$tool.getData({
			r: this.$api.albumlist,
			uid: this.uid,
			page: 1,
			pageSize: 100
		});
		this.album = data.list;
	}
};
</script>

<style>
.xiangce-title {
	white-space: pre-wrap;
}
</style>
