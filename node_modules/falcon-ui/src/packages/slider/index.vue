<template>
  <slider
    :style="{width, height}"
    :infinite="infinite"
    :showIndicators="showIndicators"
    @change="(e) => $emit('change', e)"
    :previousMargin="previousMargin"
    :nextMargin="nextMargin"
    :interval="interval == 0 ? (autoPlay ? 2000 : 0) : interval"
    :scrollable="scrollable"
    :auto-play="autoPlay"
  >
    <slot></slot>
  </slider>
</template>

<script>
export default {
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '260px' },
    interval: { type: Number, default: 0 },
    infinite: { type: Boolean, default: false },
    showIndicators: { type: Boolean, default: false },
    previousMargin: { type: String, default: '18%' },
    nextMargin: { type: String, default: '18%' },
    scrollable: { type: Boolean, default: true },
    autoPlay: { type: Boolean, default: false },
  },
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'slider';

@import (multiple) '../../styles/theme.config.less';

.loadUIOverrides();
</style>
