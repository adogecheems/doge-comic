<template>
  <div v-if="bShow" class="toast-outer" :style="toastStyle">
    <text class="toast-text" :style="textStyle">{{ message }}</text>
  </div>
</template>

<script>
import {toast as tc} from '../../styles/theme.config.js'

const TOAST_DEFAULT_DURATIONS = 2000;
export default {
  name: "Toast",
  props: {
    position: { type: String, default: "top" },  // top / middle / bottom
    maxWidth: { type: [String, Number], default: tc.get('maxwidth', '70%') },
    minHeight: { type: [String, Number], default: tc.get('minHeight', '76px') },
    textStyle: { type: Object, default() { return {} } },
  },
  data() {
    return {
      bShow: false,
      message: "",
      duration: 0,
      deviceWidth: $falcon.env.deviceWidth,
      deviceHeight: $falcon.env.deviceHeight,
    };
  },
  computed: {
    toastStyle() {
      let maxWidth
      if (this.maxWidth.endsWith('%')) {
        maxWidth = parseInt(this.maxWidth) / 100 * this.deviceWidth
      } else {
        maxWidth = parseInt(this.maxWidth)
      }
      const result = {
        maxWidth: `${maxWidth}px`,
        minHeight: parseInt(this.minHeight) + 'px',
      }
      if (this.position === 'top') {
        result['top'] = '0px'
      } else if (this.position === 'middle') {
        result['top'] = `${(this.deviceHeight - parseInt(this.minHeight)) / 2}px`
      } else if (this.position === 'bottom') {
        result['bottom'] = '0px'
      }
      return result
    }
  },
  methods: {
    show(options, callback) {
      if (this.bShow) {
        this.hide();
      }
      setTimeout(() => {
        if (typeof options === "string") {
          this.message = options;
        } else {
          this.message = options.message;
        }
        this.duration = options.duration || TOAST_DEFAULT_DURATIONS;
        this.bShow = true;

        this.callback = callback;

        if (this.timerId) {
          clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
          this.hide();
          this.timerId = 0;
          if (this.callback) {
            this.callback()
          }
        }, this.duration);
      });
    },

    hide() {
      this.bShow = false;
    },
  },
};
</script>
<style lang="less" scoped>
@type    : 'component';
@element : 'toast';

@import (multiple) '../../styles/theme.config.less';

.toast-outer {
  position: fixed;
  z-index: 999;

  align-items: center;
  justify-content: center;
  align-self: center;

  background-color: @secondary;
  border-radius: @toast-radius;
  padding-left: @toast-padding-x;
  padding-right: @toast-padding-x;
}
.toast-text {
  color: @toast-font-color;
  font-size: @toast-font-size;
}

.loadUIOverrides();
</style>
