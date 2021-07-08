// pages/index/car.js
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
    show:true,
    plateNumber:"苏".split(''),
    ifFit:false,
    carInfo:[],
    userInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this;
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data
      })
      that.getInfo()
    }).then()
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
    this.onShow()
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
 getInfo(e){
  var that = this;
  var userInfo = that.data.userInfo
  var data = {
    memNum:userInfo.memNum,
    ajax: '_json'
  }
  getRequest(getApiHost(), 'customer/bh/api/crm/queryCarMem', 'body', data, 0, false, false,true).then(
    res => {
      console.log(res)
      wx.stopPullDownRefresh()
      if(res.code=='SEL_000'){
        that.setData({
          carInfo:res.carInfo.reverse().slice(0,4)
        })
      }else{
        that.setData({
          carInfo:[]
        })
      }
    }
  ).catch(res => {
    Toast({
      message: res.msg,
      type: 'warning'
    });
  });
},
 confirm(e){
   let plateNumber = this.data.plateNumber
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
  if(this.data.ifFit||e.currentTarget.dataset.carnum){
    var that= this
    var userInfo = that.data.userInfo
    var  pnum = ''
    if(e.currentTarget.dataset.carnum){
      pnum = e.currentTarget.dataset.carnum.replace('·','')
    }else{
      pnum = plateNumber.join('')
    }
    var data = {
      plateNo:pnum,
      parkId:storeId,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/parking/GetParkingPaymentInfo', 'body', data, 0, false, false,true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.result=='true'){
            wx.navigateTo({
              url: 'carInfo?pnum='+pnum
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
        message: '无车辆信息',
        type: 'warning'
      });
    });

  }else{
    Toast({
          message: '请正确输入车牌',
          type: 'warning'
        });
  }
   console.log(this.data.plateNumber.join(''))
 },
 delete(e){
  var that = this;
  var userInfo = that.data.userInfo
  var data = {
    memNum:userInfo.memNum,
    carNum:that.data.carInfo[0].carNum,
    ajax: '_json'
  }
  getRequest(getApiHost(), 'customer/bh/api/crm/deleteMemberCar', 'body', data, 0, false, false,true).then(
    res => {
      console.log(res)
      wx.stopPullDownRefresh()
      if(res.code=='SEL_000'){
        that.getInfo()
      }else{
        Toast({
          message: res.msg,
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
 addCar(carNum){
    var that = this
   let plateNumber = this.data.plateNumber
   var userInfo = that.data.userInfo
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
           that.getInfo()
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
 add(e){
   wx.navigateTo({
     url: 'addCar',
   })
 }
})