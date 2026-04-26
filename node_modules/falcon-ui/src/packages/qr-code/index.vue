<template>
  <canvas ref="canvas" :style="{ width: size + 'px', height: size + 'px' }" :width="size" :height="size"> </canvas>
</template>

<script>
import QRCode from "./qrcode.js";
export default {
  name: "FlQRCode",
  props: {
    // 二维码显示尺寸
    size: {
      type: Number | String,
      default: 256,
      validator(val) {
        return val > 0;
      }
    },
    //二维码配置 {color: 二维码颜色. bgColor: 背景颜色, corret:纠错等级(1,2,3,4)}
    options: {
      type: Object
    },
    // 二维码内容
    text: {
      type: String
    }
  },
  mounted() {
    this.makeCode();
  },
  methods: {
    makeCode() {
      // 生成二维码
      if (this.text) {
        const propOpts = this.options || {};
        const options = {
          width: this.size,
          height: this.size
        };
        if (propOpts.color) {
          options.colorDark = propOpts.color;
        }
        if (propOpts.bgColor) {
          options.colorLight = propOpts.bgColor;
        }
        if (propOpts.corret) {
          options.correctLevel = propOpts.corret;
        }
        const qrcode = new QRCode(this.$refs.canvas, options);
        qrcode.makeCode(this.text);
      }
    }
  },
  watch: {
    text() {
      // text属性发生变化，重新生成二维码
      this.makeCode();
    }
  }
};
</script>
<style lang="less" scoped>
@type    : 'component';
@element : 'qr-code';

@import (multiple) '../../styles/theme.config.less';

.loadUIOverrides();
</style>
