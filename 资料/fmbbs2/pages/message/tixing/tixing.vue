<template>
	<scroll-view class="page" scroll-y="true" @scrolltoupper="reload" @scrolltolower="loadMore">
		<view v-if="notes.length > 0" class="cu-list menu">
			<view v-for="(item, index) in notes" :key="index" class="cu-item">
				<view class="content padding-tb-sm">
					<view> :class=[fonttitle]{{ item.note }}</view>
					<view :class=[fontcontent] class="text-gray">{{ timeago(item.dateline) }}</view>
				</view>
			</view>
		</view>
		<empty v-else />
	</scroll-view>
</template>

<script>
import { format } from 'timeago.js';

export default {
	data() {
		return {
			notes: [],
			allowLoad: true,
			hasMore: true,
			page: 1,
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
		reload: async function() {
			if (this.allowLoad) {
				this.allowLoad = false;
				this.page = 1;
				const data = await this.$tool.getData({
					r: this.$api.notifylist,
					type: 'system',
					page: this.page
				});
				this.notes = data && data.body.data ? data.body.data : [];
				this.allowLoad = true;
			}
		},
		loadMore: async function() {
			if (this.allowLoad && this.hasMore) {
				this.allowLoad = false;
				this.page++;
				let data = await this.$tool.getData({
					r: this.$api.notifylist,
					type: 'system',
					page: this.page
				});
				if (data && data.body.data) {
					this.notes.push(...data.body.data);
					this.hasMore = data.body.data.length == this.$config.pageSize;
				} else {
					this.hasMore = false;
				}
				this.allowLoad = true;
			}
		}
	},
	created: function() {
		this.fontsize = getApp().globalData.fontsize
		uni.$on('fontsize', () => {
			this.fontsize = getApp().globalData.fontsize
		})
		uni.setNavigationBarTitle({
			title: '系统提醒'
		});
		this.reload();
	}
};
</script>

<style>
.page {
	height: 100vh;
}
</style>
