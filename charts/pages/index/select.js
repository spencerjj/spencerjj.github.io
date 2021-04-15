import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import areaList from '../../utils/area.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    role: '',
    storeList: [
      {
        storeName:'购物中心',
      },
      {
        storeName:'百货大楼',
      },
      {
        storeName:'新世纪',
      },
      {
        storeName:'蓝豹',
      }
    ],
    storeShow:false,
    goodsShow:false,
    typeShow:false,
    show:false,
    tab0:false,
    tab1:false,
    tab2:false,
    tab3:false,
    tab0List:[],
    tab1List:[],
    tab2List:[],
    tab3List:[],
    today:'',
    lampoMonth:[],
    lampoYear:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var now = new Date()
    now.setTime(now.getTime()-24*60*60*1000);
    var month = (now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)
    var day = now.getDate()>=10?now.getDate():'0'+now.getDate()
    var lastDay = now.getFullYear()+'-'+month+'-'+day
    this.setData({
      lastDay
    })
    setTimeout(()=>{
      this.setData({
        storeShow:true
      })
    },500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // setTimeout(()=>{
    //   this.setData({
    //     show:true
    //   })
    // },1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var chartsUser = wx.getStorageSync('chartsUser');
    var userStoreList = wx.getStorageSync('userStoreList')
    console.log(userStoreList)
    this.setData({
      sid: chartsUser.sid,
      userMenus: chartsUser.userMenus,
      userStoreList
    })
    var tab1, tab2, tab3, tab0
    if(userStoreList){
        tab0 = userStoreList[0].ifStore
        tab1 = userStoreList[1].ifStore
        tab2 = userStoreList[2].ifStore
        tab3 = userStoreList[3].ifStore
    }else{
      wx.redirectTo({
        url: 'welcome',
      })
      return;
    }
    that.setData({
      tab0,
      tab1,
      tab2,
      tab3
    })
    this.getTab()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  login(e){
    // app.doLogin().then(data => {
    //     this.onShow()
    // })
    wx.redirectTo({
      url: 'welcome',
    })
  },
  onStoreSelected(e){
    let mark = e.currentTarget.dataset.mark
    if(mark=='lampo'){
      wx.switchTab({
        url: 'index',
      })
    }else{
      wx.redirectTo({
        url: 'depart?active='+mark,
      })
    }
  },

   onTypeSelected(e){
 

   },
   getTab() {
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json'
    }
    // 业务总览
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/groupIndex', 'body', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        // console.log(res)
        if (res.data == undefined) {
          wx.showToast({
            title:  '暂无销售数据',
            image: '/images/00-8.png',
          })
          return;
        } else {
          var totalLists = res.data
          console.log(totalLists)
          var tab0List=[]
          var tab1List=[]
          var tab2List=[]
          var tab3List=[]
          totalLists.map((item) => {
            if (item.storeName.indexOf('常州') != -1) {
              item.storeName = item.storeName.substring(2, item.storeName.length)
            }
            item.moM = item.moM||0
            item.yoY = item.yoY||0
            if(item.storeId=='601'){
              tab0List = item
            }else if(item.storeId=='602'){
              tab1List = item
            }else if(item.storeId=='603'){
              tab2List = item
            }else if(item.storeId=='lampo'){
              tab3List = item
            }
          })

          that.setData({
            totalLists: res.data,
            tab0List,
            tab1List,
            tab2List,
            tab3List
          })
        }
      }
    ).catch(res => {
      wx.showToast({
        title:  res.message=="您的操作权限不足！"?'操作权限不足':res.message,
        image: '/images/00-8.png',
      })
    });
  },
})