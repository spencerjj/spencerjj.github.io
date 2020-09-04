import {
  getApiHost,
  postRequest,
  getRequest
} from '../utils/api.js'
var app = getApp();
import Notify from '../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  data: {},
  onLoad: function() {

  },
  toPage(e){
      wx.switchTab({
        url: 'charts',
      })
  }
})