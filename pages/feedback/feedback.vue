<template>
	<view class="padding">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item prop="content" label-position="top">
				<u-input type="textarea" :border="border" height="230" placeholder="请填写反馈内容" v-model="model.content" />
			</u-form-item>
		</u-form>
		<view class="margin-top-lg"><u-button throttleTime="1000" type="warning" @click="submit">提交</u-button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: {
				content: ''
			},
			rules: {
				content: [
					{
						required: true,
						message: '请输入反馈内容',
						trigger: ['change', 'blur']
					}
				]
			},
			border: false,
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
						r: 'user/feedback',
						content: this.model.content
					});

					uni.showModal({
						title: '',
						content: '反馈成功',
						showCancel: false,
						cancelText: '',
						confirmText: '确定',
						success: res => {
							uni.navigateBack({
								delta: 1
							});
						},
						fail: () => {},
						complete: () => {}
					});
				}
			});
		}
	}
};
</script>

<style></style>
