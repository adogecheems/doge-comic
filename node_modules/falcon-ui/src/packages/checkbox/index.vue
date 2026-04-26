<template>
  <div
    class="checkbox"
    :style="{
      flexDirection: direction,
      gap: checkboxGap,
      alignItems: 'flex-start'
    }"
  >
    <div
      class="checkbox-item"
      v-for="(item, i) in innerItems"
      :key="i"
      @click="itemClick(item, i)"
    >
      <div
        class="checkbox-item-el"
        :class="{
          'checkbox-item-el-checked': isChecked(item),
          'checkbox-item-el-disabled': isDisabled(item),
        }"
        :style="checkboxStyle(item, i)"
      >
        <div
          v-if="isChecked(item)"
          class="checkbox-item-el-symbol"
          :style="{
            'width': `${symbolWidth}px`, 'height': `${symbolHeight}px`,
            'top': `${symbolTop}px`, 'left': `${symbolLeft}px`,
          }"
        ></div>
      </div>
      <text
        class="checkbox-item-el-text"
        :class="{
          'checkbox-item-el-text-checked': isChecked(item),
          'checkbox-item-el-text-disabled': isDisabled(item),
        }"
        :style="{'font-size': textSize, 'color': checkboxTextColor(item, i)}"
      >{{item.label}}</text>
    </div>
  </div>
</template>

<script>

import {checkbox as tc} from '../../styles/theme.config.js'

export default {
  name: 'FlCheckbox',
  model:{
    prop: 'value',
    event: 'change'
  },
  props: {
    items: {        // item列表，可以为 string[] 也可以为 {label: string, value: string, disabled?: bool}
      type: Array,
      default() {
        return [];
      },
    },
    value: {      // 选中的item index列表
      type: Array,
      default() {
        return [];
      },
    },
    direction: {
      type: String,
      default: 'row',  // row / column
    },
    checkboxColor: { // 选中时的背景色
      type: String,
      default: tc.get('checkboxColor', ''),
    },
    checkboxSize: {  // 选择框大小
      type: String,
      default: tc.get('checkboxSize', '30px'),
    },
    checkboxGap: {   // 元素间距
      type: String,
      default: tc.get('checkboxGap', '25px'),
    },
    checkboxTextGap: {    // checkbox与text间距
      type: String,
      default: tc.get('checkboxTextGap', '10px'),
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
    },
    round: {  // 形状为圆/方
      type: Boolean,
      default: tc.get('round', false),
    }
  },
  data() {
    return {
      innerChecked: this.value.slice(),
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
      return this.symbolHeight / 2
    },
    symbolHeight() {
      return parseInt(this.checkboxSize) / 2
    },
    symbolTop() {
      return this.symbolLeft / 3
    },
    symbolLeft() {
      return parseFloat(this.checkboxSize) / 3
    },
  },
  mounted() {
  },
  methods: {
    itemClick(item, i) {
      if (item.disabled) return
      if (!this.isChecked(item)) this.innerChecked.push(item.value)
      else {
        this.innerChecked.splice(this.innerChecked.indexOf(item.value), 1)
      }
    },
    checkboxBgColor(item, i) {
      return this.isChecked(item) ? this.checkboxColor : undefined
    },
    checkboxBorderColor(item, i) {
      return this.checkboxColor
    },
    checkboxTextColor(item, i) {
      return this.isChecked(item) ? this.textColorChecked : this.textColor
    },
    checkboxStyle(item, i) {
      return {
        'width': this.checkboxSize, 'height': this.checkboxSize, 'margin-right': this.checkboxTextGap,
        'border-radius': this.round ? '999px' : '',
        'background-color': this.checkboxBgColor(item, i),
        'border-color': this.checkboxBorderColor(item, i),
      }
    },

    isChecked(item) {
      return item && item.value !== undefined && this.innerChecked.includes(item.value)
    },
    isDisabled(item) {
      return item.disabled
    }
  },
  watch: {
    innerChecked() {
      let checked = [];
      let checkedItems = [];
      for (let value of this.innerChecked) {
        let item = this.innerItems.find(item => item.value === value)
        if (item === undefined) continue
        checked.push(item.value)
        checkedItems.push(item)
      }
      this.$emit('change', checked, checkedItems)
    },
    value() {
      if (
        JSON.stringify([...this.value].sort()) ===
        JSON.stringify([...this.innerChecked].sort())
      ) return
      this.innerChecked = this.innerItems.filter(item => this.value.indexOf(item.value) > -1)
        .map(item => item.value)
    }
  }
}
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'checkbox';

@import (multiple) '../../styles/theme.config.less';

.checkbox {
  flex-wrap: wrap;
}
.checkbox-item {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.checkbox-item-el {
  border-style: solid;
  border-width: 3px;
  border-color: @primary;
  transition-property: background-color;
  transition-duration: 100ms;

  &-checked {
    background-color: @primary;
  }
  &-disabled {
    opacity: @disabled-opacity;
  }
}
.checkbox-item-el-symbol {
  border-style: solid;
  border-color: @checkbox-symbol-color;

  border-left-width: 0;
  border-top-width: 0;
  border-right-width: 4px;
  border-bottom-width: 4px;

  transform: rotate(45deg);
}

.checkbox-item-el-text {
  color: @checkbox-text-color;
}
.checkbox-item-el-text-disabled {
  opacity: @disabled-opacity;
}
.checkbox-item-el-text-checked {
  color: @checkbox-checked-text-color;
}
.loadUIOverrides();
</style>
