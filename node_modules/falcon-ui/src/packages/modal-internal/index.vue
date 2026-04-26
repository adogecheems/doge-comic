<template>
  <div v-if="show && !system" class="modal" @click="onClick">
    <slot></slot>
  </div>
  <modal v-else-if="show && system" class="modal" @dismiss="dismiss" @click="onClick">
    <!-- system modal -->
    <slot></slot>
  </modal>
</template>

<script>
export default {
  name: "FlModalInternal",
  model: {
    prop: "show",
    event: "change"
  },
  props: {
    // 是否系统全局弹窗，对于设备端生效，web端走普通的fixed浮窗
    system: {
      type: [Boolean, String],
      default: false
    },
    show: {
      type: [Boolean, String],
      default: false
    }
  },
  methods: {
    dismiss() {
      // 退出页面或者应用时被容器关闭了,仅限系统弹窗
      this.$emit("dismiss");
    },
    onClick(e){
      this.$emit('click');
    }
  }
};
</script>
<style lang="less" scoped>
@type    : 'component';
@element : 'modal-internal';

@import (multiple) '../../styles/theme.config.less';

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.loadUIOverrides();
</style>
