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
import {doLogin} from '../../utils/login.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var oricode = require('../../utils/qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    orderLists:[],
    show:false,
    nowNum:'',
    userInfo:'',
    avatarUrl:'',
    cardNum:0
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
    var that = this;
    var user = wx.getStorageSync('user')
    var userInfo = wx.getStorageSync('userInfo')
    that.setData({
      cardNum:wx.getStorageSync('cardNum')||0,
      userInfo:userInfo||''
    })
    if (!user) {
      app.doLogin().then(res=>{
      })
    }
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
    doLogin(wx.getStorageSync('userInfo').phone)
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
  login(e){
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  getPhone(e) {
    console.log(e)
    var that = this;
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      Toast({
        message: '授权失败，请重新授权登录',
        type: 'warning'
      });
    } else {
      app.doLogin().then(myData => {
        console.log(myData)
        var data = {
          openid: myData.openid,
          store:601,
          sessionKey: myData.sessionKey,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          ajax: '_json',
        }
        getRequest(getApiHost(), 'customer/bh/api/wx/getPhoneNumber', 'body', data, 0, false, false).then(
          res => {
            that.setData({
              phoneNo: res.data
            })
            wx.setStorageSync('loginphone', res.data)
            that.register()
          }
        ).catch(res => {
          Toast({
            message: '系统错误，登录失败',
            type: 'warning'
          });
        });
      })
    }
  },
  register() {
    var that = this;
    var data = {
      phone: that.data.phoneNo,
      sex:wx.getStorageSync('weInfo').gender?'先生':'女士',
      store: store,
      name: wx.getStorageSync('weInfo').nickName||'会员',
      openid: wx.getStorageSync('user').openid || '99999',
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/LPMemberRegister', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        doLogin(that.data.phoneNo).then((res)=>{
          that.setData({
            userInfo:res
          })
        })
      }
    ).catch(res => {
      wx.showModal({
        title: '系统错误，登录失败',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  },
  use() {
    var that = this;
    new oricode('canvas', that.data.userInfo.memNum,250,250);
    wx.showLoading({
      title: '加载中',
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
  toPage(e){
    if(e.currentTarget.dataset.url=='borrow'){
      wx.navigateTo({
        url: e.currentTarget.dataset.url+'?active=1'
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
    
  },
  getUser(e){
    this.setData({
      avatarUrl:e.detail.avatarUrl
    })
  },
  toLogin(e){
    wx.switchTab({
      url: 'index',
    })
  }
})