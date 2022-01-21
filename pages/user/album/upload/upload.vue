<template>
	<view class="padding-lr-sm">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :label-position="labelPosition" label="相册" label-width="100" prop="album">
				<u-input :border="border" type="select" :select-open="albumShow" v-model="model.album" placeholder="请选择相册" @click="albumShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="描述" prop="content">
				<u-input type="textarea" :border="border" height="230" placeholder="请填写描述" v-model="model.content" />
			</u-form-item>
			<u-form-item label-position="top" label="上传图片" prop="photo" label-width="150">
				<u-upload ref="upload" :action="action" :form-data="formData" name="uploadFile[]" width="160" height="160"></u-upload>
			</u-form-item>
		</u-form>
		<view class="margin-top-lg padding-bottom-lg"><u-button throttleTime="1000" type="warning" @click="submit">保存</u-button></view>
		<u-select v-model="albumShow" :list="albumList" @confirm="albumConfirm"></u-select>
	</view>
</template>

<script>
import { mapState } from 'vuex';

let albumId = 0;

export default {
	data() {
		return {
			albumShow: false,
			albumList: [],
			model: {
				album: null,
				content: ''
			},
			rules: {
				album: [
					{
						required: true,
						message: '请选择相册',
						trigger: ['change', 'blur']
					}
				],
				content: [
					{
						required: false,
						message: '请输入描述',
						trigger: ['change', 'blur']
					}
				]
			},
			border: false,
			labelPosition: 'left',
			errorType: ['message'],
			action: '',
			formData: {}
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	methods: {
		albumConfirm(e) {
			this.model.album = '';
			e.map((val, index) => {
				albumId = val.value;
				this.model.album = val.label;
			});
		},
		submit: async function() {
			this.$refs.uForm.validate(async valid => {
				if (valid) {
					const images = this.$refs.upload.lists;
					if (images && images.length > 0) {
						const ids = images.map(img => img.response.body.attachment[0].id);

						uni.showLoading({
							mask: true
						});

						try {
							const result = await this.$http.post({
								r: 'user/savealbum',
								ids: ids.join(),
								picDesc: this.model.content,
								albumId
							});

							uni.hideLoading();

							uni.showModal({
								title: '',
								content: '上传成功',
								showCancel: false,
								cancelText: '',
								confirmText: '确定',
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						} catch (e) {
							uni.hideLoading();
						}
					} else {
						uni.showModal({
							title: '',
							content: '请选择图片',
							showCancel: false,
							cancelText: '',
							confirmText: '确定',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}
				}
			});
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onLoad: async function(options) {
		this.action = this.$http.config.baseURL;
		this.formData = {
			r: 'forum/sendattachmentex',
			module: 'album',
			type: 'image',
			accessToken: this.user.token,
			accessSecret: this.user.secret
		};

		const result = await this.$http.get({
			r: 'user/albumlist'
		});

		let _albumList = [];
		for (let item of result.list) {
			_albumList.push({
				value: item.album_id,
				label: item.title
			});
		}
		this.albumList = _albumList;
	}
};
</script>

<style></style>
