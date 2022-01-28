<template>
	<view class="content">
		<z-paging :fixed="false" style="height: 100%;" ref="paging" v-model="zList" :use-page-scroll="usePageScroll"
			autowire-query-name="zQuery" :auto="false" :enable-back-to-top="currentIndex === tabIndex">
			<view class="cu-list" :class="[hasAvatar ? 'menu-avatar' : 'padding-lr']">
				<view v-for="(item, index) in zList" :key="index" :data-id="item.authorId || item.toUserId || item.uid"
					:data-plid="item.plid" :data-pmid="item.pmid" :data-index="index"
					:data-actions="item.actions && item.actions.length > 0" @click="gotoInfo" class="cu-item cur">
					<view v-if="hasAvatar" class="cu-avatar">
						<u-avatar :show-sex="!!item.gender" :sex-icon="1 == item.gender ? 'man' : 'woman'"
							:src="item.authorAvatar || item.toUserAvatar || item.icon"></u-avatar>
					</view>
					<view class="content  flex-sub justify-center">
						<view class="text-cut">{{ item.author || item.toUserName || item.nickname || item.name }}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">{{ item.note || item.lastSummary || item.location }}</view>
						</view>
					</view>
					<view class="action text-gray" style="width: 70px;">
						<view class="cuIcon-right"></view>
						<view v-if="item.dateline || item.lastDateline" class="text-xs">
							{{ $u.timeFrom(item.dateline || item.lastDateline) }}
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: 'dx-user-paging',
		props: {
			params: Object,
			reload: {
				type: Boolean,
				default: false
			},
			hasAvatar: {
				type: Boolean,
				default: true
			},
			usePageScroll: {
				type: Boolean,
				default: false
			},
			auth: {
				type: Boolean,
				default: false
			},
			method: {
				type: String,
				default: 'get'
			},
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
			params: function() {
				if (this.reload) this.$refs.paging.reload();
			},
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
				let list = [];
				try {
					const res = await this.$http[this.method](
						Object.assign(
							this.params,
							'message/pmsessionlist' == this.params.r ? {
								json: "{'page':" + page + ",'pageSize': " + pageSize + '}'
							} : {
								page,
								pageSize
							}
						), {
							custom: {
								auth: this.auth
							}
						}
					);
					list = res.body.list || res.body.data || res.pois || res.list;
				} catch (e) {
					//TODO handle the exception
				} finally {
					this.$refs.paging.complete(list);
					this.firstLoaded = true;
				}
			},
			gotoInfo(e) {
				const {
					id,
					plid,
					pmid,
					index,
					actions
				} = e.currentTarget.dataset;

				let url;

				if (actions) {
					const {
						redirect,
						title
					} = this.zList[index].actions[0]

					url = `/pages/wv/wv?title=${title}&url=${encodeURIComponent(redirect)}`
				} else if ('message/pmsessionlist' == this.params.r) {
					url = `/pages/chat/chat?plid=${plid}&pmid=${pmid}&fromUid=${id}`
				} else {
					url = `/pages/user/home?uid=${id}`
				}

				uni.navigateTo({
					url
				});

			}
		}
	};
</script>

<style scoped>
	.content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
