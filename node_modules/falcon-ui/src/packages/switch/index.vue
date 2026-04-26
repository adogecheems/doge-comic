<template>
  <!-- box为组件外框 -->
  <div
    class="switch-outer"
    @click="toggle"
    :style="{flexDirection: direction, 'gap': switchTextGap}"
  >
    <text
      v-if="inactiveText"
      class="inactive-text"
      :class="{'inactive-text-disabled': disabled}"
      :style="{color: !isActive ? activeColor: inactiveColor, 'text-align': 'right' }"
    >{{ inactiveText }}</text>
    <div
      class='box'
      :class="{
        'box-active': isActive,
        'box-inactive': !isActive,
        'box-disabled': disabled
      }"
      :style="{'width': parseInt(width) + 'px', 'height': parseInt(height) + 'px',
        borderColor: isActive ? activeColor: inactiveColor,
        backgroundColor: isActive ? activeColor: inactiveColor,
      }"
    >
      <!-- button为内部圆球 -->
      <div
        class='button'
        :class="{'button-disabled': disabled}"
        :style="{'width': `${ballWidth()}px`, 'height': `${ballHeight()}px`,
          'transform': `translate(${isActive ? (parseInt(width) - ballWidth() - buttonMarginInt) + 'px' : (buttonMarginInt + 'px')}, ${buttonMarginInt}px)`,
          'background-color' : colorButton
        }"
      />
    </div>
    <text
      v-if="activeText"
      class="active-text"
      :class="{'active-text-disabled': disabled}"
      :style="{color: isActive ? activeColor: inactiveColor, 'text-align': 'left' }"
      >{{ activeText }}</text>
  </div>
</template>
<script>
import {switch_ as tc} from '../../styles/theme.config.js'

export default {
  name: 'FlSwitch',
  model:{           // v-model双向数据绑定
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {      // 是否选中
      type: [Boolean, String, Number],
      default: false,
    },
    direction: {
      type: String,
      default: 'row',
    },
    switchTextGap: {
      type: String,
      default: '10px',
    },
    activeColor: { // 选中时的背景色
      type: String,
      default: tc.get('activeColor', '')
    },
    inactiveColor: {  // 默认未选中时的背景色
      type: String,
      default: tc.get('inactiveColor', '')
    },
    colorButton: {  // 按钮颜色
      type: String,
      default: tc.get('colorButton', '')
    },
    width: {        // 宽度(px)，需大于高度，设置整体组件宽度
      type: [Number, String],
      default: tc.get('width', '60px')
    },
    height: {       // 高度(px)，需小于宽度，设置组件高度
      type: [Number, String],
      default: tc.get('height', '30px')
    },
    disabled: {
      type: Boolean,
      default: false
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: null,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: null,
    },
    activeText: {
      type: String,
      default: ''
    },
    inactiveText: {
      type: String,
      default: ''
    },
    beforeChange:{
      type:Function,
      default:null
    },
    buttonMargin: {
      type: [String, Number],
      default: tc.get('buttonMargin', '2px'),
    }
  },
  data() {
    let valuePair = []
    if (this.inactiveValue !== null && this.inactiveValue !== undefined) {
      valuePair.push(this.inactiveValue)
    } else {
      valuePair.push(false)
    }
    if (this.activeValue !== null && this.activeValue !== undefined) {
      valuePair.push(this.activeValue)
    } else {
      valuePair.push(true)
    }
    let innerValue = this.value
    if (!valuePair.includes(innerValue)) {
      innerValue = valuePair[0]
    }
    return {
      innerValue,
      valuePair,
      buttonMarginInt: parseInt(this.buttonMargin),
    };
  },
  computed: {
    isActive() {
      return this.innerValue === this.valuePair[1]
    }
  },
  methods: {
    toggle() {
      if (this.disabled) return

      let nextValue = this._getToggleValue();
      nextValue = this.beforeChange ? this.beforeChange(nextValue) : nextValue;
      this.innerValue = nextValue;
    },
    _getToggleValue() {
      return this.valuePair[0] === this.innerValue ?  this.valuePair[1] : this.valuePair[0]
    },
    ballWidth() {
      return Math.min(parseInt(this.height), parseInt(this.width)) - this.buttonMarginInt * 2
    },
    ballHeight() {
      return this.ballWidth()
    }
  },
  watch: {
    value() {
      this.innerValue = this.value;
    },
    innerValue() {
      this.$emit('change', this.innerValue)
    }
  }
}
</script>
<style lang="less" scoped>
@type    : 'component';
@element : 'switch';

@import (multiple) '../../styles/theme.config.less';

.switch-outer {
  align-items: center;
  justify-content: flex-start;
}
.box {  /* switch背景样式 */
  border-style: solid;
  border-width: @switch-box-border-width;
  border-color: @switch-box-border-color;
  border-radius: 1000px;
  transition-property: background-color;
  transition-duration: 100ms;
  &-disabled {
    opacity: @disabled-opacity;
  }
}
.box-active {
  background-color: @switch-active-color;
}
.box-inactive {
  background-color: @switch-inactive-color;
}
.button { /* switch圆球样式 */
  background-color: @switch-button-color;
  border-radius: 1000px;
  box-shadow: @switch-button-shadow;
  transition-property: transform;
  transition-duration: 100ms;
  &-disabled {
    opacity: @disabled-opacity;
  }
}

.inactive-text {
  color: @switch-inactive-color;
}
.inactive-text-disabled {
  opacity: @disabled-opacity;
}

.active-text {
  color: @switch-active-color;
}
.active-text-disabled {
  opacity: @disabled-opacity;
}

.loadUIOverrides();
</style>
