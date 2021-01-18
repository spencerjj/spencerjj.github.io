// pages/index/baihuo.js
var wxCharts = require('../../utils/wxcharts2.js');
var line = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'all',
    title: '购物中心',
    showList: [],
    totalLists:[
      {
        name:'百货集团',
        sales:2145,
        month:13321,
        year:33648,
      },
      {
        name:'购物中心',
        sales:35,
        month:321,
        year:648
      },
      {
        name:'新世纪',
        sales:22,
        month:321,
        year:648
      },
      {
        name:'百货大楼',
        sales:145,
        month:321,
        year:648
      },
      {
        name:'会员总览',
        sales:145,
        month:321,
        year:648
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showTab()
    this.doLine()
    let mark = options.mark
    this.setData({
      active:mark
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
  onChange(e) {
    console.log(e)
    this.setData({
      active: e.detail.name
    })
    wx.pageScrollTo({
      scrollTop: 0
    });
    if (e.detail.name == 'gou') {
      this.doLine()
      this.setData({
        title: '购物中心'
      })
    } else if (e.detail.name == 'xin') {
      this.doLine()
      this.setData({
        title: '新世纪'
      })
    } else if (e.detail.name == 'bai') {
      this.doLine()
      this.setData({
        title: '百货大楼'
      })
    } else if (e.detail.name == 'all') {
      this.showTab()
    }

  },
  toPage() {
    wx.navigateTo({
      url: 'group',
    })
  },
  showTab() {
    var that = this
    that.setData({
      showList: []
    })
    var show = that.data.showList
    that.data.totalLists.map(()=>{
        show.push(true)
        console.log(show)
        that.setData({
          showList: show
        })
    })
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
      background: '#000000',
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
      }, {
        name: '同比',
        color: '#B37474',
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
      width: windowWidth - 10,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
    });
  },
  touchHandler: function (e) {
    console.log(line.getCurrentDataIndex(e));
    line.showToolTip(e, {
      format: function (item, category) {
        return item.name+':'+item.data
      }
    });
  },
  toSelect(e){
      wx.redirectTo({
        url: 'select',
      })
  }
})