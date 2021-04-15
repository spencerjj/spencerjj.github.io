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
    current: 0,
    show: false,
    point: 0,
    exLists: [{
        money: 150,
        point: 3000
      },
      {
        money: 250,
        point: 5000
      },
      {
        money: 500,
        point: 10000
      },
      {
        money: 750,
        point: 15000
      },
      {
        money: 1000,
        point: 20000
      },
      {
        money: 2000,
        point: 40000
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if (phoneNo.length > 1) {
      that.getInfo()
    } else {
      Toast({
        message: '登录失效，请重新授权登录',
        type: 'warning'
      });
      setTimeout(() => {
        wx.redirectTo({
          url: 'index'
        })
      }, 1000)
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
  getInfo(e) {
    var that = this;
    var data = {
      phone: wx.getStorageSync('phoneNo'),
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberAllInfo', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.status==0){
          that.setData({
            point: res.availablePoints
          })
        }else{
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      console.log(res)
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  toPage(e) {
    wx.navigateTo({
      url: 'point',
    })
  },
  exchange(e) {
    var that = this;
    let point = e.currentTarget.dataset.point
    Dialog.confirm({
        title: '提示',
        message: `确认消耗${point}积分兑换吗？`,
      })
      .then(() => {
        var data = {
          phone: wx.getStorageSync('phoneNo'),
          points:point,
          ajax: '_json'
        }
        getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPFixedpointsExcOneVoucher', 'body', data, 0, false, true).then(
          res => {
            console.log(res)
            if(res.status==0){
              Toast({
                message: '兑换成功',
                type: 'success'
              });
              setTimeout(()=>{
                that.onLoad()
              },500)
            }else{
              Toast({
                message: res.msg,
                type: 'error'
              });
            }
          }
        ).catch(res => {
          console.log(res)
          Toast({
            message: '系统错误，请联系管理员',
            type: 'warning'
          });
        });

      })
      .catch(() => {
        // on cancel
      });
  }
})