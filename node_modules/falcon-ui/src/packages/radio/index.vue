<template>
  <div
    class="radio-group"
    :style="{
      flexDirection: direction,
      gap: radioGap,
      alignItems: 'flex-start'
    }"
  >
    <div
      class="radio-item"
      v-for="(item, i) in innerItems"
      :key="i"
      @click="itemClick(item, i)"
    >
      <div
        class="radio-item-el"
        :class="{
          'radio-item-el-checked': isChecked(item),
          'radio-item-el-disabled': isDisabled(item),
        }"
        :style="radioStyle(item, i)"
      >
        <div
          v-if="isChecked(item)"
          class="radio-item-el-symbol"
          :style="{
            'width': `${symbolWidth}px`, 'height': `${symbolHeight}px`,
          }"
        ></div>
      </div>
      <text
        class="radio-item-el-text"
        :class="{
          'radio-item-el-text-checked': isChecked(item),
          'radio-item-el-text-disabled': isDisabled(item),
        }"
        :style="{'font-size': textSize, 'color': radioTextColor(item, i)}"
      >{{item.label}}</text>
    </div>
  </div>
</template>

<script>
import {radio as tc} from '../../styles/theme.config.js'

export default {
  name: 'FlRadio',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    items: {
      type: Array,
      // string[] | Array<{ label: string value: string disabled?: boolean }>
      default() {
        return [];
      },
    },
    value: {
      type: String,
    },
    direction: {
      type: String,
      default: 'row',  // row / column
    },
    radioColor: { // 选中时的背景色
      type: String,
      default: tc.get('radioColor', ''),
    },
    radioSize: {  // radio选择框大小
      type: String,
      default: tc.get('radioSize', '30px'),
    },
    radioGap: {   // radio元素间距
      type: String,
      default: tc.get('radioGap', '25px'),
    },
    radioTextGap: {    // radio与text间距
      type: String,
      default: tc.get('radioTextGap', '10px'),
    },
    textSize: {        // text大小
      type: String,
      default: tc.get('textSize', '22px'),
    },
    textColor: {      // text颜色
      type: String,
      default: tc.get('textColor', ''),
    },
    textColorChecked: {  // 选择时text颜色
      type: String,
      default: tc.get('textColorChecked', ''),
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      current: this.value,
    };
  },
  computed: {
    innerItems() {
      let result = []
      for (let item of this.items) {
        if (typeof item === 'string') {
          result.push({label: item, value: item, disabled: this.disabled || false})
        } else {
          result.push({label: item.label, value: item.value,
            disabled: this.disabled || item.disabled})
        }
      }
      return result
    },
    symbolWidth() {
      return this.symbolHeight
    },
    symbolHeight() {
      return parseInt(this.radioSize) * 0.4
    },
  },
  mounted() {
  },
  methods: {
    itemClick(item, i) {
      if (item.disabled) return
      this.current = item.value;
    },

    radioBgColor(item, i) {
      return this.isChecked(item) ? this.radioColor : undefined
    },
    radioBorderColor(item, i) {
      return this.radioColor
    },
    radioTextColor(item, i) {
      return this.isChecked(item) ? this.textColorChecked : this.textColor
    },


    radioStyle(item, i) {
      return {
        'width': this.radioSize, 'height': this.radioSize, 'margin-right': this.radioTextGap,
        'background-color': this.radioBgColor(item, i),
        'border-color': this.radioBorderColor(item, i),
      }
    },
    isChecked(item) {
      return item && item.value !== undefined && this.current === item.value
    },
    isDisabled(item) {
      return item.disabled
    }
  },
  watch: {
    current() {
      let item = this.items.find(item => this.current === item.value)
      this.$emit('change', this.current, item)
    },
    value() {
      if (this.current === this.value) return
      this.current = this.value
    }
  }
}
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'radio';

@import (multiple) '../../styles/theme.config.less';

.radio-group {
  flex-wrap: wrap;
}
.radio-item {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.radio-item-el {
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 3px;
  border-color: @primary;
  border-radius: 1000px;
  transition-property: background-color;
  transition-duration: 100ms;

  &-checked {
    background-color: @primary;
  }
  &-disabled {
    opacity: @disabled-opacity;
  }
}

.radio-item-el-symbol {
  background-color: @radio-symbol-color;

  border-width: 0px;
  border-radius: 1000px;
}
.radio-item-el-text {
  color: @radio-text-color;
}
.radio-item-el-text-disabled {
  opacity: @disabled-opacity;
}
.radio-item-el-text-checked {
  color: @radio-checked-text-color;
}
.loadUIOverrides();
</style>
