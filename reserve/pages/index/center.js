// pages/index/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperH: '', //swiper高度
    nowIdx: 0, //当前swiper索引
    imgList: [ //图片列表
      "/images/banner.png",
      "/images/banner.png",
      "/images/banner.png",
    ],
    current:0,
    isShow:false
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
  infoChange(e) {
    this.setData({
      nowIdx: e.detail.current,
      current:e.detail.current,
    })
  },
  toitem(e){
    this.setData({
      nowIdx: e.currentTarget.dataset.index,
      current:e.currentTarget.dataset.index,
    })
  },
  show(){
    this.setData({
      isShow:true
    })
  }
})