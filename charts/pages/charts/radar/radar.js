var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var radarChart = null;
Page({
    data: {
        selection:['激情', '综合得分', '成果', '共赢', '极致']
    },
    touchHandler: function (e) {
        console.log(radarChart.getCurrentDataIndex(e));
    },
    onReady: function (e) {
        var that = this
        var windowWidth = 350;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        radarChart = new wxCharts({
            canvasId: 'radarCanvas',
            type: 'radar',
            categories: that.data.selection,
            series: [{
                name: '同级',
                data: [90, 110, 125, 95, 87]
            },{
                name: '下级',
                data: [80, 90, 85, 75, 107]
            },{
                name: '自评',
                data: [20, 110, 15, 35, 67],
                color:'#eee'
            },{
                name: '隔级上级',
                data: [20, 110, 15, 35, 67],
                color:'rgb(243, 243, 148)'
            }
        ],
            width: windowWidth,
            height: 300,
            extra: {
                radar: {
                    max: 150
                }
            }
        });
    }
});