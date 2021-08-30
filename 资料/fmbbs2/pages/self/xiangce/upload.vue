<template>
	<view>
		<view class="cu-form-group">
			<picker @change="change" :value="index" :range="album">
				<view class="txt-left picker text-grey">{{ index > -1 ? album[index] : '请选择相册' }}</view>
			</picker>
		</view>
		<view class="cu-form-group"><textarea @blur="handleBlur" style="height: 100px;" maxlength="-1" placeholder="请输入描述"></textarea></view>
		<view class="cu-bar bg-white margin-top">
			<view class="action">选择图片</view>
			<!-- <view class="action">{{ imgList.length }}/4</view> -->
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					<image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="imgList.length < 4"><text class="cuIcon-cameraadd"></text></view>
			</view>
		</view>
		<view class="padding flex flex-direction"><button @click="save" class="cu-btn bg-blue margin-tb-sm lg">保存</button></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {},
				index: -1,
				albumData: [],
				album: [],
				imgList: [],
				desc: ''
			};
		},
		methods: {
			handleBlur: function(e) {
				this.desc = e.detail.value;
			},
			save: async function() {
				if (this.index == -1) {
					this.$tool.modal('请选择相册');
					return;
				}
				if (this.imgList.length == 0) {
					this.$tool.modal('请选择图片');
					return;
				}

				this.$tool.loading()
				const reses = await Promise.all(this.imgList.map(async img => await this.$tool.upload(img, 'album', 'image', true)));
				const ids = reses.map(res => {
					if (null == res[0]) {
						if (200 == res[1].statusCode) {
							const data = JSON.parse(res[1].data);
							return data.body.attachment[0].id;
						}
					}
					return null;
				});
				const upres = await this.$tool.getData({
						r: this.$api.savealbum,
						ids: ids.join(),
						picDesc: this.desc,
						albumId: this.albumData[this.index].album_id
					},
					'post', true
				);
				this.$tool.loaded()
				uni.navigateBack({

				})
			},
			change: function(e) {
				this.index = -1 == e.detail.value ? 0 : e.detail.value;
			},
			ChooseImage() {
				uni.chooseImage({
					count: this.$config.maxImg,
					sizeType: ['compressed'],
					success: res => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths);
						} else {
							this.imgList = res.tempFilePaths;
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					content: '确定要删除图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1);
						}
					}
				});
			}
		},
		created: async function() {
			uni.setNavigationBarTitle({
				title: '上传'
			});
			this.user = getApp().globalData.user;
			const data = await this.$tool.getData({
				r: this.$api.albumlist,
				uid: this.user.uid,
				page: 1,
				pageSize: 100
			});
			this.albumData = data.list;
			this.album = this.albumData.map(item => item.title);
		}
	};
</script>

<style>
	.txt-left {
		text-align: left !important;
	}
</style>
