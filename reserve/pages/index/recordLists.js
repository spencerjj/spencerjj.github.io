// pages/index/recordLists.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import format from '../../utils/time.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    ScreenBrightness:0.5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获得屏幕亮度
    wx.getScreenBrightness({
      success: function (res) {
        console.log(res.value)
        that.setData({
          ScreenBrightness: res.value
        })
      }
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
  onClose(){
    this.setData({
      show:false
    })
    wx.setScreenBrightness({
      value: this.data.ScreenBrightness,
    })
  },
  use(){
    this.setData({
      show:true
    })
    //设置屏幕亮度
    wx.setScreenBrightness({
      value: 1
    })
  },
  cancel(e){
    Dialog.confirm({
      title: '取消预约',
      message: '确认取消本次预约吗？',
    })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  }
})