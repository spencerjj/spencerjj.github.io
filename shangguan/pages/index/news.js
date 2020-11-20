// pages/mine/mine.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
var app = getApp();
const {
  $Toast
} = require('../../component/iview/base/index');
import {
  APP_VER,
  URI
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userDetails: '',
    loadAll: true,
    nodes: '',
    id: '',
    detail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
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
      userDetails: userDetails
    })
    that.getDetail()
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
    this.onShow()
    wx.showNavigationBarLoading()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

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
  getDetail(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      id: this.options.id
    }
    getRequest(getApiHost(), 'api/merchant/merchantNoticeForm', 'body', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let detail = res.data
        console.log(detail)
        var content = detail.content
          .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
          .replace(/<div>/ig, '<div style="font-size: 15px; line-height: 25px;color:#777;letter-spacing:1.5px">')
          content= content.replace(new RegExp(/src=\"/g), `style="width: 100%; border-radius: 2.5px;" mode="aspectFill" src="`+URI)
        this.setData({
          detail:detail,
          nodes: content
        })
        wx.setNavigationBarTitle({
          title: detail.title
        })
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      });
    });
  }

})