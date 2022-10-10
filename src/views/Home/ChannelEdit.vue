
<template>
    <div>
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
            <template #right>
                <van-icon name="cross" size="0.37333334rem" color="white" @click="closeFn"/>
            </template>
        </van-nav-bar>
        <!-- 我的频道 -->
        <div class="my-channel-box">
            <div class="channel-title">
                <span>我的频道
                    <span class="small-title">
                        点击{{isEdit?'删除':"进入"}}频道
                    </span>
                </span>
                <span @click="editFn">{{isEdit?"完成":"编辑"}}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
                <van-col span="6" v-for="obj in userList" :key="obj.id" @click="userChannelClickFn(obj)">
                    <div class="channel-item van-hairline--surround">
                        {{obj.name}}
                        <!-- 删除的徽标 -->
                        <van-badge color="transparent" class="cross-badge" v-show="isEdit && obj.id!==0">
                            <template #content>
                                <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="0.32rem" />
                            </template>
                        </van-badge>
                    </div>
                </van-col>
            </van-row>
        </div>

        <!-- 更多频道 -->
        <div class="more-channel-box">
            <div class="channel-title">
                <span>点击添加更多频道：</span>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
                <van-col span="6" v-for="obj in unCheckList" :key="obj.id" @click="moreFn(obj)">
                    <div class="channel-item van-hairline--surround">{{obj.name}}</div>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
// 目标1一：编辑频道-》显示x和不同的文字
// 定义isedit变量，来控制x是否显示
// 编辑span标签点击时，isEdit取反
// isedit变量控制文字的不同显示，以及推荐频道上x，额外判断条件

// 目标二编辑频道后-》点击更多频道进行新增
// 更多频道-》绑定点击事件，传递频道对象下去，下去之后要做一个判断，只有编辑才能添加
// 子传父，把频道对象传递给Home/index.vue->父push到用户已选频道数组
export default {
  props: {
    userList: Array,
    unCheckList: Array
  },
  data () {
    return {
      isEdit: false // 控制编辑频道的编辑状态
    }
  },
  methods: {
    editFn () {
      this.isEdit = !this.isEdit
    },
    moreFn (channelObj) {
      if (this.isEdit === true) {
        // 单向数据流
        this.$emit('addChannelEV', channelObj)
      }
    },
    // 用户频道的点击事件
    userChannelClickFn (channelObj) {
      if (this.isEdit === true) {
        this.$emit('removeChannelEV', channelObj)
      }
    },
    // 关闭弹出层
    closeFn () {
      this.$emit('closeEV')
    //   也可以再父组件使用ref
    //   this.isEdit = false
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
    background-color: transparent;
    height: 100%;
    width: 100%;
}

.popup-container {
    display: flex;
    flex-direction: column;
}

.pop-header {
    height: 90px;
    background-color: #007bff;
    color: white;
    text-align: center;
    font-size: 14px;
    position: relative;

    .title {
        width: 100%;
        position: absolute;
        bottom: 15px;
    }
}

.pop-body {
    flex: 1;
    overflow: scroll;
    padding: 8px;
    background-color: white;
}

.my-channel-box,
.more-channel-box {
    .channel-title {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        line-height: 28px;
        padding: 0 6px;
    }
}

.channel-item {
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color: #fafafa;
    margin: 5px;
}

/*删除的微标 */
.cross-badge {
    position: absolute;
    right: -3px;
    top: 0;
    border: none;
}

/*提示文字 */
.small-title {
    font-size: 10px;
    color: gray;
}
</style>
