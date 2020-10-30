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
  APP_VER
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '',
    userDetails: '',
    loadAll: true,
    nodes:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  var data = '<div><h3>javascript - <em>js同步编程</em>与异步编程的区别,异步有哪些优点,为什么...</h3><div><span>2016年5月20日 - </span>从编程方式来讲当然是<em>同步编程</em>的方式更为简单,但是同步有其局限性一是假如是单线程那么一旦遇到阻塞调用,会造成整个线程阻塞,导致cpu无法得到有效利用...</div><div><div></div><span ><span ></span></span> - 百度快照</div><div ><img src="/images/office.png"><span>为您推荐：</span>js同步和异步ajax异步和同步的区别</div></div>';
  data = data
  .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
  .replace(/<div>/ig, '<div style="font-size: 15px; line-height: 25px;">')
  .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
  .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
  .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
  .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
  .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 style="width: 100%; border-radius: 2px;"');

   this.setData({ nodes:data })
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
    // that.getTag()
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
      url: data.url
    })
  },
  getTag(e) {
    var that = this 
    var data={
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
            let list = res.data
            console.log(list)
        }
    ).catch(res => {
        that.setData({
            ifYearData: false
        })
    });
  }

})