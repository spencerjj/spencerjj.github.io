// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId,
  HOST_URI
} from '../../config.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var QRCode = require('../../utils/code.js')
var oricode = require('../../utils/qrcode.js')
import {barcode} from '../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    cards:[],
    show:false,
    nowNum:'',
    lists:[],
    endLists:[],
    title:'',
    remarks:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data
      })
      that.getInfo()
    }).then()
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
    this.onLoad()
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
  getInfo(e){
    var that = this;
    var data = {
      corp_code: storeId,
      mobile:that.data.userInfo.phone,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getEventRegistList', 'body', data, 0, false, false,true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.result=='true'){
          let lists = res.data
          let endLists = []
          var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
          lists.map(item=>{
            item.event.fileUrl=HOST_URI+'customer/'+item.event.fileUrl
            item.compare = new Date().getTime()>new Date(item.event.startTime.replace(/-/g,'/')).getTime()?'进行中':'即将开始'
            if(item.event.startTime==item.event.endTime){
              var myDate = new Date(Date.parse(item.event.startTime.slice(0,10)));  
              item.actTime = item.event.startTime.slice(0,10).replace(/-/g,'/')+' '+weekDay[myDate.getDay()]+' '+item.event.startTime.slice(-5)
            }else{
              item.actTime = item.event.startTime.slice(0,10).replace(/-/g,'/')+' ~ '+item.event.endTime.slice(5,10).replace(/-/g,'/')
            }
            if(item.status!=0){
              endLists.push(...item)
            }
          })


        that.setData({
            lists:res.data,
            endLists
          })
        }else{
          Toast({
            message: res.message,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  onChange(e){
    this.setData({
      current:e.detail.index
    })
  },
  onClose() {
    this.setData({
      show1: false,
      show2:false
    })
    setTimeout(()=>{
      this.setData({
        show:false
      })
    },300)
    this.onLoad()
  },
  recommend(e){
    wx.navigateTo({
      url: 'recommend?no='+e.currentTarget.dataset.no,
    })
  },
  showCode(e){
    console.log(e.detail)
      var that = this;
      that.createQrCode(e.detail.id,'canvas',230,230)
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        nowNum:e.detail.id,
        title:e.detail.title,
        remarks:e.detail.remarks
      })
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          show: true
        })
        setTimeout(()=>{
          this.setData({
            show1:true,
          })
        },50)
        setTimeout(()=>{
          this.setData({
            show2:true
          })
        },300)
      }, 300)
  },
  createQrCode: function (content, canvasId, cavW, cavH) {
    QRCode.api.draw(content, canvasId, cavW, cavH);
  }
})