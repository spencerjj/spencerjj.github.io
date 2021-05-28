// pages/index/card.js
import {
  getApiHost,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId,
  HOST_URI
} from '../../config.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    cards:[],
    show:false,
    nowNum:'',
    actLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data,
        id:options.id,
        fileUrl:options.url
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
  getInfo(e) {
    var that = this;
    var data = {
      storeId:storeId,
      typeId:that.data.id,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getShoppingActiveSecondList', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.result=='true') {
          var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
          let actLists = res.data
          actLists.map(item=>{
            if(item.fileUrl.split(',').length>1){
              item.fileUrl = item.fileUrl.split(',')
              for(let x in item.fileUrl){
                item.fileUrl[x] =  HOST_URI+'customer'+item.fileUrl[x]
              }
            }else{
              let array = []
              array.push(HOST_URI+'customer/'+item.fileUrl)
              item.fileUrl = array
            }
            item.compare = new Date().getTime()>new Date(item.startTime.replace(/-/g,'/')).getTime()?'进行中':'即将开始'
            if(item.startTime==item.endTime){
              var myDate = new Date(Date.parse(item.startTime.slice(0,10)));  
              console.log(item.startTime.slice(0,10).replace(/-/g,'/'))
              item.actTime = item.startTime.slice(0,10).replace(/-/g,'/')+' '+weekDay[myDate.getDay()]+' '+item.startTime.slice(-5)
            }else{
              item.actTime = item.startTime.slice(0,10).replace(/-/g,'/')+'~'+item.endTime.slice(5,10).replace(/-/g,'/')
            }
          })
          that.setData({
            actLists:res.data
          })
        } else {
          Toast({
            message: '活动获取失败',
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg,
        type: 'warning'
      });
    });
  },
  report(e){
    console.log(e.detail)
  }
})