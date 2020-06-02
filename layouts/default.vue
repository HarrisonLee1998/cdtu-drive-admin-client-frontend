<template>
  <el-container>
    <el-aside width="200px">
      <div class="user-info">
        <img src="https://cdn.harrisonlee.net/hl.jpg">
        <div>
          <span>管理员：{{ admin.username }}</span>
        </div>
      </div>
      <div class="menu">
        <div v-for="(menu, i) in menus" :key="menu.title">
          <div
            class="menu-item"
            :class="[expandMenus[i] ? 'expand-menu' : '',
                     activeMenu === i ? 'active-menu': '']"
            @click="handleMenu(i, undefined, menu.link ? menu.link : undefined)"
          >
            <span>
              <i :class="menu.icon" />
              {{ menu.title }}
            </span>
            <i
              v-if="menu.subMenu.length > 0"
              :class="['direction', 'fas', expandMenus[i] ? 'fa-chevron-down' : 'fa-chevron-right']"
            />
          </div>
          <div v-for=" (sm, j) in menu.subMenu" :key="sm.title" class="sub-menu">
            <div
              class="menu-item"
              :class="activeMenuItem === i + '-' + j ? 'active-menu-item' : ''"
              @click="handleMenu(i, j, sm.link)"
            >
              {{ sm.title }}
            </div>
          </div>
        </div>
        <div class="logout">
          <i class="fas fa-sign-out-alt" @click="logout" />
        </div>
      </div>
    </el-aside>

    <div class="right">
      <main>
        <nuxt />
      </main>
    </div>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: [],
      expandMenus: {},
      activeMenu: -1,
      activeMenuItem: -1,
      admin: { username: '' }
    }
  },
  created () {
    this.$store.subscribe((state, mutation) => {
      if (mutation.type === 'user/setAdmin') {
        this.admin = state.admin
      }
    })
    this.getMenu()
  },
  methods: {
    handleMenu (i, j, k) {
      if (j === undefined) {
        this.activeMenuItem = ''
        const am = JSON.parse(JSON.stringify(this.expandMenus))
        if (am[i]) {
          am[i] = false
        } else {
          am[i] = true
        }
        if (this.activeMenu === i) {
          this.activeMenu = -1
        } else {
          this.activeMenu = i
        }
        this.expandMenus = am
      } else if (this.activeMenuItem !== i + '-' + j) {
        this.activeMenuItem = i + '-' + j
      }
      if (this.activeMenu !== i) {
        this.activeMenu = i
      }
      if (k) {
        this.$router.push(k)
      }
    },
    getMenu () {
      this.$axios.get('/api/admin/menu')
        .then((res) => {
          if (res.data.status === 'OK') {
            const menus = res.data.map.menus
            const home = { title: '首页', link: '/', icon: 'fas fa-home', subMenu: [] }
            menus.unshift(home)
            this.menus = menus
          }
        })
    },
    logout () {
      this.$axios.get('/api/logout')
        .then((res) => {
          if (res.data.state === 'OK') {
            this.$router.push('/login')
          } else {
            this.$message.error('系统出现故障')
          }
        })
    }
  }
}
</script>

<style lang="scss">

a {
  color: inherit;
  text-decoration: none;
}

  .right {
    width: calc(100% - 200px);
    position: absolute;
    top: 0;
    left: 200px;
  }

  .el-aside {
    color: #fff;
    background-color: #052754;
    height: 100vh;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
      img {
        width: 100px;
        height: auto;
        border-radius: 50%;
        margin-bottom: 10px;
      }
    }
  }
  .menu {
    overflow-y: auto;
    .sub-menu {
      display: none;
    }
  }
  .menu-item {
    height: 40px;
    font-size: 16px;
    padding: 0px 20px;
    line-height: 40px;
    position: relative;
    cursor: pointer;
    span {
      i:not(.direction) {
        margin-right: 10px;
        width: 20px;
        height: 16px;
      }
    }
    .direction {
      position: absolute;
      right: 10px;
      top: 12px;
    }
  }
  .sub-menu > .menu-item {
    padding: 0 40px;
  }
  .expand-menu ~ .sub-menu{
    display: block;
  }
  .active-menu,
  .active-menu-item {
    color: deepskyblue;
  }

  .logout {
    position: fixed;
    font-size: 30px;
    left: 160px;
    bottom: 20px;
    i {
      cursor: pointer;
    }
  }
</style>
