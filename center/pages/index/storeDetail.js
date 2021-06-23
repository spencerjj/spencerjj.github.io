// pages/index/storeDetail.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {store,storeId,HOST_URI} from '../../config.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeDetail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.storeDetail)
    let storeDetail = app.globalData.storeDetail
    wx.setNavigationBarTitle({
      title: storeDetail.shopName,
    })
    this.setData({
      storeDetail
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
  call(e){
    wx.makePhoneCall({
      phoneNumber: this.data.storeDetail.shopPhone,
    })
  },
  enter(e){
    console.log(this.data.storeDetail.shopLink)
    wx.navigateToMiniProgram({ appId: 'wxf02c836c64be8566', path: this.data.storeDetail.shopLink, success(res) {  } })
  }
})