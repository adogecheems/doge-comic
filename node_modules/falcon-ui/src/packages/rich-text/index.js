/**
 * richtext由于有递归的render,框架中的richtext无法处理,所以直接js实现render方法.
 */

import { parseTemplate } from "./utils";
// import RichFragment from "./rich-fragment.vue";
export default {
  name: "fl-richtext",
  components: {
    // RichFragment
  },
  props: {
    template: {
      type: String,
      default: ""
    },
    tagMapping: {
      type: Function,
      default: null
    }
  },
  render(h) {
    const children = this.template ? this.renderChildren(h, this.nodeTree.children) : [this.$slots.default];
    return h('richtext', {
      on: this.$listeners,
      attrs: this.$attrs
    }, children);
  },
  computed: {
    nodeTree() {
      const content = this.template ? parseTemplate(this.template) : null;
      return content;
    }
  },
  data() {
    return {
      content: {}
    };
  },
  methods: {
    renderChildren(h, children) {
      return children.map((node, index) => {
        if (node.tag === 'text') {
          return node.children;
        } else {
          const attrs = node.attrs || {};
          return h(node.tag, {
            attrs: attrs,
            key: node.tag + index,
            style: attrs.style,
          }, node.children ? this.renderChildren(h, node.children) : []);
        };
      });
    }
  }
};


// export { default } from './index.vue';