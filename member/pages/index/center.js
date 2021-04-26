// pages/index/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [ //图片列表
      "/images/cut/c1.png",
      "/images/cut/c2.png",
      "/images/cut/c3.png",
      "/images/cut/c4.png",
      "/images/cut/c5.png"
    ],
    current:0,
    isShow:false,
    swiperH:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange(e){
    console.log(e.detail.index)
    this.setData({
      current:e.detail.index
    })
  },
  toPage(){
    wx.navigateTo({
      url: 'detail',
    })
  },
    //获取swiper高度
    getHeight(e) {
      var winWid = wx.getSystemInfoSync().windowWidth - 2 * 50; //获取当前屏幕的宽度
      var imgh = e.detail.height; //图片高度
      var imgw = e.detail.width;
      var sH = winWid * imgh / imgw + "px"
      this.setData({
        swiperH: sH //设置高度
      })
    },
    //swiper滑动事件
    swiperChange(e) {
      this.setData({
        nowIdx: e.detail.current,
        current:e.detail.current,
      })
    },
})