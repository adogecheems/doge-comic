// NOTE: virtual import support by aiot-vue-cli
import themeConfig from 'FALCON_THEME'
import themeCustomConfig from 'FALCON_THEME_CUSTOM'

/**
 * Performs a deep merge of `source` into `target`.
 * Mutates `target` only but not its objects and arrays.
 *
 * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).
 */
function merge(target, source) {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = merge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

function Getter(obj) {
  this.obj = obj
}
Getter.prototype.get = function(key, default_value) {
  if (!this.obj) return default_value
  let result = this.obj[key];
  return (typeof result !== "undefined") ? result : default_value;
}

const config = {}

merge(config, themeConfig)
if (!themeCustomConfig || typeof themeCustomConfig !== 'object') {
  throw new Error(`自定义 theme 需要导出 object 配置对象, 如 {}`)
}
merge(config, themeCustomConfig)

export const radio = new Getter(config.radio)
export const checkbox = new Getter(config.checkbox)
export const switch_ = new Getter(config.switch_)
export const toast = new Getter(config.toast)
export const seekbar = new Getter(config.seekbar)