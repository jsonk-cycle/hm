const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
const path = require('path')
console.log(path)
module.exports = {
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        // 导入覆盖的属性
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // '@van-nav-bar-background-color': '#007bff',
            // '@van-nav-bar-title-text-color': '#fff'
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${path.join(__dirname, '/src/styles/cover.less')}";`
          }
        }
      }
    }
  }
}
