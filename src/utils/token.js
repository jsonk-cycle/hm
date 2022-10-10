// 封装3个方法专门用于操作token的
// 代码分层更方便清晰,以后修改方便
const key = 'geek-itheima'
// 设置,在localStorage进行长久的存储
export const setToken = (token) => {
  localStorage.setItem(key, token)
}
// 获取
export const getToken = () => localStorage.getItem(key)
// 删除
export const remove = () => {
  localStorage.removeItem(key)
}
