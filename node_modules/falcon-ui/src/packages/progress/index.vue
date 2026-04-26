<template>
  <div class="progress-bar" @click="$emit('click')">
    <div class="active-bar" :style="strokeStyle" />
  </div>
</template>

<script>
export default {
  name: "FlProgress",
  model: {
    prop: "percent"
  },
  props: {
    percent: {
      type: Number | String, // 百分比(0~100)。
      default: 0,
      validator(val) {
        let num = Number(val);
        return num >= 0 && num <= 100;
      }
    },
    strokeColor: {
      type: String,
      default: ""
    },
    strokeRadius: {
      type: Boolean | Number | String,
      default: true
    },
    transition: {
      type: Boolean | String,
      default: true  // false, true, or time string eg. 350ms
    },
  },
  computed: {
    strokeStyle() {
      const strokeStyle = {};
      const bgColor = this.strokeColor;
      if (bgColor) {
        if (bgColor.indexOf(",") !== -1) {
          const colors = bgColor.split(",");
          strokeStyle.backgroundImage = `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
        } else {
          strokeStyle.backgroundColor = this.strokeColor;
        }
      }

      const radius = this.strokeRadius;
      if(radius === false || radius === "false"){
        strokeStyle.borderRadius = "0px";
      } else {
        if(!isNaN(Number(radius))){
          strokeStyle.borderRadius = radius + "px";
        }
      }
      strokeStyle.width = this.percent + "%";
      if (this.transition) {
          strokeStyle['transition-property'] = 'width'
          strokeStyle['transition-duration'] = this.transition === true ? '350ms' : this.transition
      }
      return strokeStyle;
    }
  }
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'progress';

@import (multiple) '../../styles/theme.config.less';

.progress-bar {
  background-color: @progress-bar-color;
  height: @progress-height;
  border-radius: 999px;
}
.active-bar {
  background-color: @progress-color;
  border-radius: 999px;
  height: 100%;
  width: 20%;
}

.loadUIOverrides();
</style>
