// pages/index/check.js
const {
  $Message,
  $Toast
} = require('../../component/iview/base/index');
const md5 = require('../../utils/md5')
var app = getApp();
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {
  URI
} from '../../config.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    class: ['早班', '中班', '晚班', '全天班'],
    cindex: 5,
    array: [],
    lists: [],
    img: [],
    total: 9,
    limit: 1,
    actions: [{
      name: '提交',
      color: '#2d8cf0',
      loading: false
    }],
    visible: false,
    today: '',
    time: '',
    title: '',
    classes: 0,
    isRec: false,
    proLists: [],
    codeLists: [],
    current: 1,
    swiperHeight: '',
    secLists: [],
    officeLists: [],
    checkupNo:'',
    typeName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let userDetails = wx.getStorageSync('userDetails')
    var type = options.type
    var checkupNo = options.no
    var title = ''
    console.log(type)
    switch (type) {
      case '1':
        title = '物业巡检'
        break;
      case '2':
        title = '楼管巡检'
        break;
      case '3':
        title = '总值班巡检'
        break;
      case '4':
        title = '安保巡检'
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight
        let clientWidth = res.windowWidth
        let ratio = 750 / clientWidth
        let rpxHeight = ratio * clientHeight
        that.setData({
          swiperHeight: rpxHeight - 80
        })
      }
    })

    this.setData({
      title: title,
      type: type,
      userDetails: userDetails,
      checkupNo:checkupNo

    })
    this.showList2()
    this.showDetail()
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
    wx.showLoading()
    setTimeout(()=>{
      wx.hideLoading()
    },2000)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  login(e) {
    app.doLogin().then(data => {
      this.onLoad()
    })
  },
  showList1(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      checkType: that.data.type,
      companyCode: that.data.userDetails.companyCode,
      classes: that.data.classes
    }
    postRequest(getApiHost(), 'api/merchant/findSignatureList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        var data = res.data
        if (data.length < 1) {
          $Toast({
            content: '暂无签字点',
            type: 'warning'
          })
        }
        var lists = []
        console.log(data)
        var date = new Date()
        var hour = date.getHours()
        var minute = date.getMinutes()
        data.map((item) => {
          console.log(hour < item.signatureTime.slice(0, 2))
          console.log(hour + ',,,,' + item.signatureTime.slice(0, 2))
          if (hour > item.signatureTime.slice(0, 2)) {
            var over = true
          } else {
            var over = false
          }
          if (hour == item.signatureTime.slice(0, 2)) {
            if (minute > item.signatureTime.slice(3, 5)) {
              var over = true
            } else {
              var over = false
            }
          }
          var x = {
            id: item.id,
            code: item.signatureCode,
            area: item.signatureName,
            time: item.signatureTime.substring(0, 5),
            pic: '',
            imgId: '',
            mark: false,
            over: over
          }
          lists.push(x)
        })
        that.setData({
          lists: lists
        })
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      });
    });
  },
  showDetail(e){
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      checkupNo: that.data.checkupNo,
    }
    postRequest(getApiHost(), 'api/merchant/merchantCheckupOrderForm', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        console.log(res.data)
        var time = res.data.createDate
        var companyName = res.data.companyName
        var mainLists = res.data.merchantCheckupOrderDetailList
        var proLists = res.data.merchantCheckupOrderProList
        var typeName = res.data.typeName

        mainLists.map((item)=>{
          item.mark = false
        })
        proLists.map((item)=>{
          item.mark = false
        })
        that.setData({
          time,
          companyName,
          mainLists,
          proLists,
          typeName
        })

      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      });
    });

    wx.request({
      url: getApiHost()+'file/fileList',
      data: {
        __sid: that.data.userDetails.sid,
        __ajax: 'json',
        bizKey: that.data.checkupNo,
        bizType:'merchantCheckupOrder_image'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.result!='false'){
          let array  = res.data
          let imgLists = []
          array.map((item)=>{
            imgLists.push(URI+'platform/'+item.fileUrl)
          })
         console.log(imgLists)
          that.setData({
            imgLists:imgLists
          })
        }
      }
    })
  },
  showList2(e) {

  },
  showPic(e) {
    var array = []
    array.push(e.currentTarget.dataset.url)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: array
    })
  },
  showAll(e) {
    var that = this
    var lists = that.data.lists
    var index = e.currentTarget.dataset.index
    lists[index].mark = !lists[index].mark

    that.setData({
      lists: lists
    })
    wx.setStorageSync('checkLists', lists)
    wx.setStorageSync('type', that.data.type)
  },


  onChange(e) {
    var x = e.detail.value
    var index = e.currentTarget.dataset.index
    var lists = this.data.lists
    lists[index].index3 = x
    if (!x) {
      lists[index].index1 = -1
    }
    this.setData({
      lists: lists
    })
    wx.setStorageSync('checkLists', lists)
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    })
  },

  swiperChange(e){
    console.log(e.detail.current)
    this.setData({
      current:e.detail.current+1
    })
  },
  showReport(e){
    var that = this
    var proLists = that.data.proLists
    var index = e.currentTarget.dataset.index
    proLists[index].mark = !proLists[index].mark
    that.setData({
      proLists: proLists
    })
  }
})