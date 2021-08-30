<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title title-width" :class=[fonttitle]>原密码</view>
				<input @blur="getOldPassword" password placeholder="请输入原密码"></input>
			</view>
			<view class="cu-form-group">
				<view class="title title-width" :class=[fonttitle]>新密码</view>
				<input @blur="getNewPassword" password placeholder="请输入新密码"></input>
			</view>
		</form>
		<view class="padding flex flex-direction">
			<button @click="save" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPassword: null,
				newPassword: null,
				fontsize: 'normal'
			}
		},
		methods: {
			getOldPassword: function(e) {
				this.oldPassword = e.detail.value
			},
			getNewPassword: function(e) {
				this.newPassword = e.detail.value
			},
			save: async function() {
				if (!this.oldPassword) {
					this.$tool.modal('请输入原密码')
					return
				}
				if (!this.newPassword) {
					this.$tool.modal('请输入新密码')
					return
				}

				const data = await this.$tool.getData({
					r: this.$api.updateuserinfo,
					type: 'password',
					oldPassword: this.oldPassword,
					newPassword: this.newPassword
				})
				if (data) {
					// uni.removeStorageSync('user')
					// getApp().globalData.user = {}
					// uni.$emit('logout')
					this.$tool.modal('修改成功', function() {
						uni.navigateBack({
							// delta: 2
						})
					})
				}
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
			uni.setNavigationBarTitle({
				title: '修改密码'
			})
		}
	}
</script>

<style>

</style>
