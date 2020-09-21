import {
    getApiHost,
    postRequest,
    getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import format from '../../utils/time.js'
var wxCharts = require('../../utils/wxcharts.js');
var pieChart2020 = null;
var pieChart2019 = null;
var areaChart = null;
var column2020 = null;
var line2020 = null;
var column2019 = null;
var line2019 = null;
Page({
    data: {
        ifUp: false,
        lists: [1, 2, 3, 4, 5],
        date:'2019-09',
        yestoday:'',
        week:'',
        today:'',
        totalVip:0,
        lastYear:'',
        thisYear:'',
        vipCardCot2020:0,
        vipCardCot2019:0,
        vipRate2020:0,
        vipRate2019:0,
        reRate2020:0,
        reRate2019:0,
        oldRate2020:0,
        oldRate2019:0,
        main: [{
                title: '2020',
                data: [],
                categories: []
            },
            {
                title: '2019',
                data: [],
                categories: []
            }
        ],
        pieData2020:[
            {
                name: '新会员',
                data: '',
                color:'green'
            }, {
                name: '非会员',
                data: '',
            }, {
                name: '老会员',
                data: '',
            }
        ],
        pieData2019:[
            {
                name: '新会员',
                data: '',
                color:'green'
            }, {
                name: '非会员',
                data: '',
            }, {
                name: '老会员',
                data: '',
            }
        ],
        saleColumnData:[
            {
                title:[],
                data:[]
            },
            {
                title:[],
                data:[]
            },
        ],
        saleLineData:[
            {
                title:[1,2,3,4,5,6,7,8,9],
                data:[79, 47, 77, 80, 80, 79, 85, 88, 93]
            },
            {
                title:[1,2,3,4,5,6,7,8,9],
                data:[83, 82, 86, 86, 87, 76, 78, 81, 83]
            },
        ]
        

    },
    onLoad: function () {
        var chartsUser = wx.getStorageSync('chartsUser');
        console.log(chartsUser)
        this.setData({
            userName: chartsUser.userName,
            userCode: chartsUser.userCode,
            sid: chartsUser.sid,
            loginCode: chartsUser.loginCode,
            officeName:chartsUser.officeName
        })
        var now = new Date()
        var month =  (now.getMonth()+1)>=10?(now.getMonth()+1):'0'+(now.getMonth()+1)
        var day =  (now.getDate()-1)>=10?(now.getDate()-2):'0'+(now.getDate()-2)
        var yestoday = now.getFullYear()+'-'+(month)+'-'+(day)
        var today = now.getFullYear()+'年'+(month)+'月'+(day)+'日'
        var showDate = (month)+'/'+(day)
        var week = "日一二三四五六".charAt(new Date(yestoday).getDay())
        this.setData({
            today: today,
            yestoday:yestoday,
            date: yestoday,
            showDate:showDate,
            thisYear:now.getFullYear(),
            lastYear:now.getFullYear()-1,
            week:week
          })
        // this.doPie2020()
        // this.doPie2019()
        // this.doAreaChart()
        // this.doColumn2020()
        // this.doLine2020()
        // this.doColumn2019()
        // this.doLine2019()
        this.getTop()
        },
    toPage(e) {

    },
    // up(e) {
    //     if (!this.data.ifUp) {
    //         this.doPie2020()
    //         this.doPie2019()
    //     } else {
    //         wx.pageScrollTo({
    //             scrollTop: 0
    //         })
    //     }
    //     this.setData({
    //         ifUp: !this.data.ifUp
    //     })

    // },
    login(e){
        app.doLogin().then(data => {
            this.onLoad()
        })
      },
    getTop(e){
        var that = this
        console.log(that.data.date)
        var data = {
          __sid: that.data.sid,
          __ajax: 'json',
          lastDate:that.data.date,
          pageNo:1,
          pageSize:100
        }
        // 会员人数
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberSum', 'body', data, 0, false, false).then(
          res => {
            // console.log(res)
            if (res.result && res.result == 'login') {
                that.login()
                console.log('登录失效')
                return;
              }
            that.setData({
                totalVip:res.data.vipCount
            })
          }
        )
        // 招新转化率
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberRecruitmentPage', 'body', data, 0, false, false).then(
            res => {
            //   console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }
              that.setData({
                vipCardCot2020:res.data.list[0].vipCardCot,
                vipCardCot2019:res.data.list[1].vipCardCot,
                vipRate2020:(res.data.list[0].rate*100).toFixed(2),
                vipRate2019:(res.data.list[1].rate*100).toFixed(2)
              })
            }
          )
        //   招新复购率
          getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberRepurchasePage', 'body', data, 0, false, false).then(
            res => {
            //   console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }
              that.setData({
                reRate2020:(res.data.list[0].rat*100).toFixed(2),
                reRate2019:(res.data.list[1].rat*100).toFixed(2),
              })
            }
          )
          //   老会员回购率
          getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberOldRePage', 'body', data, 0, false, false).then(
            res => {
            //   console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }
              that.setData({
                oldRate2020:(res.data.list[0].rate*100).toFixed(2),
                oldRate2019:(res.data.list[1].rate*100).toFixed(2),
              })
            }
          )
        //   招新人数
          getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberNewPage', 'body', data, 0, false, false).then(
            res => {
            //   console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }
              that.setData({
          
              })
            }
          )
        //   实收占比
          getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findMemberSaleRate', 'body', data, 0, false, false).then(
            res => {
              console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }

              var pieData2020 = that.data.pieData2020
              var pieData2019 = that.data.pieData2019
              var array = res.data
              for(let y in array){
                  if(array[y].year === '2020'){
                    pieData2020[0].name = '新会员 '+array[y].newRate
                    pieData2020[0].data = parseFloat(array[y].newRate)
                    pieData2020[1].name = '非会员 '+array[y].noRate
                    pieData2020[1].data = parseFloat(array[y].noRate)
                    pieData2020[2].name = '老会员 '+array[y].oldRate
                    pieData2020[2].data = parseFloat(array[y].oldRate)
                  }else if(array[y].year === '2019'){
                    pieData2019[0].name = '新会员 '+array[y].newRate
                    pieData2019[0].data = parseFloat(array[y].newRate)
                    pieData2019[1].name = '非会员 '+array[y].noRate
                    pieData2019[1].data = parseFloat(array[y].noRate)
                    pieData2019[2].name = '老会员 '+array[y].oldRate
                    pieData2019[2].data = parseFloat(array[y].oldRate)
                  }
              }

              that.setData({
                pieData2019:pieData2019,
                pieData2020:pieData2020
              })
              console.log()
              that.doPie2019()
              that.doPie2020()
            }
          )
            // 近两年会员销售
          getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findRecentTwoYearsSale', 'body', data, 0, false, false).then(
            res => {
              console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }
              var list = res.data
              var arr2020 = []
              var arr2019 = []
              var month2020 = []
              var month2019 = []
              for(let x in list){
                  if(list[x].year =='2020'){
                    arr2020.push(list[x].shareMoneyMember)
                    month2020.push(x-1+2)
                  }else if(list[x].year =='2019'){
                    arr2019.push(list[x].shareMoneyMember)
                  }
              }
              var saleColumnData = that.data.saleColumnData
              saleColumnData[0].title = month2020
              saleColumnData[0].data = arr2020,
              saleColumnData[1].title = month2020
              saleColumnData[1].data = arr2019,
              that.setData({
                saleColumnData:saleColumnData
              })
              that.doColumn2020()
              that.doColumn2019()
            }
          )
          //   区域会员销售占比
          getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findRecentTwoYearsAreaSale', 'body', data, 0, false, false).then(
            res => {
              console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }
                var list = res.data
              var arr2020 = []
              var arr2019 = []
              var area2020 = []
              var area2019 = []
              for(let x in list){
                  if(list[x].year =='2020'){
                    arr2020.push(list[x].shareMoneyMember)
                    area2020.push(list[x].areaName)
                  }else if(list[x].year =='2019'){
                    arr2019.push(list[x].shareMoneyMember)
                    area2019.push(list[x].areaName)
                  }
              }
              var main = that.data.main
              main[0].categories = area2020
              main[0].data = arr2020,
              main[1].categories = area2020
              main[1].data = arr2019,
              that.setData({
                main:main
              })
              that.doAreaChart()
            }
          )
           
    },
    doPie2020(e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        pieChart2020 = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas2020',
            type: 'ring',
            series: this.data.pieData2020,
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    },
    doPie2019(e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        pieChart2019 = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas2019',
            type: 'ring',
            series: this.data.pieData2019,
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    },
    doAreaChart(e) {
        var that = this;
        var windowWidth = 300
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        areaChart = new wxCharts({
            canvasId: 'areaCanvas',
            type: 'column',
            animation: true,
            categories: this.data.main[0].categories,
            series: [{
                    name: this.data.main[0].title,
                    color: '#39a0ff',
                    data: this.data.main[0].data,
                    format: function (val, name) {
                        return val;
                    }
                },
                {
                    name: this.data.main[1].title,
                    color: '#4ecb74',
                    data: this.data.main[1].data,
                    format: function (val, name) {
                        return val;
                    }
                }
            ],
            yAxis: {
                format: function (val) {
                    return val;
                },
                min: 0,
                max: 10
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
            width: windowWidth,
            height: 200
        });
    },
    doColumn2020(e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        column2020 = new wxCharts({
            canvasId: 'columnCanvas2020',
            type: 'column',
            animation: true,
            categories: this.data.saleColumnData[0].title,
            series: [{
                name: '会员',
                color: '#39a0ff',
                data:this.data.saleColumnData[0].data,
                format: function (val, name) {
                    return val;
                }
            }],
            yAxis: {
                format: function (val) {
                    return val;
                },
                min: 0,
                max: 10
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
            width: windowWidth,
            height: 200
        });
    },
    doLine2020(e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        line2020 = new wxCharts({
            canvasId: 'lineCanvas2020',
            type: 'line',
            categories: this.data.saleLineData[0].title,
            animation: true,
            series: [{
                name: '　',
                color: '#f784a5',
                data: this.data.saleLineData[0].data,
                format: function (val, name) {
                    return val + '%';
                }
            }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                format: function (val) {
                    return val;
                },
                min: 0,
                max: 100,
                gridColor:'rgba(255,255,255,0)',
                disabled:true
            },
            width: windowWidth-25,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'straight'
            }
        });
    },
    touchHandler2020: function (e) {
        console.log(line2020.getCurrentDataIndex(e));
        line2020.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return category + '月趋势' + ':' + item.data
            }
        });
    },
    doColumn2019(e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        column2019 = new wxCharts({
            canvasId: 'columnCanvas2019',
            type: 'column',
            animation: true,
            categories: this.data.saleColumnData[1].title,
            series: [{
                name: '会员',
                color: '#39a0ff',
                data:this.data.saleColumnData[1].data ,
                format: function (val, name) {
                    return val;
                }
            }],
            yAxis: {
                format: function (val) {
                    return val;
                },
                min: 0,
                max: 10
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
            width: windowWidth,
            height: 200
        });
    },
    doLine2019(e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        line2019 = new wxCharts({
            canvasId: 'lineCanvas2019',
            type: 'line',
            categories: this.data.saleLineData[1].title,
            animation: true,
            series: [{
                name: '　',
                color: '#f784a5',
                data: this.data.saleLineData[1].data,
                format: function (val, name) {
                    return val + '%';
                }
            }],
            xAxis: {
                disableGrid: false,
            },
            yAxis: {
                format: function (val) {
                    return val;
                },
                gridColor:'rgba(255,255,255,0)',
                min: 0,
                max: 100,
                disabled:true
            },
            width: windowWidth-25,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'straight'
            }
        });
    },
    touchHandler2019: function (e) {
        console.log(line2019.getCurrentDataIndex(e));
        line2019.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return category + '月趋势' + ':' + item.data
            }
        });
    },
    toDetail(e){
        wx.navigateTo({
          url: '../bar/index?date='+this.data.date,
        })
    },
    bindDateChange(e){
        var date = new Date(e.detail.value)
        var month =  (date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1)
        var day =  (date.getDate())>=10?(date.getDate()):'0'+(date.getDate())
        var today = date.getFullYear()+'年'+(month)+'月'+(day)+'日'
        var showDate = (month)+'/'+(day)
        var week = "日一二三四五六".charAt(new Date(date).getDay())
        this.setData({
          showDate:showDate,
          date:e.detail.value,
          today:today,
          week:week
        })
        this.getTop()
      },
})