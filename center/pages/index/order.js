// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
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
    nowNum:'',
    name:'',
    level:'',
    point:0,
    total:0,
    lists:[
      {

      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if(phoneNo.length>1){
      console.log(options.point)
      that.setData({
        name:options.name||'',
        point:options.point||0,
        level:options.level||''
      })
      that.getInfo()
    }else{
      Toast({
        message: '登录失效，请重新授权登录',
        type: 'warning'
      });
      setTimeout(()=>{
        wx.redirectTo({
          url: 'index'
        })
      },1000)
    }
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
      phone: 15979129664,
      // phone:wx.getStorageSync('phoneNo'),
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/QueryMemOrderInfo', 'body', data, 0, false, false,true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.status==0||res.status==2){
          let x = []
          if(res.orderEntryList.length>0){
            res.orderEntryList.map((item)=>{
              x.push((item.actAmount||0)-1+1)
            })
            let total = x.reduce(function(prev,cur,index,array){
              return prev + cur
            })
            that.setData({
              total
            })
          }
          
          that.setData({
            orderLists:res.orderEntryList
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
  showDetail(e){
    wx.removeStorageSync('orderdetail')
    let x = e.currentTarget.dataset.index
    wx.setStorageSync('orderdetail', this.data.orderLists[x])
    wx.navigateTo({
      url: 'orderDetail',
    })
  }
})