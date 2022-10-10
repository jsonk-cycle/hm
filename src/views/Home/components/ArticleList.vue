<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefreash">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false" offset="50">
      <ArticleItem v-for="obj in list" :key="obj.art_id" :artObj="obj" @disLikeEV="disLikeFn" @reportEV="reportFn" @click.native="itemClickFn(obj.art_id)"></ArticleItem>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

import ArticleItem from '@/components/ArticleItem.vue'
import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import { Notify } from 'vant'
export default {
  props: {
    // list: Array // 文章列表的数组
    channelId: Number
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      theTime: new Date().getTime(), // 用于分页
      isLoading: false // 顶部加载栏
    }
  },
  components: {
    ArticleItem
  },
  async created () {
    this.getAllArticleListFn()
  },
  methods: {
    async getAllArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId,
        timestamp: this.theTime
      })

      // 数据的合并
      this.list = [...this.list, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp
      this.loading = false // 如果步关闭，底部就会一直是加载中状态，下次触发底部再触发onload
      if (res.data.data.pre_timestamp === null) { // 本次回来的数据就是最后了，没有下一段数据了
        this.finished = true
      }
      this.isLoading = false
    },

    async onLoad () {
      // 第二种解决开始就加载中请求数据的问题
      // immediate-check:内部不要进行判断而已，监听滚动事件的代码还在
      // 第一个频道滚动到底部，再切换第二个频道的时候（新建-内容没有这么高的时候），滚动会从底部滚回到顶部，这个时候发生了滚动，所以滚动事件还是触发了，immediate-check就无效了
      if (this.list.length === 0) {
        this.isLoading = false
        return // 如果页面没有数据，没有高度，让本次onload逻辑代码不在往下执行
      }
      this.getAllArticleListFn()
    },
    // 顶部刷新数据，list清空，获取新的数据
    async onRefreash () {
      this.list = []
      this.theTime = new Date().getTime()
      this.getAllArticleListFn()
    },
    // 反馈得不感兴趣，try+捕获同步代码的异常，try+catch捕获同步代码
    async disLikeFn (id) {
      await dislikeArticleAPI({
        artId: id
      })
      Notify({
        type: 'success',
        message: '反馈成功'
      })
    },
    async reportFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      Notify({
        type: 'success',
        message: '举报成功'
      })
    },
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
</script>

<style>
</style>
