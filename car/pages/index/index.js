// pages/index/index.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    imgLists:['/images/banner1.png','/images/banner1.png'],
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2021, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    trueDate:'',
    start:'',
    end:'',
    array:[1,2,3,4,5,6,7,8,9,10],
    peoIndex:-1,
    today:'',
    num:0,
    flight:'',
    show:false,
    comment:'',
    showCom:'',
    steps: [
      {
        desc: '申请用车',
      },
      {
        desc: '分配处理',
      },
      {
        desc: '司机确认',
      },
      {
        desc: '结束行程',
      },
    ],
    startDate: "出发时间",
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
    var today = date.getFullYear() + '-' + (month) + '-' + (day)
    this.setData({
      today:today
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
  startInput(e){
    this.setData({
      start:e.detail.value
    })
  },
  endInput(e){
    this.setData({
      end:e.detail.value
    })
  },
  bindPeoChange(e){
    this.setData({
      peoIndex:e.detail.value
    })
  },
  commentInput(e){
    let comment = e.detail.value
    this.setData({
      comment,
      num:e.detail.value.length
    })
  },
  flightInput(e){
    this.setData({
      flight:e.detail.value
    })
  },
  showComment(e){
    this.setData({
      show:true
    })
  },
  addComment(){
    this.setData({ 
      show: false,
      showCom:this.data.comment
     });
  },
  onClose() {
    this.setData({ show: false });
  },
  confirm(e){
    var that = this;
    if(that.data.start.length<1){
      Dialog.alert({
        title: '提示',
        message: '请填写您从哪儿出发',
      })
      return;
    }else if(that.data.end.length<1){
      Dialog.alert({
        title: '提示',
        message: '请填写您要去哪儿',
      })
      return;
    }else if(that.data.peoIndex==-1){
      Dialog.alert({
        title: '提示',
        message: '请选择乘车人数',
      })
      return;
    }
    var data = {
      start:that.data.start,
      end:that.data.end,
      people:that.data.peoIndex+1,
      comment:comment
    }

    if(that.data.active==1||that.data.active==3&&that.data.trueDate.length==0){
      Dialog.alert({
        title: '提示',
        message: '请选择您的出发时间',
      })
      return;
    }
    if(that.data.active==1||that.data.active==3){
      data.trueDate = that.data.trueDate
    }
    if(that.data.active==2&&that.data.flight.length==0){
      Dialog.alert({
        title: '提示',
        message: '请选择您的航班号',
      })
      return;
    }
    if(that.data.active==2){
      data.flight = that.data.flight
    }
    console.log(data)
    Dialog.confirm({
      title: '提示',
      message: '确认申请用车吗',
      asyncClose: true
    })
      .then(() => {
        setTimeout(() => {
          Dialog.close();
          wx.navigateTo({
            url: 'distribution',
          })
        }, 2000);
      })
      .catch(() => {
        Dialog.close();
      });
  },
  dChange(e){
    console.log(e.detail)
    this.setData({
      trueDate:e.detail.trueDate
    })
  },
  onChange(e){
    console.log(e.detail.index)
    this.setData({
      active:e.detail.index,
      start:'',
      end:'',
      num:0,
      flight:'',
      comment:'',
      showCom:'',
      peoIndex:-1
    })
  },
})