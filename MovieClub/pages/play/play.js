Page({
  data:{
    VideoUrl:''
  },
  onLoad: function (options) {
    this.setData({
      PlayData: JSON.parse(options.playdata),
      VideoUrl: JSON.parse(options.playdata).MoviePlayUrls[0].PlayUrl
    })
  },
  chooseVideo: function (event) {
    console.log(this.data)
    var VideoUrl = event.currentTarget.dataset.videoUrl
    console.log(VideoUrl)
    this.setData({
      VideoUrl: VideoUrl
    })
  }
})