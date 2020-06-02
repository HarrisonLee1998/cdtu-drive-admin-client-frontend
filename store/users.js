export const state = () => ({
  refreshUsers: null
})

export const mutations = {
  setRefreshUsers (state, date) {
    state.refreshUsers = date
  }
}

export const getters = {
}
