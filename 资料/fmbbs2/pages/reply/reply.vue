<template>
	<view>
		<!-- <view class="cu-form-group"><input @blur="handleBlurTitle" :value="title" placeholder="请输入标题" /></view> -->
		<view class="cu-form-group solids-bottom" style="position: relative;">
			<textarea :class=[fonttitle] @blur="handleBlurContent" :value="content" style="height: 150px;" maxlength="-1" placeholder="请输入内容"></textarea>
			<view @click="addEmoji" class="pub-emoji"><text class="cuIcon-emojifill text-grey"></text></view>
		</view>
		<uni-collapse>
			<uni-collapse-item title="上传图片">
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
		<!-- #ifndef H5 -->
		<uni-collapse>
			<uni-collapse-item title="录音">
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
		<view class="padding flex flex-direction"><button @click="pub" class="cu-btn bg-blue margin-tb-sm lg" :class=[fonttitle]>回复</button></view>
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
				fontsize: 'normal',
				title: '',
				content: '',
				showEmoji: false,
				fid: null,
				tid: null,
				replyId: null,
				isQuote: 0,
				location: '',
				address: '',
				sysinfo: {},
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
		methods: {
			pub: async function() {
				// if (this.title) {
				if (this.content) {
					this.$tool.loading()
					let aid = [];
					let body = [];
					let newreply = {
						fid: this.fid,
						tid: this.tid,
						replyId: this.replyId,
						isHidden: 0,
						isQuote: this.isQuote,
						isAnonymous: 0,
						isOnlyAuthor: 0
					};
					if (this.location) {
						newreply.isShowPostion = 1;
						newreply.longitude = this.location.longitude;
						newreply.latitude = this.location.latitude;
						newreply.location = this.address;
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
					newreply.content = JSON.stringify(body);
					newreply.aid = aid.join();
					const replyres = await this.$tool.getData({
							r: this.$api.topicadmin,
							platType: 'ios' == this.sysinfo.platform ? 5 : 1,
							act: 'reply',
							json: JSON.stringify({
								body: {
									json: newreply
								}
							})
						},
						'post', true
					);
					this.$tool.loaded()
					if (replyres) {
						uni.$emit('reply');
						this.$tool.modal(replyres.errcode, () => {
							uni.navigateBack({});
						});
					}
				} else {
					this.$tool.modal('请输入内容');
				}
				// } else {
				// 	this.$tool.modal('请输入标题');
				// }
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
				this.tempFilePath = null;
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
				title: '高级回复'
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
		onLoad: function(options) {
			this.fid = options.fid;
			this.tid = options.tid;
			this.replyId = options.replyId;
			this.isQuote = options.isQuote || 0

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
				this.tempFilePath = res.tempFilePath;
				music.src = res.tempFilePath;

				this.hasRecord = true;
				this.recording = false;
			});
			recorderManager.onError(() => {
				console.log('recorder onError');
			});
			// #endif
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
