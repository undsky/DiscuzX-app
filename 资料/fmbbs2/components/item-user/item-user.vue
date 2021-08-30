<template>
	<view class="user-item cu-item" @click="navTa">
		<view v-if="icon" class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + icon + ')' }"></view>
		<view :style="{ left: icon ? '73px' : '15px', width: 'calc(100% - ' + (icon ? 73 : 15) + 'px - 15px)' }" class="content">
			<view class="text-grey">
				<view class="text-cut" :class=[fonttitle]>{{ nickname }}</view>
			</view>
			<view class="info-show text-gray text-sm flex justify-between" :class=[fontcontent]>
				<view class="user-info flex">
					<view v-if="gender != null" class="user-nick-name text-green margin-right-xs text-cut">{{ 1 == gender ? '男' : 2 == gender ? '女' : '未知' }}</view>
					<view v-if="note" class="text-cut">
						<jyf-parser selectable @linkpress="handleContentLink" :html="mobcent" />
					</view>
					<view v-if="location" class="text-cut">{{ hidelocation }}</view>
					<view v-if="lastLogin && 'xiaoxi' != type" class="text-cut">{{ timeago }}在线</view>
				</view>
			</view>
		</view>
		<view class="action" :class=[fontcontent]>
			<view v-if="lastLogin && 'xiaoxi' == type" class="text-cut text-gray text-sm">{{ timeago }}</view>
			<view class="cuIcon-right text-gray"></view>
		</view>
	</view>
</template>

<script>
	import {
		format
	} from 'timeago.js';

	export default {
		props: ['uid', 'nickname', 'icon', 'location', 'gender', 'lastLogin', 'note', 'type', 'plid', 'pmid'],
		data() {
			return {
				fontsize: 'normal'
			};
		},
		computed: {
			timeago: function() {
				return format(this.lastLogin, 'zh_CN');
			},
			mobcent: function() {
				return this.$tool.mobcentPhiz(this.note || '');
			},
			hidelocation: function() {
				let _location = this.location
				if (_location.length > 9) {
					_location = _location.substr(0, 10)
				}
				return _location + '...'
			},
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
		},
		methods: {
			handleContentLink: function(link) {
				link.ignore()
				// #ifdef APP-PLUS
				if (link.href.indexOf('foodmate') > -1) {
					uni.navigateTo({
						url: '/pages/wv/wv?url=' + encodeURIComponent(link.href)
					});
				} else {
					plus.runtime.openURL(link.href)
				}
				// #endif
				// #ifndef APP-PLUS
				uni.navigateTo({
					url: '/pages/wv/wv?url=' + encodeURIComponent(link.href)
				});
				// #endif
			},
			navTa: function() {
				uni.navigateTo({
					url: ('xiaoxi' == this.type ? '/pages/chat/chat?plid=' + this.plid + '&pmid=' + this.pmid + '&fromUid=' :
						'/pages/ta/ta?uid=') + this.uid,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	};
</script>

<style>
	.user-item {
		height: 70px !important;
	}

	.info-show .user-nick-name,
	.info-show .board-name {
		max-width: 100px !important;
	}

	.text-cut {
		max-width: none !important;
	}

	.user-info .text-cut {
		max-width: 510upx !important;
	}
</style>
