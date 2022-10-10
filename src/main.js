import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'// 引入用来设置根标签的字体大小用来做移动端的适配

import { NavBar, Form, Field, CellGroup, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search, Image as VanImage, Divider, Tag, Dialog, DatetimePicker } from 'vant'
// 入口函数
// 浏览器报错消除
Vue.config.productionTip = false
// 使用的是对应的ui组件库
Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cell)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Popup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Search)
Vue.use(VanImage)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(DatetimePicker)

// 封装中间键函数的插件,可以单独放在一个文件
const directiveObj = {
  install () {
    // 自定义指令,指令根标签是div，而input在内部，以上都是原生标签对象
    Vue.directive('fofo', {
      // 指令所在标签被插入真实dom触发inserted,如果标签用dispaly:none，隐藏再出现，不会触发inserted,使用update
      inserted (el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      },
      update (el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextarea) theTextarea.focus()
        }
      }
    }
    )
  }
}

// 执行目标对象的install方法并传入Vue类
Vue.use(directiveObj)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// webpack开发服务器在下面终端中+eslit插件,vscode+eslint插件+目录下eslinrc.js配置,两处检测代码
