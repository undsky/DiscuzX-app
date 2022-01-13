<template>
	<view>
		<u-navbar :background="background" back-icon-color="#FFFFFF" :title="forumName" title-bold title-color="#FFFFFF">
			<view @click="showAction" class="margin-right flex" slot="right"><u-icon name="more-dot-fill" color="#FFFFFF" size="38"></u-icon></view>
		</u-navbar>
		<view class="cu-card">
			<view class="cu-item">
				<view class="title text-bold text-lg">{{ topic.title }}</view>
				<view class="flex justify-between margin-top">
					<view class="text-gray text-sm text-left">{{ $u.timeFrom(topic.create_date) }}</view>
					<view class="text-gray text-sm text-right">
						<text class="cuIcon-attentionfill margin-lr-xs"></text>
						{{ topic.hits }}
						<text class="cuIcon-messagefill margin-lr-xs"></text>
						{{ topic.replies }}
					</view>
				</view>
			</view>
		</view>
		<view class="cu-list menu-avatar">
			<view class="cu-item cur">
				<view @click="userSheet()" class="cu-avatar round lg" :style="'background-image:url(' + topic.icon + ');'"></view>
				<view @click="userSheet()" class="content">
					<view>
						<view class="text-cut flex">{{ topic.user_nick_name }}</view>
					</view>
					<view class="text-orange text-sm">{{ topic.userTitle }}</view>
				</view>
				<view class="action">
					<view class="text-blue text-xs">楼主</view>
					<view class="flex justify-around align-center">
						<view @click="zan(0)" class="cuIcon-appreciatefill text-gray"></view>
						<view @click="manageSheet()" class="cuIcon-settingsfill text-gray margin-0"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="padding-sm"><mp-html lazy-load :content="content" /></view>
		<z-paging ref="paging" use-page-scroll v-model="commentList" autowire-query-name="zQuery">
			<view class="cu-list menu-avatar comment">
				<view v-for="(item, index) in commentList" :key="item.reply_posts_id" class="cu-item">
					<view @click="userSheet(item.reply_id)" class="cu-avatar round" :style="'background-image:url(' + item.icon + ');'"></view>
					<view class="content">
						<view @click="userSheet(item.reply_id)" class="text-grey">{{ item.reply_name }}</view>
						<view class="text-gray text-content text-df"><mp-html lazy-load :content="$util.mobcent.content(item.reply_content)" /></view>
						<view v-if="item.quote_content" class="bg-grey padding-sm radius margin-top-sm  text-sm">
							<mp-html lazy-load :content="$util.mobcent.phiz(item.quote_content)" />
						</view>
						<view class="margin-top-sm flex justify-between">
							<view class="text-gray text-df">{{ $u.timeFrom(item.posts_date) }}</view>
							<view class="flex">
								<view @click="zan(item.reply_posts_id)" class="cuIcon-appreciatefill text-gray margin-right-sm"></view>
								<view @click="reply(item.reply_posts_id)" class="cuIcon-messagefill text-gray margin-right-sm"></view>
								<view @click="manageSheet(item.reply_posts_id, item.reply_id)" class="cuIcon-settingsfill text-gray"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
		<view class="cu-tabbar-height"></view>
		<dx-chatbar ref="chatbar" :showImg="false"></dx-chatbar>
		<u-popup v-model="showShare" mode="bottom" safe-area-inset-bottom><dx-share></dx-share></u-popup>
	</view>
</template>

<script>
import { setClipboardData } from '@/uni_modules/u-clipboard/js_sdk';
import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';
import { mapState } from 'vuex';

let _id;

export default {
	mixins: [ZPagingMixin],
	data() {
		return {
			background: {
				backgroundColor: '#606266'
			},
			firstLoaded: false,
			topic: {},
			boardId: 0,
			authorId: 0,
			replyId: null,
			order: 1,
			forumName: '',
			forumTopicUrl: '',
			commentList: [],
			showShare: false
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		}),
		content: function() {
			return this.$util.mobcent.content(this.topic.content);
		}
	},
	onLoad: async function(options) {
		_id = options.id;

		uni.$on('reply', async data => {
			if (this.user) {
				let isQuote = 0;
				let replyId = this.topic.reply_posts_id;
				if (this.replyId) {
					isQuote = 1;
					replyId = this.replyId;
					this.replyId = null;
				}
				const result = await this.$http.post({
					r: 'forum/topicadmin',
					act: 'reply',
					platType: getApp().globalData.systemInfo.platType,
					json: JSON.stringify({
						body: {
							json: {
								isHidden: 0,
								isQuote,
								isAnonymous: 0,
								isOnlyAuthor: 0,
								fid: this.boardId,
								tid: _id,
								replyId,
								content: JSON.stringify([
									{
										type: 0,
										infor: data
									}
								])
							}
						}
					})
				});
				this.$refs.chatbar.replytext = '';
				uni.showToast({
					title: result.errcode
				});
				this.$refs.paging.reload();
			} else {
				uni.navigateTo({
					url: '../auth/auth',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		});
	},
	methods: {
		zQuery: async function(page, pageSize) {
			const result = await this.$http.get(
				{
					r: 'forum/postlist',
					topicId: _id,
					authorId: this.authorId,
					order: this.order,
					page,
					pageSize
				},
				{
					custom: {
						auth: false
					}
				}
			);
			if (!this.firstLoaded) {
				this.boardId = result.boardId;
				this.forumName = result.forumName;
				this.forumTopicUrl = result.forumTopicUrl;
				this.topic = result.topic;
			}
			this.$refs.paging.complete(result.list);
			this.firstLoaded = true;
		},
		userSheet(reply_id) {
			if (this.user) {
				uni.showActionSheet({
					itemList: [0 == this.authorId ? '只看他的' : '查看全部', '发送消息', '查看主页'],
					success: res => {
						const uid = reply_id || this.topic.user_id;
						console.log(uid);
						switch (res.tapIndex) {
							case 0:
								this.authorId = this.authorId == 0 ? uid : 0;
								this.$refs.paging.reload();
								break;
							case 1:
								uni.navigateTo({
									url: '../chat/chat?fromUid=' + uid,
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
								break;
							case 2:
								uni.navigateTo({
									url: '../user/home?uid=' + uid,
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
								break;
						}
					},
					fail: () => {},
					complete: () => {}
				});
			} else {
				uni.navigateTo({
					url: '../auth/auth',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		zan: async function(pid) {
			const result = await this.$http.post({
				r: 'forum/support',
				tid: _id,
				pid,
				type: pid ? 'post' : 'thread'
			});
			uni.showToast({
				title: result.errcode
			});
		},
		reply(reply_posts_id) {
			this.replyId = reply_posts_id;
			this.$refs.chatbar.getFocus();
		},
		manageSheet(reply_posts_id, reply_id) {
			if (this.user) {
				uni.showActionSheet({
					itemList: [reply_posts_id ? '举报回帖' : '举报帖子', '举报用户'],
					success: res => {
						uni.navigateTo({
							url: `../feedback/feedback?type=${0 == res.tapIndex ? 'post' : 'user'}&id=${
								0 == res.tapIndex ? reply_posts_id || this.topic.topic_id : reply_id || this.topic.user_id
							}`,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					},
					fail: () => {},
					complete: () => {}
				});
			} else {
				uni.navigateTo({
					url: '../auth/auth',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		showAction: async function() {
			uni.showActionSheet({
				itemList: ['收藏', '分享', '复制链接', 1 == this.order ? '倒序查看' : '正序查看'],
				success: async res => {
					switch (res.tapIndex) {
						case 0:
							if (this.user) {
								await this.$http.post({
									r: 'user/userfavorite',
									id: _id,
									idType: 'tid',
									action: 'favorite'
								});
								uni.showToast({
									title: '收藏成功'
								});
							} else {
								uni.navigateTo({
									url: '../auth/auth',
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
							}
							break;
						case 1:
							this.showShare = true;
							break;
						case 2:
							try {
								await setClipboardData(this.forumTopicUrl);
								uni.showToast({
									title: '复制成功'
								});
							} catch (e) {
								uni.showToast({
									title: '复制失败'
								});
							}
							break;
						case 3:
							this.order = 1 == this.order ? 0 : 1;
							this.$refs.paging.reload();
							break;
					}
				},
				fail: () => {},
				complete: () => {}
			});
		}
	}
};
</script>

<style></style>
