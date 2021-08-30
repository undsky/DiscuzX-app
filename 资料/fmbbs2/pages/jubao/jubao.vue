<template>
	<view>
		<view class="cu-form-group">
			<picker @change="change" :value="index" :range="reason">
				<view class="txt-left picker text-grey" :class=[fonttitle]>
					{{reason[index]}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<textarea :class=[fonttitle] @blur="handleBlur" style="height: 200px;" maxlength="-1" placeholder="请输入举报内容"></textarea>
		</view>
		<view class="padding flex flex-direction">
			<button @click="save" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: null,
				id: 0,
				content: '',
				index: 0,
				reason: ['成人内容', '政治内容', '粗俗内容', '其他内容'],
				fontsize: 'normal'
			}
		},
		methods: {
			change: function(e) {
				this.index = e.detail.value
			},
			handleBlur: function(e) {
				this.content = e.detail.value
			},
			save: async function() {
				const res = await this.$tool.getData({
					r: this.$api.report,
					id: this.id,
					idtype: this.type,
					message: '[' + this.reason[this.index] + ']' + this.content
				}, 'post')
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
				title: '举报'
			})
		},
		onLoad: function(options) {
			this.type = options.type
			this.id = options.id
		}
	}
</script>

<style scoped>
	.txt-left {
		text-align: left !important;
	}
</style>
