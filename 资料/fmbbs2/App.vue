<script>
	export default {
		globalData: {
			user: {}
		},
		onLaunch: function() {
			this.globalData.user = uni.getStorageSync('user') || {};
			console.log(this.globalData.user)
			if (this.globalData.user.uid) {
				uni.getStorage({
					key: 'notice',
					success: res => {
						if (false !== res.data) {
							this.$tool.heart()
						}
					},
					fail: err => {
						this.$tool.heart()
					}
				})
			}
		},
		onShow: function() {
			this.globalData.fontsize = 'normal'
			this.globalData.fonttitle = 17
			this.globalData.fontcontent = 13
			this.globalData.fonttitlelg = 21
			this.globalData.fontcontentlg = 16
			uni.getStorage({
				key: 'fontsize',
				success: (res) => {
					this.globalData.fontsize = res.data
					console.log(this.globalData.fontsize)
				},
			})
			console.log('onshow')
			uni.getStorage({
				key: 'location',
				success: (res) => {
					if (res.data !== false) {
						uni.getLocation({
							geocode: true,
							success: res => {
								console.log(res)
								this.globalData.location = res
							},
							fail: err => {
								console.log(err)
							},
							complete: () => {
								console.log('get location complete')
							}
						})
					}
				},
			})

			// #ifdef APP-PLUS  
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				console.log(widgetInfo)
				const sysInfo = uni.getSystemInfoSync()
				console.log(sysInfo)
				uni.request({
					url: 'http://app.foodmate.net/update',
					data: {
						version: widgetInfo.version,
						name: widgetInfo.name,
						platform: sysInfo.platform
					},
					success: (result) => {
						console.log(result)
						var data = result.data;
						if (data.update) {
							if (data.wgtUrl) {
								uni.downloadFile({
									url: data.wgtUrl,
									success: (downloadResult) => {
										if (downloadResult.statusCode === 200) {
											plus.runtime.install(downloadResult.tempFilePath, {
												force: false
											}, function() {
												console.log('install success...');
												plus.runtime.restart();
											}, function(e) {
												console.error('install fail...');
											});
										}
									}
								});
							} else if (data.pkgUrl) {
								uni.showModal({
									title: '升级提示',
									content: '有新的版本，请升级',
									showCancel: true,
									cancelText: '取消',
									confirmText: '确定',
									success: res => {
										if (res.confirm) {
											plus.runtime.openURL(data.pkgUrl)
										}
									},
									fail: () => {},
									complete: () => {}
								});
							}
						}
					}
				});
			});
			// #endif
		},
		onHide: function() {

		}
	};
</script>

<style>
	@import 'colorui/animation.css';
	@import 'colorui/main.css';
	@import 'colorui/icon.css';

	/* 字体大小 */
	.diy-default {
		font-size: 13px !important;
	}

	.diy-title-normal {
		font-size: 17px !important;
	}

	.diy-content-normal {
		font-size: 13px !important;
	}

	.diy-title-lg {
		font-size: 21px !important;
	}

	.diy-content-lg {
		font-size: 16px !important;
	}

	.item-media {
		max-width: 100%;
	}

	.item-media .uni-audio-default {
		min-width: initial;
	}

	.cu-list+.cu-list {
		margin-top: 5px !important;
	}

	.img-emoji {
		width: 22px !important;
		height: 22px !important;
	}

	.no-margin {
		margin: 0 !important;
	}

	.no-padding {
		padding: 0 !important;
	}

	.hide {
		display: none !important;
	}

	.no-border {
		border: none !important;
	}
</style>
