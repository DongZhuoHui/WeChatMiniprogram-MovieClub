Page({
  onLoad: function () {
    var that = this
    
    wx.request({
      url: 'http://api.skyrj.com/api/Movies?skyMovieMenu=dyList',
      method: 'GET',
      header: {
        "content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            movie: res.data
          })
          wx.hideNavigationBarLoading()
        }
      }
    })
  },
  movieToDetail: function (event) {
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    console.log('movieToDetail:' + id)
    console.log('movieToDetail:' + name)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id + '&name=' + name,
    })
  },
  SearchInput: function (e) {
    this.setData({
      SearchData: e.detail.value
    })
  },
  SearchClear: function (e) {
    this.setData({
      SearchData: ''
    })
  },
  movieToSearch: function (event) {
    var SearchData = event.currentTarget.dataset.searchData
    console.log(SearchData)
    wx.navigateTo({
      url: '/pages/search/search?searchData=' + SearchData,
    })
  },
  SearchConfirm: function (event) {
    var SearchData = event.currentTarget.dataset.searchData
    console.log(SearchData)
    wx.navigateTo({
      url: '/pages/search/search?searchData=' + SearchData,
    })
  }
})