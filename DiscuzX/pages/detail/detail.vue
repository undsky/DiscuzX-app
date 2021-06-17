<template>
	<view>
		<u-navbar :background="background" back-icon-color="#FFFFFF" title="详情" title-bold title-color="#FFFFFF">
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
				<view class="cu-avatar round lg" :style="'background-image:url(' + topic.icon + ');'"></view>
				<view class="content">
					<view>
						<view class="text-cut">{{ topic.user_nick_name }}</view>
					</view>
					<view class="text-orange text-sm">{{ topic.userTitle }}</view>
				</view>
				<view class="action">
					<view class="text-blue text-xs">楼主</view>
					<view class="cuIcon-appreciatefill text-gray"></view>
				</view>
			</view>
		</view>
		<view class="padding-sm"><mp-html lazy-load :content="mobcent" /></view>
		<z-paging ref="paging" use-page-scroll v-model="commentList" autowire-query-name="zQuery">
			<view>
				<view class="comment" v-for="(item, index) in commentList" :key="item.reply_id">
					<view class="left"><image :src="item.icon" mode="aspectFill"></image></view>
					<view class="right">
						<view class="top">
							<view class="name">{{ item.name }}</view>
							<view class="like" :class="{ highlight: item.isLike }">
								<view class="num">{{ item.likeNum }}</view>
								<u-icon v-if="!item.isLike" name="thumb-up" :size="30" color="#9a9a9a" @click="getLike(index)"></u-icon>
								<u-icon v-if="item.isLike" name="thumb-up-fill" :size="30" @click="getLike(index)"></u-icon>
							</view>
						</view>
						<view class="content">{{ item.contentText }}</view>
						<view class="reply-box">
							<view class="item" v-for="(item, index) in item.replyList" :key="item.index">
								<view class="username">{{ item.name }}</view>
								<view class="text">{{ item.contentStr }}</view>
							</view>
							<view class="all-reply" @tap="toAllReply" v-if="item.replyList != undefined">
								共{{ item.allReply }}条回复
								<u-icon class="more" name="arrow-right" :size="26"></u-icon>
							</view>
						</view>
						<view class="bottom">
							{{ item.date }}
							<view class="reply">回复</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';

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
			commentList: []
		};
	},
	computed: {
		mobcent: function() {
			return this.$util.mobcent.content(this.topic.content);
		}
	},
	onLoad: async function(options) {
		_id = options.id;
	},
	methods: {
		zQuery: async function(page, pageSize) {
			const res = await this.$http.get(
				{
					r: 'forum/postlist',
					topicId: _id,
					authorId: 0,
					order: 0,
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
				this.topic = res.topic;
			}
			this.$refs.paging.complete(res.list);
			this.firstLoaded = true;
		},
		showAction: async function() {
			uni.showActionSheet({
				itemList: ['收藏', '分享', '复制链接'],
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.comment {
	display: flex;
	padding: 30rpx;
	.left {
		image {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}
	.right {
		flex: 1;
		padding-left: 20rpx;
		font-size: 30rpx;
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;
			.name {
				color: #5677fc;
			}
			.like {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;
				.num {
					margin-right: 4rpx;
					color: #9a9a9a;
				}
			}
			.highlight {
				color: #5677fc;
				.num {
					color: #5677fc;
				}
			}
		}
		.content {
			margin-bottom: 10rpx;
		}
		.reply-box {
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;
			.item {
				padding: 20rpx;
				border-bottom: solid 2rpx $u-border-color;
				.username {
					font-size: 24rpx;
					color: #999999;
				}
			}
			.all-reply {
				padding: 20rpx;
				display: flex;
				color: #5677fc;
				align-items: center;
				.more {
					margin-left: 6rpx;
				}
			}
		}
		.bottom {
			margin-top: 20rpx;
			display: flex;
			font-size: 24rpx;
			color: #9a9a9a;
			.reply {
				color: #5677fc;
				margin-left: 10rpx;
			}
		}
	}
}
</style>
