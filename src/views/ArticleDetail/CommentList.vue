<template>
  <div>
    <!-- 评论列表 -->
    <!-- van-list最好再找个div内，让底部文字/加载中，作为div的内容，容器padding-bottom -->
    <!-- 底部文字也挤上去-看得见 -->
    <div class="cmt-list" :class="{'art-cmt-container-1':isShowCmtBox,'art-cmt-container-2':!isShowCmtBox}">
      <!-- van-list包裹列表，组件内的源码，检测网页滚动事件，判断滚动是否快到达内容高度(触底) -->
      <!-- loading为true的时候底部加载中出现，内部认为处于加载中的状态，触发load事件，finished是没有数据显示，immediate-check让我们的list组件1上来不要检测是否触底，因为list中的列表内容是网络请求来的，标签挂载的时候，没有高度，list就会判定触底一次onload方法，问题created发一次，onload立刻发送一次，请求两次数据，上来就请求第一页和第二页 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多评论了" @load="onLoad"
        :immediate-check="false">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar">
              <span class="uname">{{obj.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="obj.is_liking===true" @click="likeFn(true,obj)" />
              <van-icon name="like-o" size="16" color="gray" v-else @click="likeFn(false)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{obj.content}}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{timeAgo(obj.pubdate)}}</div>
        </div>
      </van-list>
    </div>
    <!-- 发表评论 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtBox === true">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount===0 ? '' :totalCount" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="commentClickFn" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-fofo @blur="blurFn" v-model.trim="comText"></textarea>
        <van-button type="default" :disabled="comText.length === 0" @click="sendFn">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { commentsListAPI, commentLikingAPI, commentDisLikingAPI, commentSendAPI } from '@/api'
import { timeAgo } from '@/utils/date'
export default {
  data () {
    return {
      offset: null, // 偏移量评论ID
      commentArr: [], // 评论列表
      isShowCmtBox: true, // 底部显示短的还是高的评论
      totalCount: '', // 评论数量（后台返回）
      comText: '', // 关联发布评论的内容
      loading: false,
      finished: false,
      lastId: null// 分页
    }
  },
  async created () {
    const res = await commentsListAPI({
      id: this.$route.query.art_id// 文章id
    })
    console.log(res)
    this.commentArr = res.data.data.results
    this.totalCount = res.data.data.total_count// 总的评论数量
    this.lastId = res.data.data.last_id // 分页
    // 网页打开-》没有评论，res结果空数组
    // 直接让list组件显示没有更多数据底部文字
    if (res.data.data.results.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    // 评论的点赞
    async likeFn (bool, commentObj) {
      if (bool === true) {
        // 用户点在红心身上
        // 显示->灰色的♥
        commentObj.is_liking = false
        await commentDisLikingAPI({
          comId: commentObj.com_id
        })
      } else {
        // 用户点在黑心身上
        commentObj.is_liking = true
        await commentLikingAPI({
          comId: commentObj.com_id
        })
      }
    },
    // 显示评论框第二套
    toggleShowFn () {
      this.isShowCmtBox = false
    },
    // 评论按钮点击事件
    commentClickFn () {
      // 只要设置window.scrollTo(0,文章内容高度)
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // window.scrollTo使网页进行滚动，设置坐标，如果底下没有内容就不在滚动
      // window.scrollTo(0, articleHeight)
      // css可以做动画：例如轮播图，css3位移，旋转，动画（需要修改css属性）animation(帧动画)，transition（过渡动画）
      // js也可以做动画，使用计时器间隔时间，修改目标状态，（动画片）
      // 动画实现

      // scrollIntoView方便的方法（既能滚动也能添加动画）需要原生标签滚动，让原生的标签滚动到文档的上部
      // 为什么选择like-box不选择第一条评论，因为头部导航会挡住
      // 注意：有的人的电脑不支持这个方法，没有滑动的效果-》只有用原生的js写
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布评论按钮
    async sendFn () {
      // 前端效果将评论加入到列表中
      const res = await commentSendAPI({
        id: this.$route.query.art_id,
        content: this.comText
      })
      console.log(res)
      this.commentArr.unshift(res.data.data.new_obj)
      this.totalCount++
      this.comText = ''
      this.commentClickFn()// 让第一条评论滚动到屏幕上
    },
    // 失去焦点
    blurFn () {
      // 问题：点击发布按钮，点击事件不执行，原因搞的评论容器-在页面点击发布一瞬间，输入框失去焦点，被v-if和v-else移除了整个标签
      // 解决方案：失去焦点时，变量值，在最后再执行
      setTimeout(() => {
        this.isShowCmtBox = true
      }, 0)
    },
    // 底部加载更多
    async onLoad () {
      // 判断和immediate-check可选任意一个（这里可以不写）
      if (this.commentArr.length > 0) {
      // 请求下一页的数据
        const res = await commentsListAPI({
          id: this.$route.query.art_id, // 文章id
          offset: this.lastId
        })
        console.log(res)
        this.commentArr = [...this.commentArr, ...res.data.data.results]
        this.totalCount = res.data.data.total_count// 总的评论数量
        this.lastId = res.data.data.last_id // 分页
        if (res.data.data.last_id === null) {
          this.finished = true
        }
        this.loading = false
      } else {
      // 如果不加immediate-check,上来走一次onLoad，loading状态为true，但是if又进不来等created数据回来撑开高度，滚动到底部时，loading为true就不会重新执行onLoad方法了，效果一直转圈，解决：if进不去，进else里把状态关闭掉
        this.loading = false
      }
    }
  }
}

// 分享的思路
// 如果想要分享到微信等需要申请对应的开发者api调用其他的方法
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;

  .cmt-item {
    padding: 15px 0;

    +.cmt-item {
      border-top: 1px solid #f8f8f8;
    }

    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .cmt-header-left {
        display: flex;
        align-items: center;

        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }

        .uname {
          font-size: 12px;
        }
      }
    }

    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }

    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}

.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;

  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }

  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;

  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }

  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
