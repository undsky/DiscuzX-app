<template>
	<view class="wrap padding">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :leftIconStyle="iconStyle" left-icon="lock" label-width="150" :label-position="labelPosition"
				label="原密码" prop="oldPassword">
				<u-input :password-icon="true" :border="border" type="password" v-model="model.oldPassword"
					placeholder="请输入原密码"></u-input>
			</u-form-item>
			<u-form-item :leftIconStyle="iconStyle" left-icon="lock" label-width="150" :label-position="labelPosition"
				label="新密码" prop="newPassword">
				<u-input :password-icon="true" :border="border" type="password" v-model="model.newPassword"
					placeholder="请输入新密码"></u-input>
			</u-form-item>
		</u-form>
		<view class="margin-top-lg">
			<u-button type="warning" @click="submit">保存</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iconStyle: {
					color: '#888',
					fontSize: '32rpx'
				},
				model: {
					oldPassword: '',
					newPassword: ''
				},
				rules: {
					oldPassword: [{
						required: true,
						message: '请输入原密码',
						trigger: ['change', 'blur']
					}],
					newPassword: [{
						required: true,
						message: '请输入新密码',
						trigger: ['change', 'blur']
					}]
				},
				border: false,
				labelPosition: 'left',
				errorType: ['message']
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit: async function() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						const result = await this.$http.get({
							r: 'user/updateuserinfo',
							type: 'password',
							oldPassword: this.model.oldPassword,
							newPassword: this.model.newPassword
						});

						this.$util.helper.modal('修改成功', res => {
							uni.navigateBack({
								delta: 1
							});
						})
					}
				});
			}
		}
	};
</script>

<style></style>
