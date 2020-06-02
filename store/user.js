let admin = localStorage.getItem('admin')
if (admin) {
  admin = JSON.parse(admin)
}
export const state = () => ({
  admin
})

export const mutations = {
  setAdmin (state, admin) {
    state.admin = admin
    localStorage.setItem('admin', JSON.stringify(admin))
  }
}

export const getters = {
  getAdmin (state) {
    return state.admin
  }
}
