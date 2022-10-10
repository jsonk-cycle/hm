<template>
  <div>
    <!-- 路由挂载点路由要与页面的首页进行对应的联系 -->
    <!-- 第一级路由（/one）,需要将
    <router-view />标签放在app.vue里

    第二级路由（/one/two）,需要将
    <router-view />标签放在one.vue里

    第三级路由（/one/two/three）,需要将
    <router-view />标签放在two.vue里 -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {

}
</script>

<style>

</style>
