import {
  getApiHost,
  postRequest,
  getRequest
} from '../utils/api.js'
var app = getApp();
import Notify from '../miniprogram_npm/@vant/weapp/notify/notify';
import {shit} from '../utils/today.js'
Page({
  data: {},
  onLoad: function() {
    console.log(shit)
    // wx.chooseAddress({
    //   success (res) {
    //     console.log(res)
        
    //   }
    // })
          wx.authorize({
            scope: 'scope.userInfo',
            success () {
              wx.startRecord()
            }
          })
  },
  bindgetphonenumber (e) {
    console.log(e.detail)
    // wx.chooseAddress({
    //   success (res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
  },
  toPage(e){
      wx.switchTab({
        url: 'charts',
      })
  }
})