import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // ...
    user: JSON.parse(localStorage.getItem('user')) || {} // 用户基本资料(默认从本地取)
  },
  mutations: {
    // ...
    setUser (state, userObj) {
      state.user = userObj
      localStorage.setItem('user', JSON.stringify(userObj))
    }
  },
  getters: {
    userPhoto (state) {
      return state.user.photo
    }
  }
})
