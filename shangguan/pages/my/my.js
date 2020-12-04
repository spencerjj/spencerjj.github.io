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
  APP_VER,HOST_URI
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
    var url = e.currentTarget.dataset.url;
    if(url==0){
      $Toast({
        content:'页面暂未开放',
        type:'warning'
      })
      return;
    }
    var type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: url+'?type='+type
      })
    
  },
  getTag(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      pageNo: 1,
      pageSize: 100,
      status:1
    }
    wx.request({
      url: HOST_URI+'bpm/bpmMyTask/listData.json',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if(res.statusCode==200){
          if(res.data.result&&res.data.result=='login'){
            that.login()
            console.log('未登录')
            return;
          }
        if(res.data.list){
          if(res.data.list.length!=0){
            if(res.data.list.length>10){
              wx.setTabBarBadge({
                index: 1,
                text: '10+'
              })
            }else{
              wx.setTabBarBadge({
                index: 1,
                text: res.data.list.length+''	
              })
            }
          }else{
            wx.removeTabBarBadge({
              index: 1
           })
          }
        }
      }
    }
    })
  }

})