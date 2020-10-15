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
    pageSize: 10

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
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails
    })
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
      url: 'news?id='+data.id
    })
  },
  getTag(e) {
    var that = this
    var data = {
      __sid: app.globalData.__sid,
      // __sid:app.globalData.tempSid,
      __ajax: 'json',
      empCode: that.data.userDetails.userId
    }
    getRequest(getApiHost(), 'api/tag/TagAllByEmpCodeForMobile.json', 'body', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        // if(res.data.list.length==0){
          //     that.setData({
          //       loading:false,
          //       listIsFull:false,
          //       showNo:true,
          //       loadAll:false
          //     })
          // }else{
          //   if(that.data.pageNo>1){
          //     console.log('第'+that.data.pageNo+'页')
          //     var list = that.data.lists
          //     list = list.concat(res.data.list)
          //     that.setData({
          //       lists:list,
          //       showNo:false,
          //       loadAll:false
          //     })
          //     console.log(that.data.lists)
          //   }else{
          //     that.setData({
          //     lists:res.data.list,
          //     showNo:false,
          //     loadAll:false
          //   })
          //   }
            
            
          //   if(res.data.count>10){
          //     that.setData({
          //       loading:true,
          //       listIsFull:false
          //     })
          //     if(Math.ceil(res.data.count/10)>that.data.pageNo){
          //       that.setData({
          //         isMore:true
          //       })
          //     }else{
          //       that.setData({
          //         isMore:false,
          //         loading:false,
          //         listIsFull:true
          //       })
          //     }
          //   }else{
          //     that.setData({
          //       loading:false,
          //       listIsFull:true
          //     })
          //   }
          // }
        var lists = [{
            id: 1,
            date: '9月18日 20:00',
            content: '金秋十月非常乐观'
          },
          {
            id: 2,
            date: '9月18日 20:00',
            content: '金秋十月非常乐观'
          },
          {
            id: 3,
            date: '9月18日 20:00',
            content: '金秋十月非常乐观'
          }
        ]
        that.setData({
          lists: lists,
          loading:true
        })
      }
    ).catch(res => {
      that.setData({
        ifYearData: false
      })
    });
  }

})