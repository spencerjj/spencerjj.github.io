// pages/my/DISC/index.js
var app = getApp();
const {
  $Toast
} = require('../../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    loadAll: true,
    detail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(decodeURIComponent(options.scene)
    ){
      this.setData({
        id: decodeURIComponent(options.scene)

      })
    }else{
      $Toast({
        content: '培训不存在',
        type: "error"
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../my',
        })
      },2000)
    }
    
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
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
    })
    this.getInfo()
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
      this.setData({
        loadAll: true
      })
    })
  },
  getInfo(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/train/trainBase/getById',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.result == 'false') {
            $Toast({
              content: res.data.message,
              type: 'error'
            })
            return;
          } else {
            that.setData({
              loadAll: false,
              detail: res.data
            })
          }

        } else {
          $Toast({
            content: res.data.message,
            type: 'warning'
          })
        }
      }
    })
  },
  toPage(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要报名吗',
      success(res) {
        wx.showLoading({
          title: '报名中',
        })
        wx.request({
          url: app.globalData.url + '/train/trainBase/signUp',
          data: {
            __sid: app.globalData.__sid,
            __ajax: 'json',
            trainId: that.data.id,
            empCode:that.data.userDetails.userId,
            empName:that.data.userDetails.userName
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            wx.hideLoading()
            if (res.statusCode == 200) {
              if (res.data.result && res.data.result == 'login') {
                that.login()
                console.log('未登录')
                return;
              }
              if (res.data.result == 'false') {
                $Toast({
                  content: res.data.message,
                  type: 'error'
                })
                return;
              } else {
                wx.redirectTo({
                  url: 'success?notice=报名成功'
                })
              }
            } else {
              $Toast({
                content: res.data.message,
                type: 'warning'
              })
            }
          }
        })

      }
    })
  }
})