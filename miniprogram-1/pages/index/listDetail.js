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
    notice: '请输入备注信息',
    focus: false,
    myComment: '',
    inputShow: false,
    myTag:'',
    dailyNo:'',
    brandName:'',
    itemNo:'',
    price:'',
    num:'',
    payment:'',
    receiverName:'',
    receiverTel:'',
    departName:'',
    id:'',
    remark:''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.remark)
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      brandName:options.brandName!='undefined'?options.brandName:'',
      itemNo:options.itemNo!='undefined'?options.itemNo:'',
      price:options.price!='undefined'?options.price:'',
      num:options.num!='undefined'?options.num:'',
      payment:options.payment!='undefined'?options.payment:'',
      receiverName:options.receiverName!='undefined'?options.receiverName:'',
      receiverTel:options.receiverTel!='undefined'?options.receiverTel:'',
      departName:options.departName!='undefined'?options.departName:'',
      id:options.id,
      remark:options.remark!='undefined'?options.remark:'',
      sid:userInfo.sid
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
  // getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderHead.json', 'body', data, 0, false, true).then(
  //   res => {
 
  //   }
  // ).catch(res => {
  //   wx.showModal({
  //     title: '错误',
  //     content: res.message,
  //     showCancel: false,
  //     confirmText: '知道了',
  //     confirmColor: '#1890FF'
  //   })
  // });
  },
  toPage:function(){

  },
  comment(e){
    this.setData({
      focus: true,
      inputShow: true,
      myTag:this.data.remark,
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
      inputShow: false
    });
  },
  getTags: function (e) {
    this.setData({
      myTag: e.detail.value
    })
  },
  add(e){
    var that = this;
    if(that.data.remark.length>0){
      console.log(that.data.remark)
      var data={
        __sid:that.data.sid,
        __ajax:'json',
        remark:that.data.remark,
        id:that.data.id,
        state:1
      }
    getRequest(getApiHost(), 'platform/v1/api/dayily/updateOrderBody.json', 'body', data, 0, false, true).then(
      res => {
        wx.navigateBack({
          delta: 1,
        })
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

    }
  },
  remarkInput(e){
    this.setData({
      remark:e.detail.value
    })
  }
})