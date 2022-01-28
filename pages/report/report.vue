<template>
	<view class="padding">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item prop="content" label-position="top">
				<u-input type="textarea" :border="border" height="230" placeholder="请填写举报内容" v-model="model.content" />
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
				id: null,
				type: null,
				model: {
					content: ''
				},
				rules: {
					content: [{
						required: true,
						message: '请输入举报内容',
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
							r: 'user/report',
							id: this.id,
							idtype: this.type,
							message: this.model.content
						});

						this.$util.helper.modal('举报成功', res => {
							uni.navigateBack({
								delta: 1
							});
						})
					}
				});
			}
		},
		onLoad: function(options) {
			const {
				id,
				type
			} = options;

			this.id = id;
			this.type = type;
		}
	};
</script>

<style></style>
