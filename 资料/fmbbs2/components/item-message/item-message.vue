<template>
	<view class="xcx-cu-item cu-item shadow message-item">
		<view class="cu-list menu-avatar">
			<view class="cu-item">
				<view class="cu-avatar round lg" :style="{ backgroundImage: 'url(' + icon + ')' }"></view>
				<view class="content flex-sub">
					<view :class=[fonttitle]>{{reply_nick_name}}</view>
					<view :class=[fontcontent] class="text-gray text-sm flex justify-between">{{timeago}}</view>
				</view>
			</view>
		</view>
		<view class="text-content no-margin padding">
			<view class="cu-card dynamic margin-bottom">
				<view class="cu-item shadow no-margin">
					<view class="topic-title text-content no-margin" :class=[fonttitle]>{{ topic_subject }}</view>
				</view>
			</view>
			<view class="text-grey text-content text-df" :class=[fontcontent]>
				<jyf-parser selectable @linkpress="handleContentLink" :html="topicContent" />
			</view>
			<view class="flex-sub bg-gray padding-sm radius margin-top-sm" :class=[fontcontent]>
				<jyf-parser selectable @linkpress="handleContentLink" :html="replyContent" />
			</view>
			<!-- <block v-for="(item,index) in reply_content" :key="index">
				<view v-if="2 == item.type && item.infor" v-html="$tool.addVideo(item.infor)"></view>
				<view v-if="3 == item.type && item.infor" v-html="$tool.addAudio(item.infor)"></view>
			</block> -->
		</view>
		<view class="flex justify-between padding">
			<navigator hover-class="none" open-type="navigate" :url="'/pages/topic/topic?topicId=' + topic_id" class="cu-btn sm round bg-blue light" :class=[fonttitle]>查看原帖</navigator>
			<navigator hover-class="none" open-type="navigate" :url="'/pages/reply/reply?fid='+board_id+'&tid='+topic_id+'&replyId='+reply_remind_id+'&isQuote=1'"
			 class="cu-btn sm round bg-blue light" :class=[fonttitle]>回复</navigator>
		</view>
	</view>
</template>

<script>
	import {
		format
	} from 'timeago.js';

	export default {
		props: ['reply_remind_id', 'topic_id', 'board_id', 'icon', 'reply_nick_name', 'replied_date', 'topic_subject',
			'topic_content', 'reply_content'
		],
		data() {
			return {
				fontsize: 'normal'
			};
		},
		computed: {
			timeago: function() {
				return format(this.replied_date, 'zh_CN');
			},
			replyContent: function() {
				return this.$tool.mobcentPhiz(this.reply_content || '');
			},
			topicContent: function() {
				return this.$tool.mobcentPhiz(this.topic_content || '');
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
			}
		},
		created() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
		}
	};
</script>

<style scoped>
	.message-item>.text-content {
		max-height: initial !important;
	}

	.topic-title {
		padding: 0 !important;
		font-weight: bold;
		/* font-size: 17px !important; */
	}

	.topic-content {
		position: relative;
		margin: 15px;
		line-height: 1.7;
		height: 100%;
	}
</style>
