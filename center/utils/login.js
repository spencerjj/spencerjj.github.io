import {
  getApiHost,
  getRequest
} from 'api.js'

import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';
function doLogin(phone){
  
  return new Promise((resolve,reject)=>{
  var that = this;
  if(!phone||phone.length!=11){
    wx.stopPullDownRefresh()
    reject()
    return;
  }
  var data = {
    phone: phone,
    // phone:13816397695,
    channel: '微会员',
    ajax: '_json'
  }
  getRequest(getApiHost(), 'customer/bh/api/crm/LPMemberAllQuery', 'body', data, 0, false, false).then(
    res => {
      wx.stopPullDownRefresh()
      console.log(res)
        if (res.code == 'SEL_001' || res.code == 'SEL_002') {
          Toast({
            message: res.msg,
            type: 'warning'
          });
          return;
        }else{
          wx.removeStorageSync('userInfo')
          wx.setStorageSync('userInfo', res)
          resolve(res)
        }
      })
      
    }
  )
}
module.exports = {
  doLogin:doLogin
}