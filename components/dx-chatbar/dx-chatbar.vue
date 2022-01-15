<template>
	<view>
		<view class="cu-bar foot input" :style="[{ bottom: InputBottom + 'px' }]">
			<view v-if="showImg" @click="chooseImg" class="action"><text class="cuIcon-pic text-grey"></text></view>
			<textarea
				class="margin-left-sm"
				:value="replytext"
				placeholder="请输入内容"
				auto-height
				:adjust-position="false"
				:focus="focus"
				maxlength="300"
				cursor-spacing="10"
				@focus="InputFocus"
				@blur="InputBlur"
			></textarea>
			<view @click="chooseEmoji" class="action"><text class="cuIcon-emojifill text-grey"></text></view>
			<button style="width: 70px;" @click="$u.throttle(send, 1000)" class="cu-btn bg-green shadow margin-left-sm">发送</button>
		</view>
		<uni-popup @change="handlePopupChange" ref="emoji" type="bottom"><dx-emoji></dx-emoji></uni-popup>
	</view>
</template>

<script>
export default {
	name: 'dx-chatbar',
	props: {
		showImg: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			replytext: '',
			focus: false,
			InputBottom: 0,
			showEmoji: false
		};
	},
	methods: {
		getFocus() {
			this.focus = true;
		},
		send: async function() {
			if (this.replytext) {
				uni.$emit('reply', this.replytext);
			} else {
				uni.showToast({
					title: '请输入内容'
				});
			}
		},
		InputFocus(e) {
			if (this.showEmoji) {
				this.InputBottom = 0;
				this.showEmoji = false;
				this.$refs.emoji.close();
			} else {
				this.InputBottom = e.detail.height;
			}
		},
		InputBlur(e) {
			this.replytext = e.detail.value;
			this.InputBottom = 0;
			this.focus = false;
		},
		chooseEmoji: function() {
			if (this.showEmoji) {
				this.InputBottom = 0;
				this.showEmoji = false;
				this.$refs.emoji.close();
			} else {
				this.InputBottom = 200;
				this.showEmoji = true;
				this.$refs.emoji.open();
			}
		},
		handlePopupChange: function(e) {
			if (!e.show) {
				this.InputBottom = 0;
				this.showEmoji = false;
			}
		}
	},
	mounted() {
		uni.$on('tapemoji', data => {
			this.replytext += data.emoji;
		});
	}
};
</script>

<style></style>
