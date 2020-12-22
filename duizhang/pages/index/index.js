import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({
  data: {
    array:['今日订单','7天内订单','30天内订单','总订单'],
    index:0,
    name:'',
    sid:'',
    phoneNo:''
  },
  onLoad: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.navigateTo({
        url: '../login/login',
      })
    }
    that.setData({
      name:userInfo.username,
      phoneNo:userInfo.loginCode,
      sid:userInfo.sid
    })
    var data={
      sid:userInfo.sid,
      pageNo:1,
      pageSize:10
    }
    getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderHead.json', 'body', data, 0, false, true).then(
      res => {
        if(res.result){
          var lists = res.data
          
        }else{
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#1890FF'
          })
        }
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: '获取列表失败，请联系管理员',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  },
  login(e){
    app.doLogin().then(data => {
      this.getInfo()
    })
  },
  pickChange(e){
      console.log(e.detail.value)
      this.setData({
        index: e.detail.value
      })
  },
  toPage(e){
    console.log(e.currentTarget.dataset.type)
    wx.navigateTo({
      url: 'lists?type='+e.currentTarget.dataset.type,
    })
  }
})
