<template>
	<view class="xcx-cu-item cu-item">
		<view @click="handleUserAction" class="cu-avatar round" :style="{ backgroundImage: 'url(' + icon + ')' }"></view>
		<view class="content flex-sub">
			<view class="flex justify-between text-grey" :class=[fonttitle]>
				<text>{{ reply_name }}</text>
				<text>{{ floor }}楼</text>
			</view>
			<view class="text-orange text-sm" :class=[fontcontent]>{{ userTitle }}</view>
			<view class="text-gray text-content text-df" :class=[fontcontent]>
				<jyf-parser selectable @linkpress="handleContentLink" :html="mobcent" />
				<!-- <block v-for="(item,index) in reply_content" :key="index">
					<view v-if="2 == item.type && item.infor" v-html="$tool.addVideo(item.infor)"></view>
					<view v-if="3 == item.type && item.infor" v-html="$tool.addAudio(item.infor)"></view>
				</block> -->
			</view>
			<view v-if="quote_content" class="flex-sub bg-grey padding-sm radius margin-top-sm text-sm" :class=[fontcontent]>
				<jyf-parser selectable @linkpress="handleContentLink" :html="mobcentQuote" />
				<!-- <block v-for="(item,index) in quote_content" :key="index">
					<view v-if="2 == item.type && item.infor" v-html="$tool.addVideo(item.infor)"></view>
					<view v-if="3 == item.type && item.infor" v-html="$tool.addAudio(item.infor)"></view>
				</block> -->
			</view>
			<!-- </view> -->
			<view class="margin-top-sm flex justify-between" :class=[fontcontent]>
				<view class="text-gray">{{ timeago }}</view>
				<view class="text-gray">
					<text @click="handleZan" class="cuIcon-appreciatefill"></text>
					<text @click="handleReply" class="cuIcon-messagefill margin-left-sm"></text>
					<text @click="handleControlAction" class="margin-left-sm">管理</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		format
	} from 'timeago.js';

	export default {
		props: [
			'topicId',
			'boardId',
			'reply_id',
			'reply_posts_id',
			'icon',
			'reply_name',
			'position',
			'userTitle',
			'quote_content',
			'reply_content',
			'posts_date',
			'quote_user_name',
			'floor',
			'managePanel'
		],
		data() {
			return {
				user: {},
				authorId: 0,
				userActions: ['发送消息', '查看主页'],
				controlActions: [],
				fontsize: 'normal'
			};
		},
		computed: {
			timeago: function() {
				return format(this.posts_date, 'zh_CN');
			},
			mobcent: function() {
				return this.$tool.mobcentContent(this.reply_content || '');
			},
			mobcentQuote: function() {
				return this.$tool.mobcentPhiz(this.quote_content || '');
			},
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		methods: {
			handleContentLink: function(link) {
				link.ignore();
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
			handleReply: function() {
				this.$tool.needLogin(() => {
					uni.navigateTo({
						url: '/pages/reply/reply?isQuote=1&fid=' + this.boardId + '&tid=' + this.topicId + '&replyId=' + this.reply_posts_id
					});
				});
			},
			handleControlAction: function() {
				uni.$emit('topicshowbar', {
					showbar: false
				});
				uni.showActionSheet({
					itemList: this.controlActions,
					success: res => {
						switch (res.tapIndex) {
							case 0:
								this.$tool.needLogin(() => {
									uni.navigateTo({
										url: '/pages/jubao/jubao?type=post&id=' + this.reply_posts_id
									});
								});
								break;
							case 1:
								this.$tool.needLogin(() => {
									uni.navigateTo({
										url: '/pages/jubao/jubao?type=user&id=' + this.reply_id
									});
								});
								break;
							case 2:
								this.$tool.needLogin(() => {
									uni.navigateTo({
										url: '/pages/wv/wv?url=' +
											encodeURIComponent(
												this.$tool.urlParams(this.$api.base, {
													r: this.$api.topicrate,
													tid: this.topicId,
													pid: this.reply_posts_id,
													type: 'view',
													accessToken: this.user.token,
													accessSecret: this.user.secret
												})
											)
									});
								});
								break;
							case 3:
								uni.navigateTo({
									url: '/pages/wv/wv?url=' +
										encodeURIComponent(
											this.$tool.urlParams(this.$api.base, {
												r: this.$api.ratelistview,
												tid: this.topicId,
												pid: this.reply_posts_id,
												accessToken: this.user.token,
												accessSecret: this.user.secret
											})
										)
								});
								break;
						}
						if (res.tapIndex > 3) {
							const control = this.managePanel[res.tapIndex - 4];
							let action = control.action;
							if ('edit' == control.type) {
								action = this.$tool.urlParams(action, {
									accessToken: this.user.token,
									accessSecret: this.user.secret
								});
							}
							uni.navigateTo({
								url: '/pages/wv/wv?title=' + control.title + '&url=' + encodeURIComponent(action)
							});
						}
					},
					complete: () => {
						uni.$emit('topicshowbar', {
							showbar: true
						});
					}
				});
			},
			handleUserAction: function() {
				uni.$emit('topicshowbar', {
					showbar: false
				});
				uni.showActionSheet({
					itemList: [this.authorId == 0 ? '只看作者' : '查看全部'].concat(this.userActions),
					success: res => {
						switch (res.tapIndex) {
							case 0:
								this.authorId = this.authorId == 0 ? this.reply_id : 0;
								uni.$emit('topicauthor', {
									authorId: this.authorId
								});
								break;
							case 1:
								this.$tool.needLogin(() => {
									uni.navigateTo({
										url: '/pages/chat/chat?fromUid=' + this.reply_id
									});
								});
								break;
							case 2:
								this.$tool.needLogin(() => {
									uni.navigateTo({
										url: '/pages/ta/ta?uid=' + this.reply_id
									});
								});
								break;
							default:
								break;
						}
					},
					complete: () => {
						uni.$emit('topicshowbar', {
							showbar: true
						});
					}
				});
			},
			handleZan: async function() {
				this.$tool.needLogin(async () => {
					const data = await this.$tool.getData({
						r: this.$api.support,
						tid: this.topicId,
						pid: this.reply_posts_id,
						type: 'post'
					});
					if (data) {
						this.$tool.modal(data.errcode);
					}
				});
			}
		},
		created: function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			this.user = getApp().globalData.user || {};
			let controlActions = ['举报回帖', '举报用户', '我要评分', '更多评分'];
			if (this.managePanel && this.managePanel.length > 0) {
				for (let item of this.managePanel) {
					controlActions.push(item.title);
				}
			}
			this.controlActions = controlActions;
		}
	};
</script>

<style></style>
