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
			<view class="cu-form-group">
				<view class="title title-width" :class=[fonttitle]>确认密码</view>
				<input @blur="getRePassword" password placeholder="请输入确认密码"></input>
			</view>
			<view class="cu-form-group">
				<view class="title title-width" :class=[fonttitle]>邮箱</view>
				<input @blur="getEmail" placeholder="请输入邮箱"></input>
			</view>
			<view class="cu-form-group">
				<view class="title title-width" :class=[fonttitle]>手机号码</view>
				<input @blur="getMobile" type="number" maxlength="11" placeholder="请输入手机号码" name="input"></input>
			</view>
			<view class="cu-form-group">
				<view class="title title-width" :class=[fonttitle]>验证码</view>
				<input @blur="getCode" placeholder="请输入验证码" name="input"></input>
				<button @click="sendcode" :disabled="isSend" class='cu-btn bg-green shadow' :class=[fonttitle]>{{btnSendText}}</button>
			</view>
		</form>
		<view class="padding flex flex-direction">
			<button @click="reg" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: null,
				password: null,
				repassword: null,
				email: null,
				mobile: null,
				code: null,
				isSend: false,
				btnSendText: '获取验证码', //倒计时格式：(60秒)				
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
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
		},
		methods: {
			sendcode: async function() {
				if (!this.mobile) {
					this.$tool.modal('请输入手机');
					return;
				}
				const res = await this.$tool.getData({
					r: this.$api.phonecode,
					mobile: this.mobile
				})
				console.log(res)
				if (res) {
					this.$tool.modal('发送成功');
					this.isSend = true;
					let daojishi = 60;
					this.btnSendText = `${daojishi}秒`;
					const interval = setInterval(() => {
						daojishi--;
						if (0 == daojishi) {
							this.isSend = false;
							this.btnSendText = '获取验证码';
							clearInterval(interval);
							interval = null;
						} else {
							this.btnSendText = `${daojishi}秒`;
						}
					}, 1000);
				}
			},
			getUsername: function(e) {
				this.username = e.detail.value
			},
			getPassword: function(e) {
				this.password = e.detail.value
			},
			getRePassword: function(e) {
				this.repassword = e.detail.value
			},
			getEmail: function(e) {
				this.email = e.detail.value
			},
			getMobile: function(e) {
				this.mobile = e.detail.value
			},
			getCode: function(e) {
				this.code = e.detail.value
			},
			reg: async function() {
				if (!this.username) {
					this.$tool.modal('请输入用户名')
					return
				}
				if (!this.password) {
					this.$tool.modal('请输入密码')
					return
				}
				if (this.password != this.repassword) {
					this.$tool.modal('两次输入密码不匹配')
					return
				}
				if (!this.email) {
					this.$tool.modal('请输入邮箱')
					return
				}
				if (!this.mobile) {
					this.$tool.modal('请输入手机号码')
					return
				}
				if (!this.code) {
					this.$tool.modal('请输入验证码')
					return
				}

				const res = await this.$tool.getData({
					r: this.$api.reg,
					username: this.username,
					password: this.password,
					email: this.email,
					mobile: this.mobile,
					code: this.code,
				})
				console.log(res)
				if (res) {
					this.$tool.modal('注册成功，请用新账号密码登录', () => {
						uni.navigateBack()
					});
				}
			}
		}
	}
</script>

<style scoped>
	.title-width {
		width: 100px;
	}
</style>
