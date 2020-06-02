export default async function (context) {
  const { $axios, route, redirect } = context
  const white = ['/login', '/404', '/unauthorized']
  console.log(route.path)
  if (!white.includes(route.path)) {
    try {
      await $axios({
        url: '/api/admin/login/check',
        params: {
          path: route.path
        },
        method: 'get'
      }).then((res) => {
        if (res.data.status === 'OK') {
          // 放行
        } else {
          redirect('/404')
        }
      })
    } catch (error) {
      // 重定向到登录页面
      redirect('/login')
    }
  }
}
