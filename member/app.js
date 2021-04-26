//app.js
const config = require('config.js');
const HOST_URI = config.HOST_URI;
import {
  getApiHost,
  postRequest,
  getRequest
} from 'utils/api.js'
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    appid: 'wx6fbd93cb284eee7c',
    secret: '017a7a23c36490c594857502c7b68b4a'
  },
  doLogin: function () {
    console.log('登录')
    var that = this
    return new Promise((resolve, reject) => {
      var user = wx.getStorageSync('user') || {};
      var userInfo = wx.getStorageSync('userInfo') || {};
      // if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))) {
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.getUserProfile({
                success: function (res) {
                  console.log(res)
                  var userInfo = {};
                  userInfo.avatarUrl = res.userInfo.avatarUrl;
                  userInfo.nickName = res.userInfo.nickName;
                  userInfo.gender = res.userInfo.gender==2?'女士':'先生';
                  wx.setStorageSync('userInfo', userInfo);
                }
              });
              var data = {
                code: res.code,
                ajax: '_json'
              }
              getRequest(getApiHost(), 'platform/v1/api/lampocrm/code2session', 'body', data, 0, false, false).then(
                res => {
                  console.log(res)
                  var user = {}
                  user.openid = res.data.openid
                  user.sessionKey = res.data.sessionKey
                  wx.setStorageSync('user', user);
                  resolve(user)
                })
            }
          }
        })
      // }
    })
  }

})