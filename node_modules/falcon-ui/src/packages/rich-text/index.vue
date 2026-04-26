<template>
  <richtext v-bind="$attrs" v-on="$listeners">
    <slot v-if="!template"></slot>
    <template v-else v-for="(node, index) in nodeTree.children"><image v-if="node.tag === 'image'" v-bind="node.attrs" :key="index + node.tag" /><br v-else-if="node.tag === 'br'" v-bind="node.attrs" :key="index + node.tag" /><span v-else-if="node.tag === 'text'" v-bind="node.attrs" :key="index + node.tag">{{ node.children }}</span><span v-else-if="node.tag === 'span'" v-bind="node.attrs" :key="index + node.tag">{{ mergeSpan(node) }}</span></template>
  </richtext>
</template>

<script>
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
    mergeSpan(span) {
      const spanChildren = span.children.map((item) => {
        if (typeof item.children === "string") {
          return item.children;
        }
      });
      return spanChildren.join("");
    }
  }
};
</script>
<style lang="less" scoped>
@type    : 'component';
@element : 'rich-text';

@import (multiple) '../../styles/theme.config.less';

.loadUIOverrides();
</style>
