<template>
	<view>
		<dx-navbar title="首页"></dx-navbar>
		<view class="wrapper">
			<z-paging ref="paging" autowire-list-name="zList" autowire-query-name="zQuery">
				<view class="cu-list menu-avatar">
					<view v-for="(item,index) in zList" :key="item.topic_id" class="cu-item cur">
						<view class="cu-avatar round lg" :style="'background-image:url('+item.userAvatar+');'">
						</view>
						<view class="content flex-sub">
							<view class="text-cut">{{item.title}}</view>
							<view class="text-cut text-grey text-sm">{{item.subject}}</view>
							<view class="text-xs flex justify-between">
								<view class="flex">
									<view class="text-cut text-green">{{item.user_nick_name}}</view>
									<view class="text-gray margin-left-xs">{{$u.timeFrom(item.last_reply_date)}}</view>
								</view>
								<view class="text-gray">
									<text class="cuIcon-attentionfill margin-lr-xs"></text> {{item.hits}}
									<text class="cuIcon-messagefill margin-lr-xs"></text> {{item.replies}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</z-paging>
		</view>
		<dx-tabbar :currentTab="0"></dx-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				zList: []
			};
		},
		methods: {
			zQuery: async function(page, pageSize) {
				const res = await this.$http.get({
					custom: {
						auth: false
					},
					params: {
						r: 'forum/topiclist',
						sortby: 'new',
						boardId: 0,
						filterType: 'typeid',
						filterId: 0,
						page,
						pageSize
					}
				});
				this.$refs.paging.complete(res.list);
			},
		}
	};
</script>

<style scoped>
	.wrapper {
		height: calc(100vh - 94px);
	}
</style>
