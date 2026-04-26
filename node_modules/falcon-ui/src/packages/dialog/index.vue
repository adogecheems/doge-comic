<template>
  <fl-popup v-model="dlgShow" :handle-close="handlePopupClose" @dismiss="dismiss" :system="system">
    <div class="fl-dialog-wrapper" :style="dialogStyle">
      <div class="fl-dialog-title">
        <slot name="title">
          <text :class="'fl-dialog-title-text' + (isCenter ? ' fl-dialog-title-text-center' : '')">{{ title }}</text>
        </slot>
      </div>
      <div class="fl-dialog-content">
        <slot>
          <text :class="'fl-dialog-content-text' + (isContentCenter ? ' fl-dialog-content-text-center' : '')">{{content}}</text>
        </slot>
      </div>
      <div :class="'fl-dialog-footer' + (isCenter ? ' fl-dialog-footer-center' : '')">
        <slot name="footer">
          <fl-button class="fl-dialog-btn fl-dialog-btn-cancel" @click="cancelClick" v-if="isShowCancel">{{
            cancelText
          }}</fl-button>
          <fl-button
            class="fl-dialog-btn fl-dialog-btn-confirm"
            type="primary"
            @click="confirmClick"
            v-if="isShowConfirm"
            >{{ confirmText }}</fl-button
          >
        </slot>
      </div>
    </div>
  </fl-popup>
</template>
<script>
import FlPopup from "../popup/index.vue";
import FlButton from "../button/index.vue";

export default {
  components: { FlPopup, FlButton },
  model: {
    prop: "show",
    event: "change"
  },
  props: {
    system: {
      type: [Boolean, String],
      default: false
    },
    show: {
      type: [Boolean, String],
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: "内容",
    },
    center: {
      type: [Boolean, String],
      default: false
    },
    contentCenter: {
      type: [Boolean, String],
      default: false
    },
    handleClose: {
      type: Function
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    confirmText: {
      type: String,
      default: "确认"
    },
    showCancel: {
      type: [Boolean, String],
      default: true
    },
    showConfirm: {
      type: [Boolean, String],
      default: true
    },
    handleCancelClick: {
      type: Function
    },
    handleConfirmClick: {
      type: Function
    },
    dialogStyle: {
      type: Object,
    },
  },
  data() {
    return {
      dlgShow: this.show
    };
  },
  watch: {
    show(val, old) {
      this.dlgShow = val;
    },
    dlgShow(val, old) {
      this.$emit("change", val);
      this.$emit(val ? "open" : "close");
    }
  },
  computed: {
    isCenter() {
      return this.center === true || this.center === "true";
    },
    isContentCenter() {
      return this.contentCenter === true || this.contentCenter === "true";
    },
    isShowCancel() {
      return this.showCancel === true || this.showCancel === "true";
    },
    isShowConfirm() {
      return this.showConfirm === true || this.showConfirm === "true";
    }
  },
  methods: {
    open() {
      if (!this.show || this.show === "false") {
        this.$emit("change", true);
      }
    },
    async close() {
      const ret = this.handleClose ? await this.handleClose() : false;
      if (ret !== true) {
        this.$emit("change", false);
      }
    },
    dismiss() {
      // 退出页面或者应用时被容器关闭了.仅限系统弹窗
      this.$emit("close");
    },
    handlePopupClose() {
      return true;
    },
    async cancelClick() {
      let ret = this.handleCancelClick ? await this.handleCancelClick() : false;
      if (ret !== true) {
        this.close();
      }
    },
    async confirmClick() {
      let ret = this.handleConfirmClick ? await this.handleConfirmClick() : false;
      if (ret !== true) {
        this.close();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'dialog';

@import (multiple) '../../styles/theme.config.less';

.fl-dialog-wrapper {
  background-color: @dialog-background-color;
  min-width: @dialog-min-width;
  width: @dialog-width;
  border-radius: @dialog-border-radius;
}
.fl-dialog-title {
  padding: @dialog-title-padding;
}
.fl-dialog-title-text {
  color: @dialog-title-text-color;
  font-size: @dialog-title-font-size;
}
.fl-dialog-title-text-center {
  text-align: center;
}
.fl-dialog-content-text-center {
  text-align: center;
}
.fl-dialog-content {
  justify-content: center;
  padding: @dialog-content-padding;
  flex-grow: 1;
  &-text {
    color: @dialog-content-text-color;
    font-size: @dialog-content-font-size;
  }
}
.fl-dialog-footer {
  flex-direction: row;
  justify-content: flex-end;
  padding: @dialog-footer-padding;
}
.fl-dialog-footer-center {
  justify-content: center;
}
.fl-dialog-btn {
  padding: 0 20px;
  min-width: @dialog-btn-min-width;
  border-radius: 16px;
}
.fl-dialog-btn-cancel {
  margin-right: 20px;
  width: 326px;
}
.fl-dialog-btn-confirm {
  width: 326px;
}

.loadUIOverrides();
</style>
