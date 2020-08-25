//index.js
//获取应用实例
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import format from '../../utils/time.js'

function dateFromString(time) {
  time = time.replace(/-/g, ':').replace(' ', ':')
  time = time.split(':')
  var time1 = new Date(time[0], (time[1] - 1), time[2], time[3], time[4])
  return time1
}
Page({
  data: {
    index: 0,
    today: '',
    endDate: '',
    endTime: '',
    startDate: '',
    startTime: '',
    lists: [],
    listIsFull: false,
    loading: false,
    array1: [],
    index1: 0,
    array2: ['LV', '爱马仕', '范思哲'],
    index2: 0,
    pageNo: 1,
    pageSize: 10,
    companyLists: '',
    companyCode: '',
    id: '',
    active: 0,
    goodsName: '',
    status: 'TRADE_SUCCESS',
    dailyNo: '',
    officeCode: ''
  },
  onLoad: function () {
    console.log(this.options.dailyNo)
    this.setData({
      dailyNo: this.options.dailyNo
    })
  },
  onShow: function () {
    var that = this;
    wx.hideHomeButton()
    var now = new Date();
    that.setData({
      // endDate: now.format('yyyy-MM-dd'),
      // startDate:now.format('yyyy-MM-dd'),
      // endTime: now.format('hh:mm'),
      today: now.format('yyyy-MM-dd')
    });
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      name: userInfo.username,
      phoneNo: userInfo.loginCode,
      sid: userInfo.sid,
      officeCode: userInfo.officeCode,
      officeName:userInfo.officeName
    })
    // that.getSelectLists()
    that.getHead()
    that.getLists()
  },
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1,
      listIsFull: false,
      loading: false,
    })
    this.onShow();

    wx.showNavigationBarLoading()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500);
  },
  onReachBottom: function () {
    var that = this;
    console.log('到底了')
    if (that.data.isMore) {
      var pageNo = that.data.pageNo;
      pageNo++;
      that.setData({
        pageNo: pageNo
      })
      that.getLists()
    }
  },
  login(e) {
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  getLists(x) {
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      did: that.data.dailyNo,
      status: that.data.status,
      itemTitle: that.data.goodsName,
      mfCode: that.data.officeCode
    }
    getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderBody.json', 'body', data, 0, false, true).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        if (res.result) {
          console.log(res)
          if (res.data.list) {
            if (res.data.list.length == 0) {
              // setTimeout(()=>{
              that.setData({
                loading: false,
                listIsFull: false,
                showNo: true,
                loadAll: false
              })
              // },500)
            } else {
              if (that.data.pageNo > 1) {
                console.log('第' + that.data.pageNo + '页')
                var list = that.data.lists
                list = list.concat(res.data.list)
                that.setData({
                  lists: list,
                  showNo: false,
                  loadAll: false
                })
                console.log(that.data.lists)
              } else {
                that.setData({
                  lists: res.data.list,
                  showNo: false,
                  loadAll: false
                })
              }


              if (res.data.count > that.data.pageSize) {
                that.setData({
                  loading: true,
                  listIsFull: false
                })
                if (Math.ceil(res.data.count / that.data.pageSize) > that.data.pageNo) {
                  that.setData({
                    isMore: true
                  })
                } else {
                  that.setData({
                    isMore: false,
                    loading: false,
                    listIsFull: true
                  })
                }
              } else {
                that.setData({
                  loading: false,
                  listIsFull: true
                })
              }
            }
          }
        }
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  },
  onStartDatePickerChanged: function (e) {
    this.setData({
      startDate: e.detail.value
    });
  },
  onstartTimePickerChanged: function (e) {
    this.setData({
      startTime: e.detail.value
    });
  },
  onEndDatePickerChanged: function (e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  onEndTimePickerChanged: function (e) {
    this.setData({
      endTime: e.detail.value
    });
  },
  pickChange1(e) {
    this.setData({
      index1: e.detail.value,
      companyCode: this.data.companyLists[e.detail.value].companyCode
    })
  },
  pickChange2(e) {
    this.setData({
      index2: e.detail.value
    })
  },
  toPage(e) {
    app.doMessage()
    console.log(e.currentTarget.dataset.type)
    wx.navigateTo({
      url: 'listDetail'
    })
  },
  showDetail(e) {
    var that = this;
    var lists = that.data.lists;
    var index = e.currentTarget.dataset.index
    lists[index].mark = !lists[index].mark
    that.setData({
      lists: lists,
    })
  },
  bindinput(e) {
    this.setData({
      goodsName: e.detail.value
    })
  },
  check(e) {
    var that = this
    app.doMessage()
    var mark = e.currentTarget.dataset.mark
    if(mark==0){
      that.setData({
        lists: '',
        listIsFull: false,
        loading: false,
        goodsName: ''
      })
    }else if(mark==1){
    that.setData({
      lists: '',
      listIsFull: false,
      loading: false,
      goodsName: that.data.goodsName
    })
  }
    that.getLists()
  },
  // getSelectLists(e) {
  //   var that = this
  //   var data = {}
  //   postRequest(getApiHost(), 'platform/v1/api/wxmini/getCompanyList.json', 'body', data, 0, false, true).then(
  //     res => {
  //       if (res.result) {
  //         var lists = res.data
  //         var array1 = []
  //         lists.map((item) => {
  //           array1.push(item.companyName)
  //         })
  //         console.log(array1)
  //         that.setData({
  //           companyLists: lists,
  //           array1: array1,
  //           companyCode: lists[0].companyCode
  //         })
  //       }
  //     }
  //   ).catch(res => {
  //     wx.showModal({
  //       title: '错误',
  //       content: res.message,
  //       showCancel: false,
  //       confirmText: '知道了',
  //       confirmColor: '#1890FF'
  //     })
  //   });
  // },
  getHead(e) {
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      dailyNo: that.data.dailyNo,
      mfCode:that.data.officeCode
    }
    getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderDetailByNo.json', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        that.setData({
          entryMoney: res.data.entryMoney,
          deliveredMoney: res.data.deliveredMoney,
          unrecordedMoney: res.data.unrecordedMoney
        })
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: '获取数据失败',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  },
  toDetail(e) {
    console.log(e.currentTarget.dataset.index)
    var lists = this.data.lists
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: 'listDetail?brandName='+lists[index].brandName+'&itemNo='+lists[index].itemNo+'&price='+lists[index].price+'&num='+lists[index].num+'&payment='+lists[index].payment+'&receiverName='+lists[index].receiverName+'&receiverTel='+lists[index].receiverTel+'&departName='+lists[index].departName+'&remark='+lists[index].remark+'&id='+lists[index].id+'&itemTitle='+lists[index].itemTitle
    })
  },
  onChange(event) {
    console.log(event.detail.name)
    var that = this
    if (event.detail.name == 0) {
      that.setData({
        lists: '',
        pageNo:1,
        listIsFull: false,
        loading: false,
        status: 'TRADE_SUCCESS'
      })
    } else if (event.detail.name == 1) {
      that.setData({
        lists: '',
        listIsFull: false,
        pageNo:1,
        loading: false,
        status: 'WAIT_SELLER_SEND_GOODS'
      })
    } else if (event.detail.name == 2) {
      that.setData({
        lists: '',
        listIsFull: false,
        pageNo:1,
        loading: false,
        status: 'WAIT_BUYER_CONFIRM_GOODS'
      })
    }
    that.getLists()
  },
})