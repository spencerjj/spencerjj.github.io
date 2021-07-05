// pages/index/car.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { store,storeId } from '../../config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointCard:[],
    totalPoint:0,
    num:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.ifUser().then((data)=>{
      that.setData({
        userInfo:data,
        pointCard:app.globalData.pointCard,
        totalPoint:app.globalData.pointCard.excPoint
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
  toPage(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  onChange(e){
    console.log(e.detail)
    var that = this;
    this.setData({
      num:e.detail,
      totalPoint:e.detail*that.data.pointCard.excPoint
    })
  },
  confirm(e){
    var that = this
    Dialog.confirm({
      title: '提示',
      message: `确认兑换吗？`,
    })
    .then(() => {
      console.log(that.data.totalPoint)
        var data = {
          phone: that.data.userInfo.phone,
          membership:'会员',
          vCode:that.data.pointCard.vnum,
          store:store,
          channel:'微会员',
          num:that.data.num,
          ajax: '_json'
        }
        getRequest(getApiHost(), 'customer/bh/api/crm/exchangeVoucher', 'body', data, 0, false, false).then(
          res => {
            console.log(res)
            wx.stopPullDownRefresh()
            if(res.code=='SEL_000'){
              Toast({
                message:res.msg,
                type:"success"
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1,
                })
              },1000)
            }else{
              Toast({
                message: res.msg,
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
      // wx.navigateTo({
      //   url: 'pointInfo',
      // })
    }).catch(() => {
      // on cancel
    });
  }

})