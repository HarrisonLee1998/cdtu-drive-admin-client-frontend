<template>
  <div class="box">
    <h1>Admin Login</h1>
    <p id="error">
      {{ error }}
    </p>
    <input
      id="id"
      v-model="id"
      type="text"
      placeholder="ID"
      autocomplete="off"
      @focus="error = ''"
    >
    <input
      id="password"
      v-model="password"
      type="password"
      placeholder="Password"
      autocomplete="off"
      @focus="error = ''"
    >
    <button class="submit" @click="login">
      Login
    </button>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  data () {
    return {
      id: '',
      password: '',
      error: ''
    }
  },
  mounted () {
    this.error = this.$route.params.error
  },
  methods: {
    async login () {
      try {
        const res = await this.$axios({
          url: '/api/admin/login',
          method: 'post',
          data: {
            id: this.id,
            password: this.password
          }
        })
        if (res.data.status === 'OK') {
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          const user = res.data.map.user
          this.$store.commit('user/setAdmin', user)
          this.$router.push({ path: '/' })
        } else {
          this.$message.error('登录失败，请重新登录')
        }
      } catch (error) {}

      // this.$axios({
      //   url: '/api/admin/login',
      //   method: 'POST',
      //   data: {
      //     username: this.username,
      //     password: this.password
      //   },
      //   headers: { 'Content-Type': 'application/json' }
      // }).then((res) => {
      //   if (res.data.status === 'OK') {
      //     // this.$store.commit('jwt/setToken', res.data.map.token)
      //     this.$router.push('/')
      //   } else {
      //     this.error = '登录信息有误'
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 320px;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #191919;
  text-align: center;
}
.box h1 {
  color: white;
  text-transform: uppercase;
  font-weight: 500;
}
.box input[type='text'],
.box input[type='password'] {
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #3498db;
  padding: 14px 10px;
  width: 200px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
}
.box input[type='text']:focus,
.box input[type='password']:focus {
  width: 280px;
  border-color: #2ecc71;
}
.box .submit {
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  border: 2px solid #3498db;
  padding: 14px 40px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
  cursor: pointer;
}

.box .submit:hover {
  background: #2ecc71;
}

#error {
  color: red;
  margin: 10px 0;
}
</style>
