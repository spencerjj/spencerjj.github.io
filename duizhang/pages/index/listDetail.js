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
    time:'',
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
      brandName:options.brandName!='undefined'?options.brandName:'未知',
      itemTitle:options.itemTitle!='undefined'?options.itemTitle:'未知',
      itemNo:options.itemNo!='undefined'?options.itemNo:'未知',
      price:options.price!='undefined'?options.price:'未知',
      num:options.num!='undefined'?options.num:'未知',
      payment:options.payment!='undefined'?options.payment:'未知',
      receiverName:options.receiverName!='undefined'?options.receiverName:'未知',
      receiverTel:options.receiverTel!='undefined'?options.receiverTel:'未知',
      departName:options.departName!='undefined'?options.departName:'未知',
      time:options.time!='undefined'?options.time:'未知',
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
  // getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderHead', 'body', data, 0, false, true).then(
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
    getRequest(getApiHost(), 'platform/v1/api/dayily/updateOrderBody', 'body', data, 0, false, true).then(
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

    }else{
      Notify({
        message: '请填写备注信息',
        type: 'warning'
      });
    }
  },
  remarkInput(e){
    this.setData({
      remark:e.detail.value
    })
  }
})