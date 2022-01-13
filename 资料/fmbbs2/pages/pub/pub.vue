<template>
	<view>
		<view class="grid col-2">
			<view class="cu-form-group">
				<picker mode="multiSelector" @change="multiChange" @columnchange="multiColumnChange" :value="multiIndex" :range="multiArray">
					<view class="txt-left picker text-grey" :class=[fonttitle]>{{ multiIndex[0] > -1 ? multiArray[1][multiIndex[1]] : '请选择板块' }}</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<picker :disabled="multiIndex[0] == -1" @change="pickerChange" :value="index" :range="picker">
					<view class="txt-left picker text-grey" :class=[fonttitle]>{{ index > -1 ? picker[index] : '请选择分类' }}</view>
				</picker>
			</view>
		</view>
		<view class="cu-form-group"><input :class=[fonttitle] @blur="handleBlurTitle" :value="title" placeholder="请输入标题" /></view>
		<view class="cu-form-group" style="position: relative;">
			<textarea :class=[fonttitle] @blur="handleBlurContent" :value="content" style="height: 150px;" maxlength="-1"
			 placeholder="请输入内容"></textarea>
			<view @click="addEmoji" class="pub-emoji"><text class="cuIcon-emojifill text-grey"></text></view>
		</view>
		<view class="cu-form-group">
			<picker @change="seeChange" :value="seeIndex" :range="see">
				<view class="txt-left picker text-grey" :class=[fonttitle]>{{ seeIndex > -1 ? see[seeIndex] : '可见性设置' }}</view>
			</picker>
		</view>
		<uni-collapse>
			<uni-collapse-item :open="openAddImg" title="上传图片">
				<view class="cu-form-group padding">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length < 4"><text class="cuIcon-cameraadd"></text></view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<!-- #ifdef H5 -->
		<uni-collapse>
			<uni-collapse-item :open="openRecord" title="录音">
				<view class="uni-padding-wrap voice-box">
					<block v-if="!recording && !playing && !hasRecord">
						<view class="page-body-time">
							<text class="time-big text-gray">{{ formatedRecordTime }}</text>
						</view>
						<view class="page-body-buttons">
							<view class="page-body-button"></view>
							<view class="page-body-button" @click="startRecord">
								<image class="voice-image" src="../../static/record.png"></image>
							</view>
							<view class="page-body-button"></view>
						</view>
					</block>
					<block v-if="recording === true">
						<view class="page-body-time">
							<text class="time-big text-gray">{{ formatedRecordTime }}</text>
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
							<text class="time-big text-gray">{{ formatedPlayTime }}</text>
							<text class="time-small text-gray">{{ formatedRecordTime }}</text>
						</view>
						<view class="page-body-buttons">
							<view class="page-body-button" @click="playVoice">
								<image class="voice-image" src="../../static/play.png"></image>
							</view>
							<view class="page-body-button" @click="clear">
								<image class="voice-image" src="../../static/trash.png"></image>
							</view>
						</view>
					</block>
					<block v-if="hasRecord === true && playing === true">
						<view class="page-body-time">
							<text class="time-big text-gray">{{ formatedPlayTime }}</text>
							<text class="time-small text-gray">{{ formatedRecordTime }}</text>
						</view>
						<view class="page-body-buttons">
							<view class="page-body-button" @click="stopVoice">
								<image class="voice-image" src="../../static/stop.png"></image>
							</view>
							<view class="page-body-button" @click="clear">
								<image class="voice-image" src="../../static/trash.png"></image>
							</view>
						</view>
					</block>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view v-if="address" class="cu-form-group justify-start">
			<text class="cuIcon-locationfill text-blue margin-right-xs"></text>
			<text class="text-grey">{{ address }}</text>
		</view>
		<!-- #endif -->
		<view class="padding flex flex-direction"><button @click="pub" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>发布</button></view>
		<uni-popup @change="handlePopupChange" ref="emoji" type="bottom">
			<emoji></emoji>
		</uni-popup>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import permision from '@/services/permission.js';
	// #endif
	var util = require('@/services/util.js');
	var playTimeInterval = null;
	var recordTimeInterval = null;
	var recorderManager = null;
	var music = null;

	export default {
		data() {
			return {
				boardId: null,
				fontsize: 'normal',
				openAddImg: false,
				openRecord: false,
				location: null,
				address: '',
				sysinfo: {},
				title: '',
				content: '',
				showEmoji: false,
				type: null,
				classifys: [],
				boards: [],
				multiIndex: [-1, 0],
				multiArray: [],
				index: -1,
				picker: [],
				seeIndex: -1,
				see: ['所有人可见', '回帖仅作者可见'],
				imgList: [],
				// #ifndef H5
				recording: false, //录音中
				playing: false, //播放中
				hasRecord: false, //是否有了一个
				tempFilePath: null,
				recordTime: 0,
				playTime: 0,
				formatedRecordTime: '00:00:00', //录音的总时间
				formatedPlayTime: '00:00:00' //播放录音的当前时间
				// #endif
			};
		},
		computed: {
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		methods: {
			pub: async function() {
				if (this.multiIndex[0] > -1) {
					const _boardid = this.boards[this.multiIndex[0]].board_list[this.multiIndex[1]].board_id
					if (this.index > -1 || 22 == _boardid) {
						if (this.title) {
							if (this.content) {
								try {
									this.$tool.loading()
									let aid = [];
									let body = [];
									let newtopic = {
										title: this.title,
										fid: 22 == _boardid ? 22 : this.boards[this.multiIndex[0]].board_list[this.multiIndex[1]].board_id,
										typeId: 22 == _boardid ? 0 : this.classifys[this.index].classificationType_id,
										isOnlyAuthor: this.seeIndex > -1 ? this.seeIndex : 0,
										isHidden: 0,
										isAnonymous: 0
									};
									if (this.location) {
										newtopic.isShowPostion = 1;
										newtopic.longitude = this.location.longitude;
										newtopic.latitude = this.location.latitude;
										newtopic.location = this.address;
									}
									body.push({
										type: 0,
										infor: this.content
									});
									if (this.tempFilePath) {
										const audiores = await this.$tool.upload(this.tempFilePath, 'forum', 'audio', true);
										if (null == audiores[0]) {
											const audiodata = JSON.parse(audiores[1].data);
											body.push({
												type: 3,
												infor: audiodata.body.attachment[0].urlName
											});
											aid.push(audiodata.body.attachment[0].id);
										}
									}
									const imgres = await Promise.all(this.imgList.map(async img => await this.$tool.upload(img, 'forum', 'image',
										true)));
									imgres.forEach(res => {
										if (null == res[0]) {
											if (200 == res[1].statusCode) {
												const imgdata = JSON.parse(res[1].data);
												body.push({
													type: 1,
													infor: imgdata.body.attachment[0].urlName.replace('//forum', '/forum')
												});
												aid.push(imgdata.body.attachment[0].id);
											}
										}
									});
									newtopic.content = JSON.stringify(body);
									newtopic.aid = aid.join();
									const pubres = await this.$tool.getData({
											r: this.$api.topicadmin,
											platType: 'ios' == this.sysinfo.platform ? 5 : 1,
											act: 'new',
											json: JSON.stringify({
												body: {
													json: newtopic
												}
											})
										},
										'post', true
									);
									this.$tool.loaded()
									if (pubres) {
										this.$tool.modal(pubres.errcode, () => {
											uni.navigateBack({});
										});
									}
								} catch (e) {
									this.$tool.log(e)
								}
							} else {
								this.$tool.modal('请输入内容');
							}
						} else {
							this.$tool.modal('请输入标题');
						}
					} else {
						this.$tool.modal('请选择分类');
					}
				} else {
					this.$tool.modal('请选择板块');
				}
			},
			handleBlurTitle: function(e) {
				setTimeout(() => {
					this.title = e.detail.value;
				});
			},
			handleBlurContent: function(e) {
				this.content = e.detail.value;
			},
			handlePopupChange: function(e) {
				if (!e.show) {
					this.showEmoji = false;
				}
			},
			addEmoji: function() {
				if (this.showEmoji) {
					this.showEmoji = false;
					this.$refs.emoji.close();
				} else {
					this.showEmoji = true;
					this.$refs.emoji.open();
				}
			},
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
				// #ifndef H5
				music.stop();
				recorderManager.stop();
				clearInterval(recordTimeInterval);
				clearInterval(playTimeInterval);
				(this.recording = false), (this.playing = false), (this.hasRecord = false);
				(this.playTime = 0), (this.recordTime = 0);
				(this.formatedRecordTime = '00:00:00'), (this.formatedRecordTime = '00:00:00');
				// #endif
			},
			clear() {
				this.tempFilePath = null
				this.end();
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
			ChooseImage(source) {
				uni.chooseImage({
					count: this.$config.maxImg,
					sourceType: source ? [source] : ['album', 'camera'],
					sizeType: ['compressed'],
					success: res => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths);
						} else {
							this.imgList = res.tempFilePaths;
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					content: '确定要删除图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1);
						}
					}
				});
			},
			pickerChange: async function(e) {
				this.index = e.detail.value == -1 ? 0 : e.detail.value;
			},
			seeChange: async function(e) {
				this.seeIndex = e.detail.value == -1 ? 0 : e.detail.value;
			},
			reloadClassType: async function() {
				this.index = -1;
				this.picker = [];
				const data = await this.$tool.getData({
					r: this.$api.topiclist,
					boardId: this.boards[this.multiIndex[0]].board_list[this.multiIndex[1]].board_id
				});
				console.log(data)
				this.classifys = data.classificationType_list;
				let picker0 = [];
				for (let classify of this.classifys) {
					picker0.push(classify.classificationType_name);
				}
				this.picker = picker0;
			},
			multiChange: async function(e) {
				console.log(e.detail.value)
				if (-1 == e.detail.value[0]) {
					e.detail.value[0] = 0;
				}
				this.multiIndex = e.detail.value;
				this.reloadClassType()
			},
			multiColumnChange: async function(e) {
				// console.log(e.detail)
				if (0 == e.detail.column) {
					let data = {
						multiArray: this.multiArray,
						multiIndex: this.multiIndex
					};
					data.multiIndex[e.detail.column] = e.detail.value;
					const board = this.boards[e.detail.value];
					let multiArray1 = [];
					for (let i = 0; i < board.board_list.length; i++) {
						const childBoard = board.board_list[i];
						multiArray1.push(childBoard.board_name);
					}
					data.multiArray[1] = multiArray1;
					this.multiArray = JSON.parse(JSON.stringify(data.multiArray));
					this.multiIndex = data.multiIndex;
				}
			}
		},
		created: async function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			console.log(this.headStyle)
			uni.setNavigationBarTitle({
				title: '发帖'
			});

			this.location = getApp().globalData.location;
			if (this.location && this.location.address) {
				this.address =
					(this.location.address.province || '') + (this.location.address.city || '') + (this.location.address.district ||
						'') + (this.location.address.street || '');
			}

			uni.getSystemInfo({
				success: res => {
					this.sysinfo = res;
				}
			});
		},
		onUnload: function() {
			this.end();
		},
		onLoad: async function(options) {
			this.boardId = options.board_id
			this.type = options.type;

			const data = await this.$tool.getData({
					r: this.$api.board
				},
				'get',
				true
			);
			this.boards = data.list;
			console.log(this.boards)
			let multiArray0 = [];
			let multiArray1 = [];
			let multiIndex0 = -1;
			let multiIndex1 = 0;
			for (let i = 0; i < this.boards.length; i++) {
				const board = this.boards[i];
				multiArray0.push(board.board_category_name);
				if (options.board_id) {
					for (let j = 0; j < board.board_list.length; j++) {
						if (options.board_id == board.board_list[j].board_id) {
							multiIndex0 = i;
							multiIndex1 = j;
							break;
						}
					}
				}
			}
			const initBoard = this.boards[multiIndex0 > -1 ? multiIndex0 : 0]
			for (let j = 0; j < initBoard.board_list.length; j++) {
				multiArray1.push(initBoard.board_list[j].board_name);
			}
			this.multiArray = [multiArray0, multiArray1];
			if (multiIndex0 > -1) {
				this.multiIndex = [multiIndex0, multiIndex1]
				this.reloadClassType()
			}

			// #ifndef H5
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
				this.tempFilePath = res.tempFilePath
				music.src = res.tempFilePath;

				this.hasRecord = true;
				this.recording = false;
			});
			recorderManager.onError(() => {
				console.log('recorder onError');
			});
			// #endif

			if ('img' == this.type) {
				this.openAddImg = true;
				this.ChooseImage('album');
			} else if ('camera' == this.type) {
				this.openAddImg = true;
				this.ChooseImage('camera');
			} else if ('voice' == this.type) {
				this.openRecord = true;
				this.startRecord();
			}
		},
		onReady: function() {
			uni.$on('tapemoji', data => {
				this.content += data.emoji;
			});
		}
	};
</script>

<style scoped>
	.txt-left {
		text-align: left !important;
	}

	.voice-box {
		background-color: #ffffff;
	}

	.voice-image {
		width: 150upx;
		height: 150upx;
	}

	.page-body-wrapper {
		justify-content: space-between;
		flex-grow: 1;
		margin-bottom: 300upx;
	}

	.page-body-time {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time-big {
		font-size: 60upx;
		margin: 20upx;
	}

	.time-small {
		font-size: 30upx;
	}

	.page-body-buttons {
		/* margin-top: 60upx; */
		display: flex;
		justify-content: space-around;
	}

	.page-body-button {
		width: 250upx;
		text-align: center;
	}

	.button-stop-record {
		width: 110upx;
		height: 110upx;
		border: 20upx solid #fff;
		background-color: #f55c23;
		border-radius: 130upx;
		margin: 0 auto;
	}

	.pub-emoji {
		position: absolute;
		right: 15px;
		bottom: 15px;
		font-size: 20px;
		z-index: 999999999;
	}
</style>
