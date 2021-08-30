<template>
	<view @click="$emit('click',bindData)" class="cu-item" :class="[arrow?'arrow':'',touchDirection?'move-cur-'+touchDirection:'']"
	 @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
		<view v-if="'right' == move || 'both' == move" class="move move-right">
			<slot name="moveRight"></slot>
		</view>
		<slot name="left"></slot>
		<view v-if="text" class="content padding-xs width-100pct">
			<view>
				<image v-if="image" :src="image" mode="aspectFit"></image>
				<text v-else-if="icon" class="margin-right-sm" :class="[icon,iconColor?'text-'+iconColor:'']"></text>
				<text :class="[textClass,color?'text-'+color:'',cut?'text-cut':'','lg' == size ? 'diy-title-lg' : 'diy-title-normal']">{{text}}</text>
				<slot name="tag"></slot>
			</view>
			<view v-if="subText" class="text-sm" :class="[image || icon?'padding-left-lg':'',subColor?'text-'+subColor:'',subCut?'text-cut':'']">{{subText}}</view>
			<slot name="actionbar"></slot>
		</view>
		<slot></slot>
		<view v-if="'left' == move || 'both' == move" class="move move-left">
			<slot name="moveLeft"></slot>
		</view>
	</view>
</template>

<script>
	let _touchDirection = null;
	export default {
		name: "mcItem", // 列表项
		props: {
			bindData: [String, Number, Object], // 绑定数据
			text: String, // 文本
			size: String,
			textClass: [String, Array], // 文本样式
			color: { // 文本颜色
				type: String,
				default: 'black'
			},
			cut: { // 文本截断
				type: Boolean,
				default: false
			},
			move: { // 滑动：左滑、右滑、双向
				type: String,
				validator: function(value) {
					return !value || ['left', 'right', 'both'].indexOf(value) !== -1
				}
			},
			subText: String, // 副文本
			subCut: { // 副文本截断
				type: Boolean,
				default: false
			},
			subColor: { // 副文本颜色
				type: String,
				default: 'grey'
			},
			arrow: { // 箭头
				type: Boolean,
				default: false
			},
			image: String, // 图片
			icon: String, // 图标
			iconColor: String, // 图标颜色
		},
		data() {
			return {
				touchStart: 0,
				touchDirection: null,
			};
		},
		methods: {
			handleTouchStart(e) {
				this.touchStart = e.touches[0].pageX
			},

			handleTouchMove(e) {
				_touchDirection = e.touches[0].pageX - this.touchStart > 0 ? 'right' : 'left'
			},

			handleTouchEnd(e) {
				if ('both' == this.move || _touchDirection == this.move) {
					if (this.touchDirection) {
						_touchDirection = null
						this.touchDirection = null
					} else {
						this.touchDirection = _touchDirection
					}
				}
			}
		}
	}
</script>

<style>

</style>
