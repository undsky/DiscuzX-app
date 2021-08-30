<template>
	<scroll-view class="page" scroll-y="true" @scrolltoupper="reload" @scrolltolower="loadMore">
		<view v-if="photos.length > 0" class="grid col-2 padding-sm">
			<view v-for="item in photos" :key="item.pic_id" class="cu-card case">
				<view class="cu-item shadow">
					<view @click="preview" :data-pic="item.origin_pic" class="bg-img flex align-end" style="height: 414upx;" :style="{ backgroundImage: 'url(' + item.thumb_pic + ')' }">
					</view>
				</view>
			</view>
		</view>
		<empty v-else />
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				uid: 0,
				album_id: 0,
				photos: [],
				allowLoad: true,
				hasMore: true,
				page: 1,
				urls: []
			};
		},
		methods: {
			preview: function(e) {
				uni.previewImage({
					urls: this.urls,
					current: e.target.dataset.pic
				});
			},
			reload: async function() {
				if (this.allowLoad) {
					this.allowLoad = false;
					this.page = 1;
					let data = await this.$tool.getData({
						r: this.$api.photolist,
						albumId: this.album_id,
						uid: this.uid,
						page: this.page
					});
					if (data && data.list) {
						this.photos = data.list
						this.urls = data.list.map(item => item.origin_pic)
					}
					this.allowLoad = true;
				}
			},
			loadMore: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false;
					this.page++;
					let data = await this.$tool.getData({
						r: this.$api.photolist,
						albumId: this.album_id,
						uid: this.uid,
						page: this.page
					});
					if (data && data.list) {
						this.photos.push(...data.list);
						this.urls.push(...data.list.map(item => item.origin_pic))
						this.hasMore = data.list.length == this.$config.pageSize;
					} else {
						this.hasMore = false;
					}
					this.allowLoad = true;
				}
			}
		},
		created: function() {
			uni.setNavigationBarTitle({
				title: '相片'
			});
		},
		onLoad: function(options) {
			this.uid = options.uid;
			this.album_id = options.album_id;
			this.reload();
		}
	};
</script>

<style>
	.page {
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
	}
</style>
