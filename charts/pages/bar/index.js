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
let chart1 = null;
var chart1_data = ''

function setOption(chart, xlist, ylist1, ylist2,thisYear,lastYear) {
  var option = {
    color: ['#39a0ff', '#4ecb74'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true,
      formatter(param) {
        if ((param[0].data - param[1].data) > 0) {
          return "增长:" + (param[0].data - param[1].data)
        } else {
          return "减少:" + (param[0].data - param[1].data)
        }

      }
    },
    legend: {
      data: [thisYear, lastYear],
      textStyle: {
        color: '#fff'
      },
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
      splitLine: {
        show: false
      },
      axisLabel: {
        color: '#fff'
      }
    }],
    yAxis: [{
      type: 'category',
      axisTick: {
        show: true
      },
      splitLine: {
        show: false
      },
      data: xlist,
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#fff'
      }
    }],
    series: [{
        name: thisYear,
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
        name: lastYear,
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

function dochart1(chart1) {
  console.log(123)
  var option = {
    title: {
      text: '测试下面legend的红色区域不应被裁剪',
      left: 'center',
      textStyle: {
        color: '#fff'
      },
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['A', 'B', 'C'],
      top:30,
      left: 'center',
      backgroundColor: '#fff',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#fff'
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }, {
      name: 'B',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }]
  };
  chart1.setOption(option);
  return chart1;
}

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    ec2: {
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
    tableDate: [],
    thisYear: '',
    lastYear: ''
  },
  onLoad(e) {
    var that = this
    this.drowsyUserInfo()
    this.oneComponent = this.selectComponent('#mychart-dom-bar');
    this.oneComponent1 = this.selectComponent('#mychart-dom-line');
    console.log(this.options.date)
    var now = new Date(this.options.date)
    var thisYear = now.getFullYear()
    var lastYear = now.getFullYear() - 2
    that.setData({
      thisYear: thisYear,
      lastYear: lastYear
    })
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
        if (list.length == 0) {
          wx.showModal({
            title: '提示',
            content: '当天暂无数据',
          })
          return;
        }
        var tableDate = that.data.tableDate
        var total2019 = 0
        var total2020 = 0
        var sonNum = list.length / 2
        for (let x in list) {
          if (list[x].year == that.data.thisYear) {
            total2020 = total2020 + list[x].shareMoneyMember
          } else if (list[x].year == that.data.lastYear) {
            total2019 = total2019 + list[x].shareMoneyMember
          }
        }
        list.map((item, index) => {
          if (index < sonNum) {
            var temp = {
              areaName: list[index].areaName,
              year2020: list[index].shareMoneyMember,
              year2019: list[index - 1 + 1 + sonNum].shareMoneyMember,
              rate2020: (list[index].shareMoneyMember / total2020 * 100).toFixed(1),
              rate2019: (list[index - 1 + 1 + sonNum].shareMoneyMember / total2019 * 100).toFixed(1),
              compare: list[index].shareMoneyMember - list[index - 1 + 1 + sonNum].shareMoneyMember
            }
            tableDate.push(temp)
          }
        })
        var total2020 = 0
        var total2019 = 0
        list.map((item, index) => {
          if (index < sonNum) {
            total2020 += Number(list[index].shareMoneyMember)
            total2019 += Number(list[index - 1 + 1 + sonNum].shareMoneyMember)
          }
        })
        var temp = {
          areaName: '总计',
          year2020: total2020,
          year2019: total2019,
          rate2020: '100',
          rate2019: '100',
          compare: total2020 - total2019
        }
        tableDate.unshift(temp)
        console.log(tableDate)

        // for(let x in list){
        //   if(x<sonNum){
        //     var temp ={
        //       areaName:list[x].areaName,
        //       year2020:list[x].shareMoneyMember,
        //       year2019:list[x-1+1+sonNum].shareMoneyMember,
        //       rate2020:(list[x].shareMoneyMember/total2020*100).toFixed(1),
        //       rate2019:(list[x-1+1+sonNum].shareMoneyMember/total2019*100).toFixed(1),
        //       compare:list[x].shareMoneyMember-list[x-1+1+sonNum].shareMoneyMember
        //     }
        //     tableDate.push(temp)
        //   }
        // }
        console.log(tableDate)

        var arr2020 = []
        var arr2019 = []
        var area2020 = []
        var area2019 = []
        for (let x in list) {
          if (list[x].year == that.data.thisYear) {
            arr2020.push(list[x].shareMoneyMember)
            area2020.push(list[x].areaName)
          } else if (list[x].year == that.data.lastYear) {
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
          chart1_data: chart,
          tableDate: tableDate.reverse()
        })
        that.init1(area2020, arr2020, arr2019,that.data.thisYear+'',that.data.lastYear+'')
        // that.init2()
      }
    )
  },
  onShow(e) {

  },
  init1: function (xdata, ylist1, ylist2,thisYear,lastYear) { //初始化第一个图表
    this.oneComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      setOption(chart, xdata, ylist1, ylist2,thisYear,lastYear) //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },
  init2: function () { //初始化第一个图表
    this.oneComponent1.init((canvas, width, height, dpr) => {
      const chart1 = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      dochart1(chart1) //赋值给echart图表
      this.chart1 = chart1;
      return chart1;
    });
  },
    // 添加水印
    drowsyUserInfo () {
      var that= this
      // var userInfo = wx.getStorageSync('userInfo');
      // var name_xx = userInfo.username || userInfo.nickName;
      var ctx = wx.createCanvasContext("myCanvas1");
   
      ctx.rotate(45 * Math.PI / 180);//设置文字的旋转角度，角度为45°；
   
      //对斜对角线以左部分进行文字的填充
      for (let j = 1; j < 10; j++) { //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
        ctx.beginPath();
        ctx.setFontSize(20);
        ctx.setFillStyle("rgba(255,255,255,.1)");
   
        ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, 50 * j);
        for (let i = 1; i < 10; i++) {//这个for循环代表横向循环，
          ctx.beginPath();
          ctx.setFontSize(20);
          ctx.setFillStyle("rgba(255,255,255,.1)");
          ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, 100 * j);
        }
      }//两个for循环的配合，使得文字充满斜对角线的左下部分
   
      //对斜对角线以右部分进行文字的填充逻辑同上
      for (let j = 0; j < 10; j++) {
        ctx.beginPath();
        ctx.setFontSize(20);
        ctx.setFillStyle("rgba(255,255,255,.1)");
   
        ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, -50 * j);
        for (let i = 1; i < 10; i++) {
          ctx.beginPath();
          ctx.setFontSize(20);
          ctx.setFillStyle("rgba(255,255,255,.1)");
          ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, -100 * j);
        }
      }
    ctx.draw(true, function () {
      //保存临时文件
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas1',
        success: function (res) {
          console.log(res.tempFilePath)
          that.setData({
            temp:res.tempFilePath
          })
        }
      },this)
    })
  }

});