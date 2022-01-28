<template>
	<view class="padding">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item prop="content" label-position="top">
				<u-input type="textarea" :border="border" height="230" placeholder="请填写反馈内容" v-model="model.content" />
			</u-form-item>
		</u-form>
		<view class="margin-top-lg">
			<u-button type="warning" @click="submit">提交</u-button>
		</view>
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
					content: [{
						required: true,
						message: '请输入反馈内容',
						trigger: ['change', 'blur']
					}]
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

						this.$util.helper.modal('反馈成功', res => {
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
