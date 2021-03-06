// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    show: false,
    point: 0,
    signState:0,
    comState:0,
    reState:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if (phoneNo.length > 1) {
      that.getInfo()
      that.getSign()
    } else {
      Toast({
        message: '登录失效，请重新授权登录',
        type: 'warning'
      });
      setTimeout(() => {
        wx.redirectTo({
          url: 'index'
        })
      }, 1000)
    }
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
  getInfo(e) {
    var that = this;
    var data = {
      phone: wx.getStorageSync('phoneNo'),
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberAllInfo', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.status==0){
          that.setData({
            point: res.availablePoints,
            reState:res.nInvFriends<=6?res.nInvFriends:6,
            comState:res.perfect<15?0:100
          })
        }else{
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      console.log(res)
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  getSign(){
    var that = this;
    var today = new Date().getFullYear()+'-'+(new Date().getMonth()-1+2)+'-'+new Date().getDate()
    var data = {
      memPhone: wx.getStorageSync('phoneNo'),
      startDate:today,
      endDate:today,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberSign', 'body', data, 0, false, false,false).then(
      res => {
        console.log(res)
        if(res.status==0){
          if(res.signInfoList.length==0){
            that.setData({
              signState: 0
            })
          }else{
            that.setData({
              signState: 100
            })
          }
        }else{
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      console.log(res)
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.id,
    })
  },
  sign(){
    var that = this;
    var data = {
      phone: wx.getStorageSync('phoneNo'),
      reason:'SignIn',
      value:10,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPAddPoints', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        if(res.status==0){
          that.getSign()
        }else{
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      console.log(res)
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  }
})