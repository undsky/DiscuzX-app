<template>
	<button @click="$emit('click')" class="cu-btn" :loading="loading" :disabled="disabled" :class="[border?borderBold?'lines-' + color:'line-' + color:'bg-'+ color,round?'round':'',size,shadow?'shadow':'',onlyIcon?'cuIcon':'']">
		<slot></slot>
	</button>
</template>

<script>
	/**
	 * mcButton 按钮
	 * @description 
	 * @tutorial 
	 * @property {String} size 尺寸：sm、lg
	 * @event {Function} click 点击触发
	 * @example 
	 */
	export default {
		name: 'mcButton', // 按钮
		props: {
			size: String, // 尺寸
			onlyIcon: { // 只显示图片
				type: Boolean,
				default: false
			},
			color: { // 颜色
				type: String,
				default: 'gray'
			},
			round: { // 椭圆
				type: Boolean,
				default: false
			},
			shadow: { // 阴影
				type: Boolean,
				default: false
			},
			border: { // 镂空
				type: Boolean,
				default: false
			},
			borderBold: { // 粗边框
				type: Boolean,
				default: false
			},
			disabled: { // 禁用
				type: Boolean,
				default: false
			},
			loading: { // 原生加载
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>
