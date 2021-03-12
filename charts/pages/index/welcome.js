// pages/index/welcome.js
const config = require('../../config.js');
const HOST_URI = config.HOST_URI;
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pro:0,
    gifLeft:2,
    ifLogin:false,
    userStoreList:[
      {
        storeCode:'601',
        ifStore:false,
      },
      {
        storeCode:'602',
        ifStore:false,
      },
      {
        storeCode:'603',
        ifStore:false,
      },
      {
        storeCode:'lampo',
        ifStore:false,
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync('chartsUser')
    wx.removeStorageSync('userStoreList')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  login(e){
    app.doLogin().then(data => {
      this.setData({
        ifLogin:true
      })
    })
  },
  onShow: function () {
    this.loading()
    this.login()
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
  loading(e){
    var set = setInterval(()=>{
      this.setData({
        pro:this.data.pro==90?this.data.pro:this.data.pro+1,
      })
      if(this.data.gifLeft<82){
        this.setData({
          gifLeft:this.data.gifLeft+0.9
        })
      }
      if(this.data.pro==90){
        if(this.data.ifLogin){
          console.log(123)
          clearInterval(set)
          this.toPage()
        }
      }
    },15)
  },
  toPage(){
    var go = setInterval(()=>{
      this.setData({
        pro:this.data.pro==100?this.data.pro:this.data.pro+1,
      })
      if(this.data.gifLeft<90){
        this.setData({
          gifLeft:this.data.gifLeft+0.9
        })
      }
      if(this.data.pro==100){
        if(this.data.ifLogin){
          clearInterval(go)
          console.log(wx.getStorageSync('chartsUser'))
          let menus = wx.getStorageSync('chartsUser').userMenus
          let userStoreList = this.data.userStoreList
          menus.map((item)=>{
            if(item.permission=='bhreport:601:view'){
              userStoreList[0].ifStore = true
            }else if(item.permission=='bhreport:602:view'){
              userStoreList[1].ifStore = true
            }else if(item.permission=='bhreport:603:view'){
              userStoreList[2].ifStore = true
            }else if(item.permission=='lampo'){
              userStoreList[3].ifStore = true
            }
          })
          wx.removeStorageSync('userStoreList')
          wx.setStorageSync('userStoreList', userStoreList)
          for(let x in menus){
            if(menus[x].permission=='bhreport:group:view'){
              app.globalData.changeShow = true
              wx.redirectTo({
                url: 'select'
              })
              console.log('集团')
              return false;
            }
          }
          for(let x in menus){
            if(menus[x].permission=='bhreport:overview:view'){
              console.log('百货')
              wx.redirectTo({
                url: 'depart'
              })
              return false;
            }
          }
          for(let x in menus){
            if(menus[x].permission=='lampo'){
              console.log('蓝豹')
              wx.switchTab({
                url: 'index'
              })
              return false;
            }
          }
          wx.showToast({
            title: '暂无查看权限',
            image: '/images/00-8.png'
          })
        }
      }
    },15)
  }
})