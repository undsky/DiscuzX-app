<template>
	<view>
		<scroll-view class="page" scroll-y="true" :scroll-top="scrollTop" @scroll="scroll" @scrolltolower="loadMore">
			<view class="cu-card dynamic">
				<view class="cu-item shadow no-margin">
					<view class="topic-title text-content no-margin" :class=[fonttitle]>{{ topic.title }}</view>
					<view class="flex justify-between text-gray text-sm text-right padding">
						<view :class=[fontcontent]>{{ timeago }}</view>
						<view :class=[fontcontent]>
							<text class="cuIcon-attentionfill margin-lr-xs"></text>
							{{ topic.hits }}
							<text class="cuIcon-messagefill margin-lr-xs"></text>
							{{ topic.replies }}
						</view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view @click="handleUserAction" class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + topic.icon + ')' }"></view>
							<view class="content flex-sub">
								<view class="flex justify-between">
									<text class="text-grey" :class=[fontcontent]>{{ topic.user_nick_name }}</text>
									<text class="text-blue margin-left-sm" :class=[fontcontent]>楼主</text>
								</view>
								<view class="text-gray text-sm flex justify-between">
									<view class="text-orange" :class=[fontcontent]>{{ topic.userTitle }}</view>
									<view class="text-df">
										<text @click="handleZan" class="cuIcon-appreciatefill"></text>
										<text @click="handleControlAction" class="margin-left-sm" :class=[fontcontent]>管理</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="topic-content" :class=[fontcontent]>
						<jyf-parser selectable lazy-load show-with-animation @linkpress="handleContentLink" :html="mobcent" />
						<!-- <block v-for="(item,index) in topic.content" :key="index">
							<view v-if="2 == item.type && item.infor" v-html="$tool.addVideo(item.infor)"></view>
							<view v-if="3 == item.type && item.infor" v-html="$tool.addAudio(item.infor)"></view>
						</block> -->
					</view>
					<block v-if="topic.poll_info && topic.poll_info.is_visible">
						<view class="cu-bar bg-gray solid-bottom margin-top" :class=[fontcontent]>
							<view class="action">投票{{ 2 == topic.poll_info.poll_status ? '（最多可选择' + topic.poll_info.type + '项）' : '结果' }}</view>
						</view>
						<checkbox-group class="block toupiao" @change="CheckboxChange">
							<label v-for="(item, index) in polls" :key="item.poll_item_id" class="cu-form-group">
								<checkbox v-if="2 == topic.poll_info.poll_status" :class="polls[index].checked ? 'checked' : ''" :checked="polls[index].checked ? true : false"
								 :value="'' + item.poll_item_id"></checkbox>
								<view class="title margin-left-sm text-grey">
									<text>{{ item.name }}</text>
									<progress :percent="item.percent" show-info stroke-width="3" />
								</view>
							</label>
						</checkbox-group>
						<view v-if="2 == topic.poll_info.poll_status" style="padding: 0 15px !important;" class="flex flex-direction">
							<button @click="handleToupiao" class="cu-btn bg-blue margin-tb-sm lg shadow" :class=[fontcontent]>投票</button>
						</view>
					</block>
					<view class="cu-bar bg-gray solid-bottom margin-top">
						<view class="action" :class=[fontcontent]>评分</view>
						<view class="action"><button @click="pingfen" class="cu-btn bg-orange" :class=[fontcontent]>我要评分</button></view>
					</view>
					<view v-if="topic.rateList && topic.rateList.head" class="grid col-3 text-center" :class=[fontcontent]>
						<view class="padding-sm text-bold">{{ topic.rateList.head.field1 }}</view>
						<view class="padding-sm text-bold">{{ topic.rateList.head.field2 }}</view>
						<view class="padding-sm text-bold">{{ topic.rateList.head.field3 }}</view>
						<view class="padding-sm text-blue">{{ topic.rateList.total.field1 }}</view>
						<view class="padding-sm text-blue">{{ topic.rateList.total.field2 }}</view>
						<view class="padding-sm text-blue">{{ topic.rateList.total.field3 }}</view>
						<block v-for="(item, index) in topic.rateList.body" :key="index">
							<view class="padding-sm text-green">{{ item.field1 }}</view>
							<view class="padding-sm text-green">{{ item.field2 }}</view>
							<view class="padding-sm text-green">{{ item.field3 }}</view>
						</block>
					</view>
					<view v-else class="padding text-center text-grey" :class=[fontcontent]>呀！目前还没有人评分哦！你先来一个</view>
					<view v-if="topic.rateList && topic.rateList.showAllUrl" class="padding bg-gray solid-bottom solid-top text-center text-blue">
						<text @click="morePingfen" :data-url="topic.rateList.showAllUrl" :class=[fontcontent]>更多评分</text>
					</view>
					<view class="cu-list menu-avatar comment solids-top">
						<item-reply v-for="item in replys" :key="item.reply_posts_id" :managePanel="item.managePanel" :boardId="boardId"
						 :topicId="topicId" :floor="item.position" :reply_id="item.reply_id" :reply_posts_id="item.reply_posts_id" :icon="item.icon"
						 :reply_name="item.reply_name" :position="item.position" :userTitle="item.userTitle" :quote_content="item.quote_content"
						 :reply_content="item.reply_content" :posts_date="item.posts_date" :quote_user_name="item.quote_user_name"></item-reply>
					</view>
				</view>
			</view>
			<!-- <view v-if="total > 0" class="pagination">
				<button class="cu-btn bg-grey prev" @click="gotoPrev" :disabled="!hasprev">上一页</button>
				<view class="cu-form-group">
					<picker class="pages" @change="pickerChange" :value="index" :range="picker">
						<view class="txt-left picker text-grey">{{ this.index == -1 ? '请选择页码' : picker[index] }}</view>
					</picker>
				</view>
				<button class="cu-btn bg-grey next" @click="gotoNext" :disabled="!hasnext">下一页</button>
			</view> -->
		</scroll-view>
		<view class="cu-bar foot input" :style="[{ bottom: InputBottom + 'px' }]" :class="{ hide: !showbar }">
			<view @click="handleReply" class="action"><text class="cuIcon-add text-grey"></text></view>
			<!-- <textarea :auto-height="true" :value="replytext" placeholder="请输入内容" class="uni-input reply-content" :focus="false" @focus="InputFocus" @blur="InputBlur" /> -->
			<input :class=[fonttitle] :value="replytext" placeholder="请输入内容" class="uni-input solid-bottom" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<view @click="handleEmoji" class="action margin-right-xs"><text class="cuIcon-emojifill text-grey"></text></view>
			<button @click="send" style="width: 80px;" class="cu-btn bg-green shadow" :class=[fonttitle]>发送</button>
		</view>
		<uni-popup @change="handleEmojiPopupChange" ref="emoji" type="bottom">
			<emoji :parent="'topic'"></emoji>
		</uni-popup>
		<uni-popup @change="handleSharePopupChange" ref="share" type="bottom">
			<share :title="topic.title" :href="forumTopicUrl" :summary="topic.user_nick_name"></share>
		</uni-popup>
		<view v-show="old.scrollTop > 0" @click="gototop" class="gototop bg-green"><text class="cuIcon-top text-white"></text></view>
	</view>
</template>

<script>
	import {
		format
	} from 'timeago.js';
	// import ClipboardJS from 'clipboard'

	export default {
		data() {
			return {
				user: {},
				showShare: false,
				showEmoji: false,
				showbar: true,
				InputBottom: 0,
				boardId: 0,
				forumTopicUrl: '',
				topicId: 0,
				topic: {},
				replys: [],
				allowLoad: true,
				hasMore: true,
				page: 1,
				order: 0,
				authorId: 0,
				navActions: ['收藏本帖', '分享', '复制链接'],
				// navActions: ['跳转页面', '收藏本帖', '分享', '复制链接', '浏览器打开'],
				userActions: ['发送消息', '查看主页'],
				controlActions: [],
				polls: [],
				checkpolls: [],
				replytext: '',
				sysinfo: null,
				location: null,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				index: -1,
				picker: [],
				total: 0,
				hasprev: false,
				hasnext: false,
				fontsize: 'normal'
			};
		},
		onNavigationBarButtonTap: async function(button) {
			this.showShare = false;
			this.$refs.share.close();
			this.showEmoji = false;
			this.$refs.emoji.close();
			if (0 == button.index) {
				this.showbar = false;
				uni.showActionSheet({
					itemList: [this.order == 0 ? '倒序查看' : '正序查看'].concat(this.navActions),
					success: async res => {
						switch (res.tapIndex) {
							case 0:
								this.order = 0 == this.order ? 1 : 0;
								this.reload(true);
								break;
							case 1:
								this.$tool.needLogin(async () => {
									await this.$tool.getData({
										r: this.$api.userfavorite,
										id: this.topicId,
										idType: 'tid',
										action: 'favorite'
									});
								});
								break;
							case 2:
								this.$nextTick(() => {
									this.showbar = false;
									this.showShare = true;
									this.$refs.share.open();
								});
								break;
							case 3:
								// #ifndef H5
								uni.setClipboardData({
									data: this.forumTopicUrl
								});
								// #endif
								break;
							case 4:
								break;
							default:
								break;
						}
					},
					complete: () => {
						this.showbar = true;
					}
				});
			}
		},
		computed: {
			timeago: function() {
				return format(this.topic.create_date, 'zh_CN');
			},
			mobcent: function() {
				return this.$tool.mobcentContent(this.topic.content);
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
			gotoPrev() {
				this.hasnext = true
				this.page = this.page - 1
				if (1 == this.page) {
					this.hasprev = false
				}
				this.index = this.page - 1
				this.loadMore()
			},
			gotoNext() {
				this.hasprev = true
				this.page = this.page + 1
				if (this.total == this.page) {
					this.hasnext = false
				}
				this.index = this.page - 1
				this.loadMore()
			},
			pickerChange: async function(e) {
				this.index = e.detail.value == -1 ? 0 : e.detail.value;
				this.page = this.index + 1
				this.hasprev = 1 != this.page
				this.hasnext = this.total != this.page
				this.loadMore()
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			gototop(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
					this.old.scrollTop = 0
				});
			},
			openUrl: function(e) {
				plus.runtime.openURL(e.target.dataset.url)
			},
			mobcentPhiz: function(content) {
				return this.$tool.mobcentPhiz(content)
			},
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
			send: async function() {
				this.$tool.needLogin(() => {
					setTimeout(async () => {
						if (this.replytext) {
							if (!this.sysinfo) {
								this.sysinfo = uni.getSystemInfoSync();
							}
							let newreply = {
								isHidden: 0,
								isQuote: 0,
								isAnonymous: 0,
								isOnlyAuthor: 0,
								fid: this.boardId,
								tid: this.topicId,
								replyId: this.topic.reply_posts_id,
								content: JSON.stringify([{
									type: 0,
									infor: this.replytext
								}])
							};
							if (this.location) {
								newreply.isShowPostion = 1;
								newreply.longitude = this.location.longitude;
								newreply.latitude = this.location.latitude;
								newreply.location = this.address;
							}
							const replyres = await this.$tool.getData({
									r: this.$api.topicadmin,
									act: 'reply',
									platType: 'ios' == this.sysinfo.platform ? 5 : 1,
									json: JSON.stringify({
										body: {
											json: newreply
										}
									})
								},
								'post'
							);
							if (replyres) {
								this.loadReply();
								this.$tool.modal(replyres.errcode);
								this.replytext = '';
							}
						} else {
							this.$tool.modal('请输入内容');
						}
					}, 100);
				});
			},
			handleToupiao: async function() {
				this.$tool.needLogin(async () => {
					if (this.checkpolls.length > 0) {
						const data = await this.$tool.getData({
								r: this.$api.vote,
								options: this.checkpolls.join(),
								boardId: this.boardId,
								tid: this.topicId
							},
							'post'
						);
						if (data) {
							this.$tool.modal(data.errcode);
						}
					} else {
						this.$tool.modal('请至少选择一项');
					}
				});
			},
			CheckboxChange: function(e) {
				if (e.detail.value.length > this.topic.poll_info.type) {
					this.$tool.modal('最多可选择' + this.topic.poll_info.type + '项');
				} else {
					let items = [];
					this.checkpolls = e.detail.value;
					for (let poll of this.polls) {
						poll.checked = false;
						for (let check of this.checkpolls) {
							if (poll.poll_item_id == check) {
								poll.checked = true;
								break;
							}
						}
						items.push(poll);
					}
					this.polls = items;
				}
			},
			morePingfen: function(e) {
				uni.navigateTo({
					url: '/pages/wv/wv?url=' + encodeURIComponent(e.target.dataset.url)
				});
			},
			handleEmojiPopupChange: function(e) {
				if (!e.show) {
					this.InputBottom = 0;
					this.showEmoji = false;
				}
			},
			handleSharePopupChange: function(e) {
				if (!e.show) {
					this.InputBottom = 0;
					this.showShare = false;
				}
			},
			pingfen: function() {
				this.$tool.needLogin(() => {
					uni.navigateTo({
						url: '/pages/wv/wv?url=' +
							encodeURIComponent(
								this.$tool.urlParams(this.$api.base, {
									r: this.$api.topicrate,
									tid: this.topicId,
									pid: this.topic.reply_posts_id,
									type: 'view',
									accessToken: this.user.token,
									accessSecret: this.user.secret
								})
							)
					});
				});
			},
			handleReply: function() {
				this.$tool.needLogin(() => {
					uni.navigateTo({
						url: '/pages/reply/reply?fid=' + this.boardId + '&tid=' + this.topic.topic_id + '&replyId=' + this.topic.reply_posts_id
					});
				});
			},
			handleControlAction: function() {
				this.showbar = false;
				uni.showActionSheet({
					itemList: this.controlActions,
					success: res => {
						if (0 == res.tapIndex) {
							this.$tool.needLogin(() => {
								uni.navigateTo({
									url: '/pages/jubao/jubao?type=post&id=' + this.topicId
								});
							});
						} else if (1 == res.tapIndex) {
							this.$tool.needLogin(() => {
								uni.navigateTo({
									url: '/pages/jubao/jubao?type=user&id=' + this.topic.user_id
								});
							});
						} else {
							const control = this.topic.managePanel[res.tapIndex - 2];
							let action = control.action;
							// if ('edit' == control.type) {
							// 	action = this.$tool.urlParams(action, {
							// 		accessToken: this.user.token,
							// 		accessSecret: this.user.secret
							// 	});
							// 	console.log(action)
							// }
							uni.navigateTo({
								url: '/pages/wv/wv?title=' + control.title + '&url=' + encodeURIComponent(action)
							});
						}
					},
					complete: () => {
						this.showbar = true;
					}
				});
			},
			handleUserAction: function() {
				this.showbar = false;
				uni.showActionSheet({
					itemList: [this.authorId == 0 ? '只看作者' : '查看全部'].concat(this.userActions),
					success: res => {
						switch (res.tapIndex) {
							case 0:
								this.authorId = this.authorId == 0 ? this.topic.user_id : 0;
								this.reload(true);
								break;
							case 1:
								this.$tool.needLogin(() => {
									uni.navigateTo({
										url: '/pages/chat/chat?fromUid=' + this.topic.user_id
									});
								});
								break;
							case 2:
								this.$tool.needLogin(() => {
									uni.navigateTo({
										url: '/pages/ta/ta?uid=' + this.topic.user_id
									});
								});
								break;
							default:
								break;
						}
					},
					complete: () => {
						this.showbar = true;
					}
				});
			},
			handleZan: async function() {
				this.$tool.needLogin(async () => {
					const data = await this.$tool.getData({
						r: this.$api.support,
						tid: this.topicId,
						pid: 0,
						type: 'thread'
					});
					if (data) {
						this.$tool.modal(data.errcode);
					}
				});
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
			loadReply: async function() {
				const data = await this.$tool.getData({
						r: this.$api.postlist,
						topicId: this.topicId,
						authorId: this.authorId,
						order: 1,
						page: 1,
						pageSize: 11
					},
					'get',
					true
				);
				if (data && data.list) {
					for (let item of data.list) {
						if (this.user.uid == item.reply_id) {
							this.replys.push(item);
							break;
						}
					}
				}
			},
			reload: async function(order) {
				if (this.allowLoad) {
					this.allowLoad = false;
					this.page = 1;
					const data = await this.$tool.getData({
						r: this.$api.postlist,
						topicId: this.topicId,
						authorId: this.authorId,
						order: this.order,
						page: this.page,
						pageSize: 11
					});
					if (data) {
						this.total = Math.ceil(data.total_num / 11)
						let pages = []
						for (let i = 0; i < this.total; i++) {
							pages.push('第' + (i + 1) + '页')
						}
						this.picker = pages
						if (pages.length > 0) {
							this.index = 0
						}
						if (pages.length > 1) {
							this.hasnext = true
						}

						if (!order) {
							this.boardId = data.boardId;
							this.forumTopicUrl = data.forumTopicUrl;
							this.topic = data.topic;
							if (data.topic.poll_info && data.topic.poll_info.poll_item_list) {
								this.polls = data.topic.poll_info.poll_item_list.map(item => {
									item.checked = false;
									return item;
								});
							}
							let controlActions = ['举报主题', '举报用户'];
							if (data.topic.managePanel && data.topic.managePanel.length > 0) {
								for (let item of data.topic.managePanel) {
									controlActions.push(item.title);
								}
							}
							this.controlActions = controlActions;
							uni.setNavigationBarTitle({
								title: data.forumName
							});
						}
						if (data && data.list) {
							this.replys = data.list;
							this.hasMore = data.list.length == 11;
						} else {
							this.hasMore = false;
						}
					}
					this.allowLoad = true;
				}
			},
			loadMore: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false;
					this.page++;
					let data = await this.$tool.getData({
						r: this.$api.postlist,
						topicId: this.topicId,
						authorId: this.authorId,
						order: this.order,
						page: this.page,
						pageSize: 11
					});
					if (data && data.list) {
						this.replys.push(...data.list);
						this.hasMore = data.list.length == 11;
					} else {
						this.hasMore = false;
					}
					this.allowLoad = true;
				}
			}
		},
		onLoad: function(options) {
			this.topicId = options.topicId;
			this.reload();
			this.user = getApp().globalData.user || {};
			this.location = getApp().globalData.location;
		},
		onReady: function() {
			uni.$on('topicshowbar', data => {
				this.showbar = data.showbar;
			});
			uni.$on('tapemoji', data => {
				if ('topic' == data.parent) this.replytext += data.emoji;
			});
			uni.$on('topicauthor', data => {
				console.log(data)
				this.authorId = data.authorId;
				this.reload(true);
			});
			uni.$on('login', data => {
				this.user = getApp().globalData.user || {};
			});
			uni.$on('reply', () => {
				this.loadReply();
			});
		}
	};
</script>

<style scoped>
	.pagination {
		margin: 10px 0;
		display: flex;
		justify-content: center;
	}

	.pagination .prev {
		/* margin-right: 5px; */
	}

	.pagination .cu-form-group {
		min-height: 32px !important;
		height: 32px !important;
	}

	.pagination .next {
		/* margin-left: 5px; */
	}

	.gototop {
		position: fixed;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		z-index: 999;
		right: 15px;
		bottom: 65px;
		/* #ifdef H5 */
		bottom: calc(65px + var(--window-bottom));
		/* #endif */
		padding: 10px;
		width: 50px;
		height: 50px;
		border-radius: 55px;
	}

	.gototop .cuIcon-top {
		font-size: 23px;
	}

	.page {
		background-color: #FFFFFF;
		/* #ifdef H5 */
		height: calc(100vh - 50px - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: calc(100vh - 50px);
		/* #endif */
	}

	.topic-title {
		margin-top: 10px !important;
		font-weight: bold;
		/* font-size: 17px !important; */
	}

	.topic-content {
		position: relative;
		margin: 15px;
		line-height: 1.7;
		height: 100%;
	}

	.toupiao .cu-form-group {
		justify-content: flex-start;
	}

	.toupiao .cu-form-group .title {
		width: 100%;
		min-height: 60px !important;
		height: inherit !important;
	}

	/* #ifdef APP-PLUS */
	/* .reply-content {
	height: 35px !important;
}

.reply-content .uni-textarea-textarea {
	height: 35px !important;
	line-height: 35px !important;
}

.reply-content .uni-textarea-placeholder {
	display: flex;
	align-items: center;
} */
	/* #endif */
</style>
