<template>
	<view>
		<dx-navbar title="板块"></dx-navbar>
		<u-tabs-swiper ref="tabs" :list="tabList" :is-scroll="false" :current="tabIndex" @change="tabChange">
		</u-tabs-swiper>
		<swiper class="swiper" :current="currentIndex" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
				<view v-if="0 == index" v-for="item in boardList" :key="item.board_category_id">
					<view class="cu-bar bg-white">
						<view class="action">
							<text class="cuIcon-titles text-orange"></text>
							<text class="text-lg text-bold">{{ item.board_category_name }}</text>
						</view>
					</view>
					<u-grid :border="false" :col="4">
						<u-grid-item @click="$util.helper.goto('./list/list?board_id='+board.board_id)"
							v-for="board in item.board_list" :key="board.board_id">
							<u-badge :count="board.td_posts_num" :offset="[20, 20]"></u-badge>
							<u-icon :color="board.td_posts_num ? '#f37b1d' : '#8799a3'"
								:name="board.board_img || 'chat-fill'" :size="64"></u-icon>
							<view class="grid-text text-grey margin-top-sm">{{ board.board_name }}</view>
						</u-grid-item>
					</u-grid>
				</view>
				<scroll-view class="sv" v-else scroll-y="true" @scrolltoupper="" @scrolltolower="">
					<u-waterfall v-model="flowList" ref="uWaterfall">
						<template v-slot:left="{ leftList }">
							<view class="cu-card case no-card">
								<view class="cu-item shadow" v-for="(item, index) in leftList" :key="index">
									<view class="image">
										<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
											mode="widthFix"></image>
										<view class="cu-tag bg-blue">史诗</view>
										<view class="cu-bar bg-shadeBottom"> <text
												class="text-cut">我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。</text>
										</view>
									</view>
									<view class="cu-list menu-avatar">
										<view class="cu-item">
											<view class="cu-avatar round lg"
												style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);">
											</view>
											<view class="content flex-sub">
												<view class="text-cut">正义天使 凯尔</view>
												<view class="text-gray text-sm flex justify-between">
													<view class="text-gray text-sm">
														<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
														<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
														<text class="cuIcon-messagefill margin-lr-xs"></text> 30
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</template>
						<template v-slot:right="{ rightList }">
							<view class="cu-card dynamic no-card">
								<view class="cu-item shadow" v-for="(item, index) in rightList" :key="index">
									<view class="cu-list menu-avatar">
										<view class="cu-item">
											<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
											<view class="content flex-sub">
												<view>凯尔</view>
												<view class="text-gray text-sm flex justify-between">
													2019年12月3日
												</view>
											</view>
										</view>
									</view>
									<view class="grid flex-sub padding-lr col-1 margin-top-xs">
										<image class="radius" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
											mode="widthFix"></image>
									</view>
									<view class="text-gray text-sm text-right padding">
										<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
										<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
										<text class="cuIcon-messagefill margin-lr-xs"></text> 30
									</view>
							
									
								</view>
							</view>
						</template>
					</u-waterfall>
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
				}, {
					name: '靓照'
				}],
				tabIndex: 0,
				currentIndex: 0,
				flowList: [],
				list: [{
						price: 35,
						title: '北国风光，千里冰封，万里雪飘',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg'
					},
					{
						price: 75,
						title: '望长城内外，惟余莽莽',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg'
					},
					{
						price: 385,
						title: '大河上下，顿失滔滔',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg'
					},
					{
						price: 784,
						title: '欲与天公试比高',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/zzpic23369_s.jpg'
					},
					{
						price: 7891,
						title: '须晴日，看红装素裹，分外妖娆',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg'
					},
					{
						price: 2341,
						shop: '李白杜甫白居易旗舰店',
						title: '江山如此多娇，引无数英雄竞折腰',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg'
					},
					{
						price: 661,
						shop: '李白杜甫白居易旗舰店',
						title: '惜秦皇汉武，略输文采',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23344_s.jpg'
					},
					{
						price: 1654,
						title: '唐宗宋祖，稍逊风骚',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg'
					},
					{
						price: 1678,
						title: '一代天骄，成吉思汗',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg'
					},
					{
						price: 924,
						title: '只识弯弓射大雕',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg'
					},
					{
						price: 8243,
						title: '俱往矣，数风流人物，还看今朝',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg'
					}
				]
			};
		},
		methods: {
			tabChange(index) {
				this.currentIndex = index;
			},
			transition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.tabIndex = current;
			}
		},
		onLoad: async function(options) {
			const result = await this.$http.post({
				r: 'forum/forumlist'
			}, {
				custom: {
					auth: false
				}
			});

			this.boardList = result.list;

			for (let i = 0; i < 110; i++) {
				let index = this.$u.random(0, this.list.length - 1);
				// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
				let item = JSON.parse(JSON.stringify(this.list[index]));
				item.id = this.$u.guid();
				this.flowList.push(item);
			}
		}
	};
</script>

<style scoped>
	.swiper,
	.sv {
		height: calc(100vh - 158px - var(--status-bar-height));
	}
</style>
