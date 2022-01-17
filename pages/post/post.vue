<template>
	<view class="padding-lr-sm">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<view class="flex">
				<u-form-item :label-position="labelPosition" label="板块" label-width="100" prop="board">
					<u-input :border="border" type="select" :select-open="boardShow" v-model="model.board" placeholder="请选择板块" @click="boardShow = true"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="分类" label-width="100" prop="board">
					<u-input :border="border" type="select" :select-open="classShow" v-model="model.class" placeholder="请选择分类" @click="classShow = true"></u-input>
				</u-form-item>
			</view>
			<u-form-item label-width="100" :label-position="labelPosition" label="标题" prop="title">
				<u-input :border="border" placeholder="请输入标题" v-model="model.title" type="text"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="内容" prop="content">
				<u-input type="textarea" :border="border" height="230" placeholder="请填写内容" v-model="model.content" />
				<view @click="chooseEmoji" class="choose-emoji"><text class="cuIcon-emojifill text-grey"></text></view>
			</u-form-item>
			<u-form-item label-position="top" label="上传图片" prop="photo" label-width="150">
				<u-upload ref="upload" :action="action" :form-data="formData" name="uploadFile[]" width="160" height="160"></u-upload>
			</u-form-item>
			<u-form-item label-position="top" label="上传音频" prop="audio" label-width="150">
				
			</u-form-item>
			<u-form-item label-position="top" label="上传视频" prop="video" label-width="150">
				
			</u-form-item>
		</u-form>
		<view class="margin-top-lg"><u-button throttleTime="1000" type="warning" @click="submit">发布</u-button></view>
		<u-select mode="mutil-column-auto" v-model="boardShow" :list="boardList" @confirm="boardConfirm"></u-select>
		<u-select v-model="classShow" :list="classList" @confirm="classConfirm"></u-select>
		<uni-popup @change="handlePopupChange" ref="emoji" type="bottom"><dx-emoji></dx-emoji></uni-popup>
	</view>
</template>

<script>
import { mapState } from 'vuex';

let _boardId = 0;
let _classId = 0;

export default {
	data() {
		return {
			action: '',
			formData: {},
			boardShow: false,
			classShow: false,
			boardList: [],
			classList: [],
			model: {
				title: '',
				content: '',
				board: null,
				class: null
			},
			rules: {
				board: [
					{
						required: true,
						message: '请选择板块',
						trigger: ['change', 'blur']
					}
				],
				class: [
					{
						required: true,
						message: '请选择分类',
						trigger: ['change', 'blur']
					}
				],
				title: [
					{
						required: true,
						message: '请输入标题',
						trigger: ['change', 'blur']
					}
				],
				content: [
					{
						required: true,
						message: '请输入内容',
						trigger: ['change', 'blur']
					}
				]
			},
			border: false,
			labelPosition: 'left',
			errorType: ['message'],
			showEmoji: false
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onLoad: async function(options) {
		uni.$on('tapemoji', data => {
			this.model.content += data.emoji;
		});

		this.action = this.$http.config.baseURL;
		this.formData = {
			r: 'forum/sendattachmentex',
			module: 'forum',
			type: 'image',
			accessToken: this.user.token,
			accessSecret: this.user.secret
		};
		const result = await this.$http.get({
			r: 'forum/forumlist'
		});
		let _boardList = [];
		for (let item of result.list) {
			let _board = {
				value: item.board_category_id,
				label: item.board_category_name,
				children: []
			};
			for (let item2 of item.board_list) {
				_board.children.push({
					value: item2.board_id,
					label: item2.board_name
				});
			}
			_boardList.push(_board);
		}
		this.boardList = _boardList;
	},
	methods: {
		boardConfirm(e) {
			this.model.board = '';
			_classId = 0;
			this.model.class = '';
			e.map(async (val, index) => {
				_boardId = val.value;
				this.model.board += this.model.board == '' ? val.label : '-' + val.label;

				const result = await this.$http.post({
					r: 'forum/topiclist',
					boardId: _boardId
				});
				let _classList = [];
				for (let item of result.classificationType_list) {
					_classList.push({
						value: item.classificationType_id,
						label: item.classificationType_name
					});
				}
				this.classList = _classList;
			});
		},
		classConfirm(e) {
			this.model.class = '';
			e.map((val, index) => {
				_classId = val.value;
				this.model.class = val.label;
			});
		},
		submit: async function() {
			this.$refs.uForm.validate(async valid => {
				if (valid) {
					uni.showLoading({
						mask: true
					});
					
					let aid = [];
					let body = [
						{
							type: 0,
							infor: this.model.content
						}
					];
					let topic = {
						title: this.model.title,
						fid: _boardId,
						typeId: _classId,
						isOnlyAuthor: 0,
						isHidden: 0,
						isAnonymous: 0
					};
					const images = this.$refs.upload.lists;
					if (images && images.length > 0) {
						images.forEach(res => {
							const imgdata = res.response;
							body.push({
								type: 1,
								infor: imgdata.body.attachment[0].urlName.replace('//forum', '/forum')
							});
							aid.push(imgdata.body.attachment[0].id);
						});
					}
					topic.content = JSON.stringify(body);
					topic.aid = aid.join();

					const result = await this.$http.post({
						r: 'forum/topicadmin',
						act: 'new',
						platType: getApp().globalData.systemInfo.platType,
						json: JSON.stringify({
							body: {
								json: topic
							}
						})
					});
					
					uni.hideLoading()
					
					uni.showModal({
						title: '',
						content: '发帖成功',
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
		},
		chooseEmoji: function() {
			if (this.showEmoji) {
				this.showEmoji = false;
				this.$refs.emoji.close();
			} else {
				this.showEmoji = true;
				this.$refs.emoji.open();
			}
		},
		handlePopupChange: function(e) {
			if (!e.show) {
				this.showEmoji = false;
			}
		}
	}
};
</script>

<style scoped>
.choose-emoji {
	position: absolute;
	right: 15px;
	bottom: 15px;
	font-size: 23px;
}
</style>
