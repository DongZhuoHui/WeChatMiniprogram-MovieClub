var module = require('../../utils/md5.js');
Page({
  data: {
    history: wx.getStorageSync('history') || [],
    favorite: wx.getStorageSync('favorite') || []
  },
  onLoad: function(options) {
    this.setData({
      ID: options.id,
      Name: options.name
    })
    var that = this

    wx.request({
      url: 'http://api.skyrj.com/api/movie?id=' + that.data.ID,

      header: {
        "content-Type": "application/x-www-form-urlencoded"
      },

      success: function(res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            movie: res.data
          })
          wx.setNavigationBarTitle({
            title: res.data.Name,
          })
          wx.hideNavigationBarLoading()
        }

      }
    })
    wx.showNavigationBarLoading()

    var that = this
    var authentication = getToken()
    console.log(authentication)

    function getToken() {
      var key = "72c49feb4df5483388980fc4a4f83506"
      var timestamp = ((Date.parse(new Date())) / 1000).toString()
      var openToken = module.md5(key + "parse_api" + timestamp.toString())
      return {
        "openToken": openToken,
        "timestamp": timestamp,
        "key": key
      }
    }

    console.log('Detail download msg:' + that.data.ID)
    console.log('Detail download msg:' + that.data.Name)
    wx.request({
      url: 'https://api.wxkdy666.com/KdyApi/ApiDownload/Index',
      method: 'POST',
      data: {
        "KeyWord": that.data.Name,
        "Page": 1,
        "EngineId": 55,
        "SearchType": 0,
        "PageSize": 20,
        "ObjectId": 1
      },

      header: {
        "content-Type": "application/x-www-form-urlencoded",
        "OpenToken": authentication.openToken,
        "Timestamp": authentication.timestamp,
        "Key": authentication.key
      },

      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.Code == 200) {
            that.setData({
              moviedownload: res.data
            })
          } else {
            that.setData({
              moviedownload: ''
            })
          }
          console.log(res)
          wx.hideNavigationBarLoading()
        }
      }
    })
  },

  onShow: function(options) {
    this.animation = wx.createAnimation({
        delay: 500,
        duration: 1000,
        timingFunction: 'ease',
        transformOrigin: 'left top 0',
      }),

      this.animation.translateY(-100).step()
    this.setData({
      //输出动画
      animation: this.animation.export()
    })
    this.openHistoryPlay()
    this.openFavorite()
  },

  openHistoryPlay: function() {
    this.setData({
      history: wx.getStorageSync('history') || [], //若无储存则为空
    })
  },

  openFavorite: function() {
    this.setData({
      favorite: wx.getStorageSync('favorite') || [], //若无储存则为空
    })
  },

  movieToPlay: function(event) {
    var that = this
    var playdata = event.currentTarget.dataset.playData
    var history = this.data.history

    //将搜索值放入历史记录中,只能放前20条
    if (history.length < 20) {
      history.unshift({
        value: playdata.Name,
        id: playdata.ID
      })
    } else {
      history.pop() //删掉旧的时间最早的第一条
      history.unshift({
        value: playdata.Name,
        id: playdata.ID
      })
    }
    //将历史记录数组整体储存到缓存中
    wx.setStorageSync('history', history)

    wx.navigateTo({
      url: '/pages/play/play?playdata=' + JSON.stringify(playdata),
    })
  },
  toDownload: function(event) {
    console.log(this.data.moviedownload)
    if (this.data.moviedownload == '') {
      wx.showModal({
        title: '提示',
        content: '啥资源都没找到给你',
        success: function(res) {
          if (res.confirm) {
            console.log('确定')
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })

    } else {
      wx.setClipboardData({
        data: this.data.moviedownload.ResultData[0].Results[0],
        success: function(res) {
          wx.showModal({
            title: '提示',
            content: '复制成功，打开自己的浏览器来下载吧',
            success: function(res) {
              if (res.confirm) {
                console.log('确定')
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })
        }
      });
    }
  },
  toFavorite: function(event) {
    var playdata = event.currentTarget.dataset.playData
    var favorite = this.data.favorite
    var exited = false
    if (favorite != false) {
      console.log("数组里有东西，开始判断数据里元素是否重复")
      for (let i = 0; i < favorite.length; i++) {
        console.log(favorite[i].value)
        if (playdata.Name.toString() == favorite[i].value.toString()) {
          wx.showToast({
            title: '收藏夹里有啦',
            mask: true,
            duration: 2000,
            icon: 'none'
          })
          exited = true//收藏夹里有，赋值true
          console.log("数据里元素重复了")
          break
        }
        console.log("数据里元素没有重复")
      }
      if (!exited) {
        console.log(favorite)
        favorite.push({
          value: playdata.Name,
          id: playdata.ID
        })
        wx.setStorageSync('favorite', favorite)
        console.log(favorite)

        wx.showToast({
          title: '收藏成功',
          mask: true,
          duration: 2000,
          icon: 'success'
        })
      }
    }else{
      favorite.push({
        value: playdata.Name,
        id: playdata.ID
      })
      wx.setStorageSync('favorite', favorite)

      wx.showToast({
        title: '收藏成功',
        mask: true,
        duration: 2000,
        icon: 'success'
      })
    }
    

    wx.showNavigationBarLoading()

  },

  onShareAppMessage:function(){
    return{
      title: '我在看《' + this.data.Name + '》'
    }
  }
})