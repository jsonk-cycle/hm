<template>
  <!-- 使用对应的vant组件库参照对应的官方文档 -->
  <div><van-nav-bar title="黑马头条-登录" />
  <div>
    <!-- van-form表单组件,submit事件,van-field表单一项,name属性,表单提交时会收集一个对象向后端发送的值就是name,:表示一个表达式不加的化表示字符串 -->
  <van-form @submit="onSubmit">
    <!-- 两个单元格 -->
    <!-- 通过 CellGroup 的 inset 属性，可以将单元格转换为圆角卡片风格 -->
  <van-cell-group inset>
    <van-field
      v-model="user.mobile"
      required
      name="mobile"
      label="手机号"
      placeholder="请输入手机号"
      :rules="[{ required: true, message: '请填写正确手机号', pattern: /^1[3-9]\d{9}$/}]"
    />
    <!-- 使用正则表达式来进行匹配对应的11位手机号 -->
    <van-field
      v-model="user.code"
      required
      type="password"
      name="code"
      label="密码"
      placeholder="请输入密码"
      :rules="[{ required: true, message: '请填写正确的密码', pattern: /^\d{6}$/ }]"
    />
    <!-- 六位对应的密码 -->
  </van-cell-group>
  <div style="margin: 16px;">
    <van-button round block type="primary" native-type="submit" :disabled="isLoading" :loading="isLoading" loading-text="正在登录ing...">
      <!-- disabled 表示是否禁用按钮 -->
      <!-- loading设置为加载状态 -->
      登录
    </van-button>
  </div>
</van-form>
  </div>
  </div>
</template>

<script>
// 导入token和接口函数与组件
import { loginAPI } from '@/api'
import { setToken } from '@/utils/token'
import { Notify } from 'vant'

// import { log } from 'console'
export default {
  name: 'Login_',
  data () {
    return {
      user: {
        mobile: '13888888888',
        code: '246810'
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      // values表示收集的参数名和值
      console.log('submit', values)
      // 显示登录的特效
      this.isLoading = true
      try {
        // 向接口发送请求数据
        const res = await loginAPI(this.user)
        console.log(res)
        // 提示框
        Notify({ type: 'success', message: '登录成功' })
        // 当登录成功开始设置对应的token值
        setToken(res.data.data.token)
        // 跳转一定要写在最后
        // location.href会刷新网页,当地址改变,当地址一样就不会刷新
        // this.$router.push()会产生历史记录可以回退,replace替换不会产生历史记录即当登录成功后不可返回
        this.$router.replace({ path: '/layout/home' }) // 需要写全
      } catch (err) {
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoading = false // 网络请求完成后无论成功还是失败都重置
    }
  }
}
</script>

<style scoped lang="less">
// .van-nav-bar{
//     background-color:#007bff;
// }
// 注意当你想在父组件修改子组件的样式，就需要使用/deep/,UI组件库也是组件相当于子组件
// >>>、/deep/以及::v-deep
// 以上三种的效果均是在父组件改变子组件的样式。
// 一些预处理器（例如Sass）可能无法正确解析>>>。在这些情况下，可以改用/deep/或::v-deep组合器，两者都是它的别名，并且和>>>工作原理完全相同。
// // # 此选择器名字是van-nav-bar组件内标签的scoped尝试把此选择器后属性选择器匹配当前页面标签(选不中组件内部)
// /deep/ .van-nav-bar__title{
//     color: white;
// }
</style>
