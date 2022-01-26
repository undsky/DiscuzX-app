<template>
	<view>
		<view class="cu-bar foot input" :style="[{ bottom: InputBottom + 'px' }]">
			<view @click="chooseImg" class="action"><text class="cuIcon-pic text-grey"></text></view>
			<textarea class="margin-left-sm" :value="replytext" placeholder="请输入内容" auto-height :adjust-position="false"
				:focus="focus" maxlength="300" cursor-spacing="10" @focus="InputFocus" @blur="InputBlur"></textarea>
			<view @click="chooseEmoji" class="action margin-right-sm"><text class="cuIcon-emojifill text-grey"></text>
			</view>
			<u-button throttleTime="1000" type="warning" @click="send">发送</u-button>
		</view>
		<uni-popup @change="handlePopupChange" ref="emoji" type="bottom">
			<dx-emoji :parent="parent"></dx-emoji>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		name: 'dx-chatbar',
		props: {
			parent: {
				type: String,
				default: ''
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
		computed: {
			...mapState({
				user: state => state.auth.user
			})
		},
		methods: {
			chooseImg() {
				if (this.user) {
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						success: async images => {
							uni.$emit('replyImg', images.tempFilePaths[0]);
						}
					});
				} else {
					uni.navigateTo({
						url: '/pages/auth/auth',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			},
			getFocus() {
				this.focus = true;
			},
			send: async function() {
				if (this.user) {
					if (this.replytext) {
						uni.$emit('reply', this.replytext);
					} else {
						uni.showToast({
							title: '请输入内容'
						});
					}
				} else {
					uni.navigateTo({
						url: '/pages/auth/auth',
						success: res => {},
						fail: () => {},
						complete: () => {}
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
				if (data.parent == this.parent) this.replytext += data.emoji;
			});
		}
	};
</script>

<style></style>
