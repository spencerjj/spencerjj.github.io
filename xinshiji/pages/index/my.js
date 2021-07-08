// pages/index/card.js
import {
  getApiHost,
  getRequest
} from '../../utils/api.js'
import {
  store,
} from '../../config.js'
import {
  doLogin
} from '../../utils/login.js'
var app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
var oricode = require('../../utils/qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    orderLists: [],
    show: false,
    nowNum: '',
    userInfo: '',
    avatarUrl: '',
    cardNum: 0,
    backLists: ['http://tiebapic.baidu.com/forum/w%3D580/sign=d571df3014540923aa696376a259d1dc/c9e209fa513d2697012e294e08fbb2fb4316d836.jpg', 'http://tiebapic.baidu.com/forum/w%3D580/sign=b8d5a9721bdf8db1bc2e7c6c3921dddb/0bdef603918fa0ecec4fcce7639759ee3c6ddb5b.jpg', 'http://tiebapic.baidu.com/forum/w%3D580/sign=e396408e134e9258a63486e6ac80d1d1/4f9958ee3d6d55fb584edecc28224f4a21a4dd5b.jpg', 'http://tiebapic.baidu.com/forum/w%3D580/sign=6a0456c90c540923aa696376a25ad1dc/c9e209fa513d2697be5ba0b710fbb2fb4216d85b.jpg'],
    backUrl: 'http://tiebapic.baidu.com/forum/w%3D580/sign=d571df3014540923aa696376a259d1dc/c9e209fa513d2697012e294e08fbb2fb4316d836.jpg'
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
    var cardNum = wx.getStorageSync('cardNum') || 0
    let url = ''
    if (userInfo.tier == '金星卡会员') {
      url = that.data.backLists[1]
    } else if (userInfo.tier == '黑星卡会员') {
      url = that.data.backLists[2]
    } else if (userInfo.tier == '黑钻卡会员') {
      url = that.data.backLists[3]
    } else {
      url = that.data.backLists[0]
    }
    that.setData({
      cardNum: userInfo ? cardNum : '',
      userInfo: userInfo || '',
      backUrl: url
    })
    if (!user) {
      app.doLogin().then(res => {})
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
  login(e) {
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
          store: 601,
          sessionKey: myData.sessionKey,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          ajax: '_json',
        }
        getRequest(getApiHost(), 'customer/bh/api/wx/getPhoneNumber', 'body', data, 0, false, false).then(
          res => {
            if (res.result == 'true') {
              that.setData({
                phoneNo: res.data
              })
              wx.setStorageSync('loginphone', res.data)
              doLogin(that.data.phoneNo).then((res) => {
                let url = ''
                if (res.tier == '金星卡会员') {
                  url = that.data.backLists[1]
                } else if (res.tier == '黑星卡会员') {
                  url = that.data.backLists[2]
                } else if (res.tier == '黑钻卡会员') {
                  url = that.data.backLists[3]
                } else {
                  url = that.data.backLists[0]
                }
                that.setData({
                  userInfo: res,
                  backUrl: url
                })
              })
            } else {
              Toast({
                message: '授权失败，请重新授权登录',
                type: 'warning'
              });
            }
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
  use() {
    wx.navigateTo({
      url: 'myCode',
    })
  },
  toPage(e) {
    if (e.currentTarget.dataset.url == 'borrow') {
      wx.navigateTo({
        url: e.currentTarget.dataset.url + '?active=1'
      })
    } else if (e.currentTarget.dataset.url == 'borrow1') {
      wx.navigateTo({
        url: 'borrow'
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }

  },
  getUser(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
  },
  toLogin(e) {
    wx.switchTab({
      url: 'index',
    })
  },
  quit(e) {
    var that = this
    Dialog.confirm({
        title: '提示',
        message: `确认要退出当前账号吗？`,
      })
      .then(() => {
        wx.clearStorageSync()
        that.onShow()
      }).catch()
  }
})