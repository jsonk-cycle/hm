<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userObj.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{userObj.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userObj.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit"/>
      <van-cell icon="chat-o" title="小思同学" is-link />
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn"/>
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfoAPI } from '@/api'
import { remove } from '@/utils/token'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  data () {
    return {
      userObj: {}// 用户对象
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['userPhoto'])
  },
  async created () {
    const res = await getUserInfoAPI()
    console.log(res)
    this.setUser(res.data.data)
  },
  methods: {
    ...mapMutations(['setToken', 'setUser']),
    quitFn () {
      this.$dialog.confirm({
        title: '是否退出登录',
        message: '这就走了?不爱我了吗?'
      }).then(() => {
        // 清空vuex和本地,点击确认
        remove()
        // 跳到登录页
        this.$router.replace('/login')
      }).catch(() => {
        // on cancel，点击取消
      })
    }
  }
}
// 主动退出-用户点击退出-清空token,强制replace
// 被动退出，时间到了
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
