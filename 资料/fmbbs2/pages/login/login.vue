<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title title-width" :class=[fonttitle]>用户名</view>
				<input @blur="getUsername" placeholder="请输入用户名"></input>
			</view>
			<view class="cu-form-group">
				<view class="title title-width" :class=[fonttitle]>密码</view>
				<input @blur="getPassword" password placeholder="请输入密码"></input>
			</view>
		</form>
		<view class="padding flex flex-direction">
			<button @click="login" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>登录</button>
		</view>
		<view @click="register" class="flex justify-center text-green" :class=[fonttitle]>点击注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: null,
				password: null,				
				fontsize: 'normal'
			}
		},
		computed: {
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		methods: {
			register: function() {
				uni.navigateTo({
					url: './reg/reg'
				})
				// const url = 'http://bbs.foodmate.net/member.php?mod=register&mobile=2&from=app'
				// // #ifdef APP-PLUS
				// plus.runtime.openURL(url)
				// // #endif
				// // #ifndef APP-PLUS
				// uni.navigateTo({
				// 	url: '/pages/wv/wv?url=' + encodeURIComponent(url)
				// });
				// // #endif
			},
			getUsername: function(e) {
				this.username = e.detail.value
			},
			getPassword: function(e) {
				this.password = e.detail.value
			},
			login: async function() {
				if (!this.username) {
					this.$tool.modal('请输入用户名')
					return
				}
				if (!this.password) {
					this.$tool.modal('请输入密码')
					return
				}

				const data = await this.$tool.getData({
					r: this.$api.login,
					username: this.username,
					password: this.password
				})
				if (data && data.uid) {
					const user = {
						uid: data.uid,
						token: data.token,
						secret: data.secret,
						userName: data.userName,
						avatar: data.avatar
					}
					getApp().globalData.user = user
					uni.setStorageSync('user', user)
					uni.getStorage({
						key: 'notice',
						success: res => {
							if (false !== res.data) {
								this.$tool.heart()
							}
						},
						fail: err => {
							this.$tool.heart()
						}
					})
					this.$tool.modal('登录成功', function() {
						uni.$emit('login')
						uni.navigateBack({

						})
					})
				}
			}
		},
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			uni.setNavigationBarTitle({
				title: '登录'
			})
		}
	}
</script>

<style>
	.title-width {
		width: 80px;
	}
</style>
