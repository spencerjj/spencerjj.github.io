// pages/index/group.js
var wxCharts = require('../../utils/wxcharts2.js');
var line = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.doLine()
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
  doLine(e) {
    var windowWidth = 320;
    try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }
    line = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['阿迪厅', '耐克厅', '李宁厅', '匡威厅', '耐克360厅'],
      series: [{
          name: '销售额',
          data: [15, 20, 45, 37, 40],
          format: function (val) {
              return val.toFixed(2) + '万';
          }
      }, {
          name: '销售目标',
          data: [30, 37, 65, 78, 69],
          format: function (val) {
              return val.toFixed(2) + '万';
          }
      },{
        name: '同比',
        color:'#102757',
        data: [22, 57, 33, 28, 99],
        format: function (val) {
            return val.toFixed(2) + '万';
        }
    }],
      yAxis: {
          title: '',
          format: function (val) {
              return val.toFixed(2);
          },
          min: 0
      },
      width:windowWidth-10,
      height: 200
  });
},
touchHandler: function (e) {
  console.log(line.getCurrentDataIndex(e));
  line.showToolTip(e, {
      format: function (item, category) {
          return item.data
      }
  });
},
})