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
  onHide(e){

  },
  globalData: {
    userInfo: null,
    url: 'http://192.168.2.81:8980/'
  },
  login: function (code) {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  doMessage(e){
    wx.requestSubscribeMessage({
      tmplIds: ['-RCILlm7nALXM6jxiYNiZuTbf6D5LBCwYPB-K6qDNn4'],
      success(res) {
        console.log('订阅成功')
      }
    })
  },
  doLogin(e) {
    console.log('登录')
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          var code = res.code //返回code
          var data = {
            code: code,
            ajax: '_json'
          }
          getRequest(getApiHost(), 'platform/v1/api/wxmini/code2session.json', 'body', data, 0, false, false).then(
            res => {
              // that.setData({
              //   openid:res.data.openid,
              //   sessionKey:res.data.sessionKey
              // })
              var data = {
                openid: res.data.openid,
                __ajax: 'json'
              }
              getRequest(getApiHost(), 'platform/v1/api/wxmini/checkOpenid', 'body', data, 0, false, false).then(
                res => {
                  console.log('openid'+res.result)
                  if(res.result=='false'){
                    wx.redirectTo({
                      url: '/pages/login/regist',
                    })
                    return;
                  }
                  var phoneNo = res.data.mobile
                  
                  var data = {
                    loginCode:phoneNo,
                    param_deviceType:'mobileApp',
                    ajax: '_json',
                  }
                  wx.showLoading({
                    title: '自动登录中',
                  })
                  wx.request({
                    url: HOST_URI+ 'platform/v1/api/wxmini/miniLogin.json',
                    data: data,
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                      console.log(res)
                      wx.hideLoading()
                        if (res.data.result=='false') {
                          wx.showModal({
                            title: '登录失败',
                            content: '服务器错误，请联系管理员',
                            showCancel: false,
                            confirmText: '知道了',
                            confirmColor: '#1890FF'
                          })
                          reject()
                          return;
                        }

                          var userInfo = {};
                          userInfo.companyName = res.data.companyName;
                          userInfo.officeName = res.data.officeName;
                          userInfo.username = res.data.username;
                          userInfo.sid = res.data.sid;
                          userInfo.loginCode = res.data.loginCode;
                          userInfo.roleCodes = res.data.roleCodes;
                          userInfo.officeCode = res.data.officeCode;
                          userInfo.companyCode = res.data.companyCode;
                          wx.setStorageSync('userInfo', userInfo);
                          resolve(res.data.sid)
                    }
                  })
                }
              ).catch(res => {
                wx.redirectTo({
                  url: '/pages/login/regist',
                })
              });
            }
          ).catch(res => {
            wx.showModal({
              title: '登录失败',
              content: '没有访问权限，请联系管理员',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#1890FF'
            })
          });

          // wx.request({
          //   url: HOST_URI + 'platform/v1/api/wxmini/code2session.json',
          //   data: {
          //     code: code,
          //     __ajax: 'json'
          //   },
          //   async: true,
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: function (res) {
          //     console.log(res)
          //     that.globalData.statusCode = res.statusCode
          //     if (res.statusCode == 200) {
          //       if(res.data.data.result=='false'){
          //         wx.showModal({
          //           title: '登录失败',
          //           content: res.data.data.message,
          //           showCancel: false,
          //           confirmText: '知道了',
          //           confirmColor: '#1890FF'
          //         })
          //         return;
          //       }
          //       var userInfo = {};
          //   userInfo.companyName = res.data.companyName;
          //   userInfo.officeName = res.data.officeName;
          //   userInfo.username = res.data.username;
          //   userInfo.sid = res.data.sid;
          //   userInfo.loginCode = res.data.loginCode;
          //   wx.removeStorageSync('userInfo');
          //   wx.setStorageSync('userInfo', userInfo);
          //       resolve(res.data.data.__sid)
          //     } else {
          //       wx.showModal({
          //         title: '登录失败',
          //         content: '请联系管理员!',
          //         showCancel: false,
          //         confirmText: '知道了',
          //         confirmColor: '#1890FF'
          //       })
          //       wx.removeStorageSync('userDetails');
          //       wx.removeStorageSync('lbuser');
          //       reject('error')
          //     }
          //   }
          // })
        }
      })
    })

  }
})