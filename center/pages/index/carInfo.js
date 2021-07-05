// pages/index/car.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId
} from '../../config.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfo: [],
    cardLists: [],
    show: false,
    nowId: '',
    nowDur: '',
    nowindex: '',
    nowMoney: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data) => {
      that.setData({
        userInfo: data,
        pnum: options.pnum
      })
      that.getInfo()
      that.getCard()
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
  getInfo(e) {
    var that = this
    var data = {
      plateNo: that.data.pnum,
      parkId: storeId,
      ajax: '_json',
      freeTime: that.data.nowDur * 60,
      freeMoney: that.data.nowMoney
    }
    getRequest(getApiHost(), 'customer/bh/api/parking/GetParkingPaymentInfo', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result == 'true') {
          let car = res.data
          car.totalAmount = (car.totalAmount / 100).toFixed(2)
          car.hour = Math.floor(car.elapsedTime / 60)
          car.minute = car.elapsedTime % 60 >= 10 ? car.elapsedTime % 60 : '0' + car.elapsedTime % 60
          car.paidAmount = (car.paidAmount / 100).toFixed(2)
          car.payable = (car.payable / 100).toFixed(2)
          car.deductionAmount = (car.deductionAmount / 100).toFixed(2)
          that.setData({
            carInfo: car
          })
        } else {
          Toast({
            message: res.message,
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
  getCard() {
    var that = this
    var data = {
      phone: that.data.userInfo.phone,
      store: store,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/queryParkingOffer', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.code = "SEL_000") {
          let cardLists = res.packOfferEntrys
          let array = []
          cardLists.map(item => {
            item.offerDuration = item.offerDuration * 60
            if(item.status=='有效'){
              array.push(item)
            }
          })

          that.setData({
            cardLists: array
          })
        } else {
          that.setData({
            cardLists: []
          })
        }

      }
    ).catch(res => {
      Toast({
        message: '支付错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  delete(e) {
    Dialog.confirm({
        title: '提示',
        message: `确认要删除车辆信息吗？`,
      })
      .then(() => {
        console.log('success')
      })
  },
  pay() {
    var that = this
    let carInfo = that.data.carInfo
    let array = []
    array.push({
      code: 11,
      money: 0.01,
      time: 1,
      type: 1
    })
    var data = {
      openId: wx.getStorageSync('user').openid,
      storeId: storeId,
      orderNo: carInfo.orderNo,
      soure: '停车',
      parkId: storeId,
      payableAmount: carInfo.paidAmount,
      amount: carInfo.payable,
      phone: that.data.userInfo.phone,
      memberCode: that.data.userInfo.memNum,
      plateNo: that.data.pnum,
      parkId: storeId,
      ajax: '_json'
    }
    if (that.data.nowDur > 1 || that.data.nowDur.length > 1) {
      data.freeMoney = that.data.nowMoney
      data.freeTime = that.data.nowDur
      data['whyOrderDiscountList[0].code'] = that.data.nowId
      data['whyOrderDiscountList[0].money'] = that.data.nowMoney
      data['whyOrderDiscountList[0].time'] = that.data.nowDur
      data['whyOrderDiscountList[0].type'] = 1
    }

    getRequest(getApiHost(), 'customer/bh/api/wx/pay/createOrder', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result == 'true') {
          if (res.code == 0) {
            wx.redirectTo({
              url: 'paySuccess',
            })
          } else {
            wx.requestPayment({
              "timeStamp": res.order.timeStamp,
              "nonceStr": res.order.nonceStr,
              "package": res.order.packageValue,
              "signType": "MD5",
              "paySign": res.order.paySign,
              success: function (res) {
                wx.redirectTo({
                  url: 'paySuccess',
                })
              },
              fail: function (err) {
                Toast({
                  message: '支付失败',
                  type: 'warning'
                });
              }
            });
          }

        } else {
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

  },
  tip(e) {
    wx.showModal({
      title: '已经支付过的金额',
      content: '线上已经支付的金额+线下已经支付的金额+线下优惠金额',
      showCancel: false
    })
  },
  showCard(e) {
    this.setData({
      show: true
    })
  },
  onClose(e) {
    this.setData({
      show: false
    })
    this.getInfo()
  },
  select(e) {
    var cardLists = this.data.cardLists
    cardLists.map(item => {
      item.ifsel = false
    })
    cardLists[e.currentTarget.dataset.index].ifsel = true
    this.setData({
      nowId: e.currentTarget.dataset.id,
      nowDur: e.currentTarget.dataset.dur,
      nowIndex: e.currentTarget.dataset.index,
      cardLists
    })
    this.onClose()
  },
  clear(e) {
    var cardLists = this.data.cardLists
    cardLists.map(item => {
      item.ifsel = false
    })
    this.setData({
      nowId: '',
      nowDur: '',
      nowIndex: '',
      cardLists
    })
    this.onClose()
  }
})