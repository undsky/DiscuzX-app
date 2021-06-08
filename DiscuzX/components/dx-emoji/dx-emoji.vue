<template>
	<scroll-view class="emoji-scroll" scroll-x="true">
		<view class="emoji-panel">
			<image @click="handleEmoji" :data-emoji="item" class="emoji-item" v-for="(item, index) in emojis"
				:key="index" :src="'/static/emoji/' + (index < 10 ? '0' + index : index) + '.png'"></image>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name: 'dx-emoji',
		props: ['parent'],
		data() {
			return {
				emojis: this.$util.mobcent.emojis
			};
		},
		methods: {
			handleEmoji: function(e) {
				uni.$emit('tapemoji', {
					emoji: e.target.dataset.emoji,
					parent: this.parent
				});
			}
		}
	};
</script>

<style scoped>
	.emoji-scroll {
		background-color: #ffffff;
		height: 200px;
	}

	.emoji-panel {
		width: 100%;
		height: 200px;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		padding-top: 16px;
	}

	.emoji-item {
		height: 32px;
		width: 32px;
		margin: 5px;
	}
</style>
