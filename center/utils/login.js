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
    // phone:13615236576,
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
          let pro = 0
          let list = res
          let point = res.gradePoint
          if(res.tier=='银星卡会员'){
            pro = (point/20000).toFixed(2)*100
          }else if(res.tier=='金星卡会员'){
            pro = (point/50000).toFixed(2)*100
          }else if(res.tier=='黑金卡会员'){
            pro = (point/100000).toFixed(2)*100
          }
          list.pro = pro
          list.gradePoint = Number(list.gradePoint).toFixed(0)
          wx.setStorageSync('userInfo', list)
          resolve(res)
        }
      })
      
    }
  )
}
module.exports = {
  doLogin:doLogin
}