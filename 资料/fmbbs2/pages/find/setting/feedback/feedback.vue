<template>
	<view>
		<view class="cu-form-group margin">
			<textarea @blur="handleBlurContent" :value="content" style="height: 200px;" maxlength="-1" placeholder="感谢您的反馈,请提出您的意见和建议"></textarea>
		</view>
		<view class="padding flex flex-direction"><button @click="send" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>发送</button></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				fontsize: 'normal'
			}
		},
		methods: {
			send: async function() {
				if (this.content) {
					const res = await this.$tool.getData({
						r: this.$api.feedback,
						content: this.content
					})
					if (res) {
						this.$tool.modal('发送成功，感谢您的反馈', () => {
							uni.navigateBack({

							})
						})
					}
				} else {
					this.$tool.modal('请输入您的意见和建议')
				}
			},
			handleBlurContent: function(e) {
				this.content = e.detail.value;
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
				title: '意见反馈'
			})
		}
	}
</script>

<style>

</style>
