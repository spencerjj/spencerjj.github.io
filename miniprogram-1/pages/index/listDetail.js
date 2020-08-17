// pages/index/payInfo/listDetail.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

  /**
   * Page initial data
   */
  data: {
    pkTeacher:'',
    pkPayBill:'',
    listDetail:{
      billTitle:'账单',
      nameSchool:'百货大楼',
      depart:'销售部',
      deadlineTime:'爱马仕',
      itemAmount:10000.00,
      time:'2019-01-10 12:00',
      comment:'123'
    },
    notice: '请输入备注信息',
    focus: false,
    myComment: '',
    inputShow: false,
    myTag:'',
    dailyNo:''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      dailyNo:options.id
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      sid:userInfo.sid
    })
    that.getDetail()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  login(e){
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  getDetail(e){
    var that = this
    var data={
      __sid:that.data.sid,
      __ajax:'json',
      dailyNo:that.data.dailyNo
    }
  getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderHead.json', 'body', data, 0, false, true).then(
    res => {
 
    }
  ).catch(res => {
    wx.showModal({
      title: '错误',
      content: res.message,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#1890FF'
    })
  });
  },
  detail: function (e) {
    console.log(e.target.dataset.url)
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  toPage:function(){

  },
  comment(e){
    this.setData({
      focus: true,
      inputShow: true,
      myTag:this.data.listDetail.comment,
    })
  },
  reply: function (e) {

  },
  bindfocus: function (e) {
    console.log(e.detail)
    this.setData({
      bottom: e.detail.height
    })
  },
  bindblur: function (e) {
    this.setData({
      inputShow: false,
      myTag: '',
    });
  },
  getTags: function (e) {
    this.setData({
      myTag: e.detail.value
    })
  },
  add(e){
    var that = this;
    if(that.data.myTag.length>0){
      console.log(that.data.myTag)
      var listDetail = that.data.listDetail
      listDetail.comment = that.data.myTag
      console.log(listDetail)
      that.setData({
        listDetail:listDetail
      })
    }
  }
})