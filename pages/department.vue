<template>
  <div>
    <div class="container">
      <el-button type="primary" class="dept-tree-btn" @click="dialog = true">
        查看部门树
      </el-button>
      <el-dialog
        title="部门树"
        :visible.sync="dialog"
        width="30%"
      >
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
        />
      </el-dialog>

      <el-table
        :data="depts"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="编号"
          width="180"
        />
        <el-table-column
          prop="title"
          label="名称"
          width="180"
        />
        <el-table-column
          prop="type"
          label="类型"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      depts: [],
      node: [],
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getAllDepts()
    this.getDeptTree()
  },
  methods: {
    getAllDepts () {
      this.$axios.get('/api/admin/dept')
        .then((res) => {
          if (res.data.status === 'OK') {
            const depts = res.data.map.depts
            depts.forEach((d) => {
              if (d.type === '0') {
                d.type = '学校'
              } else if (d.type === '1') {
                d.type = '二级学院或其他校级部门'
              } else if (d.type === '2') {
                d.type = '专业'
              } else {
                d.type = '班级'
              }
            })
            this.depts = depts
          }
        })
    },
    getDeptTree () {
      this.$axios.get('/api/admin/dept/tree')
        .then((res) => {
          if (res.data.status === 'OK') {
            this.node.push(res.data.map.node)
          }
        })
    },
    filterNode (value, data) {
      if (!value) { return true }
      return data.label.includes(value)
    }
  }
}
</script>

<style scoped>
.el-input{
  width: 300px;
}
.container {
  padding: 5% 10%;
}
.dept-tree-btn {
  margin-bottom: 5%;
}
</style>
