// pages/index/progress/success.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexmark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.indexmark){
      this.setData({
        indexmark:options.indexmark
      })
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
    wx.hideHomeButton()
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code //返回code
        var data = {
          code: code,
          ajax: '_json'
        }
        getRequest(getApiHost(), 'platform/v1/api/wxmini/code2session', 'body', data, 0, false, false,false).then(
          res => {
            that.setData({
              openid:res.data.openid,
              sessionKey:res.data.sessionKey
            })
            var data = {
              openid: res.data.openid,
              __ajax: 'json'
            }
            getRequest(getApiHost(), 'platform/v1/api/wxmini/checkOpenid', 'body', data, 0, false, false,false).then(
              res => {
                console.log(res.data.status)
                if(res.data.status==0){
                  wx.redirectTo({
                    url: '../index/finList',
                  })
                }
              }
            ).catch(res => {
              console.log(res)
              if(res.data.status==0){
                wx.redirectTo({
                  url: '../index/finList',
                })
              }
            });
          }
        )
      }
    })
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
  toPage(){
      wx.redirectTo({
        url: '../login/login',
      })
  }
})