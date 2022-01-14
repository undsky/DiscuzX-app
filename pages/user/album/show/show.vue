<template>
	<z-paging ref="paging" v-model="photos" autowire-query-name="zQuery">
		<view class="grid col-2 padding-sm">
			<view v-for="item in photos" :key="item.pic_id" class="cu-card case">
				<view class="cu-item shadow">
					<view
						@click="preview"
						:data-pic="item.origin_pic"
						class="bg-img flex align-end"
						style="height: 414upx;"
						:style="{ backgroundImage: 'url(' + item.thumb_pic + ')' }"
					></view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
export default {
	data() {
		return {
			album_id: 0,
			photos: []
		};
	},
	methods: {
		zQuery: async function(page, pageSize) {
			const result = await this.$http.get({
				r: 'user/photolist',
				albumId: this.album_id,
				page,
				pageSize
			});

			this.$refs.paging.complete(result.list);
		},
		preview: function(e) {
			uni.previewImage({
				urls: this.photos.map(item => item.origin_pic),
				current: e.target.dataset.pic
			});
		}
	},
	onLoad: function(options) {
		this.album_id = options.album_id;
	}
};
</script>

<style></style>
