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
    officeCode: '',
    entryMoney:0,
    deliveredMoney:0,
    unrecordedMoney:0,
    disabled1:false,
    status1:''
  },
  onLoad: function () {
    this.setData({
      dailyNo: this.options.dailyNo,
      status1:this.options.status
    })
  },
  onShow: function () {
    var that = this;
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
      officeName:userInfo.officeName,
      pageNo: 1
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    // that.getSelectLists()
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
      // mfCode: that.data.officeCode
    }
    getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderBody', 'body', data, 0, false, true).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        that.getHead()
        if (res.result) {
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
                var list = that.data.lists
                list = list.concat(res.data.list)
                that.setData({
                  lists: list,
                  showNo: false,
                  loadAll: false
                })
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
        goodsName: '',
        dailyNo:''
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
  //   postRequest(getApiHost(), 'platform/v1/api/wxmini/getCompanyList', 'body', data, 0, false, true).then(
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
      // mfCode:that.data.officeCode
    }

    console.log(data)
    getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderDetailByNo', 'body', data, 0, false, false,false).then(
      res => {
        console.log(res)
        that.setData({
          entryMoney: res.data.entryMoney||0,
          deliveredMoney: res.data.deliveredMoney||0,
          unrecordedMoney: res.data.unrecordedMoney||0
        })
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: '获取对账单明细汇总失败',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  },
  toDetail(e) {
    var lists = this.data.lists
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: 'listDetail?brandName='+lists[index].brandName+'&itemNo='+lists[index].itemNo+'&price='+lists[index].price+'&num='+lists[index].num+'&payment='+lists[index].payment+'&receiverName='+lists[index].receiverName+'&receiverTel='+lists[index].receiverTel+'&departName='+lists[index].departName+'&remark='+lists[index].remark+'&id='+lists[index].id+'&itemTitle='+lists[index].itemTitle+'&time='+lists[index].orderCreateTime
    })
  },
  onChange(event) {
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
  confirm(e){
    app.doMessage()
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认该订单吗',
      success(res) {
        if (res.confirm) {
          var data={
            did:that.data.dailyNo,
            mfCode:that.data.officeCode,
            state:0,
            __sid:that.data.sid,
            __ajax:'json',
          }
          getRequest(getApiHost(), 'platform/v1/api/dayily/mfissue', 'body', data, 0, false, true).then(
            res => {

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
        }
      }
    })
  },    // 昨日到账金额
  // 截止到昨日为止未发货金额
  showDetail(e){
    wx.showModal({
      title:'口径说明',
      content:'已提货已入账：昨日到账金额。\r\n未提货：截止到昨日为止未发货金额。\r\n已提货未入账：截止到昨日为止已提货未入账金额。',
      showCancel:false
    })
},
})