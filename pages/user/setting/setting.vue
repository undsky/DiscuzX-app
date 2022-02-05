<template>
	<view>
		<u-cell-group>
			<u-cell-item hover-class="none" title="允许访问位置" icon="map" :arrow="false">
				<u-switch slot="right-icon" v-model="locationChecked" @change="locationChange"></u-switch>
			</u-cell-item>
			<!-- #ifdef APP -->
			<u-cell-item @click="noticeSetting" title="通知设置" icon="volume-up">
				<!-- <u-switch slot="right-icon" v-model="noticeChecked" @change="noticeChange"></u-switch> -->
			</u-cell-item>
			<!-- #endif -->
			<u-cell-item @click="showShare = true" icon="share" title="分享"></u-cell-item>
			<u-cell-item @click="$util.helper.goto('/pages/feedback/feedback', true)" icon="question-circle"
				title="意见反馈"></u-cell-item>
		</u-cell-group>
		<u-gap :bg-color="$u.color['infoLight']"></u-gap>
		<u-cell-group>
			<u-cell-item @click="navTo()" icon="info-circle" title="隐私政策"></u-cell-item>
		</u-cell-group>
		<u-popup v-model="showShare" mode="bottom" safe-area-inset-bottom>
			<dx-share></dx-share>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				locationChecked: true,
				noticeChecked: true,
				showShare: false
			};
		},
		methods: {
			locationChange(e) {
				getApp().globalData.location = null;

				uni.setStorageSync('location', this.locationChecked);
			},
			noticeSetting() {
				if ('Android' == plus.os.name) {
					const main = plus.android.runtimeMainActivity();
					const pkName = main.getPackageName();
					const uid = main.getApplicationInfo().plusGetAttribute("uid");
					/**
					 *  是否允许通知
					 */
					// let NotificationManagerCompat = plus.android.importClass(
					// 	"android.support.v4.app.NotificationManagerCompat");
					// //android.support.v4升级为androidx
					// if (NotificationManagerCompat == null) {
					// 	NotificationManagerCompat = plus.android.importClass(
					// 		"androidx.core.app.NotificationManagerCompat");
					// }
					// const areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
					const Intent = plus.android.importClass('android.content.Intent');
					const intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
					const Build = plus.android.importClass("android.os.Build");
					//android 8.0引导  
					if (Build.VERSION.SDK_INT >= 26) {
						intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
					} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
						intent.putExtra("app_package", pkName);
						intent.putExtra("app_uid", uid);
					} else { //(<21)其他--跳转到该应用管理的详情页  
						intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
						const uri = Uri.fromParts("package", mainActivity.getPackageName(),
							null);
						intent.setData(uri);
					}
					// 跳转到该应用的系统通知设置页  
					main.startActivity(intent);
				} else if ('iOS' == plus.os.name) {
					/**
					 *  是否允许通知
					 */
					// let isOn = undefined;
					// let types = 0;
					// const app = plus.ios.invoke('UIApplication', 'sharedApplication');
					// const settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
					// if (settings) {
					// 	types = settings.plusGetAttribute('types');
					// 	plus.ios.deleteObject(settings);
					// } else {
					// 	types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
					// }
					// plus.ios.deleteObject(app);
					// isOn = (0 != types);			
					const app = plus.ios.invoke('UIApplication', 'sharedApplication');
					const setting = plus.ios.invoke('NSURL', 'URLWithString:',
						'app-settings:');
					plus.ios.invoke(app, 'openURL:', setting);
					plus.ios.deleteObject(setting);
					plus.ios.deleteObject(app);

				}
			},
			noticeChange(e) {
				clearInterval(getApp().globalData.heartInterval);
				getApp().globalData.heartInterval = null;
				this.$store.commit('clearHeart');

				uni.setStorageSync('notice', this.noticeChecked);
			},
			navTo() {
				uni.navigateTo({
					url: '/pages/wv/wv?url=' + encodeURIComponent('https://www.undsky.com')
				});
			}
		}
	};
</script>

<style></style>
