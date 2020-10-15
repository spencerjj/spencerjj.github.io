//app.js
const config = require('config.js');
const HOST_URI = config.HOST_URI;
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
    currentTeacher: {
      pkTeacher: 123,
    },
    statusCode: 0,
    __sid: '',
    tempSid:'',
    userInfo: null,
    url: HOST_URI
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
          wx.showLoading({
            title: '自动登录中',
          })
          wx.request({
            url: that.globalData.url + 'wx/cp/qywxLogin.json',
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
              wx.hideLoading({
              })
              that.globalData.statusCode = res.statusCode
              if (res.statusCode == 200) {
                if(res.data.data.result=='false'){
                  wx.showModal({
                    title: '登录失败',
                    content: res.data.data.message,
                    showCancel: false,
                    confirmText: '知道了',
                    confirmColor: '#1890FF'
                  })
                  return;
                }
                var userDetails = {};
                userDetails.mobile = res.data.data.mobile;
                userDetails.userName = res.data.data.userName;
                userDetails.office = res.data.data.officeName;
                userDetails.__sid = res.data.data.__sid;
                wx.removeStorageSync('userDetails');
                wx.setStorageSync('userDetails', userDetails);
                that.globalData.__sid = res.data.data.__sid;
                resolve(res.data.data.__sid)
              } else {
                wx.showModal({
                  title: '登录失败',
                  content: '请联系管理员!',
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#1890FF'
                })
                wx.removeStorageSync('userDetails');
                wx.removeStorageSync('lbuser');
                reject('error')
              }
            }
          })
        }
      })
    })

  }
})