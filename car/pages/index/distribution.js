// pages/index/index.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    peoIndex:-1,
    array:['老王','老张','老范','老六','老五'],
    date:'2021-3-23',
    time:'11:30',
    start:'普林仕集团办公楼门口',
    end:'常州高铁总站',
    flight:'UK2356',
    type:'接机',
    num:3,
    show:false,
    comment:'123123123123',
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    show:false,
    comment:'',
    showCom:'',
    steps: [
      {
        text: '11-10 11:10',
        desc: '申请用车',
      },
      {
        text: '　',
        desc: '分配处理',
      },
      {
        text: '　',
        desc: '开始行程',
      },
      {
        text: '　',
        desc: '结束行程',
      },
    ],
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
    this.compare(this.data.date)
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
  onChange(e){
    this.setData({
      active:e.detail.index
    })
  },
  swiperChange(e){
    this.setData({
      active:e.detail.current
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
  switch(e){
    this.setData({
      active:1
    })
  },
  confirm(e){
    var that = this;
    if(that.data.peoIndex==-1){
      Dialog.alert({
        title: '提示',
        message: '请选择分配司机',
      })
      return;
    }
    Dialog.confirm({
      title: '提示',
      message: '确认分配吗',
      asyncClose: true
    })
      .then(() => {
        setTimeout(() => {
          Dialog.close();
          wx.navigateTo({
            url: 'finish',
          })
        }, 2000);
      })
      .catch(() => {
        Dialog.close();
      });
  },
  compare(e){
    var that = this
    var myDate = new Date(e)
    var myYear = myDate.getFullYear()
    var myMonth = myDate.getMonth()+1
    var myDay = myDate.getDate()
    var tdate = new Date()
    var year = tdate.getFullYear()
    var month = tdate.getMonth() + 1
    var day = tdate.getDate()
    console.log(day+','+myDay)
    if(myYear==year&&myMonth==month&&myDay>=day){
      if(myDay==day){
         that.setData({
           date:'今天'
         })
      }else if(myDay-day==1){
        that.setData({
          date:'明天'
        })
      }else if(myDay-day == 2){
        that.setData({
          date:'后天'
        })
      }else{
        that.setData({
          date:that.dateForm(myDate)
        })
      }
    }else{
        that.setData({
          date:that.dateForm(myDate)
        })
    }
  },
  dateForm(e){
    var date = new Date(e)
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
    var date = date.getFullYear() + '年' + (month) + '月' + (day) + '日'
    return date
  }
})