<template>
  <div class="container">
    <div class="btns">
      <el-button type="primary" @click="openNewRoleDialog">
        新增角色
      </el-button>
    </div>
    <div class="table">
      <el-table
        :data="roles"
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
          prop="createDate"
          label="创建日期"
          width="180"
        />
        <el-table-column
          prop="lastUpdateDate"
          label="上次修改日期"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialogs">
      <el-dialog
        :title="mode === 0 ? '新建角色' : '修改角色'"
        :visible.sync="dialog.newRoleDialog"
        width="30%"
      >
        <div>
          <div>
            角色名称：<el-input v-model="newRole.title" :readonly="mode === 1" />
          </div>
          <div>
            <p>角色所属的权限：</p>
            <el-checkbox-group v-model="newRole.checkedPermTitles">
              <el-checkbox
                v-for="p in permTitles"
                :key="p"
                :label="p"
              >
                {{ p }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.newRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitAddOrModify">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="删除角色"
        :visible.sync="dialog.deleteRoleDialog"
        width="30%"
      >
        是否确认删除
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.deleteRoleDialog = false">取 消</el-button>
          <el-button type="danger" @click="deleteRole">删除</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roles: [],
      perms: [],
      permTitles: [],
      newRole: {
        title: '',
        permissions: [],
        checkedPermTitles: []
      },
      dialog: {
        newRoleDialog: false,
        deleteRoleDialog: false
      },
      mode: 0,
      deleteTarget: null
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$axios.get('/api/admin/role/perm')
        .then((res) => {
          if (res.data.status === 'OK') {
            this.parseRoles(res.data.map.roles, res.data.map.perms)
          } else {
            this.$message.error('获取数据失败')
          }
        })
    },
    parseRoles (roles, perms) {
      roles.forEach((role) => {
        // role.createDate = this.$moment(role.createDate).utcOffset(8).format('yyyy/MM/DD HH:mm:ss')
        // role.lastUpdateDate = this.$moment(role.lastUpdateDate).utcOffset(8).format('yyyy/MM/DD HH:mm:ss')
        role.checkedPermTitles = []
      })
      this.permTitles = []
      perms.forEach((perm) => {
        this.permTitles.push(perm.title)
      })
      this.roles = roles
      this.perms = perms
    },
    openNewRoleDialog () {
      this.mode = 0
      const newRole = {}
      newRole.title = ''
      newRole.permissions = []
      newRole.checkedPermTitles = []
      this.newRole = newRole
      this.dialog.newRoleDialog = true
    },
    handleEdit (role) {
      this.mode = 1
      this.newRole = role
      this.newRole.checkedPermTitles = []
      this.dialog.newRoleDialog = true
      role.permissions.forEach((perm) => {
        this.newRole.checkedPermTitles.push(perm.title)
      })
    },
    handleDelete (role) {
      this.deleteTarget = role
      this.dialog.deleteRoleDialog = true
    },
    deleteRole () {
      this.dialog.deleteRoleDialog = false
      this.$axios.delete('/api/admin/role', {
        params: {
          id: this.deleteTarget.id
        }
      })
        .then((res) => {
          if (res.data.status === 'OK') {
            this.$message.success('删除成功')
            this.getData()
          } else {
            this.$message.success('删除失败')
          }
        })
    },
    submitAddOrModify () {
      if (this.handleNewRolePermsId()) {
        this.$axios.post('/api/admin/role', this.newRole)
          .then((res) => {
            if (res.data.status === 'OK') {
              this.$message.success('操作成功')
              this.getData()
            } else {
              this.$message.success('操作失败')
            }
          })
        this.dialog.newRoleDialog = false
      }
    },
    handleNewRolePermsId () {
      if (this.newRole.title.trim() === '') {
        this.$message.error('角色名称不能为空')
        return false
      }
      if (this.mode === 0) {
        for (let i = 0; i < this.roles.length; ++i) {
          if (this.newRole.title === this.roles[i].title) {
            this.$message.error('已存在该角色名称，请重新输入')
            return false
          }
        }
      }
      this.newRole.permissions = []
      this.newRole.checkedPermTitles.forEach((title) => {
        for (let i = 0; i < this.perms.length; ++i) {
          if (title === this.perms[i].title) {
            this.newRole.permissions.push(this.perms[i])
            break
          }
        }
      })
      if (this.newRole.permissions.length === 0) {
        this.$message.error('角色所属权限不能为空')
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 90%;
  margin: 5% auto;
}
</style>
