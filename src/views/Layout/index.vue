<template>
    <div>
        <div class="home_container">
            <!-- 二级路由页面 -->
            <router-view></router-view>
            <!-- 下面底部导航 -->
        </div>

        <div>
            <!-- 在上面设置route了 -->
            <van-tabbar v-model="active" route>
                <!-- 设置route和to集成路由属性 -->
                <!-- 使用to进行跳转这里可以将子组件新建到对应的layout下面 -->
                <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
                <van-tabbar-item icon="user-o" to="/layout/user">我的</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
export default {
// 后面加下划线可以默认没有
  name: 'Layout_',
  data () {
    // 为了给对应的激活样式
    return {
      active: 0
    }
  }
}
</script>

<style scoped>
/* 把内容往上挤压,防止内部被底部导航挡住 */
.home_container {
    padding-bottom: 50px;
}
/* 底部导航上边框 */
.van-tabber{
    border-top: 1px solid #f8f8f8;
}
</style>
