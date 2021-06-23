// pages/my/DISC/index.js
var app = getApp();
const {
  $Toast
} = require('../../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    loadAll: true,
    detail: [],
    signInCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(decodeURIComponent(options.scene)){
      let temp = decodeURIComponent(options.scene)
      let array = temp.split(',')
      this.setData({
        id: array[0],
        signInCode:array[1]
      })
    }else{
      $Toast({
        content: '培训不存在',
        type: "error"
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../my',
        })
      },2000)
    }
    
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
    var that = this;
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
    })
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
      url: app.globalData.url + '/train/trainBase/signIn',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        trainId: that.data.id,
        empCode:that.data.userDetails.userId,
        empName:that.data.userDetails.userName,
        signInCode:that.data.signInCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
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
            setTimeout(()=>{
              wx.switchTab({
                url: '../my',
              })
            },2000)
            return;
          } else {
            wx.redirectTo({
              url: 'success?notice=签到成功',
            })
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