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
  async created () {
    try {
      const res = await getAllChannelsAPI()
      console.log(res)
    } catch (err) {
      // console.dir详细打印
      console.dir(err)
    }
  }
}
</script>

<style>

</style>
