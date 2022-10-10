// 基于axios封装网络请求，而不是接口请求
// 每个程序的想法都不一样,思路相同
// 相当于给axios封装
// 在babel.config.js设置插件按需引入theAxios只是个变量的名字而已
import theAxios from 'axios'
import router from '@/router'
import { Notify } from 'vant'
import { getToken } from './token'
const axios = theAxios.create({
  // 主机的基础地址
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 统一携带token
  // 判断本地有token再携带，判断api/index.js里如果没有携带Authorization,我在添加
  // 没有叫underfined,null具体的值你得赋予才叫空
  // ?.可选链操作符，如果前面对象没有length,整个表达式返回underfined
  // 如果getToken()在原地有值token字符串，才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // http响应状态码为2XX,3XX就进入这里
  // 对响应数据做点什么
  return response
}, function (error) {
  // http的状态码4XX，5XX就进入这里
  // 对响应错误做点什么
  // console.dir(error)
  // 只有401才代表身份过期
  if (error.response.status === 401) {
    // 不能使用this.$router,this的指向问题，我们这边直接引入router对象
    Notify({ type: 'warning', message: '你的身份已过期' })
    router.replace('/login')
  }
  return Promise.reject(error)
})
// 进行结构赋值,带有默认参数,将其导出去,通用性好
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url, method, params, data, headers
  })
}
// 以后换库, 只需要改这里, 逻辑页面不用动, 保证代码的复用性和独立性(高内聚低耦合)
//   return $.ajax({
//     url: url,
//     type: method,
//     data: data,
//     header: headers
