// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    orderLists:[],
    show:false,
    nowNum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if(phoneNo.length>1){
      that.getInfo()
    }else{
      Toast({
        message: '登录失效，请重新授权登录',
        type: 'warning'
      });
      setTimeout(()=>{
        wx.redirectTo({
          url: 'index'
        })
      },1000)
    }
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
      phone: wx.getStorageSync('phoneNo'),
      ajax: '_json'
    }
  //  wx.request({
  //    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId='+app.globalData.appid+'&secret='+app.globalData.secret,
  //   success(e){
  //     console.log(e.data.access_token)
  //     var path = 'pages/index/index'
  //     var data1={
  //       path:'pages/index/index'
  //     }
  //     wx.request({
  //       url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token='+e.data.access_token,
  //       method:'POST',
  //       data:data1,
  //      success(res){
  //        console.log(res.data)
  //      }
  //     })

  //   }
  //  })
  },
  save(e){
    wx.saveImageToPhotosAlbum({
      filePath: '/images/logo.png',
      success: function (data) {
        console.log(data)
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (err) {
        console.log(err);
        // $yjpToast.show({
        //   text: `保存失败`
        // })
        // if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
        //   console.log("当初用户拒绝，再次发起授权")
        //   wx.showModal({
        //     title: '提示',
        //     content: '需要您授权保存相册',
        //     showCancel: false,
        //     success: modalSuccess => {
        //       wx.openSetting({
        //         success(settingdata) {
        //           console.log("settingdata", settingdata)
        //           if (settingdata.authSetting['scope.writePhotosAlbum']) {
        //             wx.showModal({
        //               title: '提示',
        //               content: '获取权限成功,再次点击图片即可保存',
        //               showCancel: false,
        //             })
        //           } else {
        //             wx.showModal({
        //               title: '提示',
        //               content: '获取权限失败，将无法保存到相册哦~',
        //               showCancel: false,
        //             })
        //           }
        //         },
        //         fail(failData) {
        //           console.log("failData", failData)
        //         },
        //         complete(finishData) {
        //           console.log("finishData", finishData)
        //         }
        //       })
        //     }
        //   })
        // }
      }
    });
  }
})