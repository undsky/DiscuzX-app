<template>
	<view>
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view @click="sendImg" class="action">
				<text class="cuIcon-pic text-grey"></text>
			</view>
			<input :value="replytext" placeholder="请输入内容" class="uni-input solid-bottom" maxlength="300"
				cursor-spacing="10" @focus="InputFocus" @blur="InputBlur"></input>
			<view @click="handleEmoji" class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button @click="$u.throttle(send)" class="cu-btn bg-green shadow">发送</button>
		</view>
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
		}
	}
</script>

<style>

</style>
