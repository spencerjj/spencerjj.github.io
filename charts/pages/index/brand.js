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
    southDate: [{
      title: '总成交量',
      data: [80, 20, 70, 30, 80, 60, 30, 20, 10, 10, 30, 60, 70],
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }],
    date: '',
    yestoday: '',
    week: '',
    today: '',
    totalVip: 0,
    thisDate: '',
    lastDate: '',
    thisYear:'',
    lastYear:'',
    year:'',
    userName: '',
    userCode: '',
    sid: '',
    loginCode: '',
    officeName: '',
    pageNo: 1,
    pageSize: 100,
    mark: 0,
    lists: [1, 2, 3, 4, 5, 6, 7, 8],
    type: '',
    showTopData: [],
    chartList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var chartsUser = wx.getStorageSync('chartsUser');
    this.setData({
      userName: chartsUser.userName,
      userCode: chartsUser.userCode,
      sid: chartsUser.sid,
      loginCode: chartsUser.loginCode,
      officeName: chartsUser.officeName
    })
    // console.log(options.date)
    var thisDate = options.date
    var now = new Date(thisDate)

    var month = (now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)
    var day = (now.getDate()) >= 10 ? (now.getDate()) : '0' + (now.getDate())
    var lastDate = (now.getFullYear() - 1) + '-' + (month) + '-' + (day)
    var thisYear = now.getFullYear()
    var lastYear = now.getFullYear()-1
    // console.log(lastDate)
    this.setData({
      thisDate: thisDate,
      lastDate: lastDate,
      date: thisDate,
      year:thisYear,
      thisYear:thisYear,
      lastYear:lastYear
    })
    this.getTop()
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
  login(e) {
    app.doLogin().then(data => {
      this.onLoad()
    })
  },
  getTop(e) {
    var that = this
    var data1 = {
      __sid: that.data.sid,
      __ajax: 'json',
      lastDate: that.data.thisDate,
    }
    // 区域统计
    getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findBrandSumList', 'body', data1, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        if (res.data == undefined) {
                          
          wx.showModal({
              title: '提示',
              content: '当天暂无数据',
          })
      return;
  }
        let list = res.data
        let topData1 = []
        let topData2 = []
        for(let x in list){
          if(list[x].year==that.data.thisYear){
            topData1.push({
              name:list[x].ppmc,
              money:list[x].money
            })
          }else if(list[x].year==that.data.lastYear){
            topData2.push({
              name:list[x].ppmc,
              money:list[x].money
            })
          }
        }
        for(let x in topData1){
          topData1[x].compare =  (topData1[x].money-topData2[x].money).toFixed(2)
        }
        // if(that.data.mark==0){
          that.setData({
            showTopData:topData1,
          })
        // }else{
        //   that.setData({
        //     showTopData:topData2
        //   })
        // }

      }
    )
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      lastDate: that.data.date,
      year:that.data.year
    }
    getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findBrandDetailList', 'body', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        // console.log(res)
        let list = res.data
        var chartList = []
        var moneyList = []
        var categoriesList = []
        for(let x in list){
          for(let y in list[x].lampoPpSaleList){
            moneyList.push(list[x].lampoPpSaleList[y].money.toFixed(0))
            categoriesList.push(list[x].lampoPpSaleList[y].fimonth)
          }
          chartList.push({
            name:list[x].ppmc,
            money:moneyList,
            categories:categoriesList
          })
          moneyList = []
          categoriesList = []
        }
        // console.log(chartList)
        that.setData({
          chartList:chartList
        })
        that.getChart()
      }
    )

  },
  getChart(e) {
    var length = this.data.chartList.length
    switch (length) {
      case 3:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        break;
      case 4:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        this.showchart4()
        break;
      case 5:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        this.showchart4()
        this.showchart5()
        break;
      case 6:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        this.showchart4()
        this.showchart5()
        this.showchart6()
        break;
      case 7:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        this.showchart4()
        this.showchart5()
        this.showchart6()
        this.showchart7()
        break;
      case 8:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        this.showchart4()
        this.showchart5()
        this.showchart6()
        this.showchart7()
        this.showchart8()
        break;
      case 9:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        this.showchart4()
        this.showchart5()
        this.showchart6()
        this.showchart7()
        this.showchart8()
        this.showchart9()
        break;
      case 10:
        this.showchart1()
        this.showchart2()
        this.showchart3()
        this.showchart4()
        this.showchart5()
        this.showchart6()
        this.showchart7()
        this.showchart8()
        this.showchart9()
        this.showchart10()
        break;
    }
  },
  // bindDateChange(e){
  //   this.setData({
  //     date:e.detail.value
  //   })
  //   this.getTop()
  // },
  // bindYearChange(e){
  //   this.setData({
  //     year:e.detail.value
  //   })
  //   this.getChart()
  // },
  showchart1(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    southChart = new wxCharts({
      canvasId: 'canvas1',
      type: 'column',
      animation: true,
      categories: this.data.chartList[0].categories,
      series: [{
        name: this.data.chartList[0].name,
        color: '#295aa6',
        data: this.data.chartList[0].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart2(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var northChart = new wxCharts({
      canvasId: 'canvas2',
      type: 'column',
      animation: true,
      categories: this.data.chartList[1].categories,
      series: [{
        name: this.data.chartList[1].name,
        color: '#51bdbd',
        data: this.data.chartList[1].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart3(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var westChart = new wxCharts({
      canvasId: 'canvas3',
      type: 'column',
      animation: true,
      categories: this.data.chartList[2].categories,
      series: [{
        name: this.data.chartList[2].name,
        color: '#f784a5',
        data: this.data.chartList[2].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart4(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
      canvasId: 'canvas4',
      type: 'column',
      animation: true,
      categories: this.data.chartList[3].categories,
      series: [{
        name: this.data.chartList[3].name,
        color: '#f4b374',
        data: this.data.chartList[3].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart5(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
      canvasId: 'canvas5',
      type: 'column',
      animation: true,
      categories: this.data.chartList[4].categories,
      series: [{
        name: this.data.chartList[4].name,
        color: '#295aa6',
        data: this.data.chartList[4].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart6(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
      canvasId: 'canvas6',
      type: 'column',
      animation: true,
      categories: this.data.chartList[5].categories,
      series: [{
        name: this.data.chartList[5].name,
        color: '#51bdbd',
        data: this.data.chartList[5].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart7(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
      canvasId: 'canvas7',
      type: 'column',
      animation: true,
      categories: this.data.chartList[6].categories,
      series: [{
        name: this.data.chartList[6].name,
        color: '#f784a5',
        data: this.data.chartList[6].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart8(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
      canvasId: 'canvas8',
      type: 'column',
      animation: true,
      categories: this.data.chartList[7].categories,
      series: [{
        name: this.data.chartList[7].name,
        color: '#f4b374',
        data: this.data.chartList[7].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart9(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
      canvasId: '#295aa6',
      type: 'column',
      animation: true,
      categories: this.data.chartList[8].categories,
      series: [{
        name: this.data.chartList[8].name,
        color: '#f4b374',
        data: this.data.chartList[8].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  showchart10(e) {
    var that = this;
    var windowWidth = 300
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var eastChart = new wxCharts({
      canvasId: 'canvas10',
      type: 'column',
      animation: true,
      categories: this.data.chartList[9].categories,
      series: [{
        name: this.data.chartList[9].name,
        color: '#51bdbd',
        data: this.data.chartList[9].money,
        format: function (val, name) {
          return val;
        }
      }, ],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0,
        max: 100
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 25,
          color: '#000000'
        }
      },
      width: windowWidth - 25,
      height: 200
    });
  },
  changeYear(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      mark: id
    })
    if (id == 0) {
      this.setData({
        year:this.data.thisYear
      })
      this.getTop()
    } else if (id == 1) {
      this.setData({
        year:this.data.lastYear
      })
      this.getTop()
    }
  }
})