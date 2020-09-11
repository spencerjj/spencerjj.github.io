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
        option1: [
            { text: '全部商品', value: 0 },
            { text: '新款商品', value: 1 },
            { text: '活动商品', value: 2 },
          ],
          option2: [
            { text: '默认排序', value: 'a' },
            { text: '好评排序', value: 'b' },
            { text: '销量排序', value: 'c' },
          ],
          value1: 0,
          value2: 'a',
        ifUp: false,
        lists: [1, 2, 3, 4, 5],
        date:'2019-09',
        yestoday:'',
        main: [{
                title: '2019',
                data: [5931, 3698, 3737, 2737, 2462, 1076],
                categories: ['南区', '江苏区', '西区', '浙沪区', '北区', '电商区']
            },
            {
                title: '2020',
                data: [4162, 2638, 2441, 1852, 1943, 918],
                categories: ['南区', '江苏区', '西区', '浙沪区', '北区', '电商区']
            }
        ],
        pieData:[{
            name: '新会员 28%',
            data: 28,
            color: 'green'
        }, {
            name: '非会员 21%',
            data: 21,
        }, {
            name: '老会员 51%',
            data: 51,
        }],
        saleColumnData:[
            {
                title:[1,2,3,4,5,6,7,8,9],
                data:[3487, 262, 1094, 1924, 2203, 1983, 1285, 1490, 225]
            },
            {
                title:[1,2,3,4,5,6,7,8,9],
                data:[3647, 3014, 2608, 2849, 2418, 1995, 1431, 1411, 291]
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
        this.doPie2020()
        this.doPie2019()
        this.doAreaChart()
        this.doColumn2020()
        this.doLine2020()
        this.doColumn2019()
        this.doLine2019()
        var now = new Date()
        var yestoday = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+(now.getDate()-1)
        var showDate = new Date(yestoday)
        console.log(yestoday)
        this.setData({
            today: now.format('yyyy-MM-dd'),
            yestoday:yestoday,
            date: showDate.format('yyyy-MM-dd'),
            showDate:showDate.format('MM/dd'),
            thisYear:now.getFullYear(),
            year:now.getFullYear()
          })
    },
    toPage(e) {

    },
    up(e) {
        if (!this.data.ifUp) {
            this.doPie2020()
            this.doPie2019()
        } else {
            wx.pageScrollTo({
                scrollTop: 0
            })
        }
        this.setData({
            ifUp: !this.data.ifUp
        })

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
            type: 'pie',
            series: this.data.pieData,
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
            type: 'pie',
            series: this.data.pieData,
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
          url: '../bar/index',
        })
    },
    bindDateChange(e){
        var date = new Date(e.detail.value)
        this.setData({
          showDate:date.format('MM/dd'),
          date:e.detail.value
        })
      },
})