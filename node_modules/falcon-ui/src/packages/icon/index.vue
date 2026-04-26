
<template>
  <text class="icon-font" @click="$emit('click')">{{ Icon[name] }}</text>
</template>

<script>
import Icon from "./type";

export default {
  props: {
    name: {
      default: "success",
      type: String
    }
  },
  computed: {
    Icon() {
      return Icon;
    }
  }
};

</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'icon';

@import (multiple) '../../styles/theme.config.less';

.icon-font {
  font-family: falcon-icons;
}

.loadUIOverrides();
</style>
