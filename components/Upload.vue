<template>
  <div>
    <div>
      <input id="excelFileUpload" ref="excelFileUpload" type="file" class="upload-btn" @change="upload">
      <label type="text" for="excelFileUpload">
        上传Excel文件
      </label>

      <!-- <el-button @click="upload">
        上传(仅存在于编码阶段)
      </el-button> -->
    </div>
    <div><small>文件类型仅限.xls, .xlsx</small></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: ['application/vnd.ms-excel',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    }
  },
  methods: {
    upload () {
      const file = this.$refs.excelFileUpload.files[0]
      if (!file) {
        this.$message.error('请选择所要上传的文件')
        return
      }
      if (this.checkFileType(file) && this.checkFileSize(file)) {
        const data = new FormData()
        data.append('file', file)
        this.$axios.post('/api/admin/users', data)
          .then((res) => {
            if (res.data.status === 'OK') {
              this.$message.success('添加成功')
              this.$store.commit('user/setRefreshUsers', new Date())
            } else {
              this.$message.error('添加失败')
            }
          })
          .catch(() => {
            this.$message.error('添加失败')
          })
      }
    },
    checkFileType (file) {
      if (this.type.includes(file.type)) {
        return true
      } else {
        this.$message.error('请上传正确类型的文件')
        return false
      }
    },
    checkFileSize (file) {
      if (file.size > 1024 * 1024 * 10) {
        this.$message.error('文件太大，系统拒绝上传')
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uploader {
  width: 100px;
}
.upload-btn {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.upload-btn + label {
  padding: 10px 5px;
  display: inline-block;
  border: 1px solid #409eff;
  background-color: #409eff;
  color: #ffffff;
  border-radius: 5px;
}
.upload-btn:focus + label,
.upload-btn + label:hover {
  background-color: #59acff;
}
</style>
