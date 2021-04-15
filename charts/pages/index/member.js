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
        rightTime:0,
        main: [{
                title: '',
                data: [],
                categories: []
            },
            {
                title: '',
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
                title:[],
                data:[]
            },
            {
                title:[],
                data:[]
            },
        ],
        ifTotalVip:true,
        ifVipCardCot:true,
        ifReRate:true,
        ifOldRate:true,
        ifPieData:true,
        ifAreaData:true,
        ifTwoData:true,
        show: false,
        describe:'',
        trend2020:600,
        trend2019:550,
        trend2019Des:false,
        trend2020Des:false,
        changeShow:false
    },
    onLoad: function () {
        var chartsUser = wx.getStorageSync('chartsUser');
        console.log(chartsUser)
        this.setData({
            userName: chartsUser.userName,
            userCode: chartsUser.userCode,
            sid: chartsUser.sid,
            loginCode: chartsUser.loginCode,
            officeName:chartsUser.officeName,
            changeShow:app.globalData.changeShow
        })
        var now = new Date()
        var now1 = new Date()
        var month = (now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)
        var day = now.getDate()
        now1.setTime(now1.getTime()-24*60*60*1000);
        console.log(now1.getFullYear())
        var month1 = (now1.getMonth() + 1) >= 10 ? (now1.getMonth() + 1) : '0' + (now1.getMonth() + 1)
        var day1 = now1.getDate()>=10?now1.getDate():'0'+now1.getDate()
        var t2 = now1.getFullYear()+'-'+month1+'-'+day1
        var yestoday = now.getFullYear() + '-' + (month) + '-' + (day)
        var today = now.getFullYear() + '年' + (month) + '月' + (day) + '日'
        var showDate = (month1)+'/'+(day1)
        var week = "日一二三四五六".charAt(new Date(yestoday).getDay())
        this.setData({
            today: today,
            yestoday: t2,
            date: t2,
            showDate: showDate,
            thisYear: now.getFullYear(),
            lastYear: now.getFullYear() - 2,
            week: week
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
      onPullDownRefresh: function () {
        this.getTop()
        wx.showNavigationBarLoading()
        setTimeout(function () {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }, 500);
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
            if(res.data==undefined){
                console.log(that.data.rightTime)
                if(that.data.rightTime!=0){
                    wx.showModal({
                        title: '提示',
                        content: '当天暂无数据，请重新选择日期',
                      })
                      
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '当天暂无数据',
                      })
                }
                return;
            }else{
               that.setData({
                totalVip:res.data.vipCount,
                rightTime:that.data.date,
                ifTotalVip:true
               })
            }

          }
        ).catch(res => {
            that.setData({
                ifTotalVip:false
            })
          });
        // 招新转化率
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberRecruitmentPage', 'body', data, 0, false, false).then(
            res => {
              console.log(res)
              if (res.result && res.result == 'login') {
                  that.login()
                  console.log('登录失效')
                  return;
                }
              that.setData({
                vipCardCot2020:res.data.list[0].vipCardCot,
                vipCardCot2019:res.data.list[1].vipCardCot,
                vipCardCompare:res.data.list[0].vipCardCot-res.data.list[1].vipCardCot,
                vipRate2020:(res.data.list[0].rate*100).toFixed(2),
                vipRate2019:(res.data.list[1].rate*100).toFixed(2),
                vipCompare:((res.data.list[0].rate*100).toFixed(2)-(res.data.list[1].rate*100).toFixed(2)).toFixed(2),
                ifVipCardCot:true
            })
            console.log(res.data.list[0].vipCardCot-res.data.list[1].vipCardCot)

       }
     ).catch(res => {
         that.setData({
            ifVipCardCot:false
         })
       });
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
                reCompare:((res.data.list[0].rat*100).toFixed(2)-(res.data.list[1].rat*100).toFixed(2)).toFixed(2),
                ifReRate:true
            })

       }
     ).catch(res => {
         that.setData({
            ifReRate:false
         })
       });
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
                oldCompare:((res.data.list[0].rate*100).toFixed(2)-(res.data.list[1].rate*100).toFixed(2)).toFixed(2),
                ifOldRate:true
            })

       }
     ).catch(res => {
         that.setData({
            ifOldRate:false
         })
       });
        //   招新人数
        //   getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findLampoMemberNewPage', 'body', data, 0, false, false).then(
        //     res => {
        //     //   console.log(res)
        //       if (res.result && res.result == 'login') {
        //           that.login()
        //           console.log('登录失效')
        //           return;
        //         }
        //       that.setData({
          
        //       })
        //     }
        //   )
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
                  if(array[y].year == that.data.thisYear){
                    pieData2020[0].name = '新会员'
                    pieData2020[0].data = parseFloat(array[y].newRate)
                    pieData2020[1].name = '非会员'
                    pieData2020[1].data = parseFloat(array[y].noRate)
                    pieData2020[2].name = '老会员'
                    pieData2020[2].data = parseFloat(array[y].oldRate)
                  }else if(array[y].year == that.data.lastYear){
                    pieData2019[0].name = '新会员'
                    pieData2019[0].data = parseFloat(array[y].newRate)
                    pieData2019[1].name = '非会员'
                    pieData2019[1].data = parseFloat(array[y].noRate)
                    pieData2019[2].name = '老会员'
                    pieData2019[2].data = parseFloat(array[y].oldRate)
                  }
              }
              that.setData({
                pieData2019:pieData2019,
                pieData2020:pieData2020,
                ifPieData:true
              })
              console.log(pieData2020)
              that.doPie2019()
              that.doPie2020()

       }
     ).catch(res => {
         that.setData({
            ifPieData:false
         })
       });
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
              var line2020 = [];
              var line2019 = []
              for(let x in list){
                  if(list[x].year ==that.data.thisYear){
                    arr2020.push(list[x].shareMoneyMember)
                    line2020.push((list[x].shareMoneyMember/list[x].shareMoney*100).toFixed(2))
                    month2020.push(x-1+2)
                  }else if(list[x].year ==that.data.lastYear){
                    arr2019.push(list[x].shareMoneyMember)
                    line2019.push((list[x].shareMoneyMember/list[x].shareMoney*100).toFixed(2))
                  }
              }
              var saleColumnData = that.data.saleColumnData
              var saleLineData = that.data.saleLineData
              saleColumnData[0].title = month2020
              saleColumnData[0].data = arr2020,
              saleColumnData[1].title = month2020
              saleColumnData[1].data = arr2019,
              saleLineData[0].title = month2020
              saleLineData[0].data = line2020,
              saleLineData[1].title = month2020
              saleLineData[1].data = line2019,
              that.setData({
                saleColumnData:saleColumnData,
                saleLineData:saleLineData,
                ifTwoData:true
              })
              that.doColumn2020()
              that.doColumn2019()
              that.doLine2020()
              that.doLine2019()
            }
          ).catch(res => {
            that.setData({
               ifTwoData:false
            })
          });
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
                  if(list[x].year ==that.data.thisYear){
                    arr2020.push(list[x].shareMoneyMember)
                    area2020.push(list[x].areaName)
                  }else if(list[x].year ==that.data.lastYear){
                    arr2019.push(list[x].shareMoneyMember)
                    area2019.push(list[x].areaName)
                  }
              }
              var main = that.data.main
              main[0].categories = area2020
              main[0].data = arr2020
              main[0].title = that.data.thisYear
              main[1].categories = area2020
              main[1].data = arr2019
              main[1].title = that.data.lastYear
              that.setData({
                main:main,
                ifAreaData:true
              })
              that.doAreaChart()
            }
          ).catch(res => {
            that.setData({
               ifAreaData:false
            })
          });
           
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
            dataLabel: true
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
                    color: '#ffffff'
                }
            },
            width: windowWidth-25,
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
            width: windowWidth-25,
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
            background:'#000000',
            type: 'line',
            categories: this.data.saleLineData[0].title,
            animation: true,
            series: [{
                name: '会员销售占比',
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
            width: windowWidth-50,
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
                return category + '月会员销售占比' + ':' + item.data
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
            width: windowWidth-25,
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
                name: '会员销售占比',
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
            width: windowWidth-50,
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
                return category + '月会员销售占比' + ':' + item.data
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
        var thisYear = date.getFullYear()
        var lastYear = date.getFullYear()-2
        var month =  (date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1)
        var day =  (date.getDate())>=10?(date.getDate()):'0'+(date.getDate())
        var today = date.getFullYear()+'年'+(month)+'月'+(day)+'日'
        var showDate = (month)+'/'+(day)
        var week = "日一二三四五六".charAt(new Date(date).getDay())
        this.setData({
            date: e.detail.value,
            showDate,
            today,
            week,
            thisYear,
            lastYear
        })
        this.getTop()
      },
    showPopup(e){
        if(e.target.dataset.mark=='trend2020'){
            this.setData({
                trend2020:this.data.trend2020==750?600:750,
                trend2020Des:!this.data.trend2020Des
            })
        }else if(e.target.dataset.mark=='trend2019'){
            this.setData({
                trend2019:this.data.trend2019==750?550:750,
                trend2019Des:!this.data.trend2019Des
            })
        }
        // this.setData({
        //     show:true,
        // })
    },
    onClose(e){
        this.setData({
            show:false
        })
    },
    showDetail(e){
        wx.showModal({
          title:'口径说明',
          content:'会员总数：注册总人数(含潜客)\r\n招新人数：本年注册人数(含潜客)。\r\n招新转化率：招新消费人数/招新人数。\r\n招新复购率：招新消费2天及以上人数/招新消费人数\r\n老会员回购率：去年消费的会员，今年继续消费的比例。',
          showCancel:false
        })
    },
    toSelect(e){
        wx.redirectTo({
          url: 'select',
        })
    }
})