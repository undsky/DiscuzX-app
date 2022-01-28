<template>
	<view class="padding-lr-sm">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<view class="flex">
				<u-form-item :label-position="labelPosition" label="板块" label-width="100" prop="board">
					<u-input :border="border" type="select" :select-open="boardShow" v-model="model.board"
						placeholder="请选择板块" @click="boardShow = true"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="分类" label-width="100" prop="board">
					<u-input :border="border" type="select" :select-open="classShow" v-model="model.class"
						placeholder="请选择分类" @click="classShow = true"></u-input>
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
				<u-upload ref="upload" :action="action" :form-data="formData" name="uploadFile[]" width="160"
					height="160"></u-upload>
			</u-form-item>
			<!-- #ifdef APP || MP-WEIXIN -->
			<u-form-item label-position="top" label="上传音频" prop="audio" label-width="150">
				<view class="uni-padding-wrap response">
					<block v-if="!recording && !playing && !hasRecord">
						<view class="page-body-time">
							<text class="time-big">{{ formatedRecordTime }}</text>
						</view>
						<view class="page-body-buttons">
							<view class="page-body-button"></view>
							<view class="page-body-button" @click="startRecord">
								<image class="audio-image" src="../../static/record.png"></image>
							</view>
							<view class="page-body-button"></view>
						</view>
					</block>
					<block v-if="recording === true">
						<view class="page-body-time">
							<text class="time-big">{{ formatedRecordTime }}</text>
						</view>
						<view class="page-body-buttons">
							<view class="page-body-button"></view>
							<view class="page-body-button" @click="stopRecord">
								<view class="button-stop-record"></view>
							</view>
							<view class="page-body-button"></view>
						</view>
					</block>
					<block v-if="hasRecord === true && playing === false">
						<view class="page-body-time">
							<text class="time-big">{{ formatedPlayTime }}</text>
							<text class="time-small">{{ formatedRecordTime }}</text>
						</view>
						<view class="page-body-buttons">
							<view class="page-body-button" @click="playVoice">
								<image class="audio-image" src="../../static/play.png"></image>
							</view>
							<view class="page-body-button" @click="clear">
								<image class="audio-image" src="../../static/trash.png"></image>
							</view>
						</view>
					</block>
					<block v-if="hasRecord === true && playing === true">
						<view class="page-body-time">
							<text class="time-big">{{ formatedPlayTime }}</text>
							<text class="time-small">{{ formatedRecordTime }}</text>
						</view>
						<view class="page-body-buttons">
							<view class="page-body-button" @click="stopVoice">
								<image class="audio-image" src="../../static/stop.png"></image>
							</view>
							<view class="page-body-button" @click="clear">
								<image class="audio-image" src="../../static/trash.png"></image>
							</view>
						</view>
					</block>
				</view>
			</u-form-item>
			<!-- #endif -->
			<u-form-item label-position="top" label="上传视频" prop="audio" label-width="150">
				<view class="uni-padding-wrap response">
					<template v-if="!src">
						<view class="add-video" @tap="chooseVideo">+ 添加视频</view>
					</template>
					<template v-else>
						<video :src="src" class="video"></video>
						<view class="page-body-buttons">
							<view class="page-body-button" @click="clearVideo()">
								<image class="audio-image" src="../../static/trash.png"></image>
							</view>
						</view>
					</template>
				</view>
			</u-form-item>
		</u-form>
		<view class="margin-top-lg padding-bottom-lg">
			<u-button throttleTime="1000" type="warning" @click="submit">发布</u-button>
		</view>
		<u-select mode="mutil-column-auto" v-model="boardShow" :list="boardList" @confirm="boardConfirm"></u-select>
		<u-select v-model="classShow" :list="classList" @confirm="classConfirm"></u-select>
		<uni-popup @change="handlePopupChange" ref="emoji" type="bottom">
			<dx-emoji></dx-emoji>
		</uni-popup>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import permision from '@/common/permission.js';
	// #endif
	import {
		mapState
	} from 'vuex';

	let _boardId = 0;
	let _classId = 0;

	let playTimeInterval = null;
	let recordTimeInterval = null;
	let recorderManager = null;
	let music = null;

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
					board: [{
						required: true,
						message: '请选择板块',
						trigger: ['change', 'blur']
					}],
					class: [{
						required: true,
						message: '请选择分类',
						trigger: ['change', 'blur']
					}],
					title: [{
						required: true,
						message: '请输入标题',
						trigger: ['change', 'blur']
					}],
					content: [{
						required: true,
						message: '请输入内容',
						trigger: ['change', 'blur']
					}]
				},
				border: false,
				labelPosition: 'left',
				errorType: ['message'],
				showEmoji: false,
				// 录音
				recording: false, //录音中
				playing: false, //播放中
				hasRecord: false, //是否有了一个
				tempFilePath: '',
				recordTime: 0,
				playTime: 0,
				formatedRecordTime: '00:00:00', //录音的总时间
				formatedPlayTime: '00:00:00', //播放录音的当前时间
				// 视频
				src: ''
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

			// 录音

			music = uni.createInnerAudioContext();
			music.onEnded(() => {
				clearInterval(playTimeInterval);
				var playTime = 0;
				console.log('play voice finished');
				this.playing = false;
				this.formatedPlayTime = util.formatTime(playTime);
				this.playTime = playTime;
			});
			recorderManager = uni.getRecorderManager();
			recorderManager.onStart(() => {
				console.log('recorder start');

				this.recording = true;
				recordTimeInterval = setInterval(() => {
					this.recordTime += 1;
					this.formatedRecordTime = util.formatTime(this.recordTime);
				}, 1000);
			});
			recorderManager.onStop(res => {
				console.log('on stop');
				music.src = res.tempFilePath;

				this.hasRecord = true;
				this.recording = false;
			});
			recorderManager.onError(() => {
				console.log('recorder onError');
			});
		},
		onUnload: function() {
			this.end();
			this.src = '';
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

						try {
							let aid = [];
							let body = [{
								type: 0,
								infor: this.model.content
							}];
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
										infor: imgdata.body.attachment[0].urlName.replace(
											'//forum', '/forum')
									});
									aid.push(imgdata.body.attachment[0].id);
								});
							}

							if (this.tempFilePath) {
								const audioResult = await this.$http.uploadAttachment(this.tempFilePath,
									'forum', 'audio');
								if (null == audioResult[0]) {
									const audioData = JSON.parse(audioResult[1].data);
									body.push({
										type: 3,
										infor: audioData.body.attachment[0].urlName
									});
									aid.push(audioData.body.attachment[0].id);
								}
							}

							if (this.src) {
								const videoResult = await this.$http.uploadAttachment(this.src, 'forum',
									'video');
								body.push({
									type: 4,
									infor: videoResult.body.attachment[0].urlName
								});
								aid.push(videoResult.body.attachment[0].id);
							}

							topic.content = JSON.stringify(body);
							topic.aid = aid.join();

							const {
								location
							} = getApp().globalData;
							if (location) {
								topic.isShowPostion = 1;
								topic.longitude = location.longitude;
								topic.latitude = location.latitude;
								topic.location = location.position;
							}

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

							uni.hideLoading();

							this.$util.helper.modal('发帖成功', res => {
								uni.navigateBack({
									delta: 1
								});
							})
						} catch (e) {
							uni.hideLoading();
						}
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
			},
			// 录音
			async startRecord() {
				//开始录音
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
				// #endif

				// TODO ios 在没有请求过权限之前无法得知是否有相关权限，这种状态下需要直接调用录音，但没有状态或回调判断用户拒绝
				recorderManager.start({
					format: 'mp3'
				});
			},
			stopRecord() {
				//停止录音
				recorderManager.stop();
				clearInterval(recordTimeInterval);
			},
			playVoice() {
				console.log('play voice');
				this.playing = true;
				playTimeInterval = setInterval(() => {
					this.playTime += 1;
					this.formatedPlayTime = util.formatTime(this.playTime);
				}, 1000);
				music.play();
			},
			stopVoice() {
				clearInterval(playTimeInterval);
				this.playing = false;
				this.formatedPlayTime = util.formatTime(0);
				this.playTime = 0;
				music.stop();
			},
			end() {
				music.stop();
				if (this.hasRecord) recorderManager.stop();
				clearInterval(recordTimeInterval);
				clearInterval(playTimeInterval);
				(this.recording = false), (this.playing = false), (this.hasRecord = false);
				(this.playTime = 0), (this.recordTime = 0);
				(this.formatedRecordTime = '00:00:00'), (this.formatedRecordTime = '00:00:00');
			},
			clear() {
				this.end();
			},
			clearVideo() {
				this.src = '';
			},
			// #ifdef APP-PLUS
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS('record') : await permision.requestAndroid(
					'android.permission.RECORD_AUDIO');

				if (status === null || status === 1) {
					status = 1;
				} else if (status === 2) {
					uni.showModal({
						content: '系统麦克风已关闭',
						confirmText: '确定',
						showCancel: false,
						success: function(res) {}
					});
				} else {
					uni.showModal({
						content: '需要麦克风权限',
						confirmText: '设置',
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					});
				}
				return status;
			},
			// #endif
			// 视频
			chooseVideo: function() {
				uni.chooseVideo({
					success: res => {
						this.src = res.tempFilePath;
					},
					fail: err => {
						// #ifdef MP
						uni.getSetting({
							success: res => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res
											.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '本应用需要从您的相机或相册获取视频，请在设置界面打开相关权限',
										success: res => {
											if (res.confirm) {
												uni.openSetting();
											}
										}
									});
								}
							}
						});
						// #endif
					}
				});
			}
		}
	};
</script>

<style scoped>
	.video {
		width: 100%;
	}

	.add-video {
		text-align: center;
		line-height: 300rpx;
		background: #f1f1f1;
		font-size: 38rpx;
		color: #808080;
	}

	.audio-image {
		width: 150rpx;
		height: 150rpx;
	}

	.page-body-wrapper {
		justify-content: space-between;
		flex-grow: 1;
		margin-bottom: 300rpx;
	}

	.page-body-time {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time-big {
		font-size: 60rpx;
		margin: 20rpx;
	}

	.time-small {
		font-size: 30rpx;
	}

	.page-body-buttons {
		display: flex;
		justify-content: space-around;
	}

	.page-body-button {
		width: 250rpx;
		text-align: center;
	}

	.button-stop-record {
		width: 110rpx;
		height: 110rpx;
		border: 20rpx solid #fff;
		background-color: #f55c23;
		border-radius: 130rpx;
		margin: 0 auto;
	}

	.choose-emoji {
		position: absolute;
		right: 15px;
		bottom: 15px;
		font-size: 23px;
	}
</style>
