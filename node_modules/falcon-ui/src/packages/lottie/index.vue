<template>
  <canvas :width="this.width" :height="this.height" ref="canvas"></canvas>
</template>

<script>
export default {
  name: 'FlLottie',
  model:{
    event: 'loop'
  },
  props: {
    animationData: { // lottie动画数据
      type: Object,
    },
    width: {        // 宽度(px)
      type: Number,
      default: 300,
    },
    height: {       // 高度(px)
      type: Number,
      default: 150,
    },
    loopCount: {
      type: Number,
      default: 1,
      validator(val) {
        return val >= 0;
      },
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
      default: 1,
      validator(val) {
        return val > 0;
      },
    }
  },
  data() {
    return {
      running: false,
      pause: false,
    };
  },
  mounted() {
    import('./lottie_canvas.min.js').then((lottie) => {
      this.init(lottie)
    })
  },
  beforeDestroy() {
    this.anim && this.anim.destroy();
  },
  methods: {
    init(lottie) {
      this.anim = lottie.loadAnimation({
        renderer: "canvas",
        loop: true,
        autoplay: this.autoplay,
        animationData: this.animationData,
        rendererSettings: {
          context: typeof createCanvasContext === 'function' ? createCanvasContext(this.$refs.canvas) : this.$refs.canvas.getContext('2d'),
          width: this.width,
          height: this.height,
        }
      });
      this.anim.setSpeed(this.speed);
      this.currentLoop = 0;

      this.anim.onLoopComplete = () => {
        if (this.loopCount > 0) {
          if (++this.currentLoop >= this.loopCount) {
            this.currentLoop = 0;
            this.anim.pause();
            this.running = false;
            this.$emit('loop', true);
          } else {
            this.$emit('loop', false);
          }
        } else {
          this.$emit('loop', false);
        }
      };
      if (this.autoplay) {
        this.running = true;
      }
    },
    stopAnim() {
      this.anim && this.anim.stop();
      this.running = false;
    },
    startAnim() {
      this.currentLoop = 0;
      this.anim && this.anim.play();
      this.running = true;
      this.pause = false;
    },
    // resumeAnim() {
    //   this.running && this.anim && this.anim.play();
    //   this.pause = false;
    // },
    pauseAnim() {
      !this.pause && this.anim && this.anim.pause();
      this.pause = true;
    },
  },
}
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'lottie';

@import (multiple) '../../styles/theme.config.less';

.loadUIOverrides();
</style>
