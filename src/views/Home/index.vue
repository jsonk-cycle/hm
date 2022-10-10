<template>
  <!-- 学生问: 为何不在Layout上面使用?
答案 : 如果使用, 则所有二级页面都有头了, 但实际上只有Home页面头部有 -->
    <div>
        <div>
            <!-- 固定头部导航 -->
            <van-nav-bar fixed>
                <template v-slot:left>
                    <img class="logo" src="@/assets/toutiao_logo.png" alt="logo">
                </template>
                <!-- 注意#right -->
                <template #right>
                    <!-- 我们的postcss只能翻译style里的产css样式,行内标签无法自动转换,这个rem需要自动换算 -->
                    <van-icon name="search" size="0.48rem" color="#fff" @click="moveSearchPageFn"/>
                </template>
            </van-nav-bar>
        </div>
        <!-- tab导航下面的多个选择，点击哪个就显示哪个分类 -->
        <!-- sticky animated粘性定位于对应的切换动画 -->
        <!-- v-model="channelId"绑定选择的id -->
        <!-- 要注意对应的使用版本有一些需要指定的版本才能使用 -->
        <!-- 定义切换的方法 -->
        <div class="main">
            <van-tabs
            v-model="channelId"
            @change="channelChangeFn"
            sticky animated
            offset-top="1.226667rem"
            >
            <!-- 单独一项的导航切换按钮，遍历用户选中的列表进行对应的内容排布 -->
                <van-tab
                v-for="obj in userChannelList"
                :title="obj.name"
                :key="obj.id"
                :name="obj.id"
                >
                <!-- 这里是文章的显示页面部分 -->
                <ArticleList
                :channelId="channelId"
                >
              </ArticleList>
            </van-tab>

            </van-tabs>
            <!-- 编辑频道图标 -->
            <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="plusClickFn"></van-icon>
        </div>

        <!-- 频道管理弹出层 -->
        <van-popup v-model="show" get-container="body" class="channel_popup">
          <ChannelEdit :userList="userChannelList" :unCheckList="unCheckChannelList" @addChannelEV="addChannelFn" @removeChannelEV="removeChannelFn" @closeEV="closeFn" ref="editRef"></ChannelEdit>
        </van-popup>
    </div>
</template>

<script>
// 导入接口函数
import { getUserChannelsAPI, getAllChannelsAPI, updateChannelsAPI, removeTheChannelAPI } from '@/api'
// 导入子组件
import ArticleList from './components/ArticleList'
import ChannelEdit from './ChannelEdit'

export default {
  name: 'Home_',
  data () {
    return {
      channelId: 0, // tab导航激活索引(默认频道ID为0,页面刚打开是推荐频道高亮-推荐的文章数据)
      userChannelList: [], // 用户选中频道列表
      allChannelList: [], // 所有的频道列表
      //   articleList: [] // 文章列表
      show: false // 频道弹出层控制显示或隐藏
    }
  },
  async created () {
    // 发送请求
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.userChannelList = res.data.data.channels
    // this.channelChangeFn()
    // 所有的频道列表
    const res2 = await getAllChannelsAPI()
    this.allChannelList = res2.data.data.channels
  },
  methods: {
    async channelChangeFn () {
      // 获取文章列表
    //   const res2 = await getAllArticleListAPI({
    //     channel_id: this.channelId,
    //     timestamp: (new Date()).getTime()
    //   })
    //   console.log(res2)
    //   this.articleList = res2.data.data.results
    },
    plusClickFn () {
      this.show = true
    },
    // 添加频道
    async addChannelFn (channelBbj) {
      this.userChannelList.push(channelBbj)
      // 为什么只需要push,不需要下面的移除，因为下面的是计算属性
      // 把最新的数组发送给后台
      // 数组对象字段-》转换
      // 推荐频道不能传递,筛选
      // const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      // newArr.forEach((obj, index) => {
      //   // delete对象.属性 删除键值对
      //   delete obj.name
      //   obj.seq = index
      // })
      // const res = await updateChannelsAPI({
      //   channels: this.userChannelList
      // })
      // console.log(res)
      // 上面的代码有问题，新增时，名字被删除了，原因是所有的数组对象都是同一个内存地址，解决方案
      const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj }// 拷贝浅拷贝
        delete newObj.name
        newObj.seq = index
        return newObj // 收集新对象
      })

      const res = await updateChannelsAPI({
        channels: theNewArr
      })
      console.log(res)
    },
    // 删除频道
    async removeChannelFn (channelObj) {
      const index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index, 1)
      // 第一种方式：把现在的用户数组的数据，再覆盖式发给后台
      // 第二种方式，只调用删除接口
      const res = await removeTheChannelAPI({
        channelId: channelObj.id
      })
      console.log(res)
    },
    // 关闭弹出层
    closeFn () {
      this.show = false
      // 我们要让内部的编辑状态回归false
      this.$refs.editRef.isEdit = false
    },
    // 首页右上角搜索按钮跳转到搜索页面,可以返回
    moveSearchPageFn () {
      this.$router.push('/search')
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    // unCheckChannelList () {
    //   // 目标把所有的频道数组挨个对象取出，，去用户以选择的频道查找，如果找不到，则filter方法收集到一个新数组里
    //   const newArr = this.allChannelList.filter(bigObj => {
    //     const index = this.userChannelList.findIndex(smallObj => {
    //       return smallObj.id === bigObj.id
    //     })

    //     if (index > -1) {
    //       return false
    //     } else {
    //       return true
    //     }
    //   })
    //   return newArr
    // }
    unCheckChannelList () {
      // 简化写法
      return this.allChannelList.filter(bigObj => (this.userChannelList.findIndex(smallObj => smallObj.id === bigObj.id) === -1))
    }

  }
}
</script>

<style scoped lang="less">
.logo {
    width: 100px;
    height: 30px;
}
.main{
    padding-top: 46px;
}

::v-deep .van-tabs_wrap{
  padding-right: 30px;
  background-color: #fff;
}

.moreChannels{
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.channel_popup{
  width: 100vw;
  height: 100vh;
}
//wh,vw是参考浏览器的窗口
</style>
