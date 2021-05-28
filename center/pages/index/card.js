// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {
  store,
  storeId
} from '../../config.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var QRCode = require('../../utils/code.js')
var oricode = require('../../utils/qrcode.js')
import {
  barcode
} from '../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    cards: [],
    show: false,
    nowNum: '',
    userInfo: '',
    vStatus: '可用,待激活',
    cardName: '',
    array1:[],
    array2:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data) => {
      that.setData({
        userInfo: data
      })
      that.getInfo()
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
    this.onLoad()
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
  getInfo(e) {
    var that = this;
    var userInfo = that.data.userInfo
    var data = {
      phone: userInfo.phone,
      membership: '会员',
      store: store,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/memberVoucherQuery', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 'SEL_000') {
          let lists = res.vouchermessage
          let array1 = []
          let array2 = []
          lists.map((item)=>{
            if(item.status=='可用'||item.status=='待激活'){
              array1.push(item)
            }else{
              array2.push(item)
            }
          })
          that.setData({
            array1,
            array2
          })
          if (that.data.vStatus == '可用,待激活') {
            wx.removeStorageSync('cardNum')
            wx.setStorageSync('cardNum', array1.length)
          }
        } else {
          that.setData({
            cards: []
          })
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg,
        type: 'warning'
      });
    });
  },
  onChange(e) {
    this.setData({
      current: e.detail.index,
    })
  },
  onClose() {
    this.setData({
      show: false
    })
    this.onLoad()
  },
  recommend(e) {
    wx.navigateTo({
      url: 'recommend?no=' + e.currentTarget.dataset.no,
    })
  },
  showCode(e) {
    console.log(e.detail)
    var that = this;
    that.createQrCode(e.detail.no, 'canvas', 230, 230)
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      nowNum: e.detail.no,
      cardName: e.detail.name
    })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        show: true
      })
    }, 300)
  },
  createQrCode: function (content, canvasId, cavW, cavH) {
    QRCode.api.draw(content, canvasId, cavW, cavH);
  }
})