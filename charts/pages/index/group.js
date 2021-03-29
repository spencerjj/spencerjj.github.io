// pages/index/group.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
var wxCharts = require('../../utils/wxcharts2.js');
var line = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:70,
    storeId:'',
    departCode2:'',
    totalData:'',
    storeData:[],
    cateList:[],
    dateList:[],
    ifRound: false,
    noewTime:'',
    ifStoreData:true,
    temp:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drowsyUserInfo()
    var storeId = options.storeId
    var departCode2 = options.departCode2
    var now = new Date()
    var hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()
    var minute = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()
    var second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds()
    var nowTime = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + (now.getDate()) + '日 ' + hour + ':' + minute + ':' + second
    this.setData({
      storeId,
      departCode2,
      nowTime
    })
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
    this.setData({
      sid: wx.getStorageSync('chartsUser').sid,
    })
    this.getData()
    this.getStore()
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
    this.onShow()
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
  login(e){
    // app.doLogin().then(data => {
    //     this.onShow()
    // })
    wx.redirectTo({
      url: 'welcome',
    })
  },
  getData() {
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      departCode2:that.data.departCode2,
      storeId:that.data.storeId
    }
    // 业务总览
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/findDeptSaleByCode', 'body', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        wx.stopPullDownRefresh();
        console.log(res)
        if (res.data == undefined) {
          wx.showToast({
            title: '当天暂无数据',
            image: '/images/00-8.png',
          })
          return;
        } else {
          var totalData = res.data
          if(totalData.goalRatio){
            totalData.mround = (totalData.goalRatio).toFixed(2)
            totalData.goalRatio = (totalData.goalRatio).toFixed(0)
          }
          if(totalData.yearGoalRatio){
            totalData.yround = (totalData.yearGoalRatio).toFixed(2)
            totalData.yearGoalRatio = (totalData.yearGoalRatio).toFixed(0)
          }
          that.setData({
            totalData
          })
        }
      }
    ).catch(res => {
      wx.showToast({
        title: res.message=="您的操作权限不足！"?'操作权限不足':res.message,
        image: '/images/00-8.png',
      })
    });
  },
  getStore(){
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      departId:that.data.departCode2,
      storeId:that.data.storeId,
      pageNo:1,
      pageSize:100
    }
    // 业务总览
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/findMframeSaleByCode', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        if (res.data == undefined) {
          wx.showToast({
            title: '当天暂无数据',
            image: '/images/00-8.png',
          })
          return;
        } else {
          var storeData = res.data.list
          var cateList = []
          var dateList = []
          storeData.map((item)=>{
            cateList.push(item.brandName)
            dateList.push(item.sales)
          })
          that.setData({
            storeData,
            cateList,
            dateList,
            ifStoreData:true
          })
          // this.doLine()
        }
      }
    ).catch(res => {
      that.setData({
        ifStoreData:false
      })
    });
  },
  doLine(e) {
    var windowWidth = 320;
    var that= this;
    try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }
    line = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'column',
      categories: that.data.cateList,
      series: [{
          name: '柜组销售额',
          data: that.data.dateList,
          format: function (val) {
              return val;
          }
    }],
      yAxis: {
          title: '',
          format: function (val) {
              return val;
          },
          min: 0
      },
      width:windowWidth-10,
      height: 300
  });
},
fresh() {
  this.setData({
    ifRound: true
  })
  this.onShow()
  setTimeout(() => {
    this.setData({
      ifRound: false
    })
  }, 1500)
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
        ctx.setFillStyle("rgba(0,0,0,.2)");
   
        ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, 50 * j);
        for (let i = 1; i < 10; i++) {//这个for循环代表横向循环，
          ctx.beginPath();
          ctx.setFontSize(20);
          ctx.setFillStyle("rgba(0,0,0,.2)");
          ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, 100 * j);
        }
      }//两个for循环的配合，使得文字充满斜对角线的左下部分
   
      //对斜对角线以右部分进行文字的填充逻辑同上
      for (let j = 0; j < 10; j++) {
        ctx.beginPath();
        ctx.setFontSize(20);
        ctx.setFillStyle("rgba(0,0,0,.2)");
   
        ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, -50 * j);
        for (let i = 1; i < 10; i++) {
          ctx.beginPath();
          ctx.setFontSize(20);
          ctx.setFillStyle("rgba(0,0,0,.2)");
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
})