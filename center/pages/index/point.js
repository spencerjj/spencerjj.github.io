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
    orderLists:[],
    show:false,
    nowNum:''
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
      memNum: that.data.userInfo.memNum,
      txnDateScope:'消费积分',
      store:store,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/memberPointTxnQuery', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.code=='SEL_000'){
          that.setData({
            orderLists:res.pointmessage.listOfMemberPointTxnInfo.pointTxnEntry
          })
        }else{
          that.setData({
            orderLists:[]
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
  toPage(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})