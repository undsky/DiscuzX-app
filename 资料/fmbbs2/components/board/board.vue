<template>
	<scroll-view scroll-y="true">
		<block v-for="item in boards" :key="item.board_category_id">
			<view class="padding-sm bg-grey light solid-bottom text-center">
				<view :class=[fonttitle]>{{ item.board_category_name }}</view>
			</view>
			<view class="flex flex-wrap">
				<view v-for="item2 in item.board_list" :key="item2.board_id" class="basis-df">
					<view class="cu-list menu">
						<view class="board-item cu-item">
							<navigator class="content" hover-class="none" :url="'../../pages/board/list/list?board_id=' + item2.board_id + '&board_name=' + item2.board_name"
							 open-type="navigate">
								<view class="text-black">
									<view class="text-cut" :class=[fontcontent]>{{ item2.board_name }}</view>
								</view>
								<view class="text-gray text-sm flex">
									<view class="text-cut">{{ timeago(item2.last_posts_date) }}</view>
								</view>
							</navigator>
							<view class="action">
								<view class="cu-tag round bg-blue light sm">{{ item2.td_posts_num }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<view class="cu-tabbar-height"></view>
	</scroll-view>
</template>

<script>
	import {
		format
	} from 'timeago.js';

	export default {
		data() {
			return {
				boards: [],
				fontsize: 'normal'
			};
		},
		computed: {
			fonttitle: function() {
				return 'diy-title-' + this.fontsize
			},
			fontcontent: function() {
				return 'diy-content-' + this.fontsize
			}
		},
		methods: {
			timeago: function(datetime) {
				return format(datetime, 'zh_CN');
			},
			reloadBoards: async function() {
				const data = await this.$tool.getData({
					r: this.$api.board
				});
				this.boards = data.list;
			}
		},
		created: async function() {
			this.fontsize = getApp().globalData.fontsize
			uni.$on('fontsize', () => {
				this.fontsize = getApp().globalData.fontsize
			})
			this.reloadBoards()
			uni.$on('login', data => {
				this.reloadBoards()
			})
			uni.$on('logout', data => {
				this.reloadBoards()
			})
		}
	};
</script>

<style>
	.basis-df {
		padding: 3px !important;
	}

	.board-item {
		align-items: flex-start !important;
		padding: 5px !important;
	}
</style>
