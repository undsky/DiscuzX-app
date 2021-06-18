<template>
	<view>
		<u-navbar :background="background" back-icon-color="#FFFFFF" title="详情" title-bold title-color="#FFFFFF">
			<view @click="showAction" class="margin-right flex" slot="right">
				<u-icon name="more-dot-fill" color="#FFFFFF" size="38"></u-icon>
			</view>
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
		<view class="padding-sm">
			<mp-html lazy-load :content="content" />
		</view>
		<z-paging ref="paging" use-page-scroll v-model="commentList" autowire-query-name="zQuery">
			<view class="cu-list menu-avatar comment">
				<view v-for="(item,index) in commentList" :key="item.reply_posts_id" class="cu-item">
					<view class="cu-avatar round" :style="'background-image:url(' + item.icon + ');'"></view>
					<view class="content">
						<view class="text-grey">{{item.reply_name}}</view>
						<view class="text-gray text-content text-df">
							<mp-html lazy-load :content="$util.mobcent.content(item.reply_content)" />
						</view>
						<view v-if="item.quote_content" class="bg-grey padding-sm radius margin-top-sm  text-sm">
							<mp-html lazy-load :content="$util.mobcent.phiz(item.quote_content)" />
						</view>
						<view class="margin-top-sm flex justify-between">
							<view class="text-gray text-df">{{ $u.timeFrom(item.posts_date) }}</view>
							<view>
								<view class="cuIcon-appreciatefill text-gray"></view>
							</view>
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
			content: function() {
				return this.$util.mobcent.content(this.topic.content);
			}
		},
		onLoad: async function(options) {
			_id = options.id;
		},
		methods: {
			zQuery: async function(page, pageSize) {
				const res = await this.$http.get({
					r: 'forum/postlist',
					topicId: _id,
					authorId: 0,
					order: 0,
					page,
					pageSize
				}, {
					custom: {
						auth: false
					}
				});
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

<style>
</style>
