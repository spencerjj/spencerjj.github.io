//app.js
const config = require('config.js');
const HOST_URI = config.HOST_URI;
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
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
      wx.showModal({
        title: '已经有新版本了',
        content: '新版本已经上线了，请您删除当前小程序，重新搜索打开',
      })
    })
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
            url: that.globalData.url + 'api/cp/qywxLogin',
            data: {
              code: code,
              param_deviceType: 'mobileApp',
              param_userType:'merchant',
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
                var userDetails = {};
                userDetails.companyName = res.data.companyName;
                userDetails.companyCode = res.data.companyCode;
                userDetails.userName = res.data.userName;
                userDetails.userCode = res.data.userCode;
                userDetails.officeName = res.data.officeName;
                userDetails.officeCode = res.data.officeCode;
                userDetails.loginCode = res.data.loginCode;
                userDetails.sex = res.data.sex;
                userDetails.sid = res.data.sid;
                wx.removeStorageSync('userDetails');
                wx.setStorageSync('userDetails', userDetails);
                that.globalData.sid = res.data.sid;
                resolve(res.data.sid)
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