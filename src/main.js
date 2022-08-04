import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 浏览器报错消除
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// webpack开发服务器在下面终端中+eslit插件,vscode+eslint插件+目录下eslinrc.js配置,两处检测代码
