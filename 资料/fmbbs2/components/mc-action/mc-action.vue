<template>
	<view class="action" @click="action">
		<text v-if="leftIcon" class="margin-right-sm" :class="leftIcon"></text>
		<radio-group v-if="'radio' == type" @change="radioChange">
			<block v-for="(item,index) in radios" :key="index">
				<label class="margin-left-sm">
					<radio :class="[radioClass,radio == item.value ? 'checked' : '']" :checked="radio == item.value" :value="item.value"></radio>
					<text class="margin-left-sm" :class="['lg' == item.value ? 'diy-title-lg' : 'diy-title-normal']">{{item.text}}</text>
				</label>
			</block>
		</radio-group>
		<checkbox-group v-if="'checkbox' == type" @change="checkboxChange">
			<block v-for="(item,index) in checkboxs" :key="index">
				<label class="margin-left-sm">
					<checkbox :class="[checkboxClass,!!item.checked ? 'checked' : '']" :checked="!!item.checked" :value="item.value"></checkbox>
					<text class="margin-left-sm">{{item.text}}</text>
				</label>
			</block>
		</checkbox-group>
		<block v-if="'tag' == type" v-for="(item,index) in tags" :key="index">
			<mc-tag class="margin-left-sm" @click="$emit('click', {index,item})" :text="item.text" :size="item.size" :icon="item.icon"
			 :round="item.round" :radius="item.radius" :color="item.color" :border="item.border" :badge="item.badge" :capsule="item.capsule"></mc-tag>
		</block>
		<block v-if="'button' == type" v-for="(item,index) in _buttons" :key="index">
			<mc-button class="margin-left-sm" @click="$emit('click', {index,item})" :onlyIcon="!item.text && item.icon" :size="item.size"
			 :color="item.color" :round="item.round" :shadow="item.shadow" :border="item.border" :borderBold="item.borderBold"
			 :disabled="item.disabled" :loading="item.loading">
				<text v-if="item.icon" :class="item.icon"></text>
				<block v-if="item.text">{{item.text}}</block>
			</mc-button>
		</block>
		<text v-if="text" :class="[textClass,'switch' == type || rightIcon ? 'margin-right-sm' : '']">{{text}}</text>
		<switch v-if="'switch' == type" @change="switchChange" :class="[switchClass,switchVl ? 'checked' : '']" :checked="switchVl"></switch>
		<text v-if="rightIcon" :class="rightIcon"></text>
	</view>
</template>

<script>
	export default {
		name: "mcAction",
		props: {
			type: { // 类型：单选、多选、按钮、开关、标签
				type: String,
				validator: function(value) {
					return !value || ['radio', 'checkbox', 'button', 'switch', 'tag'].indexOf(value) !== -1
				}
			},
			text: String, // 子标题
			textClass: [String, Array], // 子标题样式
			leftIcon: [String, Array], // 子标题左侧图标
			rightIcon: [String, Array], // 子标题右侧图标
			switchClass: [String, Array], // 开关样式
			switchCheck: { // 是否打开开关
				type: Boolean,
				default: false
			},
			radioClass: [String, Array], // 单选样式
			radios: Array, // 单选
			checkboxClass: [String, Array], // 多选样式
			checkboxs: Array, // 多选
			buttons: [String, Array], // 按钮
			tags: [String, Array], // 标签
		},
		data() {
			return {
				switchVl: this.switchCheck,
				radio: null
			};
		},
		computed: {
			_buttons: function() {
				return this.str2Arr(this.buttons)
			},
			_tags: function() {
				return this.str2Arr(this.tags)
			}
		},
		methods: {
			str2Arr(str) {
				return 'string' === typeof str ? str.split(',').map(button => {
					return {
						text: button
					}
				}) : str
			},
			action() {
				if (!this.type) {
					this.$emit('click')
				}
			},
			switchChange(e) {
				this.switchVl = !this.switchVl
				this.$emit('change', this.switchVl)
			},
			radioChange(e) {
				this.radio = e.detail.value
				this.$emit('change', this.radio)
			},
			checkboxChange(e) {
				let items = this.checkboxs
				const values = e.detail.value;
				for (var i = 0; i < items.length; i++) {
					const item = items[i]
					if (values.includes(item.value)) {
						this.$set(item, 'checked', true)
					} else {
						this.$set(item, 'checked', false)
					}
				}
				this.$emit('change', values)
			}
		},
		created: function() {
			if (this.radios) {
				for (let radio of this.radios) {
					if (radio.checked) {
						this.radio = radio.value
						break;
					}
				}
			}
		}
	}
</script>

<style>

</style>
