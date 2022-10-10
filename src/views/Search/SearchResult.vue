<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.go(-1)" fixed />
    </div>
    <!-- 文章列表 -->
    <div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
        <ArticleItem v-for="obj in articleList" :key="obj.art_id" :artObj="obj" :isShow="false" @click.native="itemClickFn(obj.art_id)">
        </ArticleItem>
      </van-list>

    </div>

  </div>
</template>

<script>
// 事件修饰符.native=>给组件内根标签绑定原生的click点击事件
import { searchResultAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页码
      articleList: [],
      loading: false, // 加载状态
      finished: false
    }
  },
  async created () {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw

    })
    console.log(res)
    this.articleList = res.data.data.results
  },
  components: {
    ArticleItem
  },
  methods: {
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw

        })
        if (res.data.data.results.length === 0) {
          // 没有更多数据
          this.finished = true
          return
        }
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      }
    },
    // 跳转到详情
    itemClickFn (id) {
      this.$router.push({
        path: `/detail?art_id=${id}`
      })
    }
  }
}
// 业务问题
// 404前端是自己,后端是自己,后端保存的文章的数据,但是文章里面的图片来自于其他服务器的路径,后端只是保存了图片的地址,后端会把数据和图片的地址返回前端,前端铺设页面,第三方图片(人家把图片删除了),前端只能给一个提示
// 403你无权请求此地址,后端做了图片的防盗链
// 后端会判断请求时referer是否是自己的地址
// 解决:meta不让浏览器携带请求头里reffer,让后端判断失效
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
