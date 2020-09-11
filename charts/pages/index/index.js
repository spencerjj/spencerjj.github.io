import {
    getApiHost,
    postRequest,
    getRequest
  } from '../../utils/api.js'
  var app = getApp();
  import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
  var wxCharts = require('../../utils/wxcharts.js');
Page({
    data: {
      main: [
        {
            title: '本期',
            data: [8, 2, 7, 3],
            categories: ['东区', '南区', '西区', '北区']
        },
        {
            title: '往期',
            data: [1, 2, 5, 7],
            categories: ['东区', '南区', '西区', '北区']
        },
    ],
    date:'2020-10'
    },
    onLoad: function() {
      var that = this

      this.showAreaChart()
      this.showFromChart()
      this.showBrandChart()
    },
    toPage(e){
        var mark = e.target.dataset.mark
        wx.navigateTo({
          url: mark
        })
    },
    showAreaChart(e){
      var that = this;
      var windowWidth = 300
      try {
        var res = wx.getSystemInfoSync();
          windowWidth=res.windowWidth
      } catch (e) {
        console.error('getSystemInfoSync failed!');
      }
      var columnChart = new wxCharts({
          canvasId: 'areaCanvas',
          type: 'column',
          animation: true,
          categories: this.data.main[0].categories,
          series: [{
              name: '同期',
              color:'#39a0ff',
              data: this.data.main[0].data,
              format: function (val, name) {
                  return val;
              }
          },
          {
              name: '往期',
              color:'#4ecb74',
              data: this.data.main[1].data,
              format: function (val, name) {
                  return val;
              }
          }],
          yAxis: {
              format: function (val) {
                  return val;
              },
              min: 0,
              max:10
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
    showFromChart(e){
      var that = this;
      var windowWidth = 300
      try {
        var res = wx.getSystemInfoSync();
          windowWidth=res.windowWidth
      } catch (e) {
        console.error('getSystemInfoSync failed!');
      }
      var columnChart = new wxCharts({
          canvasId: 'fromCanvas',
          type: 'column',
          animation: true,
          categories: this.data.main[0].categories,
          series: [{
              name: '同期',
              color:'#39a0ff',
              data: this.data.main[0].data,
              format: function (val, name) {
                  return val;
              }
          },
          {
              name: '往期',
              color:'#4ecb74',
              data: this.data.main[1].data,
              format: function (val, name) {
                  return val;
              }
          }],
          yAxis: {
              format: function (val) {
                  return val;
              },
              min: 0,
              max:10
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
    showBrandChart(e){
      var that = this;
      var windowWidth = 300
      try {
        var res = wx.getSystemInfoSync();
          windowWidth=res.windowWidth
      } catch (e) {
        console.error('getSystemInfoSync failed!');
      }
      var columnChart = new wxCharts({
          canvasId: 'brandCanvas',
          type: 'column',
          animation: true,
          categories: this.data.main[0].categories,
          series: [{
              name: '同期',
              color:'#39a0ff',
              data: this.data.main[0].data,
              format: function (val, name) {
                  return val;
              }
          },
          {
              name: '往期',
              color:'#4ecb74',
              data: this.data.main[1].data,
              format: function (val, name) {
                  return val;
              }
          }],
          yAxis: {
              format: function (val) {
                  return val;
              },
              min: 0,
              max:10
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
    }
})