// pages/index/welcome.js
const config = require('../../config.js');
const HOST_URI = config.HOST_URI;
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pro:0,
    gifLeft:2,
    ifLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.loading()
    var chartsUser = wx.getStorageSync('chartsUser');
    this.setData({
        userName: chartsUser.userName,
        userCode: chartsUser.userCode,
        sid: chartsUser.sid,
        loginCode: chartsUser.loginCode,
        officeName:chartsUser.officeName
    })
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      lastDate:that.data.date,
      pageNo:1,
      pageSize:100
    }
    // 会员人数
    getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberSum', 'body', data, 0, false, false,false).then(
      res => {
        // console.log(res)
        if (res.result && res.result == 'login') {
            that.login()
            console.log('登录失效')
            return;
          }
        if(res.result){
          that.setData({
            ifLogin:true
          })
        }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  login(e){
    app.doLogin().then(data => {
      this.onLoad()
    })
  },
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
  loading(e){
    var set = setInterval(()=>{
      this.setData({
        pro:this.data.pro==90?this.data.pro:this.data.pro+1,
      })
      if(this.data.gifLeft<82){
        this.setData({
          gifLeft:this.data.gifLeft+0.9
        })
      }
      if(this.data.pro==90){
        if(this.data.ifLogin){
          console.log(123)
          clearInterval(set)
          this.toPage()
        }
      }
    },15)
  },
  toPage(){
    var go = setInterval(()=>{
      this.setData({
        pro:this.data.pro==100?this.data.pro:this.data.pro+1,
      })
      if(this.data.gifLeft<90){
        this.setData({
          gifLeft:this.data.gifLeft+0.9
        })
      }
      if(this.data.pro==100){
        if(this.data.ifLogin){
          clearInterval(go)
          console.log(wx.getStorageSync('chartsUser'))
          wx.switchTab({
            // url: 'index',
          })
        }
      }
    },15)
  }
})