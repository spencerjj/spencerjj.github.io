// pages/index/shopLists.js
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
    lists:[
      {
        name:'店铺1',
        time:'2030年10月01日',
        area:'525.35',
        sales:'1721.12',
        mark:1
      },
      {
        name:'店铺2',
        time:'2030-10-01',
        area:'525',
        sales:'1721'
      },
      {
        name:'店铺3',
        time:'2030-10-01',
        area:'525',
        sales:'1721'
      }
    ]
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

  }
})