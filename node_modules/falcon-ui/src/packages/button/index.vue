<template>
  <div :class="btnClasses" @click="onClicked">
    <fl-icon v-if="icon" :class="textClasses" :style="iconStyle" :name="icon" @click="onClicked" />
    <text :class="textMarginClasses + textClasses" :style="textStyle">
      <slot />
    </text>
  </div>
</template>

<script>
import FlIcon from "../icon/index.vue";

export default {
  props: {
    size: {
      type: String,
      default: "normal" //large / medium / normal / small / mini
    },
    type: {
      type: String,
      default: "default" // default / primary / secondary / success / warning / danger / warning / info
    },
    plain: {
      type: [Boolean, String],
      default: false
    },
    round: {
      type: [Boolean, String],
      default: false
    },
    disabled: {
      type: [Boolean, String],
      default: false
    },
    icon: {
      type: String
    },
    iconStyle: {
      type: [Object, String]
    },
    iconRight: {
      type: [Boolean, String]
    },
    textStyle: {
      type: [Object, String]
    },
  },
  components: { FlIcon },
  mounted() {},
  computed: {
    btnClasses() {
      const plain = this.plain === true || this.plain === "true" ? "-plain" : "";
      const round = this.round === true || this.round === "true" ? `btn-round` : "";
      const iconRight = this.iconRight === true || this.iconRight === "true" ? "btn-icon-on-right" : "";
      const isDisabled = this.disabled === true || this.disabled === "true";
      const disabled = isDisabled ? `btn-${this.type}${plain}-disabled` : "";
      const active = isDisabled ? "" : `btn-${this.type}-active`;

      return `btn ${iconRight} btn-size-${this.size} ${active} btn-${this.type}${plain} ${round} ${disabled}`;
    },
    textClasses() {
      const plain = this.plain === true || this.plain === "true" ? "-plain" : "";
      const isDisabled = this.disabled === true || this.disabled === "true";
      const disabled = isDisabled ? `btn-text-${this.type}${plain}-disabled` : "";
      const active = isDisabled ? "" : `btn-text-${this.type}-active`;

      return `btn-text btn-text-size-${this.size} ${active} btn-text-${this.type}${plain} ${disabled}`;
    },
    textMarginClasses() {
      if (this.icon && this.$slots.default) {
        const iconRight = this.iconRight === true || this.iconRight === "true";
        return `btn-text-margin-${iconRight ? "right" : "left"} `;
      }
      return "";
    }
  },
  methods: {
    onClicked(event) {
      const { type, disabled } = this;
      if (!disabled) {
        this.$emit("click", { event, type });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'button';

@import (multiple) '../../styles/theme.config.less';

@btn-variant-ruleset();
@btn-text-variant-ruleset();
@btn-theme-sizes-mixin-ruleset();
@btn-theme-colors-mixin-ruleset();

.btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  border-width: @btn-border-width;
  border-style: solid;
}

.btn-icon {
  margin-right: 4px;
}

.btn-text {
  color: @btn-color;
}

#btn-theme-sizes-mixin();
#btn-theme-colors-mixin();

.btn-round {
  border-radius: 999px;
}
.btn-icon-on-right {
  flex-direction: row-reverse;
}
.btn-text-margin-left {
  margin-left: 4px;
}
.btn-text-margin-right {
  margin-right: 4px;
}

.loadUIOverrides();
</style>
