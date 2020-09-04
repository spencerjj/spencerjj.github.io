import * as echarts from '../../utils/ec-canvas/echarts';

let chart = null;
var chart1_data = ''
function setOption(chart, xlist, ylist1, ylist2){
    var option = {
      color: ['#39a0ff', '#4ecb74'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true,
        // formatter(param){
        //   return "增长:" + (param[0].data-param[1].data)
        // }
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
      xAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: true },
          data: xlist,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      series: [
        {
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
    chart1_data:[
      {
        data:['5931', 3698, 3737, 2737,1943,918],
        rate:['29.8%','18.9%','17.5%','13.3%','13.9%','6.6%'],
        title:['南区', '江苏区', '西区', '浙沪区','北区','电商区']
      },
      {
        data:[4162, 2638, 2441, 1852,2462,1076],
        rate:['30.3%','18.8%','19.0%','13.9%','12.5%','5.5%'],
        title:['南区', '江苏区', '西区', '浙沪区','北区','电商区']
      }
    ],
  },
  onLoad(e){
    this.oneComponent = this.selectComponent('#mychart-dom-bar');
    this.init1(this.data.chart1_data[0].title,this.data.chart1_data[0].data,this.data.chart1_data[1].data)
  },
  onShow(e){
    
  },
  init1: function (xdata, ylist1, ylist2) {           //初始化第一个图表
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, xdata, ylist1, ylist2)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

});
