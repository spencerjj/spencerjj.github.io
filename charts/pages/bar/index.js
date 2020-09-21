import * as echarts from '../../utils/ec-canvas/echarts';
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import format from '../../utils/time.js'
let chart = null;
var chart1_data = ''

function setOption(chart, xlist, ylist1, ylist2) {
  var option = {
    color: ['#39a0ff', '#4ecb74'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true,
      formatter(param) {
        if((param[0].data - param[1].data)>0){
          return "增长:" + (param[0].data - param[1].data)
        }else{
          return "减少:" + (param[0].data - param[1].data)
        }
        
      }
    },
    legend: {
      data: ['2020', '2019'],
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [{
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }],
    yAxis: [{
      type: 'category',
      axisTick: {
        show: true
      },
      data: xlist,
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }],
    series: [{
        name: '2020',
        type: 'bar',
        // formatter: '{b}:{c}',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: ylist1,
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '2019',
        type: 'bar',
        stack: '总量',
        // formatter: '{b}:{c}',
        label: {
          normal: {
            show: true
          }
        },
        data: ylist2,
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}
Page({
  data: {
    ec: {
      lazyLoad: true
    },
    chart1_data: [{
        data: [],
        // rate: ['29.8%', '18.9%', '17.5%', '13.3%', '13.9%', '6.6%'],
        title: []
      },
      {
        data: [],
        // rate: ['30.3%', '18.8%', '19.0%', '13.9%', '12.5%', '5.5%'],
        title: []
      }
    ],
    tableDate:[]
  },
  onLoad(e) {
    var that = this
    this.oneComponent = this.selectComponent('#mychart-dom-bar');
    console.log(this.options.date)
    var data = {
      __sid: wx.getStorageSync('chartsUser').sid,
      __ajax: 'json',
      lastDate: this.options.date,
      pageNo: 1,
      pageSize: 100
    }
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
        var tableDate = that.data.tableDate
        var total2019 = 0
        var total2020 = 0
        var sonNum = list.length/2
        for(let x in list){
          if(list[x].year=='2020'){
            total2020 = total2020+list[x].shareMoneyMember
          }else if(list[x].year=='2019'){
            total2019 = total2019+list[x].shareMoneyMember
          }
        }
        for(let x in list){
          if(x<sonNum){
            var temp ={
              areaName:list[x].areaName,
              year2020:list[x].shareMoneyMember,
              year2019:list[x-1+1+sonNum].shareMoneyMember,
              rate2020:(list[x].shareMoneyMember/total2020*100).toFixed(1),
              rate2019:(list[x-1+1+sonNum].shareMoneyMember/total2019*100).toFixed(1),
              compare:list[x].shareMoneyMember-list[x-1+1+sonNum].shareMoneyMember
            }
            tableDate.push(temp)
          }
        }
        console.log(tableDate)
        
        var arr2020 = []
        var arr2019 = []
        var area2020 = []
        var area2019 = []
        for (let x in list) {
          if (list[x].year == '2020') {
            arr2020.push(list[x].shareMoneyMember)
            area2020.push(list[x].areaName)
          } else if (list[x].year == '2019') {
            arr2019.push(list[x].shareMoneyMember)
            area2019.push(list[x].areaName)
          }
        }
        var chart = that.data.chart1_data
        chart[0].title = area2020
        chart[1].title = area2019
        chart[0].data = arr2020
        chart[1].data = arr2019
        that.setData({
          chart1_data:chart,
          tableDate:tableDate.reverse()
        })
        that.init1(area2020, arr2020, arr2019)
      }
    )
  },
  onShow(e) {

  },
  init1: function (xdata, ylist1, ylist2) { //初始化第一个图表
    this.oneComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      setOption(chart, xdata, ylist1, ylist2) //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

});