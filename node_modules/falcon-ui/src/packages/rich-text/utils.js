// 标签匹配正则表达式
const TAG_REG = /<(\/?[a-zA-Z0-9\-]+)([^>]*)>/g;

// 属性匹配标签
const ATTR_REG = /\s*([a-zA-Z0-9\-]+)[=\s]*"([^"]*)"/g;

// style属性正则
const STYLE_REG = /([^;&\s]+)[:]\s*([^&;]*)/g

// 转义字符
const ESCAPE_REG = /\\.{1}/g;

// 纯的节点,标识节点下没有子节点.
const PURE_NODES = new Set(['image', 'br', 'img']);

/* 将template转成json格式的树形结构 */
function parseTemplate(template) {
  let cursor = 0;

  function hyphenedToCamelCase(value) {
    return value.replace(/-([a-z])/g, function (s, m) {
      return m.toUpperCase()
    })
  }

  function parseStyleStringToObject(str) {
    const style = {};
    let match;
    while (match = STYLE_REG.exec(str)) {
      const key = match[1];
      const val = match[2];
      style[hyphenedToCamelCase(key)] = val;
    }
    return style;
  }

  function parseAttr(attrStr) {
    const obj = {};
    let attrMatch;
    while (attrMatch = ATTR_REG.exec(attrStr)) {
      const key = attrMatch[1];
      const val = attrMatch[2];
      if (key !== '/') {
        //TODO:这里需要考虑内容中本来就有"的问题
        const originVal = val;
        if (key === 'style') {
          obj[key] = parseStyleStringToObject(originVal);
        } else {
          obj[key] = originVal || val;
        }
      }
    }
    return obj;
  }

  function appendTextNodeIfNeed(match, parent) {
    // 不在标签内的文本,当做text节点处理
    if (cursor < match.index) {
      const node = {
        tag: "text",
        children: restoreEscaped(template.substring(cursor, match.index))
      };
      parent.children.push(node);
    }
  }

  const escaped = {};

  // 恢复被转义的内容
  function restoreEscaped(template) {
    return template.replace(/_\$E_\d+\$_/g, (content) => {
      return (escaped[content] || '').substr(1);
    });
  }

  // 先将转义内容进行替换
  template = template.replace(ESCAPE_REG, (content, index) => {
    const replace = `_$E_${index}$_`;
    escaped[replace] = content
    return replace;
  });
  console.log('escaped:', escaped,template);

  // 开始正则匹配
  const matches = [];
  let match;
  while ((match = TAG_REG.exec(template))) {
    matches.push(match);
  }
  const elements = {
    tag: "root",
    children: []
  };
  const stack = [elements];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const parent = stack[stack.length - 1];
    parent.children = parent.children || [];
    let match1 = match[1];
    let match2 = match[2];

    appendTextNodeIfNeed(match, parent);

    if (match2.trim().endsWith('/')) {
      //自闭和标签
      const node = {
        tag: match1,
        attrs: parseAttr(match2)
      }
      parent.children.push(node);
    } else {
      if (match1[0] !== "/") {
        // 如果不是'/'则判断为起始标签
        const node = {
          tag: match1,
          children: [],
          attrs: parseAttr(match2)
        };
        parent.children.push(node);
        if (!PURE_NODES.has(match1)) {
          stack.push(node);
        }
      } else {
        // 结束标签
        let tag = match1.substr(1);
        if (!PURE_NODES.has(tag)) {
          const node = stack.pop();
          if (node.tag !== tag) {
            console.warn(`mismatch tagstart:${node.tag}, tagend:${tag}`);
          }
        }
      }
    }
    cursor = match.index + match[0].length;
  }

  // 处理模板结尾不是以标签结束,最后有文字的情况
  if (cursor < template.length) {
    const parent = stack[stack.length - 1];
    const node = {
      tag: "text",
      children: restoreEscaped(template.substring(cursor, template.length))
    };
    parent.children.push(node);
  }

  if (stack.length !== 1) {
    console.warn(`mismatch tags:${stack.map(n => n.tag).slice(1).join(',')}`)
  }
  return elements;
}

export {
  parseTemplate
}