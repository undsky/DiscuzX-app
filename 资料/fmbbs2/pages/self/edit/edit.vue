<template>
	<view>
		<view class="cu-bar bg-white">
			<view class="action" :class=[fonttitle]>
				更换头像
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					<image :src="imgList[index]" mode="aspectFill"></image>
					<!-- <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view> -->
				</view>
				<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white margin-top">
			<view class="action" :class=[fonttitle]>
				性别
			</view>
		</view>
		<radio-group style="background-color: #FFFFFF;" class="block flex" @change="RadioChange">
			<view class="cu-form-group no-border">
				<view class="title text-grey" :class=[fontcontent]>保密</view>
				<radio :class="gender==0?'checked':''" :checked="gender==0?true:false" value="0"></radio>
			</view>
			<view class="cu-form-group no-border">
				<view class="title text-grey" :class=[fontcontent]>男</view>
				<radio :class="gender==1?'checked':''" :checked="gender==1?true:false" value="1"></radio>
			</view>
			<view class="cu-form-group no-border">
				<view class="title text-grey" :class=[fontcontent]>女</view>
				<radio :class="gender==2?'checked':''" :checked="gender==2?true:false" value="2"></radio>
			</view>
		</radio-group>
		<!-- <view class="cu-bar bg-white margin-top">
			<view class="action">
				签名
			</view>
		</view>
		<view class="cu-form-group">
			<textarea @blur="handleBlurSign" :value="sign" style="height: 100px;" maxlength="-1" placeholder="请输入签名"></textarea>
		</view> -->
		<view class="padding flex flex-direction"><button @click="save" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>保存</button></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gender: 0,
				imgList: [],
				user: {},
				sign: '',
				fontsize: 'normal'
			}
		},
		methods: {
			handleBlurSign: function(e) {
				setTimeout(() => {
					this.sign = e.detail.value;
				}, 100);
			},
			save: async function() {
				let newAvatar = null
				if (this.imgList.length > 0 && this.user.avatar != this.imgList[0]) {
					const path = this.imgList[0]
					try {
						this.$tool.loading()
						const res = await uni.uploadFile({
							url: this.$api.base,
							filePath: path,
							name: 'userAvatar',
							formData: {
								r: this.$api.uploadavatarex,
								type: 'image',
								accessToken: this.user.token,
								accessSecret: this.user.secret,
							}
						})
						if (null == res[0]) {
							newAvatar = JSON.parse(res[1].data).pic_path
						}
					} catch (e) {
						this.$tool.modal('访问异常')
					} finally {
						this.$tool.loaded()
					}
				}
				let params = {
					r: this.$api.updateuserinfo,
					type: 'info',
					gender: this.gender
				}
				if (newAvatar) {
					params.avatar = newAvatar
				}
				const updateres = await this.$tool.getData(params, 'post')
				if (updateres) {
					// if (newAvatar) {
					// 	this.user.avatar = newAvatar
					// 	getApp().globalData.user = this.user
					// 	uni.setStorageSync('user', this.user)
					// }
					this.$tool.modal('更新成功', function() {
						uni.$emit('updateuser', {
							update: true
						})
						uni.navigateBack({

						})
					})
				}
			},
			RadioChange(e) {
				this.gender = e.detail.value
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						this.imgList = res.tempFilePaths
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
					content: '确定要删除头像吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
		},
		computed: {
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			uni.setNavigationBarTitle({
				title: '个人设置'
			})

			this.user = getApp().globalData.user || {}
			this.imgList.push(this.user.avatar)
		},
		onLoad: function(options) {
			this.gender = options.gender
		}
	}
</script>

<style>

</style>
