//app.js
const config = require('config.js');
const HOST_URI = config.HOST_URI;
import {
  getApiHost,
  postRequest,
  getRequest
} from 'utils/api.js'
import { reject } from './libs/underscore';
import { resolve } from './libs/es6-promise.min';
App({
    onLaunch: function () {
      // 展示本地存储能力
      var logs = wx.getStorageSync('logs') || []
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
        userInfo: null,
        url: HOST_URI,
        userMenus:'',
        changeShow:false
    },
    doLogin(e) {
      console.log('登录')
      var that = this;
      return new Promise((resolve, reject) => {
        wx.qy.login({
          success: function (res) {
            var code = res.code //返回code
            wx.setStorageSync('code', code)
            console.log(code)
            wx.request({
              url: that.globalData.url + 'platform/v1/api/cp/qywxLogin',
              data: {
                code: code,
                param_deviceType: 'mobileApp',
                __ajax: 'json'
              },
              async: true,
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                  if(res.data.result=='false'){
                    wx.showModal({
                      title: '登录失败',
                      content: res.data.message,
                      showCancel: false,
                      confirmText: '知道了',
                      confirmColor: '#1890FF'
                    })
                    return;
                  }
                  var chartsUser = {};
                //   chartsUser.companyName = res.data.companyName;
                //   chartsUser.companyCode = res.data.companyCode;
                  chartsUser.userName = res.data.userName;
                  chartsUser.userCode = res.data.userCode;
                  chartsUser.loginCode = res.data.loginCode;
                  chartsUser.officeName = res.data.officeName;
                  chartsUser.userMenus = res.data.menus;
                  that.globalData.userMenus = res.data.menus
                //   chartsUser.officeCode = res.data.officeCode;
                  chartsUser.sid = res.data.sid;
                  wx.removeStorageSync('chartsUser');
                  wx.setStorageSync('chartsUser', chartsUser);
                  console.log(wx.getStorageSync('chartsUser'))
                  resolve(res.data.sid)
                } else {
                  wx.showModal({
                    title: '登录失败',
                    content: '请联系管理员!',
                    showCancel: false,
                    confirmText: '知道了',
                    confirmColor: '#1890FF'
                  })
                  wx.removeStorageSync('chartsUser');
                  reject('error')
                }
              }
            })
          }
        })
      })
  
    }
  })