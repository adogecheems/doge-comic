<template>
  <image v-if="node.tag === 'image'" v-bind="node.attrs" />
  <br v-else-if="node.tag === 'br'" v-bind="node.attrs" />
  <span v-else-if="node.tag === 'text'" v-bind="node.attrs">
    {{ node.children }}
  </span>
  <span v-else-if="node.tag === 'span'" v-bind="node.attrs">
    <rich-fragment
        v-for="(child,index) in node.children"
        :key="index"
        :node="child"
      ></rich-fragment>
  </span>
</template>
<script>
export default {
  name: "rich-fragment",
  props: {
    node: {
      type: Object,
      default: {}
    }
  },
  mounted() {
    // console.log('fragment:', this.node);
  },
  computed:{
    isPlainText() {
      if(this.tag === 'text'){
        return true;
      }
    }
  },
  methods: {
  }
};
</script>