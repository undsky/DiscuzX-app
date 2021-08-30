<template>
    <view class="gesture"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd">
        <slot></slot>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                touchStartX : 0,//触摸时的原点
                touchStartY : 0,//触摸时的原点
                time : 0,// 时间记录，用于滑动时且时间小于1s则执行左右滑动
                interval : "",// 记录/清理时间记录
                touchMoveX : 0, // x轴方向移动的距离
                touchMoveY : 0, // y轴方向移动的距离
            };
        },
        props: {
            direction: {
                type: String,
                default: 'all'
            },
            distance: {
                type: [String,Number],
                default: 30
            }
        },
        methods: {
            // 触摸开始事件
            touchStart (e) {
                this.touchStartX = e.touches[0].pageX; // 获取触摸时的原点
                this.touchStartY = e.touches[0].pageY; // 获取触摸时的原点
                // 使用js计时器记录时间
                this.interval = setInterval(() => {
                    this.time++;
                }, 100);
            },
            // 触摸移动事件
            touchMove (e) {
                this.touchMoveX = e.touches[0].pageX;
                this.touchMoveY = e.touches[0].pageY;
            },
            // 触摸结束事件
            touchEnd (e) {
                let moveX = this.touchMoveX - this.touchStartX
                let moveY = this.touchMoveY - this.touchStartY
                if (Math.sign(moveX) == -1) {
                    moveX = moveX * -1;
                }
                if (Math.sign(moveY) == -1) {
                    moveY = moveY * -1;
                }
                if (2 * moveX <= moveY) {// 上下
                    if (this.direction != 'all' && this.direction != 'vertical') return;
                    // 向上滑动
                    if (this.touchMoveY - this.touchStartY <= -this.distance && this.time < 10) {
                        this.$emit('slideUp');
                    }
                    // 向下滑动
                    if (this.touchMoveY - this.touchStartY >= this.distance && this.time < 10) {
                        this.$emit('slideDown');
                    }
                }else if (moveX > 2 * moveY) {// 左右
                    if (this.direction != 'all' && this.direction != 'horizontal') return;
                    // 向左滑动
                    if (this.touchMoveX - this.touchStartX <= -this.distance && this.time < 10) {
                        this.$emit('slideLeft');
                    }
                    // 向右滑动
                    if (this.touchMoveX - this.touchStartX >= this.distance && this.time < 10) {
                        this.$emit('slideRight');
                    }
                }
                clearInterval(this.interval); // 清除setInterval
                this.time = 0;
            },
        },
    }
</script>
<style scoped>
    .gesture {
        width: 100%;
        height: 100%;
    }
</style>
