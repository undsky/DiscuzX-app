<template>
	<scroll-view refresher-enabled @refresherrefresh="reload" :refresher-triggered="reloadTriggered" :scroll-top="scrollTop"
	 @scroll="scroll" class="page" scroll-y="true" @scrolltolower="loadMore">
		<view v-if="users.length > 0" class="cu-list menu-avatar">
			<item-user v-for="item in users" :key="item.plid" :uid="item.toUserId" :plid="item.plid" :pmid="item.pmid" :nickname="item.toUserName"
			 :icon="item.toUserAvatar" :note="item.lastSummary" :lastLogin="item.lastDateline" :type="'xiaoxi'"></item-user>
		</view>
		<empty v-else />
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				users: [],
				allowLoad: true,
				hasMore: true,
				page: 1,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				reloadTriggered: false,
			};
		},
		methods: {
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop;
			},
			reload: async function() {
				if (this.old.scrollTop > 45) {
					this.reloadTriggered = false
					return
				}
				if (this.allowLoad) {
					this.allowLoad = false;
					this.page = 1;
					this.reloadTriggered = true
					this.$tool.loading()
					let data = await this.$tool.getData({
						r: this.$api.pmsessionlist,
						json: "{'page':" + this.page + ",'pageSize': " + this.$config.pageSize + '}'
					});
					this.users = data && data.body.list ? data.body.list : [];
					setTimeout(() => {
						this.reloadTriggered = false
						this.$tool.loaded()
					}, 500)
					this.allowLoad = true;
				}
			},
			loadMore: async function() {
				if (this.allowLoad && this.hasMore) {
					this.allowLoad = false;
					this.page++;
					let data = await this.$tool.getData({
						r: this.$api.pmsessionlist,
						json: "{'page':" + this.page + ",'pageSize': " + this.$config.pageSize + '}'
					});
					if (data && data.body.list) {
						this.users.push(...data.body.list);
						this.hasMore = data.body.list.length == this.$config.pageSize;
					} else {
						this.hasMore = false;
					}
					this.allowLoad = true;
				}
			}
		},
		created: function() {
			uni.setNavigationBarTitle({
				title: '消息'
			});
			this.reload();
		}
	};
</script>

<style></style>
