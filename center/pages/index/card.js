// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {
  store,
  storeId
} from '../../config.js'
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
    userInfo: '',
    vStatus: '可用,待激活',
    cardName: '',
    array1:[],
    array2:[],
    array3:[],
    array4:[],
    desc:'',
    showType:1,
    posLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data) => {
      that.setData({
        userInfo: data,
        temp:0
      })
      that.getInfo()
      that.getFutuer()
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
  getInfo(e) {
    var that = this;
    var userInfo = that.data.userInfo
    var data = {
      phone: userInfo.phone,
      // phone:'13615236576',
      membership: '会员',
      store: store,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/memberVoucherQuery', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code == 'SEL_000') {
          let lists = res.vouchermessage
          let carLists = res.carCop
          let array1 = []
          let array2 = []
          let array3 = []
          let array4 = []
          lists.map((item)=>{
            // (new Date(item.endDate).getTime()>new Date().getTime())
            if(item.status=='可用'||item.status=='待激活'){
              array1.push(item)
            }else{
              array2.push(item)
            }
          })
          carLists.forEach(item=>{
            if(item.status=='无效'){
              array4.push(item)
            }else{
              array3.push(item)
            }
          })
          that.setData({
            array1,
            array2,
            array3,
            array4,
            temp:1
          })
          if (that.data.vStatus == '可用,待激活') {
            wx.removeStorageSync('cardNum')
            wx.setStorageSync('cardNum', array1.length)
          }
        } else {
          that.setData({
            cards: []
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
  getFutuer(e){
    var that = this;
    var userInfo = that.data.userInfo
    var data = {
      pCardno: userInfo.parameter3,
      // pCardno:'1151377581560846254',
      storeId: storeId,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/getFutuerVoucher', 'body', data, 0, false, false, false).then(
      res => {
        console.log(res)
        that.setData({
          posLists:res.data
        })
      }
    )
  },
  onChange(e) {
    this.setData({
      current: e.detail.index,
    })
  },
  onClose() {
    this.setData({
      show1: false
    })
    setTimeout(()=>{
      this.setData({
        show:false
      })
    },300)
    this.onLoad()
  },
  recommend(e) {
    wx.navigateTo({
      url: 'recommend?no=' + e.currentTarget.dataset.no,
    })
  },
  showCode(e) {
    console.log(e.detail)
    var that = this;
    that.createQrCode(e.detail.no, 'canvas', 230, 230)
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      nowNum: e.detail.no,
      cardName: e.detail.name,
      showType:1
    })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        show: true
      })
      setTimeout(()=>{
        this.setData({
          show1:true,
        })
      },50)
    }, 300)
  },
  showDetail(e){
    console.log(e.detail)
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      desc: e.detail.desc,
      cardName: e.detail.name,
      showType:2
    })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        show: true
      })
      setTimeout(()=>{
        this.setData({
          show1:true,
        })
      },50)
    }, 300)
  },
  createQrCode: function (content, canvasId, cavW, cavH) {
    QRCode.api.draw(content, canvasId, cavW, cavH);
  }
})