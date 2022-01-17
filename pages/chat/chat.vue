<template>
	<view>
		<scroll-view scroll-y :scroll-into-view="gotoView" class="cu-chat page">
			<block v-for="item in messages" :key="item.mid">
				<view :id="'chat_' + item.mid" v-if="item.sender == user.uid" class="cu-item self">
					<view class="main chat-box">
						<view v-if="'text' == item.type" class="content bg-green shadow">
							<mp-html lazy-load selectable @linkpress="handleContentLink" :content="mobcent(item.content)" />
						</view>
						<view v-if="'audio' == item.type" class="content bg-green shadow">
							<text class="cuIcon-sound text-xxl padding-right-xl" :data-content="item.content"></text>
						</view>
						<image v-if="'image' == item.type" :src="item.content" class="radius" mode="widthFix"></image>
					</view>
					<view class="cu-avatar radius" :style="{ backgroundImage: 'url(' + user.avatar + ')' }"></view>
					<view class="date">{{ $u.timeFrom(item.time) }}</view>
				</view>
				<view :id="'chat_' + item.mid" v-else class="cu-item">
					<view class="cu-avatar radius" :style="{ backgroundImage: 'url(' + fromUser.avatar + ')' }"></view>
					<view class="main chat-box">
						<view v-if="'text' == item.type" class="content shadow">
							<mp-html lazy-load selectable @linkpress="handleContentLink" :content="mobcent(item.content)" />
						</view>
						<view v-if="'audio' == item.type" class="content bg-green shadow">
							<text class="cuIcon-sound text-xxl padding-right-xl" :data-content="item.content"></text>
						</view>
						<image v-if="'image' == item.type" :src="item.content" class="radius" mode="widthFix"></image>
					</view>
					<view class="date">{{ $u.timeFrom(item.time) }}</view>
				</view>
			</block>
		</scroll-view>
		<view class="cu-tabbar-height"></view>
		<dx-chatbar ref="chatbar" parent="chat"></dx-chatbar>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			gotoView: '',
			fromUid: 0,
			plid: 0,
			pmid: 0,
			fromUser: {},
			messages: []
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	methods: {
		handleContentLink: function(link) {
			link.ignore();
			uni.navigateTo({
				url: '/pages/wv/wv?url=' + encodeURIComponent(link.href)
			});
		},
		sendMessage: async function(type, content) {
			uni.showLoading({
				mask: true
			});

			const result = await this.$http.post({
				r: 'message/pmadmin',
				json: encodeURIComponent(
					JSON.stringify({
						toUid: this.fromUid,
						plid: this.plid,
						pmid: this.pmid,
						msg: {
							type: type,
							content: content
						}
					})
				)
			});

			this.messages.push({
				sender: this.user.uid,
				type: type,
				content: content,
				time: result.body.sendTime,
				mid: result.body.pmid
			});

			uni.hideLoading();

			this.$refs.chatbar.replytext = '';
			uni.showToast({
				title: '发送成功',
				success: () => {
					this.gotoView = 'chat_' + this.messages[this.messages.length - 1].mid;
				}
			});
		},
		mobcent: function(content) {
			return this.$util.mobcent.phiz((content || '').replace(/http(.*?) /g, '<a href="http$1">http$1</a>'));
		}
	},
	onLoad: async function(options) {
		this.fromUid = options.fromUid;
		this.plid = options.plid;
		this.pmid = options.pmid;

		uni.$on('reply', async data => {
			await this.sendMessage('text', data);
		});
		uni.$on('replyImg', async data => {
			const result = await this.$http.uploadAttachment(data);
			if (null == res[0]) {
				if (200 == res[1].statusCode) {
					const data = JSON.parse(res[1].data);
					const img = data.body.attachment[0].urlName;
					await this.sendMessage('image', img);
				}
			}
		});

		const pmlist = {
			body: {
				externInfo: {
					onlyFromUid: 0
				},
				pmInfos: [
					{
						startTime: 0,
						stopTime: 0,
						cacheCount: 0,
						fromUid: this.fromUid
					}
				]
			}
		};

		uni.showLoading({
			mask: true
		});

		const result = await this.$http.post({
			r: 'message/pmlist',
			pmlist: JSON.stringify(pmlist)
		});

		const pm = result.body.pmList[0];
		this.fromUser = {
			avatar: pm.avatar,
			fromUid: pm.fromUid,
			name: pm.name,
			plid: pm.plid
		};
		this.messages = pm.msgList;
		if (this.messages && this.messages.length > 0) {
			setTimeout(() => {
				uni.hideLoading();
				this.gotoView = 'chat_' + this.messages[this.messages.length - 1].mid;
			}, 1000);
		} else {
			uni.hideLoading();
		}
	}
};
</script>

<style>
.page {
	background-color: #f1f1f1;
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

.cu-chat .cu-item > .main .content::after {
	z-index: 10 !important;
}

.cu-chat .cu-item > .chat-box {
	max-width: calc(100% - 80px) !important;
}

.cu-chat .content {
	word-break: break-all;
}
</style>
