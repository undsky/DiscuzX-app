<template>
	<view class="content">
		<z-paging :fixed="false" style="height: 100%;" ref="paging" v-model="zList" :use-page-scroll="usePageScroll"
			autowire-query-name="zQuery" :auto="false" :enable-back-to-top="currentIndex === tabIndex">
			<view class="cu-list" :class="[hasAvatar ? 'menu-avatar' : 'padding-lr']">
				<view v-for="(item, index) in zList" :key="index" class="cu-item cur post-item" :data-id="item.topic_id"
					:data-note="item.note" :data-announce_id="item.announce_id" @click="gotoDetail">
					<view v-if="hasAvatar" class="cu-avatar">
						<u-avatar :show-sex="!!item.gender" :sex-icon="1 == item.gender ? 'man' : 'woman'"
							:src="item.userAvatar || item.icon || item.authorAvatar"></u-avatar>
					</view>
					<view class="content flex-sub justify-center">
						<view>
							<view class="text-cut">{{ item.title || item.topic_subject || item.note }}</view>
						</view>
						<view class="text-cut text-grey text-sm">
							{{ item.subject || item.reply_content }}
							<!-- <mp-html lazy-load :preview-img="false"
								:content="$util.mobcent.phiz(item.subject || item.reply_content)" /> -->
						</view>
						<view class="text-xs flex justify-between">
							<view class="flex">
								<view class="text-cut text-green">
									{{ item.user_nick_name || item.reply_nick_name || item.author }}
								</view>
								<view class="text-gray margin-left-xs">
									{{ $u.timeFrom(item.last_reply_date || item.replied_date || item.dateline || item.start_date) }}
								</view>
							</view>
							<view v-if="item.board_name || item.hits || item.replies" class="text-gray">
								{{ item.board_name }}
								<text class="cuIcon-attentionfill margin-lr-xs"></text>
								{{ item.hits || 0 }}
								<text class="cuIcon-messagefill margin-lr-xs"></text>
								{{ item.replies || 0 }}
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
					const result = await this.$http[this.method](
						Object.assign(this.params, {
							page,
							pageSize
						}), {
							custom: {
								auth: this.auth
							}
						}
					);
					if (result.list && result.list.length > 0) {
						list = result.list;
					} else if (result.pois && result.pois.length > 0) {
						list = result.pois;
					} else if (result.body.data && result.body.data.length > 0) {
						list = result.body.data;
					} else if (result.anno_list && result.anno_list.length > 0) {
						list = result.anno_list
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					this.$refs.paging.complete(list || []);
					this.firstLoaded = true;
				}
			},
			gotoDetail: async function(e) {
				const {
					id,
					note,
					announce_id
				} = e.currentTarget.dataset;
				if (note) {
					this.$util.helper.modal(note);
				} else if (announce_id) {
					const result = await this.$http.get({
						r: 'forum/announcement',
						id: announce_id
					});

					if (result) {
						const {
							title,
							starttime,
							endtime,
							content: {
								infor,
								type
							}
						} = result.body.list

						uni.showModal({
							title,
							content: infor + `\r\n\n${starttime} 至 ${endtime}`,
							showCancel: false,
							cancelText: '',
							confirmText: '确定',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}
				} else {
					this.$util.helper.goto('/pages/detail/detail?id=' + id);
				}
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
