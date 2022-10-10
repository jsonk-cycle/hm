// 封装接口方法,每个方法负责请求一个url地址请求的url路径可以在这里统一的管理,接口的方法
import request from '@/utils/request.js'
// 一个参数的导入需要大括号

// 登录,登录接口
// axios会把参数对象转化为json字符串格式发后台,axios内部会自动携带请求参数(Headers),content-type:'application/json'帮您添加好
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 用户关注
export const userFollowedAPI = ({ userId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})
// 取消关注
export const userUnFollowedAPI = ({ userId }) => request({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'

})

// 用户 - 个人资料
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile'
})
// 用户 - 基本资料
export const getUserInfoAPI = () => request({
  url: '/v1_0/user'
})

// 用户更新头像
export const updateUserPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd// 外面窜进来的new fromdata表单对象
  // 如果你的请求体直接是一个formDATA表单对象，你也不用自己添加
  // Content-type,axios发现数据请求体是表单对象，他也不会转换为json字符串
  // 也不会带Content-type:application/json,而是交给浏览器，浏览器发现请求体是formData会自己携带Content-type
  // Content-type:application;axios携带，前提data请求体是对象-》字符串-》发给后台
  // Content-Type:multipart/form-data;浏览器携带，前提；data请求体必须是fromdata类型对象
})

// 用户 - 更新资料
export const updateProfileAPI = ({ birthday, userName }) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: {
      birthday: birthday,
      name: userName,
      gender: 1,
      real_name: 'Alex',
      intro: ''

    }
  })
}

// 获取所有频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

// 获取-用户选中的频道,没有登陆的话默认返回后台设置的频道列表
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels'

})
// 频道更新覆盖
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels// 用户已选整个频道数组
  }
})
// 频道删除频道
export const removeTheChannelAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'

})

// 获取-文章列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',

  params: {
    channel_id,
    timestamp
  }

})

// 文章--反馈--不喜欢
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',

  data: {
    target: artId
  }

})

// 文章-反馈-反馈垃圾内容
export const reportArticleAPI = ({ artId, type }) => request(
  {
    url: '/v1_0/article/reports',
    method: 'POST',

    data: {
      target: artId,
      type: type,
      remark: '如果你想写，你可以逻辑页面判断下，如果点击类型是0，再给一个弹出框输入其他问题，传参到这里'
    }
  }
)

// 文章的详情
export const detailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`
})

// 文章点赞和取消点赞
export const likeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章-评论列表
export const commentsListAPI = ({ id, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    // axios只针对params参数，如果发现键值对的值为空，会忽略此参数名和值不携带在url?后面
    type: 'a', // 什么时候需要外面传，此值会发生变换
    source: id,
    offset,
    limit
  }
})

// 评论 - 喜欢
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}
// 评论-取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}

export const unlikeArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 文章-评论-发布评论
export const commentSendAPI = ({ id, content, art_id = null }) => {
  // axios中data请求体传参，如果值为null，是不会忽略这个参数的，
  // 也会把参数名和值携带给后台，（只有params遇到null才会忽略）
  // 形参art_id可选参数，如果逻辑页面是对文章评论，则不需要传递art_id所以这时，内部art_id值为null就为null就证明此次调用，是针对文章的评论
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 搜索的联想菜单列表接口
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})
// 搜索的结果
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})
