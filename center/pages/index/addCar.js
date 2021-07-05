// pages/index/addCar.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {store,storeId} from '../../config.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateNumber:"苏".split(''),
    ifFit:false,
    carInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data
      })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onChange(e){
    let that = this;
    this.setData({
      plateNumber:e.detail
    })
    let index = e.detail.findIndex(item=>(item==undefined||item.length<1))
    if(index>0){
      that.setData({
        ifFit:false
      })
      return false;
    }
    if(e.detail.length>=7){
      that.setData({
        ifFit:true
      })
    }
 },
 confirm(e){
   var that = this
  let plateNumber = this.data.plateNumber
  var userInfo = that.data.userInfo
  if(e.currentTarget.dataset.carnum){
   console.log(plateNumber)
  }else{
   if(plateNumber.length>=7){
     plateNumber.map(item=>{
       if(item.length<1){
        Toast({  
          message: '请正确输入车牌',
          type: 'warning'
        });
        return;
       }
     })
    }else{
     Toast({
       message: '请正确输入车牌',
       type: 'warning'
     });
     return;
    }
  }
 if(this.data.ifFit){
    var data = {
      memNum:userInfo.memNum,
      carNum:plateNumber.join(''),
      ajax: '_json'
    }
    console.log(data)
    getRequest(getApiHost(), 'customer/bh/api/crm/insertMemberCar', 'body', data, 0, false, false,true).then(
      res => {
        Toast({
          message: res.msg,
          type: 'warning'
        });
        if(res.code=="SEL_000"){
          setTimeout(()=>{
            wx.navigateBack({ 
              delta:1
            })
          },1000)
        }
      }
    ).catch(res => {
    });
 }else{
   Toast({
         message: '请正确输入车牌',
         type: 'warning'
       });
 }
  console.log(this.data.plateNumber.join(''))
},
onShareAppMessage: function(res) {

},
onShareTimeline: function () {
  return {
      title: '',
      query: {
        key: value
      },
      imageUrl: ''
    }
},
})