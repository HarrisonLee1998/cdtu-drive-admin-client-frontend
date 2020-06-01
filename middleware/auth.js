export default async function (context) {
  const { $axios, route, redirect } = context
  const white = ['/login', '/404']
  if (!white.includes(route.path)) {
    try {
      await $axios({
        url: '/api/admin/login/check',
        params: {
          path: route.path
        },
        method: 'get'
      }).then((res) => {
        // 放行
      })
    } catch (error) {
      // 重定向到登录页面
      redirect('/login')
    }
  }
}
