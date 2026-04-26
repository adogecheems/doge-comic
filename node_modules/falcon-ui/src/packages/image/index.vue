<template>
  <image
    @load="onImageLoad"
    :style="{ width: innerWidth, height: innerHeight }"
    :src="src"
    :resize="resize"
  /></image>
</template>

<script>
export default {
  props: {
    src: {type: String},
    resize: {type: String, default: "contain"}, // contain / cover / stretch / left / right / top / bottom
    width: {type: String, default: 'auto'},
    height: {type: String, default: 'auto'},
  },
  data() {
    return {
      naturalWidth: 0,
      naturalHeight: 0,
    }
  },
  mounted() {},
  computed: {
    innerWidth () {
      if (this.width == 'auto') {
        if (this.naturalWidth == 0) return '100%'
        else return `${this.naturalWidth}px`
      }
      // else
      return this.width
    },
    innerHeight() {
      if (this.height == 'auto') {
        if (this.naturalHeight == 0) return '100%'
        else return `${this.naturalHeight}px`
      }
      // else
      return this.height
    },
  },
  methods: {
    onImageLoad(event) {
      this.$emit('onImageLoad', event)
      if (event.size) {
        this.naturalWidth = event.size.naturalWidth
        this.naturalHeight = event.size.naturalHeight
      }
    }
  }
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'image';

@import (multiple) '../../styles/theme.config.less';

.loadUIOverrides();
</style>
