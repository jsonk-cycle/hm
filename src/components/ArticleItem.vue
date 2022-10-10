<template>
  <!-- temlate中只能有一个根标签 -->
  <div>
  <!-- 一条文章单元格 -->
  <van-cell>
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{artObj.title}}</span>
        <!-- 单图 -->
        <!-- <img v-if="artObj.cover.type === 1" class="thumb" :src="artObj.cover.images[0]" alt=""> -->
        <van-image v-if="artObj.cover.type === 1" :src="artObj.cover.images[0]">
          <template v-slot:error>
            图片走丢了
          </template>
        </van-image>
      </div>
      <!-- 多图 -->
      <div class="thumb-box" v-if="artObj.cover.type > 1">
        <!-- <img v-for="(imgUrl, index) in artObj.cover.images" class="thumb" :key="index" :src="imgUrl" alt=""> -->
        <van-image v-for="(imgUrl, index) in artObj.cover.images" class="thumb" :key="index" :src="imgUrl" alt="">
          <template v-slot:error>
            图片走丢了
          </template>
        </van-image>
      </div>
    </template>
    <!-- label 区域的插槽 -->
    <template #label>
      <div class="label-box">
        <div>
          <span>{{artObj.aut_name}}</span>
          <span>{{artObj.comm_count}}评论</span>
          <span>{{formatTime(artObj.pubdate)}}</span>
        </div>
        <!-- 反馈按钮,stop阻止事件冒泡 -->
        <van-icon name="cross" @click.stop="show=true" v-if="isShow"/>
      </div>
    </template>
  </van-cell>
  <!-- 反馈面板 , 指定挂载点-->
  <van-action-sheet v-model="show" :actions="actions" @select="onSelect" @cancel="cancelFn" get-container="body" :cancel-text="bottomText" @close="closeFn" />
</div>
</template>

<script>
// 点击反馈垃圾内容进行数据的切换
// 监听点击事件，区分用户点击的是哪一个
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report'
export default {
  // 因为类型报错所有更改使用方式
  // props: {
  //   artObj: Array// 文章对象
  // },
  // data () {
  //   return {
  //     formatTime: timeAgo
  //   }
  // },
  props: {
    artObj: Object, // 文章对象
    isShow: {
      type: Boolean,
      default: true
    }

  },
  data () {
    return {
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },

  methods: {
    formatTime: timeAgo,
    onSelect (action, item) {
      // action是对应得数据，item是索引值
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      // 判断
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('disLikeEV', this.artObj.art_id)
        // 无论成功或者失败直接让反馈面板消失
        this.show = false
      } else {
        this.$emit('reportEV', this.artObj.art_id, action.value)
        this.show = false // 关闭-下面的cancel会帮你把反馈选项切换过来
      }
    },
    cancelFn () {
      if (this.bottomText === '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 关闭面板时触发得事件
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }

  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span{
    margin: 0 3px;
    &:first-child{
        margin-left: 0;
    }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
