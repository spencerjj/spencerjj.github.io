// pages/index/card.js
import {
  getApiHost,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId
} from '../../config.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    cards:[],
    show:false,
    nowNum:1,
    money:50,
    totalMoney:0,
    lists:[
      {
        money:100,
        type:'女鞋券',
        cardNum:'1111111',
        state:1
      },
      {
        money:200,
        type:'男鞋券',
        cardNum:'2222222',
        state:1
      },
      {
        money:500,
        type:'西装券',
        cardNum:'3333333',
        state:0
      },
      {
        money:1000,
        type:'超市券',
        cardNum:'4444444',
        state:0
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data,
        num:options.num,
        rentNum:options.rentNum,
        name:options.name,
        money:options.deposit,
        totalMoney:options.deposit
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
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/QueryVoucherInfo', 'body', data, 0, false, false,true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.status==0){
        that.setData({
            cards:res
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
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  onChange(e){
    this.setData({
      current:e.detail.index
    })
  },
  onClose() {
    this.setData({
      show: false
    })
    this.onLoad()
  },
  recommend(e){
    wx.navigateTo({
      url: 'recommend?no='+e.currentTarget.dataset.no,
    })
  },
  onChange(e){
    console.log(e.detail)
    this.setData({
      nowNum:e.detail,
      totalMoney:e.detail*this.data.money
    })
  },
  confirm(e){
    var that = this
    Dialog.confirm({
      title: '提示',
      message: `确认支付押金并租赁吗？`,
    })
    .then(() => {
    var data = {
      openId: wx.getStorageSync('user').openid,
      storeId: storeId,
      soure: '租借',
      parkId: storeId,
      amount:that.data.totalMoney,
      phone: that.data.userInfo.phone,
      memberCode:that.data.userInfo.memNum,
      name: that.data.userInfo.name,
      receipt:that.data.rentNum,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/wx/pay/createOrder', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result == 'true') {
          wx.requestPayment({
            "timeStamp": res.order.timeStamp,
            "nonceStr": res.order.nonceStr,
            "package": res.order.packageValue,
            "signType": "MD5",
            "paySign": res.order.paySign,
            success: function (res) {
              wx.redirectTo({
                url: 'borrow?active=1',
              })
            },
            fail: function (err) {
              Toast({
                message: '支付失败',
                type: 'warning'
              });
            }
          });
        } else {
          Toast({
            message: res.message,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: '租借失败',
        type: 'warning'
      });
    });
    }).catch(() => {
      // on cancel
    });
  }
})