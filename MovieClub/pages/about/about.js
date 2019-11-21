const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    favorite_ellipsis: false, // 文字是否收起，默认收起
    history_ellipsis: false,
    favorite_display: 'display:none',
    history_display: 'display:none',
    favorite: wx.getStorageSync('favorite') || [],
    history: wx.getStorageSync('history') || [],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.openHistoryPlay()
    this.openFavorite()
    
  },
  openHistoryPlay: function () {
    this.setData({
      history: wx.getStorageSync('history') || [], //若无储存则为空
    })
  },

  openFavorite: function () {
    this.setData({
      favorite: wx.getStorageSync('favorite') || [], //若无储存则为空
    })
  },

onShow:function(){
  var that = this
  that.setData({
    history: wx.getStorageSync('history') || [],//若无储存则为空
    favorite: wx.getStorageSync('favorite') || [],//若无储存则为空
  })
},

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 收起/展开按钮点击事件
   */
  favorite_ellipsis: function () {
    var value = !this.data.favorite_ellipsis;
    if (value) {
      this.setData({
        favorite_ellipsis: value,
        favorite_display: 'display:block'
      })
    } else {
      this.setData({
        favorite_ellipsis: value,
        favorite_display: 'display:none'
      })
    }
  },
  history_ellipsis: function () {
    var value = !this.data.history_ellipsis;
    if (value) {
      this.setData({
        history_ellipsis: value,
        history_display: 'display:block'
      })
    } else {
      this.setData({
        history_ellipsis: value,
        history_display: 'display:none'
      })
    }
  },
  aboutToDetailOrDelete: function (event) {
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    var state = event.currentTarget.dataset.state
    let that = this;
    var favorite = this.data.favorite
    var history = this.data.history
    //触摸时间距离页面打开的毫秒数
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    if (touchTime > 500){
      if (state.toString() =='history'){
        wx.showModal({
          title: '提示',
          content: '是否全部删除',
          success: function (res) {
            wx.removeStorage({
              key: 'history',
              success: function(res) {
                that.onLoad()
              },
            })
            // wx.getStorage({
            //   key: 'history',
            //   success: function (res) {
            //     history = res.data
            //     var newhistorylist = []
            //     console.log(history)
            //     for (let i = 0; i < history.length; i++){
            //       if (name.toString() != history[i].value.toString()){
            //         newhistorylist.push({
            //           value: history[i].value,
            //           id: history[i].id
            //         })
            //       }
            //     }
            //     wx.setStorageSync('history', newhistorylist)
            //     that.onLoad()
            //   }
            // })
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '是否删除',
          success: function (res) {
            wx.getStorage({
              key: 'favorite',
              success: function (res) {
                favorite = res.data
                var newfavoritelist = []
                console.log(favorite)
                for (let i = 0; i < favorite.length; i++) {
                  if (name.toString() != favorite[i].value.toString()) {
                    newfavoritelist.push({
                      value: favorite[i].value,
                      id: favorite[i].id
                    })
                  }
                }
                wx.setStorageSync('favorite', newfavoritelist)
                that.onLoad()
              }
            })
          }
        })
      }
      
    }else{
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + id + '&name=' + name,
      })
    }
  },
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
  },
  //按下事件结束
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
  },
})
