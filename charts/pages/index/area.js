// pages/index/area.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import format from '../../utils/time.js'

var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var southChart = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today:'',
    date:'',
    thisYear:'',
    year:'',
    southDate: [
      {
          title: '总成交量',
          data: [80, 20, 70, 30,80,60,30,20,10,10,30,60,70],
          categories: ['1', '2', '3', '4','5', '6', '7', '8','9','10','11','12']
      }
  ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var now = new Date()
    this.setData({
      today: now.format('yyyy-MM'),
      date:now.format('yyyy-MM'),
      thisYear:now.getFullYear(),
      year:now.getFullYear()
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
    this.showSouthChart()
    this.showNorthChart()
    this.showEastChart()
    this.showWestChart()
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
  bindDateChange(e){
    this.setData({
      date:e.detail.value
    })
  },
  bindYearChange(e){
    this.setData({
      year:e.detail.value
    })
    console.log(e.detail.value)
    this.onShow()
  },
  showSouthChart(e){
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
        windowWidth=res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    southChart = new wxCharts({
        canvasId: 'southCanvas',
        type: 'column',
        animation: true,
        categories: this.data.southDate[0].categories,
        series: [{
            name: '南区销售额',
            color:'#295aa6',
            data: this.data.southDate[0].data,
            format: function (val, name) {
                return val;
            }
        },
        ],
        yAxis: {
            format: function (val) {
                return val;
            },
            min: 0,
            max:100
        },
        xAxis: {
            disableGrid: false,
            type: 'calibration'
        },
        extra: {
            column: {
                width: 25,
                color:'#000000'
            }
        },
        width: windowWidth-25,
        height: 200
    });
  },
  showNorthChart(e){
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
        windowWidth=res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var northChart = new wxCharts({
        canvasId: 'northCanvas',
        type: 'column',
        animation: true,
        categories: this.data.southDate[0].categories,
        series: [{
            name: '北区销售额',
            color:'#51bdbd',
            data: this.data.southDate[0].data,
            format: function (val, name) {
                return val;
            }
        },
        ],
        yAxis: {
            format: function (val) {
                return val;
            },
            min: 0,
            max:100
        },
        xAxis: {
            disableGrid: false,
            type: 'calibration'
        },
        extra: {
            column: {
                width: 25,
                color:'#000000'
            }
        },
        width: windowWidth-25,
        height: 200
    });
  },
  showWestChart(e){
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
        windowWidth=res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var westChart = new wxCharts({
        canvasId: 'westCanvas',
        type: 'column',
        animation: true,
        categories: this.data.southDate[0].categories,
        series: [{
            name: '西区销售额',
            color:'#f784a5',
            data: this.data.southDate[0].data,
            format: function (val, name) {
                return val;
            }
        },
        ],
        yAxis: {
            format: function (val) {
                return val;
            },
            min: 0,
            max:100
        },
        xAxis: {
            disableGrid: false,
            type: 'calibration'
        },
        extra: {
            column: {
                width: 25,
                color:'#000000'
            }
        },
        width: windowWidth-25,
        height: 200
    });
  },
  showEastChart(e){
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
        windowWidth=res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
        canvasId: 'eastCanvas',
        type: 'column',
        animation: true,
        categories: this.data.southDate[0].categories,
        series: [{
            name: '东区销售额',
            color:'#f4b374',
            data: this.data.southDate[0].data,
            format: function (val, name) {
                return val;
            }
        },
        ],
        yAxis: {
            format: function (val) {
                return val;
            },
            min: 0,
            max:100
        },
        xAxis: {
            disableGrid: false,
            type: 'calibration'
        },
        extra: {
            column: {
                width: 25,
                color:'#000000'
            }
        },
        width: windowWidth-25,
        height: 200
    });
  },
  touchHandler(e){
    console.log(e)
  }
})