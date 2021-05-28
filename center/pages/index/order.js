// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {store,storeId} from '../../config.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    orderLists:[
      1
    ],
    show:false,
    userInfo:'',
    lists:[],
    sonLists:[],
    payLists:[]
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
    var userInfo = that.data.userInfo
    var data = {
      memNum: '1-106839358',
      store:store,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/queryMemOrderInfo', 'body', data, 0, false, false,true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.code=='SEL_000'){
        that.setData({
            lists:res.orderInfo
          })
        }else{
          that.setData({
            lists:''
          })
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg,
        type: 'warning'
      });
    });
  },
  showDetail(e){
    let x = e.currentTarget.dataset.index
    this.setData({
      sonLists:this.data.lists[x].listOfOrderDteailsEntry.orderDteailsEntry,
      payLists:this.data.lists[x].listOfOrderPaymentEntry.orderPaymentEntry
    })
    wx.showLoading({
      title: '加载中',
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
    }, 300)
  },
  close(){
    this.setData({
      show1: false
    })
 
    setTimeout(()=>{
      this.setData({
        show:false
      })
    },300)
  }
})