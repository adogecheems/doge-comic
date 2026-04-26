<template>
  <div class="fl-col" :style="style" @click="$emit('click')">
    <slot />
  </div>
</template>

<script>
const MAX_SPAN_COUNT = 24;
export default {
  name: "FlCol",
  props: {
    span: {
      type: Number | String,
      default: MAX_SPAN_COUNT,
    },
    offset: {
      type: Number | String,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    style(){
      const span = Number(this.span) || MAX_SPAN_COUNT;
      const style = {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis:(span * 100) / MAX_SPAN_COUNT + "%"
      };
      const gutter = Number(this.$parent.gutter);
      if(gutter){
        const space = gutter / 2;
        style.paddingLeft = space + 'px';
        style.paddingRight = space + 'px';
      }
      const offset = Number(this.offset) || 0;
      if(offset){
        style.marginLeft = offset * 100 / MAX_SPAN_COUNT + '%';
      }
      return style;
    }
  },
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'col';

@import (multiple) '../../styles/theme.config.less';

.fl-col {
}

.loadUIOverrides();
</style>
