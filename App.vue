<script>
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
		console.log(systemInfo);
		console.log('App Launch');
	},
	onShow: function() {
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
