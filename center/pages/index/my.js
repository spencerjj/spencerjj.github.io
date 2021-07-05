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
    backLists: ['http://tiebapic.baidu.com/forum/w%3D580/sign=fe074a27dc25bc312b5d01906edd8de7/78d1a8ec8a136327b1225ddad48fa0ec09fac71f.jpg', 'http://tiebapic.baidu.com/forum/w%3D580/sign=e8db872ca5fe9925cb0c695804aa5ee4/3e2210dfa9ec8a13b1d5c809b203918fa1ecc01f.jpg', 'http://tiebapic.baidu.com/forum/w%3D580/sign=5638be1fa5dcd100cd9cf829428a47be/4c23d52a2834349b6ec47a9794ea15ce37d3bef4.jpg', 'http://tiebapic.baidu.com/forum/w%3D580/sign=fc27ba94683e6709be0045f70bc69fb8/82f61b4c510fd9f98c8b13da322dd42a2934a4f7.jpg'],
    backUrl: 'http://tiebapic.baidu.com/forum/w%3D580/sign=fe074a27dc25bc312b5d01906edd8de7/78d1a8ec8a136327b1225ddad48fa0ec09fac71f.jpg'
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

  onShareAppMessage: function(res) {

  },
  onShareTimeline: function () {
		return {
	      title: '',
	      query: {
	        key: value
	      },
	      imageUrl: ''
	    }
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
              that.register()
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
  register() {
    var that = this;
    var data = {
      phone: that.data.phoneNo,
      sex: wx.getStorageSync('weInfo').gender ? '先生' : '女士',
      store: store,
      name: wx.getStorageSync('weInfo').nickName || '购物中心会员',
      openid: wx.getStorageSync('user').openid || '99999',
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/LPMemberRegister', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
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
    new oricode('canvas', that.data.userInfo.parameter3, 250, 250);
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        show: true
      })
      setTimeout(() => {
        this.setData({
          show1: true,
        })
      }, 50)
      setTimeout(() => {
        this.setData({
          show2: true
        })
      }, 300)
    }, 300)
  },
  onClose() {
    this.setData({
      show1: false,
      show2: false
    })
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 300)
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