Page({
  onLoad: function (options) {
    console.log(options.searchData)
    this.setData({
      Name: options.searchData
    })
    var that = this

    wx.request({
      url: 'http://api.skyrj.com/api/movies?searchKey=' + that.data.Name,
      method: 'GET',
      header: {
        "content-Type": "application/x-www-form-urlencoded",
      },

      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            movie: res.data
          })
          wx.setNavigationBarTitle({
            title: that.data.Name + '-搜索结果',
          })
          wx.hideNavigationBarLoading()
          if (res.data.length==0){
            wx.showToast({
              title:'没有资源喔,重新输入一下吧',
              mask:true,
              duration:2000,
              icon:'none'
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        }
      }
    })

    wx.showNavigationBarLoading()
  },

  movieToDetail: function (event) {
    var ObjectId = event.currentTarget.dataset.objectId
    var name = event.currentTarget.dataset.name
    console.log(ObjectId)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + ObjectId + '&name=' + name,
    })
  },
})