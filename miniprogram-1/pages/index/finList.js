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
    startTime1: '',
    endTime1: '',
    shopName: '',
    flag: 2,
    dailyNo: '',
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    officeName: '',
    top1Height: 100,
    titleTop: 0
  },
  onLoad: function (options) {
    if(options.dailyNo){
      this.setData({
        dailyNo:options.dailyNo
      })
    }
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
    console.log(userInfo)
    if (userInfo.roleCodes) {
      if (userInfo.roleCodes.indexOf('finance') != -1) {
        this.setData({
          show1: true,
          flag: 1,
          height: 310,
          top1Height: 130,
          titleTop: 15
        })
      }
      if (userInfo.roleCodes.indexOf('wshop') != -1) {
        this.setData({
          show2: true,
          flag: 2,
          height: 230
        })
      }
      if (userInfo.roleCodes.indexOf('dept_cw') != -1) {
        this.setData({
          show3: true,
          flag: 3
        })
      }
      if (userInfo.roleCodes.indexOf('brand') != -1) {
        this.setData({
          show4: true,
          flag: 4
        })
      }
    }
    console.log('code=' + that.data.companyCode)
    that.setData({
      name: userInfo.username,
      phoneNo: userInfo.loginCode,
      sid: userInfo.sid,
      companyCode: userInfo.companyCode,
      officeName: userInfo.officeName
    })
    that.getSelectLists()
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
      __ajax:'json',
      __sid: that.data.sid,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      shopName: that.data.shopName,
      dailyNo:that.data.dailyNo,
      startTime: that.data.startTime,
      endTime: that.data.endTime
    }
    if (that.data.flag == 2) {
      data.shopId = wx.getStorageSync('userInfo').companyCode
      data.shopName = wx.getStorageSync('userInfo').companyName
    }
    getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderHead', 'body', data, 0, false, true).then(
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
      // wx.redirectTo({
      //   url: '/pages/index/error',
      // })
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
    if (this.data.startDate.length == 0) {
      Notify({
        message: '请先选择起始日期',
        type: 'warning'
      });
      this.setData({
        startTime1: ''
      });
      return;
    }
    this.setData({
      startTime1: e.detail.value
    });
  },
  onEndDatePickerChanged: function (e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  onEndTimePickerChanged: function (e) {
    if (this.data.endDate.length == 0) {
      Notify({
        message: '请先选择结束日期',
        type: 'warning'
      });
      this.setData({
        endTime1: ''
      });
      return;
    }
    this.setData({
      endTime1: e.detail.value
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
    var url = ''
    console.log(e.currentTarget.dataset.id)
    if (this.data.show1) {
      url = 'deList?dailyNo=' + e.currentTarget.dataset.id + '&flag=1&status=' + e.currentTarget.dataset.status
    } else if (this.data.show2) {
      url = 'deList?dailyNo=' + e.currentTarget.dataset.id + '&flag=2&status=' + e.currentTarget.dataset.status
    } else if (this.data.show3) {
      url = 'deList?dailyNo=' + e.currentTarget.dataset.id + '&flag=3&status=' + e.currentTarget.dataset.status
    } else if (this.data.show4) {
      url = 'braList?dailyNo=' + e.currentTarget.dataset.id + '&flag=4&status=' + e.currentTarget.dataset.status
    }
    wx.navigateTo({
      url: url
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
  check(e) {
    var that = this
    app.doMessage()
    var mark = e.currentTarget.dataset.mark
    if (mark == 0) {
      that.setData({
        lists: '',
        listIsFull: false,
        loading: false,
        startDate: '',
        startTime1: '',
        endDate: '',
        endTime1: '',
        startTime: '',
        endTime: '',
        shopName: '',
        index1:0
      })
    } else if (mark == 1) {
      if (that.data.startTime1.length == 0) {
        if (that.data.startDate.length > 1) {
          that.setData({
            startTime1: '00:00'
          })
        }
      }
      if (that.data.endTime1.length == 0) {
        if (that.data.endDate.length > 1) {
          that.setData({
            endTime1: '00:00'
          })
        }
      }
      that.setData({
        lists: '',
        listIsFull: false,
        loading: false,
        shopName: that.data.array1[that.data.index1],
        startTime: that.data.startDate + ' ' + that.data.startTime1,
        endTime: that.data.endDate + ' ' + that.data.endTime1
      })
    }

    that.getLists()
  },
  getSelectLists(e) {
    var that = this
    var data = {}
    postRequest(getApiHost(), 'platform/v1/api/wxmini/getCompanyList', 'body', data, 0, false, false).then(
      res => {
        if (res.result) {
          var lists = res.data
          var array1 = []
          lists.map((item) => {
            array1.push(item.companyName)
          })
          console.log(array1)
          that.setData({
            companyLists: lists,
            array1: array1,
            companyCode: lists[0].companyCode
          })
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
  confirm(e) {
    app.doMessage()
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认该订单吗',
      success(res) {
        if (res.confirm) {
          var data = {
            dailyNo: e.currentTarget.dataset.id,
            status: 2,
            __sid: that.data.sid,
            __ajax: 'json',
          }
          getRequest(getApiHost(), 'platform/v1/api/dayily/issue', 'body', data, 0, false, true).then(
            res => {
              that.getLists()
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
  }
})