<template>
	<view class="topic-item cu-item" @click="navTopic">
		<view v-if="userAvatar" class="cu-avatar round lg" :style="{backgroundImage:'url('+ userAvatar + ')'}"></view>
		<view :style="{left : userAvatar ? '70px' : '15px',width : 'calc(100vw - '+ (userAvatar ? 70 : 15) +'px - 15px)'}"
		 class="content">
			<view class="text-grey">
				<view class="text-cut" :class="[fonttitle]">{{title}}</view>
			</view>
			<view class="text-gray text-sm flex">
				<view class="text-cut" :class="[fontcontent]">{{subject}}</view>
			</view>
			<view class="info-show text-gray text-sm flex justify-between">
				<view class="flex">
					<view class="user-nick-name text-green margin-right-xs text-cut">{{user_nick_name}}</view>
					<view class="text-cut">{{timeago}}</view>
				</view>
				<view class="flex">
					<view class="board-name margin-right-xs text-cut">{{board_name}}</view>
					<view class="margin-right-xs"><text class="cuIcon-attentionfill text-gray margin-right-xs"></text> {{hits}}</view>
					<view><text class="cuIcon-markfill text-gray margin-right-xs"></text> {{replies}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		format
	} from 'timeago.js'

	export default {
		props: ['topic_id', 'title', 'subject', 'userAvatar', 'last_reply_date', 'hits', 'replies', 'user_nick_name',
			'board_name'
		],
		data() {
			return {
				fontsize: 'normal'
			};
		},
		computed: {
			timeago: function() {
				return format(this.last_reply_date, 'zh_CN')
			},
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		methods: {
			navTopic: function() {
				uni.navigateTo({
					url: '/pages/topic/topic?topicId=' + this.topic_id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		created() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
		}
	}
</script>

<style>
	.topic-item {
		height: 90px !important;
	}

	.info-show .user-nick-name,
	.info-show .board-name {
		max-width: 100px !important;
	}

	.text-cut {
		max-width: none !important;
	}
</style>
