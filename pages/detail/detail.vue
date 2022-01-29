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
						{{ topic.hits || 0 }}
						<text class="cuIcon-messagefill margin-lr-xs"></text>
						{{ topic.replies || 0 }}
					</view>
				</view>
			</view>
		</view>
		<view class="cu-list menu-avatar">
			<view class="cu-item cur">
				<view @click="userSheet()" class="cu-avatar round lg" :style="'background-image:url(' + (topic.icon || '') + ');'"></view>
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
		<block v-if="polls.length > 0">
			<view class="cu-bar bg-gray solid-bottom margin-top">
				<view class="action">投票（最多可选择{{ topic.poll_info.type }}项）</view>
			</view>
			<checkbox-group class="block poll" @change="pollChange">
				<label v-for="(item, index) in polls" :key="item.poll_item_id" class="cu-form-group">
					<checkbox :class="item.checked ? 'checked' : ''" :checked="item.checked ? true : false" :value="'' + item.poll_item_id"></checkbox>
					<view class="title margin-left-sm text-grey">
						<text>{{ item.name }}</text>
						<progress :percent="item.percent" show-info stroke-width="3" activeColor="#39b54a" />
					</view>
				</label>
			</checkbox-group>
			<view style="padding: 0 15px !important;" class="flex flex-direction"><button @click="handlePoll" class="cu-btn bg-green margin-tb-sm lg shadow">投票</button></view>
		</block>
		<view class="cu-bar bg-gray margin-top">
			<view class="action">评分</view>
			<view class="action"><button @click="handleRate" class="cu-btn bg-blue">我要评分</button></view>
		</view>
		<view v-if="topic.rateList && topic.rateList.head" class="grid col-3 text-center">
			<view class="padding-sm text-bold">{{ topic.rateList.head.field1 }}</view>
			<view class="padding-sm text-bold">{{ topic.rateList.head.field2 }}</view>
			<view class="padding-sm text-bold">{{ topic.rateList.head.field3 }}</view>
			<view class="padding-sm text-blue">{{ topic.rateList.total.field1 }}</view>
			<view class="padding-sm text-blue">{{ topic.rateList.total.field2 }}</view>
			<view class="padding-sm text-blue">{{ topic.rateList.total.field3 }}</view>
			<block v-for="(item, index) in topic.rateList.body" :key="index">
				<view class="padding-sm text-sm">{{ item.field1 }}</view>
				<view class="padding-sm text-sm">{{ item.field2 }}</view>
				<view class="padding-sm text-sm">{{ item.field3 }}</view>
			</block>
		</view>
		<view v-else class="padding text-center text-grey">目前还没有人评分哦！</view>
		<view v-if="topic.rateList && topic.rateList.showAllUrl" class="padding bg-gray text-center text-blue">
			<text @click="moreRate" :data-url="topic.rateList.showAllUrl">更多评分</text>
		</view>
		<z-paging ref="paging" use-page-scroll v-model="commentList" autowire-query-name="zQuery">
			<view class="cu-list menu-avatar comment">
				<view v-for="(item, index) in commentList" :key="item.reply_posts_id" class="cu-item">
					<view @click="userSheet(item.reply_id)" class="cu-avatar round" :style="'background-image:url(' + (item.icon || '') + ');'"></view>
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
								<view @click="manageSheet(item.reply_posts_id, item.reply_id, index)" class="cuIcon-settingsfill text-gray"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
		<view class="cu-tabbar-height"></view>
		<dx-chatbar ref="chatbar" parent="detail"></dx-chatbar>
		<u-popup v-model="showShare" mode="bottom" safe-area-inset-bottom><dx-share></dx-share></u-popup>
	</view>
</template>

<script>
import { setClipboardData } from '@/uni_modules/u-clipboard/js_sdk';
import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';
import { mapState } from 'vuex';

let _id, _managePanel;

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
			showShare: false,
			polls: [],
			checkpolls: []
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

		uni.$on('replyImg', async data => {
			const pages = getCurrentPages();
			if ('pages/detail/detail' != pages[pages.length - 1].route) {
				return;
			}

			try {
				const result = await this.$http.uploadAttachment(data);
				const { id, urlName } = result.body.attachment[0];
				await this.sendMessage(1, urlName.replace('//forum', '/forum'), id);
			} catch (e) {
				//TODO handle the exception
			} finally {
				uni.hideLoading();
			}
		});

		uni.$on('reply', async data => {
			const pages = getCurrentPages();
			if ('pages/detail/detail' != pages[pages.length - 1].route) {
				return;
			}

			try {
				await this.sendMessage(0, data, '');
			} catch (e) {
				//TODO handle the exception
			} finally {
				uni.hideLoading();
			}
		});
	},
	methods: {
		handlePoll: async function() {
			if (this.$util.helper.checkAuth()) {
				if (this.checkpolls.length > 0) {
					const result = await this.$http.post({
						r: 'forum/vote',
						options: this.checkpolls.join(),
						boardId: this.boardId,
						tid: this.topic.topic_id
					});

					if (result) {
						this.$util.helper.modal(result.errcode);
					}
				} else {
					this.$util.helper.modal('请至少选择一项');
				}
			}
		},
		pollChange: function(e) {
			if (e.detail.value.length > this.topic.poll_info.type) {
				this.$util.helper.modal('最多可选择' + this.topic.poll_info.type + '项');
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
		handleRate: function() {
			if (this.$util.helper.checkAuth()) {
				uni.navigateTo({
					url:
						'/pages/wv/wv?title=评分&url=' +
						encodeURIComponent(
							this.$http.config.baseURL +
								this.$u.queryParams({
									r: 'forum/topicrate',
									tid: this.topic.topic_id,
									pid: this.topic.reply_posts_id,
									type: 'view',
									accessToken: this.user.token,
									accessSecret: this.user.secret
								})
						)
				});
			}
		},
		moreRate: function(e) {
			uni.navigateTo({
				url: '/pages/wv/wv?title=更多评分&url=' + encodeURIComponent(e.target.dataset.url)
			});
		},
		sendMessage: async function(type, infor, aid) {
			let isQuote = 0;
			let replyId = this.topic.reply_posts_id;
			if (this.replyId) {
				isQuote = 1;
				replyId = this.replyId;
				this.replyId = null;
			}

			const json = {
				isHidden: 0,
				isQuote,
				isAnonymous: 0,
				isOnlyAuthor: 0,
				fid: this.boardId,
				tid: _id,
				replyId,
				aid,
				content: JSON.stringify([
					{
						type,
						infor
					}
				])
			};

			const { location } = getApp().globalData;
			if (location) {
				json.isShowPostion = 1;
				json.longitude = location.longitude;
				json.latitude = location.latitude;
				json.location = location.position;
			}

			const result = await this.$http.post({
				r: 'forum/topicadmin',
				act: 'reply',
				platType: getApp().globalData.systemInfo.platType,
				json: JSON.stringify({
					body: {
						json
					}
				})
			});

			this.$refs.chatbar.replytext = '';
			uni.showToast({
				title: result.errcode
			});

			this.commentList.unshift({
				reply_posts_id: -1,
				icon: this.user.avatar,
				reply_name: this.user.userName,
				reply_content: [
					{
						type,
						infor
					}
				],
				posts_date: new Date().getTime()
			});

			// this.$refs.paging.reload();
		},
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

			if (result) {
				if (!this.firstLoaded) {
					this.boardId = result.boardId;
					this.forumName = result.forumName;
					this.forumTopicUrl = result.forumTopicUrl;
					this.topic = result.topic;
					if (result.topic.poll_info && result.topic.poll_info.poll_item_list) {
						this.polls = result.topic.poll_info.poll_item_list.map(item => {
							item.checked = false;
							return item;
						});
					}
				}
				this.$refs.paging.complete(result.list);
			}
			this.firstLoaded = true;
		},
		userSheet(reply_id) {
			if (this.$util.helper.checkAuth()) {
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
			}
		},
		zan: async function(pid) {
			if (-1 == pid) {
				this.$util.helper.modal('您不能对自己的回复点赞');
				return;
			}
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
		manageSheet(reply_posts_id, reply_id, index) {
			if (this.$util.helper.checkAuth()) {
				let itemList = [reply_posts_id ? '举报回帖' : '举报帖子', '举报用户'];
				_managePanel = reply_posts_id ? this.commentList[index].managePanel : this.topic.managePanel;
				if (_managePanel && _managePanel.length > 0) {
					for (let item of _managePanel) {
						itemList.push(item.title);
					}
				}
				uni.showActionSheet({
					itemList,
					success: res => {
						if (res.tapIndex > 1) {
							const { title, action } = _managePanel[res.tapIndex - 2];
							uni.navigateTo({
								url: '/pages/wv/wv?title=' + title + '&url=' + encodeURIComponent(action)
							});
						} else {
							uni.navigateTo({
								url: `../report/report?type=${0 == res.tapIndex ? 'post' : 'user'}&id=${
									0 == res.tapIndex ? reply_posts_id || this.topic.topic_id : reply_id || this.topic.user_id
								}`,
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						}
					},
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
							if (this.$util.helper.checkAuth()) {
								await this.$http.post({
									r: 'user/userfavorite',
									id: _id,
									idType: 'tid',
									action: 'favorite'
								});
								uni.showToast({
									title: '收藏成功'
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

<style scoped>
.poll .cu-form-group {
	justify-content: flex-start;
}

.poll .cu-form-group .title {
	width: 100%;
	min-height: 60px !important;
	height: inherit !important;
}
</style>
