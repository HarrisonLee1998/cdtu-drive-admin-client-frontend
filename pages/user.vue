<template>
  <div class="container">
    <div class="btns">
      <div><Upload /></div>
      <div>
        <el-button v-show="limit === 0" type="danger" @click="limitUsers">
          <i class="fas fa-user-slash" />限制用户
        </el-button>
        <el-button v-show="limit === 1" type="primary" @click="limitUsers">
          <i class="fas fa-unlock" />取消限制
        </el-button>
      </div>
      <div>
        <span>部门筛选: </span>
        <el-select v-model="deptId" placeholder="请选择" style="width:200px">
          <el-option
            v-for="item in depts"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </div>
      <div>
        <span>是否受限: </span>
        <el-select v-model="limit" placeholder="请选择" style="width:100px">
          <el-option v-for="op in limitOptions" :key="op.value" :label="op.label" :value="op.value" />
        </el-select>
      </div>
      <div>
        <span>用户类型: </span>
        <el-select v-model="type" placeholder="请选择" style="width:80px">
          <el-option v-for="op in typeOptions" :key="op.value" :label="op.label" :value="op.value" />
        </el-select>
      </div>
    </div>
    <!--表格-->
    <div>
      <el-table
        :data="pageInfo.list"
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="id"
          label="编号"
        />
        <el-table-column
          prop="username"
          label="姓名"
        />
        <el-table-column
          prop="gender"
          label="性别"
          width="55"
        />
        <el-table-column
          prop="dept"
          label="部门"
        />
        <el-table-column
          prop="limit"
          label="是否受限"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >
              <i class="fas fa-user-edit" />编辑
            </el-button>
            <el-button v-show="limit === 0" type="danger" size="mini" @click="limitSingleUser(scope.row)">
              <i class="fas fa-user-slash" />限制
            </el-button>
            <el-button v-show="limit === 1" type="primary" size="mini" @click="limitSingleUser(scope.row)">
              <i class="fas fa-unlock" />恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div />

    <!-- 对话框 -->
    <div>
      <el-dialog
        title="用户信息"
        :visible.sync="dialog.modifyUser"
        width="30%"
      >
        <div class="user-info">
          <div><span>编号:</span><span>{{ targetUser.id }}</span> </div>
          <div><span>姓名:</span><span>{{ targetUser.username }}</span> </div>
          <div><span>性别:</span><span>{{ targetUser.gender }}</span> </div>
          <div><span>部门:</span><span>{{ targetUser.dept }}</span> </div>
          <div class="role">
            <span>角色:</span>
            <el-select v-model="newRole" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="pwd">
            <span>密码修改: </span><el-input v-model="targetUser.password" />
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.modifyUser = false">关闭</el-button>
          <el-button type="primary" @click="saveModify">保存修改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Upload from '~/components/Upload'
export default {
  components: {
    Upload
  },
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      deptId: '0', // 0 代表全校
      limit: 0,
      limitOptions: [
        {
          label: '未受限',
          value: 0
        },
        {
          label: '受限',
          value: 1
        }
      ],
      type: 0,
      typeOptions: [
        {
          label: '学生',
          value: 0
        },
        {
          label: '教师',
          value: 1
        },
        {
          label: '管理员',
          value: 2
        }
      ],
      pageInfo: {},
      roles: [],
      depts: [],
      roleTitles: {},
      deptTitles: {},
      targetUser: {},
      dialog: {
        modifyUser: false
      },
      newRole: null,
      select: []
    }
  },
  watch: {
    deptId () {
      this.getUsers()
    },
    limit () {
      this.pageNo = 1
      this.getUsers()
    },
    type () {
      this.pageNo = 1
      this.getUsers()
    }
  },
  created () {
    this.$store.subscribe((state, mutation) => {
      if (mutation.type === 'user/setRefreshUsers') {
        this.refreshData()
      }
    })
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.$axios.get(`/api/admin/users/${this.pageNo}/${this.pageSize}/${this.deptId}/${this.limit}/${this.type}`)
        .then((res) => {
          if (res.data.status === 'OK') {
            const pageInfo = res.data.map.pageInfo
            const roles = res.data.map.roles
            const depts = res.data.map.depts
            this.parseData(pageInfo, roles, depts)
          } else {
            this.$message.error('获取用户列表失败')
          }
        })
    },
    parseData (pageInfo, roles, depts) {
      roles.unshift({ id: null, title: '普通用户' })
      roles.forEach((role) => {
        this.roleTitles[role.id] = role.title
      })
      depts.forEach((dept) => {
        this.deptTitles[dept.id] = dept.title
      })
      pageInfo.list.forEach((user) => {
        user.role = this.roleTitles[user.roleId]
        user.dept = this.deptTitles[user.deptId]
        user.gender = user.gender === 0 ? '男' : '女'
        user.limit = user.limit === 0 ? '否' : '是'
      })
      this.pageInfo = pageInfo
      this.roles = roles
      this.depts = depts
    },
    refreshData () {
      this.pageNo = 1
      this.getUsers()
    },
    handleEdit (user) {
      this.dialog.modifyUser = true
      this.targetUser = user
      this.newRole = user.roleId
    },
    handleSelection (selection) {
      this.select = []
      selection.forEach((user) => {
        this.select.push(user.id)
      })
    },
    limitUsers () {
      if (this.select.length === 0) {
        this.$message.error('请先选择用户')
      } else {
        this.setLimit(this.select)
      }
    },
    limitSingleUser (user) {
      const ids = []
      ids.push(user.id)
      this.setLimit(ids)
    },
    setLimit (ids) {
      this.$axios.patch('/api/admin/users/limit', {
        ids,
        limit: this.limit === 0 ? 1 : 0
      })
        .then((res) => {
          if (res.data.status === 'OK') {
            this.$message.success('成功')
            this.getUsers()
          } else {
            this.$message.error('失败')
          }
        })
    },
    saveModify () {
      this.dialog.modifyUser = false
      this.targetUser.roleId = this.newRole
      this.$axios.patch('/api/admin/user', {
        id: this.targetUser.id,
        password: this.targetUser.password,
        roleId: this.newRole
      }).then((res) => {
        if (res.data.status === 'OK') {
          this.$message.success('修改保存成功')
          this.refreshData()
        } else {
          this.$message.error('修改保存失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 90%;
  margin: 5% auto;
}
.btns {
  display: flex;
  flex-wrap: wrap;
  .el-button{
    height: 40px;
  }
}
.btns > div:not(:first-child) {
  margin-left: 20px;
}
.user-info {
  font-size: 16px;
  .el-input,
  .el-select {
    width: 70%;
  }
}

.user-info > div{
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
