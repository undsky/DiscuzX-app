<template>
	<view>
		<dx-navbar title="社区"></dx-navbar>
		<u-tabs-swiper ref="tabs" :list="tabList" :is-scroll="false" :current="tabIndex" @change="tabChange">
		</u-tabs-swiper>
		<swiper class="swiper" :current="currentIndex" @change="swiperChange" @transition="transition"
			@animationfinish="animationfinish">
			<swiper-item>
				<view v-for="item in boardList" :key="item.board_category_id">
					<view class="cu-bar bg-white">
						<view class="action">
							<text class="cuIcon-titles text-orange"></text>
							<text class="text-lg text-bold">{{ item.board_category_name }}</text>
						</view>
					</view>
					<u-grid :border="false" :col="4">
						<u-grid-item @click="$util.helper.goto('./list/list?board_id=' + board.board_id)"
							v-for="board in item.board_list" :key="board.board_id">
							<u-badge :count="board.td_posts_num" :offset="[20, 20]"></u-badge>
							<u-icon :color="board.td_posts_num ? '#f37b1d' : '#8799a3'"
								:name="board.board_img || 'chat-fill'" :size="64"></u-icon>
							<view class="grid-text text-grey margin-top-sm">{{ board.board_name }}</view>
						</u-grid-item>
					</u-grid>
				</view>
			</swiper-item>
			<swiper-item>
				<scroll-view class="sv" scroll-y="true" :refresher-enabled="true" :refresher-triggered="triggered"
					@refresherrefresh="reloadPhoto" @refresherpulling="onPulling" @scrolltolower="loadMorePhoto">
					<u-waterfall v-model="photoList" ref="uWaterfall">
						<template v-slot:left="{ leftList }">
							<view class="cu-card dynamic no-card">
								<view @click="$util.helper.goto('/pages/detail/detail?id=' + item.topic_id)"
									class="cu-item shadow" v-for="(item, index) in leftList" :key="item.topic_id">
									<view class="cu-list menu-avatar">
										<view class="cu-item">
											<view class="cu-avatar">
												<u-avatar :src="item.userAvatar"></u-avatar>
											</view>
											<view class="content flex-sub">
												<view>{{ item.user_nick_name }}</view>
												<view class="text-gray text-sm flex justify-between">
													{{ item.last_reply_date }}
												</view>
											</view>
										</view>
									</view>
									<view class="padding-lr-xs margin-top-xs">
										<u-lazy-load border-radius="10" :image="item.pic_path" :index="index">
										</u-lazy-load>
									</view>
									<view class="text-gray text-sm text-right padding">
										<text class="cuIcon-attentionfill margin-lr-xs"></text>
										{{ item.hits || 0 }}
										<text class="cuIcon-messagefill margin-lr-xs"></text>
										{{ item.replies || 0 }}
									</view>
								</view>
							</view>
						</template>
						<template v-slot:right="{ rightList }">
							<view class="cu-card dynamic no-card">
								<view @click="$util.helper.goto('/pages/detail/detail?id=' + item.topic_id)"
									class="cu-item shadow" v-for="(item, index) in rightList" :key="item.topic_id">
									<view class="cu-list menu-avatar">
										<view class="cu-item">
											<view class="cu-avatar">
												<u-avatar :src="item.userAvatar"></u-avatar>
											</view>
											<view class="content flex-sub">
												<view>{{ item.user_nick_name }}</view>
												<view class="text-gray text-sm flex justify-between">
													{{ item.last_reply_date }}
												</view>
											</view>
										</view>
									</view>
									<view class="padding-lr-xs margin-top-xs">
										<u-lazy-load border-radius="10" :image="item.pic_path" :index="index">
										</u-lazy-load>
									</view>
									<view class="text-gray text-sm text-right padding">
										<text class="cuIcon-attentionfill margin-lr-xs"></text>
										{{ item.hits || 0 }}
										<text class="cuIcon-messagefill margin-lr-xs"></text>
										{{ item.replies || 0 }}
									</view>
								</view>
							</view>
						</template>
					</u-waterfall>
					<u-loadmore :status="loadStatus"></u-loadmore>
				</scroll-view>
			</swiper-item>
		</swiper>

		<dx-tabbar :currentTab="1"></dx-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				boardList: [],
				tabList: [{
						name: '板块'
					},
					{
						name: '靓照'
					}
				],
				tabIndex: 0,
				currentIndex: 0,
				photoList: [],
				allowLoad: true,
				loadStatus: 'loadmore',
				page: 1,
				triggered: false
			};
		},
		methods: {
			tabChange(index) {
				this.currentIndex = index;
			},
			swiperChange: async function(e) {
				this.tabIndex = e.detail.current;

				if (1 == this.tabIndex && 0 == this.photoList.length) {
					await this.reloadPhoto();
				}
			},
			transition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			animationfinish(e) {
				this.$refs.tabs.setFinishCurrent(e.detail.current);
			},
			onPulling() {
				if (!this.triggered)
					this.triggered = true;
			},
			reloadPhoto: async function() {
				if (this.allowLoad) {
					this.allowLoad = false;
					this.page = 1;
					this.loadStatus = 'loadmore';
					uni.showLoading({
						mask: true
					});
					try {
						const result = await this.$http.get({
							// r: 'forum/photogallery',
							// pageSize: 20
							page: this.page,
							r: 'forum/topiclist',
							boardId: 0,
							filterType: 'typeid',
							filterId: 0,
							sortby: 'photo'
						}, {
							custom: {
								auth: false
							}
						});

						if (result) {
							await this.$refs.uWaterfall.clear();
							setTimeout(() => {
								this.photoList = result.list.map(item => {
									item.last_reply_date = this.$u.timeFrom(item
										.last_reply_date);
									return item;
								});
							}, 500)
						}
					} catch (e) {
						//TODO handle the exception
					} finally {
						this.triggered = false;
						uni.hideLoading();
					}

					this.allowLoad = true;
				}
			},
			loadMorePhoto: async function() {
				if (this.allowLoad && 'nomore' != this.loadStatus) {
					this.allowLoad = false;
					this.page++;
					uni.showLoading({
						mask: true
					});
					try {
						const result = await this.$http.get({
							// r: 'forum/photogallery',
							// pageSize: 20
							page: this.page,
							r: 'forum/topiclist',
							boardId: 0,
							filterType: 'typeid',
							filterId: 0,
							sortby: 'photo'
						}, {
							custom: {
								auth: false
							}
						});

						if (result) {
							this.photoList.push(
								...result.list.map(item => {
									item.last_reply_date = this.$u.timeFrom(item.last_reply_date);
									return item;
								})
							);
							if (result.list.length < 20) {
								this.loadStatus = 'nomore';
							}
						}
					} catch (e) {
						//TODO handle the exception
					} finally {
						uni.hideLoading();
					}

					this.allowLoad = true;
				}
			},
			loadBoard: async function() {
				const result = await this.$http.post({
					r: 'forum/forumlist'
				}, {
					custom: {
						auth: false
					}
				});

				if (result) this.boardList = result.list;
			}
		},
		onLoad: async function(options) {
			await this.loadBoard();
		}
	};
</script>

<style scoped>
	.swiper,
	.sv {
		height: calc(100vh - 158px - var(--status-bar-height));
	}
</style>
