<script>
	import store from './store/index.js';
	import checkUpdate from "@/uni_modules/uni-upgrade-center-app/utils/check-update"

	export default {
		onLaunch: function() {
			let systemInfo = uni.getSystemInfoSync();
			// #ifdef APP-PLUS
			systemInfo.env = 'app';
			// #endif
			// #ifdef H5
			if ('micromessenger' == window.navigator.userAgent.toLowerCase().match(/micromessenger/i)) {
				systemInfo.env = 'gh';
			} else {
				systemInfo.env = 'h5';
			}
			// #endif
			// #ifdef MP-360
			systemInfo.env = '360';
			// #endif
			// #ifdef MP-ALIPAY
			systemInfo.env = 'alipay';
			// #endif
			// #ifdef MP-BAIDU
			systemInfo.env = 'baidu';
			// #endif
			// #ifdef MP-QQ
			systemInfo.env = 'qq';
			// #endif
			// #ifdef MP-TOUTIAO
			systemInfo.env = 'toutiao';
			// #endif
			// #ifdef MP-WEIXIN
			systemInfo.env = 'weixin';
			// #endif
			systemInfo.platType = 'ios' == systemInfo.platform ? 5 : 'android' == systemInfo.platform ? 1 : 0;
			this.globalData.systemInfo = systemInfo;

			// #ifdef APP
			const {
				clientid
			}
			plus.push.getClientInfo()
			console.log(clientid)

			plus.push.addEventListener('click', function(msg) {
				console.log(msg)
				// setTimeout(() => {
				// 	uni.navigateTo({
				// 		url: ''
				// 	});
				// }, 1000);
			})

			// 在线收到通知
			plus.push.addEventListener('receive', function(msg) {
				console.log(msg)
				if ('receive' == msg.type) {
					plus.push.createMessage(msg.payload.content, '', {
						cover: false,
						title: msg.payload.title
					})
				}
			})
			// #endif

			console.log('App Launch');
		},
		onShow: function() {
			// #ifdef APP
			try {
				callCheckVersion()
			} catch (e) {
				//TODO handle the exception
			}
			// #endif
			try {
				const location = uni.getStorageSync('location');
				if (false !== location) {
					uni.getLocation({
						geocode: true,
						success: res => {
							this.globalData.location = res;
							if (res.address) {
								const {
									province,
									city,
									district,
									street
								} = res.address;
								this.globalData.location.position = (province || '') + (city || '') + (
									district || '') + (street || '');
							}
							this.$nextTick(async () => {
								if (store.state.auth.user) {
									await this.$http.post({
										r: 'user/location',
										longitude: res.longitude,
										latitude: res.latitude,
										location: this.globalData.location.position ||
											''
									});
								}
							});
						}
					});
				}
			} catch (e) {
				//TODO handle the exception
			}

			if (store.state.auth.user) {
				this.globalData.heartInterval = setInterval(async () => {
					const result = await this.$http.get({
						r: 'message/heart'
					});
					store.commit('setHeart', result);
				}, 120000);
			}

			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	@import 'colorui/main.css';
	@import 'colorui/icon.css';

	@import 'uview-ui/index.scss';
</style>
