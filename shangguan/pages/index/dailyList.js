// pages/index/progress/voteList.js
const {
  $Message,
  $Toast
} = require('../../component/iview/base/index');
var app = getApp();
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: '',
    pageSize: 20,
    pageNo: 1,
    loading: false,
    listIsFull: false,
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
      type:options.type
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
    this.showList()
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
    // this.gotoHomePage();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    this.onShow();

    wx.showNavigationBarLoading()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500);
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
    })
  },
  showList(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      type:that.data.type,
      companyCode: that.data.userDetails.companyCode,
    }
    postRequest(getApiHost(), 'api/merchant/merchantCheckupOrderList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let lists = res.data.list
        console.log(lists)
        // lists.map((item) => {
        //   item.mark = 1
        // })
        if(!lists||lists.length<1){
          wx.showModal({
            title: '提示',
            content: '暂无巡检记录，立即发起一条',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: 'dailyCheck?type='+that.data.type
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }

          })  
        }
        that.setData({
          lists: lists,
          listIsFull: true
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
  },
  
  showDetail(e) {
    var that = this;
    var lists = that.data.lists;
    var index = e.currentTarget.dataset.index
    lists[index].mark = !lists[index].mark
    console.log(lists)
    that.setData({
      lists: lists
    })
  },
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mark //仅为示例，并非真实的电话号码
    })
  },
  toPage(e){
    wx.navigateTo({
      url: 'dailyRecord1?type='+this.data.type+'&no='+e.currentTarget.dataset.no,
    })
  },
  goCheck(e){
    wx.navigateTo({
      url: 'dailyCheck?type='+this.data.type
    })
  }
})