// pages/index/index.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import format from '../../utils/time.js'

Page({
  data: {
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    today: '',
    minDate: new Date(2021, 3, 30).getTime(),
    maxDate: new Date(2021, 3, 30).getTime(),
    timeQua: [{
        ifPass: false,
        time: '10:00-12:00',
        selected: false
      },
      {
        ifPass: false,
        time: '12:00-14:00',
        selected: false
      },
      {
        ifPass: false,
        time: '14:00-16:00',
        selected: false
      },
      {
        ifPass: false,
        time: '16:00-18:00',
        selected: false
      },
      {
        ifPass: false,
        time: '18:00-20:00',
        selected: false
      },
      {
        ifPass: false,
        time: '20:00-21:30',
        selected: false
      }
    ],
    myDate: '',
    myQua: '',
    tips: '非常抱歉，鉴于当前疫情防控形势严峻，我们将无法接受你的预约到店，给你带来不便，敬请谅解。',
    longitude: 119.95581148503418,
    latitude: 31.780131217358623,
    markers: [{
      id: 1,
      longitude: 119.95581148503418,
      latitude: 31.780131217358623,
      label: {
        content: '常州市钟楼区新世纪半山书局', //文本
        color: '#ffffff', //文本颜色
        borderRadius: 3, //边框圆角
        borderWidth: 1, //边框宽度
        borderColor: '#1989fa', //边框颜色
        bgColor: '#1989fa', //背景色
        padding: 5, //文本边缘留白
        textAlign: 'center' //文本对齐方式。有效值: left, right, center
      }
    }]
  },
  onReady() {
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad: function (options) {
    var date = new Date()
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
    var today = date.getFullYear() + '-' + (month) + '-' + (day)
    var tomorrow =  new Date(date.getTime() + 48*60*60*1000);
    var hour = date.getHours()
    var minutes = date.getMinutes()
    let timeQua = this.data.timeQua
    let myQua = ''
    if (hour >= 12) {
      timeQua[0].ifPass = true
      if (hour >= 14) {
        timeQua[1].ifPass = true
        if (hour >= 16) {
          timeQua[2].ifPass = true
          if (hour >= 18) {
            timeQua[3].ifPass = true
            if (hour >= 20) {
              timeQua[4].ifPass = true
              if (hour >= 21) {
                timeQua[5].ifPass = true
              }
            }
          }
        }
      }
    }
    for (let x in timeQua) {
      if (!timeQua[x].ifPass) {
        timeQua[x].selected = true
        myQua = timeQua[x].time
        break;
      }
    }
    this.setData({
      today,
      myDate: this.dateForm1(today),
      timeQua,
      myQua,
      minDate:new Date(today).getTime(),
      maxDate:new Date(tomorrow).getTime()
    })
  },
  dateForm1(e) { //yuyue
    var date = new Date(e)
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
    var date = month + '月' + day + '日'
    return date
  },
  showdate(e) {
    this.setData({
      show1: true
    })
  },
  onClose(e) {
    this.setData({
      show1: false
    })
  },
  datechange(e) {
    var that = this
    let myDate = e.detail
    let myQua = ''
    myDate = that.dateForm1(myDate)
    console.log(myDate)
    let timeQua = that.data.timeQua
    let hour = new Date().getHours()
    if (new Date(e.detail).getDate() == new Date(that.data.today).getDate()) {
      if (hour >= 12) {
        timeQua[0].ifPass = true
        if (hour >= 14) {
          timeQua[1].ifPass = true
          if (hour >= 16) {
            timeQua[2].ifPass = true
            if (hour >= 18) {
              timeQua[3].ifPass = true
              if (hour >= 20) {
                timeQua[4].ifPass = true
                if (hour >= 21) {
                  timeQua[5].ifPass = true
                }
              }
            }
          }
        }
      }
    } else {
      timeQua.map((item) => {
        item.ifPass = false
      })
    }
    timeQua.map((item) => {
      item.selected = false
    })
    for (let x in timeQua) {
      if (!timeQua[x].ifPass) {
        timeQua[x].selected = true
        myQua = timeQua[x].time
        break;
      }
    }
    that.setData({
      timeQua,
      myDate,
      myQua
    })
  },
  selectTime(e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let timeQua = that.data.timeQua
    let myQua = that.data.timeQua[index].time
    if (!timeQua[index].ifPass) {
      timeQua.map((item) => {
        item.selected = false
      })
      timeQua[index].selected = true
      that.setData({
        timeQua,
        myQua
      })
    }
  },
  reserve(e) {
    var that = this
    console.log(this.data.myDate + ' ' + this.data.myQua)
    Dialog.confirm({
        message: '您14天内是否前往过新冠疫情高风险区域，或与新冠感染者有密切接触？',
        cancelButtonText: '是',
        cancelButtonColor: '#eee',
        confirmButtonText: '否',
        confirmButtonColor: '#000000',
      })
      .then(() => {
        this.showdate()
      })
      .catch(() => {
        that.setData({
          show2: true
        })
        setTimeout(() => {
          that.setData({
            show2: false
          })
        }, 2000)
      });
  },
  // showMap() {
  //   var that = this;
  //   wx.getLocation({
  //     type: 'gcj02', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
  //     success: function (res) {
  //       var latitude = that.data.latitude;
  //       var longitude = that.data.longitude;
  //       wx.openLocation({
  //         latitude: that.data.latitude,
  //         longitude: that.data.longitude,
  //         scale: 16
  //       })
  //     }
  //   })
  // },
  onShareAppMessage: function () {
    return {
      "title": '半山书局预约'
    }
  },
  confirm(e) {
    this.setData({
      show1: false,
      show3: true
    })
  },
  do(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      this.setData({
        show3: false
      })
      wx.showLoading({
          title: '预约中...'
        }
      )
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          show4: true
        })
      }, 1000)
    } else if (e.detail == '0') {
      this.setData({
        show3: false,
        show1: true
      })
    }
  },
  check() {
    wx.navigateTo({
      url: 'recordLists',
    })
  },
  closeSucc() {
    this.setData({
      show4: false
    })
  }
})