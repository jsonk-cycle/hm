<template>
    <div>
        <!-- 搜索页面头部 -->
        <div class="search-header">
            <!-- 后退按钮 -->
            <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
            <!-- 搜索组件 -->
            <van-search placeholder="请输入搜索关键词" background="#007BFF" shape="round" v-fofo @input="inputFn"
                v-model.trim="kw" @search="searchFn"/>
        </div>
        <!-- 搜索建议列表 -->
        <div class="sugg-list" v-if="kw.length!==0">
            <div class="sugg-item" v-for="str,index in suggestList" :key="index" v-html="lightFn(str,kw)" @click="suggestClickFn(str)">

            </div>
        </div>
        <!-- 搜索历史 -->
        <div class="search-history" v-else>
            <!-- 标题 -->
            <van-cell title="搜索历史">
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                <template #right-icon>
                    <van-icon name="delete" class="search-icon" @click="clearFn"/>
                </template>
            </van-cell>

            <!-- 历史列表 -->
            <div class="history-list">
                <span class="history-item" v-for="(str,index) in history" :key="index" @click="historyClickFn(str)">{{str}}</span>
            </div>
        </div>
    </div>
</template>

<script>
// 目标一：
// 1.输入框回车-》输入框字-》搜索结果页
// 2.点击联想菜单-点击文字-搜索结果页
// 3.点击历史记录-》点击文字-》搜索结果页
import { suggestListAPI } from '@/api'
export default {
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖的定时器
      suggestList: [], // 联想建议列表的文字数组
      history: JSON.parse(localStorage.getItem('his')) || []
    }
  },
  methods: {
    // 输入框内容改变触发的事件方法
    inputFn () {
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          const res = await suggestListAPI({
            keywords: this.kw
          })

          this.suggestList = res.data.data.options
        }, 300)
      }
      // 防抖：延时执行逻辑代码，事件再次触发时，清除上一个定时器
    },
    // 处理字符串高亮关键字方法
    lightFn (originStr, target) {
      // originStr:原来的字符串
      // target:关键字
      // 字符串的replace方法replaceAll替换全部
      // 如果要使用变量作为正则的匹配条件，不能使用语法糖简化写法
      const reg = new RegExp(target, 'ig')// i忽略大小写，g代表全局匹配
      // 替换后不能使用target
      //   因为返回的数据有可能没有数据
      if (originStr !== null) {
        return originStr.replace(reg, (match) => {
          // match就是匹配中时元字符串还是用原来的，只是我们给个颜色即可
          return `<span style="color:red;">${match}</span>`
        })
      }
    },
    moveFn (theKw) {
      // 坑：路由跳转，在watch之前执行，所以我们要让路由跳转，来一个定时器包裹
      // eventloop
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${theKw}`
        })
      }, 0)
    },
    // 输入框的回车搜索事件
    searchFn () {
      if (this.kw.length > 0) {
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
      // 最好在跳转之前把本页面的事情搞定
      // 搜索的关键字保存到数组里面
    },
    // 联想菜单的点击事件
    suggestClickFn (str) {
      this.history.push(str)
      this.moveFn(str)
    },
    // 搜索历史点击事件
    historyClickFn (str) {
      this.moveFn(str)
    },
    // 清除历史记录
    clearFn () {
      this.history = []
    }
  },
  watch: {
    history: {
      // 深度侦听历史记录数组的改变
      // es6新增set和map
      deep: true,
      handler () {
        // 立即覆盖是的保存在本地本地只能存储字符串,set无序无重复
        const theSet = new Set(this.history)
        const arr = Array.from(theSet)
        localStorage.setItem('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
    height: 46px;
    display: flex;
    align-items: center;
    background-color: #007bff;
    overflow: hidden;

    /*后退按钮*/
    .goback {
        padding-left: 14px;
    }

    /*搜索组件*/
    .van-search {
        flex: 1;
    }

}
.sugg-list {
        .sugg-item {
            padding: 0 15px;
            border-bottom: 1px solid #f8f8f8;
            font-size: 14px;
            line-height: 50px;
            // 实现省略号的三行代码
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
/**搜索历史 */
.search-icon {
     font-size: 16px;
     line-height: inherit;
   }

   .history-list {
     padding: 0 10px;
     .history-item {
       display: inline-block;
       font-size: 12px;
       padding: 8px 14px;
       background-color: #efefef;
       margin: 10px 8px 0px 8px;
       border-radius: 10px;
     }
   }
</style>
