// pages/index/card.js
import {
  getApiHost,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId
} from '../../config.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    cards:[],
    show:false,
    nowNum:'',
    lists:[],
    borrowLists:[]
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
      if(Number(options.active==1)){
        that.getRecord()
      }
      that.setData({
        active:Number(options.active)||0
      })
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
      store: store,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/queryRentalItems', 'body', data, 0, false, false,true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.code=='SEL_000'){
          var lists = res.items
          that.setData({
            lists
          })
        }else{
          Toast({
            message: res.msg,
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
  getRecord(e){
    var that = this;
    var data = {
      store: store,
      memNum:that.data.userInfo.memNum,
      // memNum:'I-11325050',
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/queryRentalItemsRecord', 'body', data, 0, false, false,true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.code=='SEL_000'){
          that.setData({
            borrowLists:res.rentalItemsRecord.listOfRentalItemsRecord.rentalItemsEnery
          })
        }else{
          // Toast({
          //   message: res.msg,
          //   type: 'warning'
          // });
          that.setData({
            borrowLists:[]
          })
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
    if(e.detail.index==0){
      this.getInfo()
    }else{
      this.getRecord()
    }
  },
  onClose() {
    this.setData({
      show: false
    })
    this.onLoad()
  },
  recommend(e){
    wx.navigateTo({
      url: 'recommend?no='+e.currentTarget.dataset.no,
    })
  },
})