<template>
	<view><dx-post-paging usePageScroll :params="params"></dx-post-paging></view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			params: {}
		};
	},
	computed: {
		...mapState({
			user: state => state.auth.user
		})
	},
	methods: {},
	onLoad: function(options) {
		this.params = {
			r: 'user/topiclist',
			type: 'reply',
			uid: this.user.uid
		};
	}
};
</script>

<style></style>
