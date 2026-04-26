<template>
  <canvas ref='canvas' :width='width' :height='height' :style="{width: width+'px',height:height+'px'}">
  </canvas>
</template>

<script>
import JsBarcode from "./libs/JsBarcode.js";
export default {
  name: 'FlBarCode',
  props: {
    width: {
      type: Number,
      default: 300,
      validator(val) {
        return val > 0;
      }
    },
    height: {
      type: Number,
      default: 150,
      validator(val) {
        return val > 0;
      }
    },
    text: {
      type: String,
    },
    options: {
      type: Object,
      default: {}
      // default: {
      //   width: 2,                    // The width option is the width of a single bar.
      //   height: 100,                 // The height of the barcode.
      //   format: "auto",              // default: "auto" (CODE128)
      //   displayValue: true,          // If show the text content.
      //   text: undefined,             // Content of the barcode.
      //   textAlign: "center",         // (textAlign) If show the text content.
      //   textPosition: "bottom",      // (textPosition) If show the text content.
      //   textMargin: 2,               // (textMargin) If show the text content.
      //   fontSize: 20,                // (fontSize) If show the text content.
      //   background: "#ffffff",       // Background of the barcode.
      //   lineColor: "#000000",        // lineColor of the barcode.
      //   margin: 10,                  // Margin to border.
      //   marginTop: undefined,
      //   marginBottom: undefined,
      //   marginLeft: undefined,
      //   marginRight: undefined,
      //   scaleType: "start",          // Scale mode if size dismatch. (start,center,fit)
      // }
    }
  },
  mounted() {
    this.makeCode();
  },
  methods: {
    makeCode() {
      if (this.text) {
        JsBarcode(this.$refs.canvas, this.text, this.options);
      }
    },
  },
  watch: {
    text() {
      this.makeCode();
    },
  }
}
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'bar-code';

@import (multiple) '../../styles/theme.config.less';

.loadUIOverrides();
</style>
