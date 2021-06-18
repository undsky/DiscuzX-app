<template>
	<view>
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<textarea class="margin-left-sm" :value="replytext" placeholder="请输入内容" auto-height :adjust-position="false"
				:focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus" @blur="InputBlur"></textarea>
			<view @click="handleEmoji" class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button style="width: 70px;" @click="$u.throttle(send)"
				class="cu-btn bg-green shadow margin-left-sm">发送</button>
		</view>
		<u-popup v-model="showEmoji" mode="bottom" :mask="false" safe-area-inset-bottom @close="popupClose">
			<dx-emoji></dx-emoji>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "dx-chatbar",
		data() {
			return {
				replytext: '',
				showEmoji: false,
				InputBottom: 0
			};
		},
		created() {
			uni.$on('emoji', emoji => {
				this.replytext += emoji;
			})
		},
		methods: {
			send: async function() {
				if (this.replytext) {
					uni.$emit('reply', this.replytext)
				} else {
					uni.showToast({
						title: '请输入内容'
					});
				}
			},
			handleEmoji: function() {
				if (this.showEmoji) {
					this.InputBottom = 0;
					this.showEmoji = false;
				} else {
					this.InputBottom = 200;
					this.showEmoji = true;
				}
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height;
				this.showEmoji = false;
			},
			InputBlur(e) {
				this.replytext = e.detail.value;
				this.InputBottom = 0;
				this.showEmoji = false;
			},
			popupClose(e) {
				this.InputBottom = 0;
				this.showEmoji = false;
			}
		}
	}
</script>

<style>

</style>
