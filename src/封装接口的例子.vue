<template>
  <div>
    <!-- 路由挂载点 -->
    <router-view></router-view>
  </div>
</template>

<script>
// @代表src文件夹
import { getAllChannelsAPI } from '@/api'
// try+catch来捕获await同步代码的错误
export default {
  name: 'Apple_',
  async created () {
    try {
      const res = await getAllChannelsAPI()
      console.log(res)
      // 因为await没有报错信息需要使用js原生的错误捕捉
    } catch (err) {
      // console.dir详细打印
      console.dir(err)
    }
  }
}
</script>

<style>

</style>
