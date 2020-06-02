<template>
  <div>
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
    />
    <el-tree
      ref="tree"
      class="filter-tree"
      :data="node"
      default-expand-all
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
export default {
  props: {
    node: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) { return true }
      return data.label.includes(value)
    },
    /* 处理目录树选择 */
    handleNodeClick (obj) {
      this.$emit('handleNodeClick', obj)
    }
  }
}
</script>
