const { $Toast } = require('../../../component/iview/base/index');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     let userDetails = wx.getStorageSync('userDetails')
     that.setData({
       userDetails: userDetails,
     })
     wx.showNavigationBarLoading()
  },
  toPage(e){
    wx.navigateTo({
      url: 'report',
    })
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
    this.getInfo()
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
  login(e) {
    app.doLogin().then(data => {
      this.onShow()
      this.setData({
        loadAll: true
      })
    })
  },
  getInfo(e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'lampo/disc/mDisc',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        empCode: that.data.userDetails.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.result == 'false') {
            $Toast({
              content: res.data.message,
              type: 'error'
            })
            return;
          }
          console.log(res)
          if(res.data){
            wx.removeStorageSync('result')
            wx.setStorageSync('result',res.data)
            setTimeout(()=>{
              wx.redirectTo({
                url: 'report',
              })
            },2000)
          }
        } else {
          $Toast({
            content: res.data.message,
            type: 'warning'
          })
        }
      }
    })
  },
})