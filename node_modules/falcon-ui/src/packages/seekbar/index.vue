<template>
  <div
    ref="ref_seekbar-container" class="seekbar-container" :class="{'seekbar-container-disabled': disabled}" :style="containerStyleV2"
    v-on:[touchstart_name]="touchStartFunc"
    v-on:[touchmove_name]="touchMoveFunc"
    v-on:[touchend_name]="touchEndFunc"
  >
    <div class="inactive-track" :style="inactiveTrackStyleV2">
      <div ref="ref_active-track" class="active-track" :style="activeTrackStyleV2">
        <div
          v-if="useBlockStyle"
          ref="ref_block-handle1"
          :style="blockHandleStyleV2(isHorizontal() ? 'lvalue': 'hvalue')"
        ></div>
        <div
          v-if="useBlockStyle"
          ref="ref_block-handle2"
          :style="blockHandleStyleV2(isHorizontal() ? 'hvalue': 'lvalue')"
        ></div>
      </div>
    </div>
    <div
      v-if="isRange"
      ref="ref_handle1"
      class="handle"
      :style="handleStyleV2(isHorizontal() ? 'lvalue': 'hvalue')"
    ></div>
    <div
      ref="ref_handle2"
      class="handle"
      :style="handleStyleV2(isHorizontal() ? 'hvalue': 'lvalue')"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
import {seekbar as tc} from '../../styles/theme.config.js'

const isWeb = $falcon.env.platform === "Web";
// const DEFAULT_CHANGE_NOTIFY_INTERVAL = 100;

function getWebOffsetXY(evt, target) {
  let offsetX, offsetY

  function getVertexPosition(el) {
    let currentTarget = el
    let top = 0
    let left = 0
    while (currentTarget !== null) {
        top += currentTarget.offsetTop
        left += currentTarget.offsetLeft
        currentTarget = currentTarget.offsetParent
    }
    return { top, left }
  }

  const vertex = getVertexPosition(target)
  offsetX = evt.changedTouches[0].pageX-vertex.left
  offsetY = evt.changedTouches[0].pageY-vertex.top

  return [offsetX, offsetY]
}

export default {
  name: "FlSeekbar",
  model: {
    // v-model双向数据绑定
    prop: "value",
    event: "change"
  },
  props: {
    direction: {
      type: String,  // horizontal / vertical
      default: tc.get('direction', 'horizontal'),
    },
    useBlockStyle: {
      type: Boolean,
      default: tc.get('useBlockStyle', false),
    },
    blockWidth: {
      type: [Number, String],
      default: tc.get('blockWidth', '120px'),
    },
    length: {
      // 滑条长度 px
      type: [Number, String],
      default: tc.get('length', '300px')
    },
    height: {
      // 滑条高度 px
      type: [Number, String],
      default: tc.get('height', '2px')
    },
    // 最小值
    min: {
      type: Number,
      default: tc.get('min', 0)
    },
    // 最大值
    max: {
      type: Number,
      default: tc.get('max', 100)
    },
    // 最小取值范围，用于范围选择范围最小差值
    step: {
      type: Number,
      default: tc.get('step', 1)
    },
    // 设置当前取值
    value: {
      type: [Number, Object],
      default: 0
    },
    // 值为 true 时，滑块为禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    inactiveColor: {
      type: String,
      default: tc.get('inactiveColor', '')
    },
    activeColor: {
      // 进度条前景色(已拖动的进度条)
      type: String,
      default: tc.get('activeColor', '')
    },
    disabledColor: {
      // 进度条 disbaled 状态前景色
      type: String,
      default: tc.get('disabledColor', '')
    },
    handleBorderColor: {
      // 滑块 border 颜色
      type: String,
      default: tc.get('handleBorderColor', "#E0E0E0")
    },
    handleInnerColor: {
      // 滑块内部颜色
      type: String,
      default: tc.get('handleInnerColor', "#FFFFFF")
    },
    handleSize: {
      type: [Number, String],
      default: tc.get('handleSize', '24px')
    },
    // changeInterval: {
    //   type: Number,
    //   default: 0
    // },
    // changingInterval: {
    //   type: Number,
    //   default: 0
    // },
    range: {
      type: [Boolean, String],
      default: false
    },
    borderRadius: {
      type: [Number, String],
      default: tc.get('borderRadius', '')
    },
    // 开启滑动事件 change 上报，注意开启后效率低，且 changingInterval 越短效率越低
    // enableMoveEvent: {
    //   type: Boolean,
    //   default: false,
    // },
    inactiveTrackStyle: {
      type: Object,
      default() { return {} }
    },
    activeTrackStyle: {
      type: Object,
      default() { return {} }
    },
    blockHandleStyle: {
      type: Object,
      default() { return {} }
    }
  },
  created() {
    this.touchStartFunc = this.onTouchStart
    this.touchMoveFunc = this.onTouchMove
    this.touchEndFunc = this.onTouchEnd
    if (isWeb) {
      this.touchstart_name = 'touchstart'
      this.touchmove_name = 'touchmove'
      this.touchend_name = 'touchend'
      this.setElmStyle = (elm, styleName, styleValue) => {
        elm.style[styleName] = styleValue + 'px'
      }
      this.touchStartFunc = (evt) => {
        this.onTouchStart(evt, ...getWebOffsetXY(evt, this.seekbarContainer))
      }
      this.touchMoveFunc = (evt) => {
        this.onTouchMove(evt, ...getWebOffsetXY(evt, this.seekbarContainer))
      }
      this.touchEndFunc = (evt) => {
        this.onTouchEnd(evt, ...getWebOffsetXY(evt, this.seekbarContainer))
      }
    } else {
      this.touchstart_name = 'touchstart'
      this.touchmove_name = 'touchmove'
      this.touchend_name = 'touchend'
      this.setElmStyle = (elm, styleName, styleValue) => {
        elm.setStyle(styleName, styleValue)
      }
    }

    this.offsetName = ''
    this.targetHandle = null
    this.activeTrack = null
    this.moved = false
  },
  mounted() {
    this.activeTrack = this.$refs['ref_active-track']
    this.seekbarContainer = this.$refs['ref_seekbar-container']
  },
  data() {
    const innerValue = this.convertValue(this.value)
    const lengthInt = parseInt(this.length)
    const offset = {
      lvalue: this.getPx(innerValue['lvalue'], lengthInt),
      hvalue: this.getPx(innerValue['hvalue'], lengthInt)
    }
    return {
      innerValue,
      offset,
      handleSizeInt: (this.useBlockStyle === true ? 0 : parseInt(this.handleSize)),
      trackSizeInt: (this.useBlockStyle === true ? parseInt(this.blockWidth) : parseInt(this.height)),
      lengthInt,
      isRange: this.range === true || this.range === "true"
    }
  },
  watch: {
    value: {
      handler(val) {
        this.updateValue(val, true)
      },
      deep: true
    }
  },
  computed: {
    // not used yet, and could puting into field variable
    // innerChangeingInterval() {
    //   return this.changingInterval || this.changeInterval || DEFAULT_CHANGE_NOTIFY_INTERVAL;
    // },
    containerStyleV2() {
      const isHorizontal = this.isHorizontal()
      // 加上 handle 的大小
      const mainX = this.lengthInt + this.handleSizeInt
      const mainY = Math.max(this.trackSizeInt, this.handleSizeInt)
      return {
        width: (isHorizontal ? mainX : mainY)+'px',
        height: (isHorizontal ? mainY : mainX)+'px',
        overflow:'visible'
      };
    },
    inactiveTrackStyleV2() {
      const isHorizontal = this.isHorizontal()
      const width = isHorizontal ? this.lengthInt : this.trackSizeInt
      const height = isHorizontal ? this.trackSizeInt : this.lengthInt
      const flexDirection = isHorizontal ? "row" : 'column'
      const justifyContent = isHorizontal ? "flex-start": "flex-end"
      return {
        width: `${width}px`,
        height: `${height}px`,
        flexDirection,
        backgroundColor: this.inactiveColor,
        borderRadius: this.borderRadius === '' ? '' : parseInt(this.borderRadius) + 'px',
        justifyContent,
        ...this.inactiveTrackStyle,
      }
    },
    activeTrackStyleV2() {
      const isHorizontal = this.isHorizontal()
      const left = this.offset["lvalue"]
      const mainX = this.offset["hvalue"] - this.offset["lvalue"]
      const mainY = this.trackSizeInt

      const ret = {
        width: (isHorizontal ? mainX : mainY) + "px",
        height: (isHorizontal ? mainY : mainX) + "px",
        backgroundColor: this.disabled ? this.disabledColor : this.activeColor,
        borderRadius: this.borderRadius === '' ? '' : parseInt(this.borderRadius) + 'px',
        flexDirection: isHorizontal ? 'row' : 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }

      // transform: isHorizontal ? `translateX(${left}px)` : `translateY(${-left}px)`,
      // 使用如下 margin-left 替换如上 translate，因为需要与 width 一起做布局，不会产生抖动
      if (isHorizontal) {
        ret['marginLeft'] = `${left}px`
      } else {
        ret['marginBottom'] = `${left}px`
      }
      return Object.assign(ret, this.activeTrackStyle)
    },
  },
  methods: {
    convertValue(value) {
      let innerValue
      if (typeof value !== "object") {
        innerValue = {
          lvalue: this.min,
          hvalue: typeof value === 'number' ? value : 0
        }
      } else {
        innerValue = {
          lvalue: typeof value.lvalue === 'number' ? value.lvalue : 0,
          hvalue: typeof value.hvalue === 'number' ? value.hvalue : 0,
        }
      }
      return innerValue
    },
    updateValue(val, convert) {
      this.innerValue = convert ? this.convertValue(val) : val
      this.offset["lvalue"] = this.getPx(this.innerValue['lvalue'], this.lengthInt)
      this.offset["hvalue"] = this.getPx(this.innerValue['hvalue'], this.lengthInt)
    },
    // 根据value转成px长度
    getPx(value, lengthInt) {
      value = Math.min(this.max, Math.max(value, this.min))
      return Math.round(((value - this.min) / (this.max - this.min)) * lengthInt)
    },
    // 根据px转成value
    getValue(px) {
      px = Math.min(this.lengthInt, Math.max(px, 0));
      const result = (px / this.lengthInt) * (this.max - this.min);
      return Math.round(result);
    },

    _emitValueChange(name, value, reason) {
      const val = {...this.innerValue}
      val[name] = value
      this.updateValue({...val}, false)
      if (this.range) { 
        this.$emit('change', val, reason)
      } else {
        this.$emit('change', value, reason)
      }
    },

    _calcNextPx(name, nextPx) {
      nextPx = Math.min(Math.max(nextPx, 0), this.lengthInt)
      const {lvalue: lowPx, hvalue: highPx} = this.offset
      const {lvalue: lowValue, hvalue: highValue} = this.innerValue
      const is_lvalue = name === "lvalue"
      const is_hvalue = !is_lvalue
      if (this.isRange) {
        if (is_lvalue && nextPx > highPx) {
          nextPx = highPx
        } else if (is_hvalue && nextPx < lowPx) {
          nextPx = lowPx
        }
      }

      let value = this.getValue(nextPx) + this.min
      //根据step调整nextPx和next value
      if (value % this.step !== 0) {
        let stepValue = Math.round(value / this.step) * this.step
        if (stepValue != value) {
          value = stepValue
          nextPx = this.getPx(value, this.lengthInt)
        }
      }

      let valueDirty = is_lvalue ? (lowValue === value) : (highValue === value)
      return { value, valueDirty, nextPx }
    },

    // bindingx style and bind functions below
    handleStyleV2(offsetName) {
      const offsetPx = this.offset[offsetName]
      const isHorizontal = this.isHorizontal()
      const result = {
        // transform: isHorizontal ? `translateX(${offsetPx}px)` : `translateY(${-offsetPx}px)`,
        backgroundColor: this.handleInnerColor,
        width: `${this.handleSizeInt}px`,
        height: `${this.handleSizeInt}px`,
        borderColor: this.handleBorderColor,
        // opacity: '0.7',
      }
      if (isHorizontal) {
        result['marginLeft'] = `${offsetPx}px`
      } else {
        result['marginBottom'] = `${offsetPx}px`  // transform should * -1
      }
      if (this.handleSizeInt === 0) {
        result['visibility'] = 'hidden'
      }
      return result
    },
    blockHandleStyleV2(offsetName) {
      const isHorizontal = this.isHorizontal()
      const mainX = 8
      const mainY = 0.36 * this.trackSizeInt
      const hidden = !this.isRange && offsetName === 'lvalue'
      return {
        width: (isHorizontal ? mainX : mainY) + "px",
        height: (isHorizontal ? mainY : mainX) + "px",
        backgroundColor: /*offsetName === 'lvalue' ? 'blue': */'#FFFFFF',
        opacity: hidden ? 0 : 0.39,
        borderRadius: '4px',
        margin: '12px',
        ...this.blockHandleStyle
      }
    },
    isVertical() {
      return this.direction === 'vertical'
    },
    isHorizontal() {
      return this.direction !== 'vertical'
    },

    _updateNextPxNative(evt, name, reason, toEmit, isHorizontal, offsetX, offsetY) {
      if (!this.moved) {
        !isWeb && this.seekbarContainer.disallowInterceptTouch()
        this.moved = true
      }

      let nextPx0
      if (isHorizontal) {
        nextPx0 = offsetX
        nextPx0 -= this.handleSizeInt / 2
      } else {
        nextPx0 = this.lengthInt + this.handleSizeInt - offsetY
        nextPx0 -= this.handleSizeInt / 2
      }

      const {value, valueDirty, nextPx} = this._calcNextPx(name, nextPx0)
      let {lvalue: lowPx, hvalue: highPx} = this.offset
      if (name === "lvalue") lowPx = nextPx
      else highPx = nextPx
      
      let mainX = highPx - lowPx

      if (isHorizontal) {
        !this.useBlockStyle && this.setElmStyle(this.targetHandle, 'marginLeft', nextPx)
        this.setElmStyle(this.activeTrack, 'width', mainX)
        this.setElmStyle(this.activeTrack, 'marginLeft', lowPx)
      } else {
        !this.useBlockStyle && this.setElmStyle(this.targetHandle, 'marginBottom', nextPx)
        this.setElmStyle(this.activeTrack, 'height', mainX)
        this.setElmStyle(this.activeTrack, 'marginBottom', lowPx)
      }

      if (toEmit) {
        this._emitValueChange(name, value, reason)
      }
    },

    _inHandleH(offsetX, offsetY, isHorizontal) {
      if (!this.isRange) return true
      const mainX = (isHorizontal ? offsetX : (this.lengthInt + this.handleSizeInt - offsetY)) - this.handleSizeInt/2
      const splitPoint = (this.offset['lvalue'] + this.offset['hvalue']) / 2
      return mainX >= splitPoint
    },

    onTouchStart(evt, offsetX, offsetY) {
      // handle开始滑动
      // console.log(`onTouchStart`, evt)
      if (this.disabled) {
        return
      }
      const isHorizontal = this.isHorizontal()
      offsetX = offsetX === undefined ? evt.changedTouches[0].pageX : offsetX
      offsetY = offsetY === undefined ? evt.changedTouches[0].pageY : offsetY

      const inHandleH = this._inHandleH(offsetX, offsetY, isHorizontal)
      
      if (inHandleH) {
        // console.log('bind handleH')
        this.offsetName = 'hvalue'
        if (this.useBlockStyle) {
          this.targetHandle = isHorizontal ? this.$refs['ref_block-handle2'] : this.$refs['ref_block-handle1']
        } else {
          this.targetHandle = isHorizontal ? this.$refs['ref_handle2'] : this.$refs['ref_handle1']
        }
      } else {
        // console.log('bind handleL')
        this.offsetName = 'lvalue'
        if (this.useBlockStyle) {
          this.targetHandle = isHorizontal ? this.$refs['ref_block-handle1'] : this.$refs['ref_block-handle2']
        } else {
          this.targetHandle = isHorizontal ? this.$refs['ref_handle1'] : this.$refs['ref_handle2']
        }
      }

      this.moved = false
      this._updateNextPxNative(evt, this.offsetName, 'start', true, isHorizontal, offsetX, offsetY)
    },
    onTouchMove(evt, offsetX, offsetY) {
      // console.log(`onTouchMove`, evt)
      // handle 开始移动
      if (this.disabled) {
        return
      }
      const isHorizontal = this.isHorizontal()
      offsetX = offsetX === undefined ? evt.changedTouches[0].pageX : offsetX
      offsetY = offsetY === undefined ? evt.changedTouches[0].pageY : offsetY
      this._updateNextPxNative(evt, this.offsetName, 'move', false, isHorizontal, offsetX, offsetY)
    },
    onTouchEnd(evt, offsetX, offsetY) {
      // console.log(`onTouchEnd`, evt)
      // handle 停止移动
      if (this.disabled) {
        return
      }
      const isHorizontal = this.isHorizontal()
      offsetX = offsetX === undefined ? evt.changedTouches[0].pageX : offsetX
      offsetY = offsetY === undefined ? evt.changedTouches[0].pageY : offsetY
      this._updateNextPxNative(evt, this.offsetName, 'end', true, isHorizontal, offsetX, offsetY)
    }
  }
};
</script>

<style lang="less" scoped>
@type    : 'component';
@element : 'seekbar';

@import (multiple) '../../styles/theme.config.less';

.seekbar-container {
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  &-disabled {
    opacity: @disabled-opacity;
  }
}

.inactive-track {
  overflow: hidden;
  position: relative;
  background-color: @seekbar-inactive-color;
  border-radius: @border-radius-normal;
}

.active-track {
  overflow: hidden;
  position: relative;
  background-color: @seekbar-active-color;
  border-radius: @border-radius-normal;
}

.handle {
  border-radius: 1000px;
  border-width: 1px;
  position: absolute;
  left: 0;
  bottom: 0;
}

.loadUIOverrides();
</style>
