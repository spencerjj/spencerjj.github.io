import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var QRCode = require('../../utils/code.js')
var oricode = require('../../utils/qrcode.js')
import {barcode} from '../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data
      })
    }).then()
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
  toPage(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  confirm(e){
    Dialog.confirm({
      title: '提示',
      message: `确认兑换吗？`,
    })
    .then(() => {
      wx.navigateTo({
        url: 'pointInfo',
      })
    }).catch(() => {
      // on cancel
    });
  },
  use(e){
      var that = this;
      that.createQrCode('1231231','canvas',230,230)
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        nowNum:123123
      })
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          show: true
        })
        setTimeout(()=>{
          this.setData({
            show1:true,
          })
        },50)
        setTimeout(()=>{
          this.setData({
            show2:true
          })
        },300)
      }, 300)
  },
  createQrCode: function (content, canvasId, cavW, cavH) {
    QRCode.api.draw(content, canvasId, cavW, cavH);
  },
  onClose() {
    this.setData({
      show1: false,
      show2:false
    })
    setTimeout(()=>{
      this.setData({
        show:false
      })
    },300)
  },

})