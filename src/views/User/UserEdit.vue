<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="profileObj.photo" @click="imageClickFn" />
          <!-- file 选择框 -->
          <!-- 视觉上隐藏，但是还要监听事件 -->
          <input type="file" ref="iptFile" v-show="false" accept="image/*" @change="onFileChange" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="profileObj.name" @click="nameClickFn" />
      <van-dialog v-model="show" title="修改名称" show-cancel-button :before-close="onNameDialogBeforeClose">
        <!-- 输入框 -->
        <input type="text" v-fofo v-model="inputUserName">
      </van-dialog>
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="isShowBirth = true" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat"/>
    </van-cell-group>
    <!-- 修改时间 -->
    <van-popup v-model="isShowBirth" position="bottom" style="height: 50%" round>
      <!-- 日期选择控件 -->
      <van-datetime-picker v-model="currentDate" type="date" title="选择出生日期" :min-date="minDate" :max-date="maxDate"
        :show-toolbar="true" @cancel="isShowBirth = false" @confirm="confirmFn" />
    </van-popup>
  </div>
</template>

<script>
import { userProfileAPI, updateUserPhotoAPI, updateProfileAPI } from '@/api'
import { Notify } from 'vant'
import moment from 'moment'
export default {
  data () {
    return {
      profileObj: {},
      // 创建fromData对象
      show: false,
      inputUserName: '', // 修改名字
      isShowBirth: false, // 显示时间选择器
      minDate: new Date(1900, 0, 1), // 最小的可选的日期
      maxDate: new Date(), // 最大的可选日期
      currentDate: new Date() // 当前日期
    }
  },
  name: 'UserEdit',
  async created () {
    const res = await userProfileAPI()
    this.profileObj = res.data.data
  },
  methods: {
    // 文件改变事件
    async onFileChange (e) {
      if (e.target.files.length === 0) return// 页面没有选择文件，直接返回阻止代码往下运行
      console.log(e.target.files[0])// (用户选中的文件) 数组其实是一个特殊的对象
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0])// 请求体里加入一对参数值
      const res = await updateUserPhotoAPI(theFd)
      this.profileObj.photo = res.data.data.photo
    },
    // 图片点击事件
    imageClickFn () {
      this.$refs.iptFile.click()// js模拟标签的事件触发的是input的事件
    },
    // 姓名的点击事件
    nameClickFn () {
      this.show = true // 控制姓名的弹出框的显示与隐藏
      this.inputUserName = this.profileObj.name
    },
    // 姓名修改弹出层-关闭前方法
    async onNameDialogBeforeClose (action, done) {
      // action的值: confirm或cancel(点击按钮区分)
      if (action === 'confirm') {
        // 确定
        // unicode编码 \u4092
        // url编码 %E2%C3%D1
        if (/^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/.test(this.userName)) {
          // 通过校验
          // 调用接口
          // 更新页面显示的名字
          await updateProfileAPI({
            userName: this.userName
          })
          // 更新页面显示的名字
          this.profileObj.name = this.userName
          // 关闭弹窗
          // 关闭弹窗
          done()
        } else {
          // 提示用户
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
          // 阻止弹窗关闭
          done(false)
        }
      } else if (action === 'cancel') {
        // 取消
        done()
      }
    },
    // 弹出时间选择框
    showBirthFn () {
      this.isShowBirth = true
      this.currentDate = new Date(this.profileObj.birthday) // 设置data组件默认显示时间
    },
    // 时间选择
    async confirmFn () {
      // console.log(this.currentDate instanceof Date)
      // this.currentDate里值是日期对象
      // 但是后台要"年-月-日"格式字符串参数值

      console.log(this.currentDate)
      const dateStr = moment(this.currentDate).format('YYYY-MM-DD')
      await updateProfileAPI({
        birthday: dateStr
      })
      // 前端页面同步
      this.profileObj.birthday = dateStr
      // 时间选择器关闭
      this.isShowBirth = false
    }
  }

}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;

  .avatar {
    width: 50px;
    height: 50px;
  }
}

::v-deep .van-dialog__content {
  text-align: center;

  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
