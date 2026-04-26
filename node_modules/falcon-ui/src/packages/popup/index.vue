<template>
  <fl-modal-internal
    v-model="popShow"
    class="fl-popup"
    :class="overlayTransition ? 'fl-pop-over' : ''"
    @click="modalClick"
    @dismiss="dismiss"
    :system="system"
  >
    <div
      :class="contentWrapClass + ' ' + preDefinedTransition"
    >
      <slot />
    </div>
  </fl-modal-internal>
</template>

<script>
import FlModalInternal from "../modal-internal/index.vue";

export default {
  components: { FlModalInternal },
  model: {
    prop: "show",
    event: "change"
  },
  props: {
    system: {
      type: [Boolean, String],
      default: false
    },
    // 是否显示
    show: {
      type: [Boolean, String],
      default: false
    },
    // 自定义内容展现动画
    transition: {
      type: [Boolean, String],
      default: false
    },
    // 内容位置:center, left, top, right, bottom
    position: {
      type: String,
      default: "center"
    },
    // overlay动画:默认为false.如果为true,则使用默认动画(背景渐入).不支持外部自定义overlay动画
    overlayTransition: {
      type: [Boolean, String],
      default: false
    },
    handleClose: {
      type: Function
    }
  },
  data() {
    return {
      popShow: this.show
    };
  },
  computed: {
    preDefinedTransition() {
      if (this.transition && this.transition !== "false" && this.position && this.position != "center") {
        return "fl-zoom-in-" + this.position;
      } else return ''
    },
    contentWrapClass() {
      return "fl-content-wrap" + (this.position !== "center" ? " fl-content-wrap-" + this.position : "")
    }
  },
  watch: {
    show(value, old) {
      console.log(`got show value ${value}`)
      this.popShow = value;
    },
    popShow(value, old) {
      this.$emit("change", value);
      this.$emit(value ? "open" : "close");
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
      // 退出页面或者应用时被容器关闭了,仅限系统弹窗
      this.$emit("close");
      this.$emit("dismiss");
    },
    async modalClick() {
      await this.close();
    }
  }
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'popup';

@import (multiple) '../../styles/theme.config.less';

@import '../../styles/keyframes.less';

.fl-popup {
  background-color: rgba(0, 0, 0, 0.6);
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fl-pop-over {
  animation-name: fl-pop-over-anim;
  animation-duration: 300ms;
  animation-fill-mode: forwards;
	animation-timing-function: cubic-bezier(0.645,0.045,0.355,1);
}
@keyframes fl-pop-over-anim {
	from {background-color: rgba(0, 0, 0, 0);}
	to {background-color: rgba(0, 0, 0, 0.6);}
}

.fl-content-wrap {
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.fl-content-wrap-left {
  align-items: flex-start;
  justify-content: center;
}
.fl-content-wrap-top {
  align-items: center;
  justify-content: flex-start;
}
.fl-content-wrap-right {
  align-items: flex-end;
  justify-content: center;
}
.fl-content-wrap-bottom {
  align-items: center;
  justify-content: flex-end;
}

.loadUIOverrides();
</style>
