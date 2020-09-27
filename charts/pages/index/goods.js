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
      var day =  (now.getDate()-1)>=10?(now.getDate()-1):'0'+(now.getDate()-1)
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
      this.getTop()
      },
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
                      content: '当天暂无数据，当前为'+that.data.rightTime+'数据',
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
              rightTime:that.data.date
             })
          }

        }
      ).catch(res => {
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#1890FF'
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
              vipRate2020:(res.data.list[0].rate*100).toFixed(2),
              vipRate2019:(res.data.list[1].rate*100).toFixed(2),
              vipCompare:((res.data.list[0].rate*100).toFixed(2)-(res.data.list[1].rate*100).toFixed(2)).toFixed(2)
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
              reCompare:((res.data.list[0].rat*100).toFixed(2)-(res.data.list[1].rat*100).toFixed(2)).toFixed(2)
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
              oldCompare:((res.data.list[0].rate*100).toFixed(2)-(res.data.list[1].rate*100).toFixed(2)).toFixed(2)
            })
            
          }
        )
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