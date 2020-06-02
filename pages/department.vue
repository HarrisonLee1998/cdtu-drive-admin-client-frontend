<template>
  <div>
    <div class="container">
      <div class="btns">
        <el-button type="primary" class="dept-tree-btn" @click="dialog.deptTreeDialog = true">
          查看部门树
        </el-button>

        <el-button type="primary" class="dept-tree-btn" @click="dialog.newDeptDialog = true">
          新建部门
        </el-button>
      </div>
      <el-dialog
        title="部门树"
        :visible.sync="dialog.deptTreeDialog"
        width="30%"
        @handleNodeClick="empty"
      >
        <DeptTree :node="node" />
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
          prop="typeTitle"
          label="类型"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.type > 0"
              size="mini"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-show="scope.row.type > 0"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div>
        <el-dialog
          title="修改组织"
          :visible.sync="dialog.modifyDialog"
          width="30%"
        >
          <div>
            组织名称: <el-input v-model="newDeptTitle" />
          </div>
          <DeptTree :node="node" @handleNodeClick="handleNodeClick" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('modifyDialog')">关闭</el-button>
            <el-button type="primary" @click="saveModify">保存修改</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="新增组织"
          :visible.sync="dialog.newDeptDialog"
          width="30%"
        >
          <div>
            <div>
              组织ID: <el-input v-model="newDept.id" />
            </div>
            <div>
              组织名称: <el-input v-model="newDept.title" />
            </div>
            <div>
              组织类型:
              <el-select v-model="newDept.type">
                <el-option v-for="op in typeOptions" :key="op.value" :label="op.label" :value="op.value" />
              </el-select>
            </div>
          </div>
          <DeptTree :node="node" @handleNodeClick="handleNodeClick" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('newDeptDialog')">关闭</el-button>
            <el-button type="primary" @click="saveAdd">保存</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="删除组织"
          :visible.sync="dialog.deleteDeptDialog"
          width="30%"
        >
          <span>请注意，删除该组织会导致该组织下的所有子组织、用户数据也会被删除</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('deleteDeptDialog')">关闭</el-button>
            <el-button type="danger" @click="saveDelete">确认删除</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import DeptTree from '~/components/DeptTree'
export default {
  components: {
    DeptTree
  },
  data () {
    return {
      dialog: {
        deptTreeDialog: false,
        modifyDialog: false,
        deleteDeptDialog: false,
        newDeptDialog: false
      },
      depts: [],
      node: [],
      newDeptTitle: '',
      targetDept: null,
      newDept: {
        id: '',
        title: '',
        type: ''
      },
      deleteDept: null,
      clickDept: null,
      typeOptions: [
        {
          label: '学院',
          value: 1
        },
        {
          label: '专业',
          value: 2
        },
        {
          label: '班级',
          value: 3
        }
      ]
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
              if (d.type === 0) {
                d.typeTitle = '学校'
              } else if (d.type === 1) {
                d.typeTitle = '二级学院或其他校级部门'
              } else if (d.type === 2) {
                d.typeTitle = '专业'
              } else {
                d.typeTitle = '班级'
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
            this.node = []
            this.node.push(res.data.map.node)
          }
        })
    },
    refreshData () {
      this.getAllDepts()
      this.getDeptTree()
    },
    handleEdit (dept) {
      this.targetDept = dept
      this.newDeptTitle = dept.title
      this.dialog.modifyDialog = true
    },
    handleDelete (dept) {
      this.deleteDept = dept
      this.dialog.deleteDeptDialog = true
    },
    saveModify () {
      // 发送请求
      this.dialog.modifyDialog = false
      let pDid = null
      if (!this.clickDept || this.newDeptTitle.trim() === '') {
        this.$message.error('修改内容无效')
        return
      }
      if (this.clickDept) {
        pDid = this.clickDept.id
      }
      this.$axios.patch('/api/admin/dept', {
        id: this.targetDept.id,
        title: this.newDeptTitle,
        pid: pDid
      })
        .then((res) => {
          if (res.data.status === 'OK') {
            this.$message.success('修改保存成功')
            this.refreshData()
          } else {
            this.$message.error('修改保存失败')
          }
        })
      this.clickDept = null
      this.targetDept = null
    },
    saveDelete () {
      // 发送请求
      this.dialog.deleteDeptDialog = false
      if (!this.deleteDept) {
        this.$message.error('请先选择所要删除的部门')
      } else {
        this.$axios.delete('/api/admin/dept', {
          params: {
            id: this.deleteDept.id
          }
        }).then((res) => {
          if (res.data.status === 'OK') {
            this.$message.success('删除成功')
            this.refreshData()
          } else {
            this.$message.error('删除失败')
          }
        })
      }
    },
    saveAdd () {
      this.dialog.newDeptDialog = false
      if (!this.clickDept) {
        this.$message.error('新部门的父级部门不能为空,请重新输入')
        return
      }
      if (this.newDept.id.trim() === '') {
        this.$message.error('新部门ID不能为空，请重新输入')
        return
      }
      if (this.newDept.title.trim() === '') {
        this.$message.error('新部门名称不能为空，请重新输入')
        return
      }
      if (!this.newDept.type) {
        this.$message.error('新部门类型不能为空，请重新输入')
        return
      }
      this.$axios.post('/api/admin/dept', {
        id: this.newDept.id,
        title: this.newDept.title,
        type: this.newDept.type,
        pid: this.clickDept.id
      }).then((res) => {
        if (res.data.status === 'OK') {
          this.$message.success('添加成功')
          this.refreshData()
        } else {
          this.$message.error('添加失败')
        }
      })
      this.clickDept = null
      this.targetDept = null
    },
    handleNodeClick (target) {
      this.clickDept = target
    },
    closeDialog (attr) {
      this.dialog[attr] = false
      this.clickDept = null
      this.targetDept = null
    },
    empty () {}
  }
}
</script>

<style scoped>
.el-input{
  width: 300px;
}
.container {
  padding: 5%;
}
.dept-tree-btn {
  margin-bottom: 5%;
}
</style>
