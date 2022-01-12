<template>
	<view>
		<scroll-view scroll-y :scroll-into-view="gotoView" class="cu-chat page">
			<block v-for="item in messages" :key="item.mid">
				<view :id="'chat_' + item.mid" v-if="item.sender == user.uid" class="cu-item self">
					<view class="main chat-box">
						<view v-if="'text' == item.type" class="content bg-green shadow" :class=[fonttitle]>
							<jyf-parser selectable @linkpress="handleContentLink" :html="mobcent(item.content)" />
						</view>
						<view v-if="'audio' == item.type" class="content bg-green shadow">
							<text class="cuIcon-sound text-xxl padding-right-xl" :data-content="item.content"> </text>
						</view>
						<image v-if="'image' == item.type" :src="item.content" class="radius" mode="widthFix"></image>
					</view>
					<view class="cu-avatar radius" :style="{ backgroundImage: 'url(' + user.avatar + ')' }"></view>
					<view class="date" :class=[fontcontent]>{{ timeago(item.time) }}</view>
				</view>
				<view :id="'chat_' + item.mid" v-else class="cu-item">
					<view class="cu-avatar radius" :style="{ backgroundImage: 'url(' + fromUser.avatar + ')' }"></view>
					<view class="main chat-box">
						<view v-if="'text' == item.type" class="content shadow" :class=[fonttitle]>
							<jyf-parser selectable @linkpress="handleContentLink" :html="mobcent(item.content)" />
						</view>
						<view v-if="'audio' == item.type" class="content bg-green shadow">
							<text class="cuIcon-sound text-xxl padding-right-xl" :data-content="item.content"> </text>
						</view>
						<image v-if="'image' == item.type" :src="item.content" class="radius" mode="widthFix"></image>
					</view>
					<view class="date "  :class=[fontcontent]>{{ timeago(item.time) }}</view>
				</view>
			</block>
		</scroll-view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view @click="sendImg" class="action">
				<text class="cuIcon-pic text-grey"></text>
			</view>
			<input :class=[fonttitle] :value="replytext" placeholder="请输入内容" class="uni-input solid-bottom" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<view @click="handleEmoji" class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button @click="send" class="cu-btn bg-green shadow" :class=[fonttitle]>发送</button>
		</view>
		<uni-popup @change="handlePopupChange" ref="emoji" type="bottom">
			<emoji></emoji>
		</uni-popup>
	</view>
</template>

<script>
	import {
		format
	} from 'timeago.js';

	export default {
		data() {
			return {
				gotoView: '',
				replytext: '',
				showEmoji: false,
				InputBottom: 0,
				fromUid: 0,
				plid: 0,
				pmid: 0,
				user: {},
				fromUser: {},
				messages: [],
				fontsize: 'normal'
			};
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
			sendImg: async function() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: async images => {
						const path = images.tempFilePaths[0]
						const res = await this.$tool.upload(path)
						if (null == res[0]) {
							if (200 == res[1].statusCode) {
								const data = JSON.parse(res[1].data);
								const img = data.body.attachment[0].urlName;
								await this.sendMessage('image', img)
							}
						}
					}
				})
			},
			sendMessage: async function(type, content) {
				const res = await this.$tool.getData({
					r: this.$api.pmadmin,
					json: encodeURIComponent(JSON.stringify({
						toUid: this.fromUid,
						plid: this.plid,
						pmid: this.pmid,
						msg: {
							type: type,
							content: content
						}
					})),
				}, 'post')
				console.log(res)
				if (res) {
					this.messages.push({
						sender: this.user.uid,
						type: type,
						content: content,
						time: res.body.sendTime,
						mid: res.body.pmid
					})
					this.$tool.modal('发送成功', () => {
						this.gotoView = 'chat_' + this.messages[this.messages.length - 1].mid
					})
				}
			},
			send: async function() {
				setTimeout(async () => {
					if (this.replytext) {
						await this.sendMessage('text', this.replytext)
					} else {
						this.$tool.modal('请输入内容');
					}
				}, 500);
			},
			timeago: function(datetime) {
				return format(datetime, 'zh_CN');
			},
			mobcent: function(content) {
				return this.$tool.mobcentPhiz((content || '').replace(/http(.*?) /g, '<a href="http$1">http$1</a>'));
			},
			handlePopupChange: function(e) {
				if (!e.show) {
					this.InputBottom = 0;
					this.showEmoji = false;
				}
			},
			handleEmoji: function() {
				if (this.showEmoji) {
					this.InputBottom = 0;
					this.showEmoji = false;
					this.$refs.emoji.close();
				} else {
					this.InputBottom = 200;
					this.showEmoji = true;
					this.$refs.emoji.open();
				}
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height;
				this.showEmoji = false;
				this.$refs.emoji.close();
			},
			InputBlur(e) {
				this.replytext = e.detail.value;
				this.InputBottom = 0;
				this.showEmoji = false;
				this.$refs.emoji.close();
			},
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
			this.user = getApp().globalData.user || {}
			uni.setNavigationBarTitle({
				title: '消息'
			})
		},
		onLoad: async function(options) {
			this.fromUid = options.fromUid
			this.plid = options.plid
			this.pmid = options.pmid
			const pmlist = {
				body: {
					externInfo: {
						onlyFromUid: 0
					},
					pmInfos: [{
						startTime: 0,
						stopTime: 0,
						cacheCount: 0,
						fromUid: this.fromUid,
						pmLimit: this.$config.pageSize
					}]
				}
			}
			this.$tool.loading()
			const res = await this.$tool.getData({
				r: this.$api.pmlist,
				pmlist: JSON.stringify(pmlist)
			}, 'post', true)
			if (res) {
				const pm = res.body.pmList[0]
				this.fromUser = {
					avatar: pm.avatar,
					fromUid: pm.fromUid,
					name: pm.name,
					plid: pm.plid,
				}
				this.messages = pm.msgList
				if (this.messages && this.messages.length > 0) {
					setTimeout(() => {
						this.$tool.loaded()
						this.gotoView = 'chat_' + this.messages[this.messages.length - 1].mid
					}, 1000)
				} else {
					this.$tool.loaded()
				}
			}
		},
		onReady: function() {
			uni.$on('tapemoji', data => {
				this.replytext += data.emoji;
			});
		}
	}
</script>

<style>
	.page {
		/* #ifdef H5 */
		height: calc(100vh - 45px - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: calc(100vh - 45px);
		/* #endif */
	}

	.cu-tabbar-height {
		min-height: 100upx;
		height: calc(100upx + env(safe-area-inset-bottom) / 2);
	}

	.cu-chat .cu-item>.chat-box {
		max-width: calc(100% - 80px) !important;
	}

	.cu-chat .content {
		word-break: break-all;
	}
</style>
