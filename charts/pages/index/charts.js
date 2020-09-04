var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var columnChart = null;
var lineChart = null;
var pieChart = null;
var chartData = {
    
    // sub: [{
    //     title: '2012年度成交量',
    //     data: [70, 40, 65, 100, 34, 18],
    //     categories: ['1', '2', '3', '4', '5', '6']
    // }, {
    //     title: '2013年度成交量',
    //     data: [55, 30, 45, 36, 56, 13],
    //     categories: ['1', '2', '3', '4', '5', '6']
    // }, {
    //     title: '2014年度成交量',
    //     data: [76, 45, 32, 74, 54, 35],
    //     categories: ['1', '2', '3', '4', '5', '6']                
    // }, {
    //     title: '2015年度成交量',
    //     data: [76, 54, 23, 12, 45, 65],
    //     categories: ['1', '2', '3', '4', '5', '6']
    // }]
};
Page({
    data: {
        chartTitle: '总成交量',
        isMainChartDisplay: true,
        main: [
            {
                title: '总成交量',
                data: [8, 2, 7, 3,8,6,3,2,1],
                categories: ['1', '2', '3', '4','5', '6', '7', '8']
            },
            {
                title: '总访问量',
                data: [1, 2, 5, 7,6,9,3,1,2,],
                categories: ['1', '2', '3', '4','5', '6', '7', '8']
            }
        ],
        lists:[1,2,3,4,5]
    },
    onLoad: function (e) {
        this.doPie()
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        
        var simulationData = this.createSimulationData();
        lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: [1,2,3,4,5,6,7,8],
            animation: true,
            // background: '#f5f5f5',
            series: [
                // {
                //     name: '成交量1',
                //     data: simulationData.data,
                //     format: function (val, name) {
                //         return val.toFixed(2) + '万';
                //     }
                // }, 
            {
                name: ' ',
                color:'#f784a5',
                data: [2, 1, 5, 3, 1, 4, 7, 8],
                format: function (val, name) {
                    return val;
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
                max:10
            },
            width: windowWidth,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },
    createSimulationData: function () {
        var categories = [];
        var data = [];
        for (var i = 0; i < 10; i++) {
            categories.push('2016-' + (i + 1));
            data.push(Math.random()*(20-10)+10);
        }
        // data[4] = null;
        return {
            categories: categories,
            data: data
        }
    },
    touchHandler: function (e) {
        console.log(lineChart.getCurrentDataIndex(e));
        lineChart.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });
    },   
    onReady: function (e) {
        var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }

        columnChart = new wxCharts({
            canvasId: 'columnCanvas',
            type: 'column',
            animation: true,
            categories: this.data.main[0].categories,
            series: [{
                name: '成交量',
                color:'#39a0ff',
                data: this.data.main[0].data,
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
                    width: 5,
                    color:'#000000'
                }
            },
            width: windowWidth,
            height: 200
        });
    },
    doPie(e){
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: [{
                name: '成交量1',
                data: 15,
                color:'green'
            }, {
                name: '成交量2',
                data: 35,
            }, {
                name: '成交量3',
                data: 78,
            }, {
                name: '成交量4',
                data: 63,
            }, {
                name: '成交量2',
                data: 35,
            }, {
                name: '成交量3',
                data: 78,
            }, {
                name: '成交量4',
                data: 63,
            }, {
                name: '成交量2',
                data: 35,
            }, {
                name: '成交量3',
                data: 78,
            }, {
                name: '成交量3',
                data: 78,
            }],
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    },
    touchHandler1: function (e) {
        console.log(pieChart.getCurrentDataIndex(e));
        pieChart.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return 123
            }
        });
    }, 
});