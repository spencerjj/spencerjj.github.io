import {
    getApiHost,
    postRequest,
    getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
var wxCharts = require('../../utils/wxcharts.js');
var column2020 = null;
var line2020 = null;
Page({
    data: {
        areaList: [{
                title: '',
                data: [],
                categories: []
            },
            {
                title: '',
                data: [],
                categories: []
            },
        ],
        fromList: [{
                title: '',
                data: [],
                categories: []
            },
            {
                title: '',
                data: [],
                categories: []
            },
        ],
        brandList: [{
                title: '',
                data: [],
                categories: []
            },
            {
                title: '',
                data: [],
                categories: []
            },
        ],
        saleColumnData: [{
            title: [],
            data: []
        }],
        saleLineData: [{
            title: [],
            data: []
        }],
        date: '',
        yestoday: '',
        week: '',
        today: '',
        totalVip: 0,
        lastYear: '',
        thisYear: '',
        userName: '',
        userCode: '',
        sid: '',
        loginCode: '',
        officeName: '',
        pageNo: 1,
        pageSize: 100,
        rightTime: 0,
        yearData: '',
        dayData: '',
        monthData: '',
        ifYearData: true,
        ifMonthData: true,
        ifDayData: true,
        ifAreaList: true,
        ifBrandList: true,
        ifFromList: true,
        ifTwoData: true
    },
    onLoad: function () {
        var chartsUser = wx.getStorageSync('chartsUser');
        console.log(chartsUser)
        this.setData({
            userName: chartsUser.userName,
            userCode: chartsUser.userCode,
            sid: chartsUser.sid,
            loginCode: chartsUser.loginCode,
            officeName: chartsUser.officeName
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
            lastYear: now.getFullYear() - 1,
            week: week
        })
        this.getTop()

    },
    toPage(e) {
        var mark = e.target.dataset.mark
        wx.navigateTo({
            url: mark + '?date=' + this.data.date
        })
    },
    login(e) {
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
    getTop(e) {
        var that = this
        // console.log(that.data.date)
        var data = {
            __sid: that.data.sid,
            __ajax: 'json',
            lastDate: that.data.date,
            pageNo: 1,
            pageSize: 100
        }
        // 本年累计销售
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findYearRate', 'body', data, 0, false, false).then(
            res => {
                if (res.result && res.result == 'login') {
                    that.login()
                    console.log('登录失效')
                    return;
                }
                let list = res.data
                // list.rate1 = (list.invmoney / list.lastinvmoney - 1).toFixed(2)
                that.setData({
                    yearData: list,
                    rightTime: that.data.date,
                    ifYearData: true
                })
            }
        ).catch(res => {
            that.setData({
                ifYearData: false
            })
        });
        // 本日累计销售
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findDateRate', 'body', data, 0, false, false).then(
            res => {
                if (res.result && res.result == 'login') {
                    that.login()
                    console.log('登录失效')
                    return;
                }
                if (res.data == undefined) {
                    wx.showModal({
                        title: '提示',
                        content: '当天暂无数据,请重新选择日期',
                    })
                    return;
                } else {
                    let list = res.data
                    that.setData({
                        dayData: list,
                        rightTime: that.data.date,
                        ifDayData: true
                    })
                }
            }
        ).catch(res => {
            that.setData({
                ifDayData: false
            })
        });

        // 本月累计销售
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findMonthRate', 'body', data, 0, false, false).then(
            res => {
                let list = res.data
                // list.rate1 = (list.invmoney / list.lastinvmoney - 1).toFixed(2)
                that.setData({
                    monthData: list,
                    ifMonthData: true
                })
            }
        ).catch(res => {
            that.setData({
                ifMonthData: false
            })
        });

        // 区域统计
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findAreaSumList', 'body', data, 0, false, false).then(
            res => {
                if (res.result && res.result == 'login') {
                    that.login()
                    console.log('登录失效')
                    return;
                }
                // console.log(res)
                let lists = res.data

                var areaList = [{
                        title: that.data.thisYear,
                        data: [],
                        categories: []
                    },
                    {
                        title: that.data.lastYear,
                        data: [],
                        categories: []
                    },
                ]
                for (let x in lists) {
                    if (lists[x].year == that.data.thisYear) {
                        areaList[0].data.push(lists[x].money.toFixed(0))
                        areaList[0].categories.push(lists[x].areaname)
                    } else if (lists[x].year == that.data.lastYear) {
                        areaList[1].data.push(lists[x].money.toFixed(0))
                        areaList[1].categories.push(lists[x].areaname)
                    }
                }
                that.setData({
                    areaList: areaList,
                    ifAreaList: true
                })
                that.showAreaChart()
            }
        ).catch(res => {
            that.setData({
                ifAreaList: false
            })
        });

        // 渠道统计
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findChannelSumList', 'body', data, 0, false, false).then(
            res => {
                if (res.result && res.result == 'login') {
                    that.login()
                    console.log('登录失效')
                    return;
                }
                // console.log(res)

                let lists = res.data
                var fromList = [{
                        title: that.data.thisYear,
                        data: [],
                        categories: []
                    },
                    {
                        title: that.data.lastYear,
                        data: [],
                        categories: []
                    },
                ]
                for (let x in lists) {
                    if (lists[x].year == that.data.thisYear) {
                        fromList[0].data.push(lists[x].money.toFixed(0))
                        fromList[0].categories.push(lists[x].channel)
                    } else if (lists[x].year == that.data.lastYear) {
                        fromList[1].data.push(lists[x].money.toFixed(0))
                        fromList[1].categories.push(lists[x].channel)
                    }
                }
                that.setData({
                    fromList: fromList,
                    ifFromList: true
                })
                that.showFromChart()
            }
        ).catch(res => {
            that.setData({
                ifFromList: false
            })
        });

        // 品牌统计
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findBrandSumList', 'body', data, 0, false, false).then(
            res => {
                if (res.result && res.result == 'login') {
                    that.login()
                    console.log('登录失效')
                    return;
                }
                // console.log(res)

                let lists = res.data
                var brandList = [{
                        title: that.data.thisYear,
                        data: [],
                        categories: []
                    },
                    {
                        title: that.data.lastYear,
                        data: [],
                        categories: []
                    },
                ]
                for (let x in lists) {
                    if (lists[x].year == that.data.thisYear) {
                        brandList[0].data.push(lists[x].money.toFixed(0))
                        brandList[0].categories.push(lists[x].ppmc)
                    } else if (lists[x].year == that.data.lastYear) {
                        brandList[1].data.push(lists[x].money.toFixed(0))
                        brandList[1].categories.push(lists[x].ppmc)
                    }
                }
                that.setData({
                    brandList: brandList,
                    ifBrandList: true
                })
                that.showBrandChart()
            }
        ).catch(res => {
            that.setData({
                ifBrandList: false
            })
        });
        //   全年销售
        getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findInmoneyAll', 'body', data, 0, false, false).then(
            res => {
                console.log(res)
                if (res.result && res.result == 'login') {
                    that.login()
                    console.log('登录失效')
                    return;
                }
                var list = res.data
                var arr2020 = []
                var month2020 = []
                var line2020 = [];
                for (let x in list) {
                    arr2020.push(list[x].invmoney)
                    line2020.push(list[x].incrate)
                    month2020.push(list[x].fimonth)
                }
                var saleColumnData = that.data.saleColumnData
                var saleLineData = that.data.saleLineData
                saleColumnData[0].title = month2020
                saleColumnData[0].data = arr2020,
                saleLineData[0].title = month2020
                saleLineData[0].data = line2020,
                    that.setData({
                        saleColumnData: saleColumnData,
                        saleLineData: saleLineData,
                        ifTwoData: true
                    })
                that.doLine2020()
                that.doColumn2020()
            }
        ).catch(res => {
            that.setData({
                ifTwoData: false
            })
        });
    },
    showAreaChart(e) {
        var that = this;
        var windowWidth = 300
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        var columnChart = new wxCharts({
            canvasId: 'areaCanvas',
            type: 'column',
            animation: true,
            categories: this.data.areaList[0].categories,
            series: [{
                    name: that.data.thisYear,
                    color: '#39a0ff',
                    data: this.data.areaList[0].data,
                    format: function (val, name) {
                        return val;
                    }
                },
                {
                    name: that.data.lastYear,
                    color: '#4ecb74',
                    data: this.data.areaList[1].data,
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
            width: windowWidth - 25,
            height: 200
        });
    },
    showFromChart(e) {
        var that = this;
        var windowWidth = 300
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        var columnChart = new wxCharts({
            canvasId: 'fromCanvas',
            type: 'column',
            animation: true,
            categories: this.data.fromList[0].categories,
            series: [{
                    name: that.data.thisYear,
                    color: '#39a0ff',
                    data: this.data.fromList[0].data,
                    format: function (val, name) {
                        return val;
                    }
                },
                {
                    name: that.data.lastYear,
                    color: '#4ecb74',
                    data: this.data.fromList[1].data,
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
            width: windowWidth - 25,
            height: 200
        });
    },
    showBrandChart(e) {
        var that = this;
        var windowWidth = 300
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        var columnChart = new wxCharts({
            canvasId: 'brandCanvas',
            type: 'column',
            animation: true,
            categories: this.data.brandList[0].categories,
            series: [{
                    name: that.data.thisYear,
                    color: '#39a0ff',
                    data: this.data.brandList[0].data,
                    format: function (val, name) {
                        return val;
                    }
                },
                {
                    name: that.data.lastYear,
                    color: '#4ecb74',
                    data: this.data.brandList[1].data,
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
            width: windowWidth - 25,
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
                name: '销售额',
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
                name: '同比',
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
    bindDateChange(e) {
        var date = new Date(e.detail.value)
        var thisYear = date.getFullYear()
        var lastYear = date.getFullYear()-1
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
        var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
        var today = date.getFullYear() + '年' + (month) + '月' + (day) + '日'
        var showDate = (month) + '/' + (day)
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
    touchHandler2020: function (e) {
        line2020.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                if(item.data.substring(0,1)!='-'){
                    return category + '月销售额同比:+' +item.data
                }else{
                    return category + '月销售额同比:' +item.data
                }
            }
        });
    },
    showDetail(e){
        console.log(123)
        wx.showModal({
          title:'口径说明',
          content:'销售总计：折线图为当月销售额同比。\r\n区域统计：’总公司‘-上海广场bespoke店、公司内卖和内卖（LV0001）及经销售卡(LV0013)的卡提货。\r\n渠道统计：‘其他’-上海广场bespoke店、公司内卖和赠送。',
          showCancel:false
        })
    },
    toSelect(e){
        wx.redirectTo({
          url: 'select',
        })
    }
})