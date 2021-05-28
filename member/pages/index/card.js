// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var QRCode = require('../../utils/code.js')
var oricode = require('../../utils/qrcode.js')
import {
  barcode
} from '../../utils/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    cards: [],
    show: false,
    nowNum: '',
    state1: 1,
    state2: 1,
    vstatus1: '可用',
    vstatus2: '可用',
    cardsLists1: [],
    cardsLists2: []
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
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/QueryVoucherInfo', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.status == 0) {
          let cardsLists1 = []
          let cardsLists2 = []
          let lists1 = res.cashVoucherEntryList
          let lists2 = res.giftVoucherEntryList
          let mark1 = that.data.state1
          let mark2 = that.data.state2
          lists1.map((item) => {
            if (mark1==1&&item.vstatus == '可用') {
              cardsLists1.push(item)
            }else if(mark1==2&&item.vstatus == '已使用'){
              cardsLists1.push(item)
            }else if(mark1==3){
              cardsLists1.push(item)
            }
          })
          lists2.map((item) => {
            if (mark2==1&&item.vstatus == '可用') {
              cardsLists2.push(item)
            }else if(mark2==2&&item.vstatus == '已使用'){
              cardsLists2.push(item)
            }else if(mark2==3){
              cardsLists2.push(item)
            }
          })
          
          that.setData({
            cards: res,
            cardsLists1,
            cardsLists2
          })
        } else {
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
  },
  onChange(e) {
    this.setData({
      current: e.detail.index
    })
  },
  showCode(e) {
    var that = this;
    let status = e.currentTarget.dataset.status
    if (status != '可用') {
      return false
    }
    wx.setNavigationBarTitle({
      title: '卡券码'
    })
    new oricode('canvas', e.currentTarget.dataset.num, 250, 250);
    barcode('barcode', e.currentTarget.dataset.num, 700, 180);
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      nowNum: e.currentTarget.dataset.num
    })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        show: true
      })
    }, 300)
  },
  onClose() {
    this.setData({
      show: false
    })
    wx.setNavigationBarTitle({
      title: '卡券包'
    })
    this.onLoad()
  },
  recommend(e) {
    wx.navigateTo({
      url: 'recommend?no=' + e.currentTarget.dataset.no,
    })
  },
  changeState1(e) {
    let mark = e.currentTarget.dataset.mark
    let lists = this.data.cards.cashVoucherEntryList
    let cardsLists1 = []
    let vstatus1 = ''
    if (mark == 1) {
      vstatus1 = '可用'
      lists.map((item) => {
        if (item.vstatus == '可用') {
          cardsLists1.push(item)
        }
      })
    } else if (mark == 2) {
      vstatus1 = '已使用'
      lists.map((item) => {
        if (item.vstatus == '已使用') {
          cardsLists1.push(item)
        }
      })
    } else {
      vstatus1 = '已过期'
      lists.map((item) => {
        if (item.vstatus == '已过期') {
          cardsLists1.push(item)
        }
      })
    }
    this.setData({
      state1: mark,
      vstatus1,
      cardsLists1
    })
  },
  changeState2(e) {
    let mark = e.currentTarget.dataset.mark
    let lists = this.data.cards.giftVoucherEntryList
    let cardsLists2 = []
    let vstatus2 = ''
    if (mark == 1) {
      vstatus2 = '可用'
      lists.map((item) => {
        if (item.vstatus == '可用') {
          cardsLists2.push(item)
        }
      })
    } else if (mark == 2) {
      vstatus2 = '已使用'
      lists.map((item) => {
        if (item.vstatus == '已使用') {
          cardsLists2.push(item)
        }
      })
    } else {
      vstatus2 = '已过期'
      lists.map((item) => {
        if (item.vstatus == '已过期') {
          cardsLists2.push(item)
        }
      })
    }
    this.setData({
      state2: mark,
      vstatus2,
      cardsLists2
    })
  }
})