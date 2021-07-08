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
    remarks:'',
    phone:'',
    name:'',
    dateLists:[
      {
        name:'6月1日',
        choose:false
      },
      {
        name:'6月2日',
        choose:false
      },
      {
        name:'6月3日',
        choose:false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.ifUser().then((data)=>{
      console.log(app.globalData.eventDetail)
      let eventDetail = app.globalData.eventDetail
      let timeLists = []
      let oriLists = []
      oriLists = eventDetail.event
      oriLists.map(item=>{
        if(item.startTime==item.endTime){
            timeLists.push(item.startTime.slice(5,-3).replace(/-/g,'/'))
        }else{
           if(item.startTime.slice(5,-9)==item.endTime.slice(5,-9)){
          timeLists.push(item.startTime.slice(5,-3).replace(/-/g,'/')+' ~ '+item.endTime.slice(11,-3).replace(/-/g,'/'))
        }else{
          timeLists.push(item.startTime.slice(5,-3).replace(/-/g,'/')+' ~ '+item.endTime.slice(5,-3).replace(/-/g,'/'))
        }
        }
      })
      that.setData({
        userInfo:data,
        eventDetail,
        title:eventDetail.title,
        timeLists,
        oriLists
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
      storeId: storeId,
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
            item.compare = new Date().getTime()>new Date(item.eventStartTime.replace(/-/g,'/')).getTime()?'进行中':'即将开始'
            if(item.eventStartTime==item.eventEndTime){
              var myDate = new Date(Date.parse(item.eventStartTime.slice(0,10)));  
              item.actTime = item.eventStartTime.slice(0,10).replace(/-/g,'/')+' '+weekDay[myDate.getDay()]+' '+item.eventStartTime.slice(-5).replace(/-/g,'/')
            }else{
              if(item.eventStartTime.slice(5,-9)==item.eventEndTime.slice(5,-9)){
                item.actTime = item.eventStartTime.slice(5,-3).replace(/-/g,'/')+' ~ '+item.eventEndTime.slice(11,-3).replace(/-/g,'/')
              }else{
                item.actTime = item.eventStartTime.slice(5,-3).replace(/-/g,'/')+' ~ '+item.eventEndTime.slice(5,-3).replace(/-/g,'/')
              }
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
        message: res.message,
        type: 'warning'
      });
    });
  },
  onChange(e){
    this.setData({
      current:e.detail.index
    })
  },
  phoneInput(e){
    this.setData({
      phone:e.detail.value
    })
  },
  nameInput(e){
    this.setData({
      name:e.detail.value
    })
  },
  onSelect(e){
    let that = this
    let i = e.currentTarget.dataset.index
    let arr = this.data.dateLists
    arr.forEach(item=>{
      item.choose = false
    })
    arr[i].choose = !arr[i].choose
    this.setData({
      dateLists:arr
    })
  },
  confirm(e){
    var that = this
    Dialog.confirm({
      title: '提示',
      message: `确认报名吗？`,
    })
    .then(() => {
      that.report()
    }).catch(() => {
      // on cancel
    });
  },
  report(e) {
    var that = this;
    var data = {
      storeId:storeId,
      corpName:store,
      eventId:that.data.eventDetail.id,
      mobile:that.data.userInfo.phone,
      nikeName:that.data.userInfo.name,
      eventStartTime:that.data.oriLists[that.data.index].startTime,
      eventEndTime:that.data.oriLists[that.data.index].endTime,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/saveEventRegistration', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result=='true') {
          Toast({
            message:'报名成功',
            type:'success'
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: 'activity'
            })
          },1000)
        } else {
          Toast({
            message: res.message||'报名失败',
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
})