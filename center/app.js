//app.js
const config = require('config.js');
const HOST_URI = config.HOST_URI;
import {
  getApiHost,
  postRequest,
  getRequest
} from 'utils/api.js'

import Toast from 'miniprogram_npm/@vant/weapp/toast/toast';
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
  },
  globalData: {
    fileLists:[],
    noteDetail:[],
    pointCard:[]
  },
  ifUser() {
    return new Promise((resolve, reject) => {
      var userInfo = wx.getStorageSync('userInfo') || ''
      if (userInfo) {
        resolve(userInfo)
      } else {
        Toast({
          message: '登录失效，请重新授权登录',
          type: 'warning'
        });
        setTimeout(() => {
          wx.switchTab({
            url: 'my'
          })
        }, 2000)
        reject('登录失效')
      }
    })
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
            var data = {
              code: res.code,
              store: 601,
              ajax: '_json'
            }
            getRequest(getApiHost(), 'customer/bh/api/wx/code2session', 'body', data, 0, false, false,false).then(
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