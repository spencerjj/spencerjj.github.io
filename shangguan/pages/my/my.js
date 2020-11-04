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
  APP_VER
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '',
    url: "",
    userDetails: '',
    loadAll: true,
    lists: '',
    appVersion: APP_VER,
    pageNo:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getTag()

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
    wx.setNavigationBarTitle({
      title: '功能中心'
    })
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
    })
    console.log(userDetails)
    that.getTag()
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
  toPage: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: data.url
    })
  },
  getTag(e) {
    var that = this 
    var data={
        __sid: that.data.userDetails.sid,
        __ajax: 'json',
        pageNo:that.data.pageNo,
        pageSize:that.data.pageSize
      }
      getRequest(getApiHost(), 'api/merchant/merchantNoticeList', 'body', data, 0, false, false,false).then(
        res => {
            if (res.result && res.result == 'login') {
                that.login()
                console.log('登录失效')
                return;
            }
            let list = res.data
            console.log(list)
        }
    )
  }

})