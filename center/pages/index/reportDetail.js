// pages/index/car.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {store,storeId} from '../../config.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    title:'',
    time:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data,
        title:options.title,
        time:options.time,
        id:options.id
      })
    }).then()
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
  toPage(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  confirm(e){
    var that = this
    Dialog.confirm({
      title: '提示',
      message: `确认报名吗？`,
    })
    .then(() => {
      that.report()
    }).catch(() => {
      // on cancel
    });
  },
  report(e) {
    var that = this;
    var data = {
      corp_code:storeId,
      corp_name:store,
      eventId:that.data.id,
      mobile:that.data.userInfo.phone,
      nikeName:that.data.userInfo.name,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/saveEventRegistration', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result=='true') {
          Toast({
            message:'报名成功',
            type:'success'
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: 'activity'
            })
          },1000)
        } else {
          Toast({
            message: res.message||'报名失败',
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg,
        type: 'warning'
      });
    });
  },

})