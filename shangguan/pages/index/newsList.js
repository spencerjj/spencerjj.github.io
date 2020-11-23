// pages/mine/mine.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
const {
  $Toast
} = require('../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userDetails: '',
    lists: '',
    listIsFull: false,
    loading: false,
    showNo: false,
    pageNo: 1,
    pageSize: 10,
    isMore:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails
    })
    that.getNews()
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
    this.setData({
      pageNo: 1,
      listIsFull: false,
      loading: false,
      showNo: false
    })
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
    var that = this;
    console.log('到底了')
    if (that.data.isMore) {
      var pageNo = that.data.pageNo;
      pageNo++;
      that.setData({
        pageNo: pageNo
      })
      this.getNews()
    }
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
  toPage: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: 'news?id=' + data.id
    })
  },
  getNews(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize
    }
    getRequest(getApiHost(), 'api/merchant/merchantNoticeList', 'body', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        console.log(res.data)
        if (res.data.list.length == 0) {
          that.setData({
            loading: false,
            listIsFull: false,
            showNo: true,
            loadAll: false
          })
        } else {
          if (that.data.pageNo > 1) {
            console.log('第' + that.data.pageNo + '页')
            var list = that.data.lists
            list = list.concat(res.data.list)
            that.setData({
              lists: list,
              showNo: false,
              loadAll: false
            })
          } else {
            that.setData({
              lists: res.data.list,
              showNo: false,
              loadAll: false
            })
          }
          if (res.data.count > that.data.pageSize) {
            that.setData({
              loading: true,
              listIsFull: false
            })
            if (Math.ceil(res.data.count / that.data.pageSize) > that.data.pageNo) {
              that.setData({
                isMore: true
              })
            } else {
              that.setData({
                isMore: false,
                loading: false,
                listIsFull: true
              })
            }
          } else {
            that.setData({
              isMore: false,
              loading: false,
              listIsFull: true
            })
          }
        }
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