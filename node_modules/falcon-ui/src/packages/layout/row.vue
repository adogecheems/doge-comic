<template>
  <div class="fl-row" :style="style" @click="$emit('click')">
    <slot />
  </div>
</template>

<script>
const JUSTIFY_MAP = {
  start: "flex-start",
  end: "flex-end",
};

const ALIGN_MAP = {
  top: "flex-start",
  bottom: "flex-end",
};
export default {
  name: "FlRow",
  props: {
    gutter: {
      type: Number | String,
      default: 0,
    },
    justify: {
      type: String,
      default: "start",
    },
    align: {
      type: String,
      default: "top",
    },
  },
  computed: {
    style() {
      const gutter = Number(this.gutter) | 0;
      let justify = JUSTIFY_MAP[this.justify] || this.justify;

      let align = ALIGN_MAP[this.align] || this.align;
      return {
        marginLeft: -gutter / 2 + "px",
        justifyContent: justify,
        alignItems: align,
      };
    },
  },
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'row';

@import (multiple) '../../styles/theme.config.less';

.fl-row {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
}

.loadUIOverrides();
</style>
