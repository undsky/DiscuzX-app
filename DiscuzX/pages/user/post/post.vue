<template>
	<view style="height: 100vh;"><dx-post-paging auth :hasAvatar="false" :params="params"></dx-post-paging></view>
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
			type: 'topic',
			uid: this.user.uid
		};
	}
};
</script>

<style></style>
