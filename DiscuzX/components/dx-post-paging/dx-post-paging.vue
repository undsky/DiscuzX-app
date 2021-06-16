<template>
	<view class="content">
		<z-paging style="height: 100%;" ref="paging" autowire-list-name="zList" autowire-query-name="zQuery" :auto="false" :enable-back-to-top="currentIndex === tabIndex">
			<view class="cu-list menu-avatar">
				<view v-for="(item, index) in zList" :key="item.topic_id" class="cu-item cur post-item" @click="$util.helper.goto('/pages/detail/detail?id=' + item.topic_id)">
					<view class="cu-avatar round lg" :style="'background-image:url(' + item.userAvatar + ');'"></view>
					<view class="content flex-sub justify-center">
						<view class="text-cut">{{ item.title }}</view>
						<view class="text-cut text-grey text-sm">{{ item.subject }}</view>
						<view class="text-xs flex justify-between">
							<view class="flex">
								<view class="text-cut text-green">{{ item.user_nick_name }}</view>
								<view class="text-gray margin-left-xs">{{ $u.timeFrom(item.last_reply_date) }}</view>
							</view>
							<view class="text-gray">
								<text class="cuIcon-attentionfill margin-lr-xs"></text>
								{{ item.hits }}
								<text class="cuIcon-messagefill margin-lr-xs"></text>
								{{ item.replies }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
export default {
	name: 'dx-post-paging',
	props: {
		params: Object,
		auth: {
			type: Boolean,
			default: false
		},
		method: {
			type: String,
			default: 'get'
		},
		tabs: Array,
		tabKey: String,
		tabIndex: {
			type: Number,
			default: 0
		},
		currentIndex: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			zList: [],
			firstLoaded: false
		};
	},
	watch: {
		currentIndex: {
			handler(newVal) {
				if (newVal === this.tabIndex) {
					if (!this.firstLoaded) {
						this.$nextTick(() => {
							this.$refs.paging.reload();
						});
					}
				}
			},
			immediate: true
		}
	},
	methods: {
		zQuery: async function(page, pageSize) {
			let _params = {
				page,
				pageSize
			};
			if (this.tabs && this.tabKey) {
				_params.filterType = 'typeid';
				_params.filterId = this.tabs[this.tabIndex][this.tabKey];
			}
			const res = await this.$http[this.method](this.$u.deepMerge(_params, this.params), {
				custom: {
					auth: this.auth
				}
			});
			this.$refs.paging.complete(res.list);
			this.firstLoaded = true;
		}
	}
};
</script>

<style scoped>
.post-item {
	height: 80px !important;
}

.content {
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>
