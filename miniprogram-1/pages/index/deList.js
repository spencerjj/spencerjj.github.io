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
    index:0,
    today: '',
    endDate: '',
    endTime: '',
    startDate:'',
    startTime:'',
    lists:[],
    listIsFull:false,
    loading:false,
    array1:[],
    index1:0,
    array2:['LV','爱马仕','范思哲'],
    index2:0,
    pageNo:1,
    pageSize:10,
    companyLists:'',
    companyCode:'',
    id:'',
    startTime1:'',
    endTime1:'',
    dailyNo:'',
    officeCode:'',
    disabled1:false,
    disabled2:false,
    disabled3:false,
    flag:0,
    companyName:'',
    officeName:'',
    officeName1:''
  },
  onLoad: function () {
    console.log(this.options.status)
    this.setData({
      dailyNo:this.options.dailyNo,
      flag:this.options.flag,
      status:this.options.status
    })
    if(this.options.flag==1){
      wx.setNavigationBarTitle({
        title: '财务账单'
      })
    }else if(this.options.flag==2){
      wx.setNavigationBarTitle({
        title: '微商城账单'
      })
    }else if(this.options.flag==3){
      wx.setNavigationBarTitle({
        title: '部门账单'
      })
    }
  },
  onShow:function(){
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
    console.log(userInfo)
    that.setData({
      name:userInfo.username,
      phoneNo:userInfo.loginCode,
      sid:userInfo.sid,
      officeCode:userInfo.officeCode,
      companyCode:userInfo.companyCode,
      companyName:userInfo.companyName,
      officeName:userInfo.officeName
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
  login(e){
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  getLists(x){
    var that = this
    var url= ''
    if(that.data.flag==1){
      var data={
        __sid:that.data.sid,
        __ajax:'json',
        dailyNo:that.data.dailyNo,
        pageNo:that.data.pageNo,
        shopId:that.data.companyCode,
        pageSize:that.data.pageSize,
        orgName:that.data.officeName1
        // startTime:that.data.startTime,
        // endTime:that.data.endTime
      }
      url = 'getDailyOrderGroupByOrg.json'
    }else if(that.data.flag==2){
      var data={
        __sid:that.data.sid,
        __ajax:'json',
        dailyNo:that.data.dailyNo,
        pageNo:that.data.pageNo,
        shopId:that.data.companyCode,
        pageSize:that.data.pageSize,
        orgName:that.data.officeName1
        // startTime:that.data.startTime,
        // endTime:that.data.endTime
      }
      url="getDailyOrderGroupByOrg.json"
    }else if(that.data.flag==3){
      var data={
        __sid:that.data.sid,
        __ajax:'json',
        dailyNo:that.data.dailyNo,
        pageNo:that.data.pageNo,
        shopId:that.data.companyCode,
        orgId:that.data.officeCode,
        pageSize:that.data.pageSize,
        mfName:that.data.officeName1
        // startTime:that.data.startTime,
        // endTime:that.data.endTime
      }
      url="getDailyOrderGroupByBrand.json"
    }
    
    console.log(data)
    getRequest(getApiHost(), 'platform/v1/api/dayily/'+url, 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        if(res.result&&res.result=='login'){
          that.login()
          console.log('登录失效')
          return;
        }
        if(res.result=='true'){
          if(res.data.list){
            if(res.data.list.length==0){
              // setTimeout(()=>{
                that.setData({
                  loading:false,
                  listIsFull:false,
                  showNo:true,
                  loadAll:false
                })
              // },500)
            }else{
              if(that.data.pageNo>1){
                console.log('第'+that.data.pageNo+'页')
                var list = that.data.lists
                list = list.concat(res.data.list)
                that.setData({
                  lists:list,
                  showNo:false,
                  loadAll:false
                })
                console.log(that.data.lists)
              }else{
                that.setData({
                lists:res.data.list,
                showNo:false,
                loadAll:false
              })
              }
              
              
              if(res.data.count>that.data.pageSize){
                that.setData({
                  loading:true,
                  listIsFull:false
                })
                if(Math.ceil(res.data.count/that.data.pageSize)>that.data.pageNo){
                  that.setData({
                    isMore:true
                  })
                }else{
                  that.setData({
                    isMore:false,
                    loading:false,
                    listIsFull:true
                  })
                }
              }else{
                that.setData({
                  loading:false,
                  listIsFull:true
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
  onStartDatePickerChanged: function(e) {
    this.setData({
      startDate: e.detail.value
    });
  },
  onstartTimePickerChanged: function(e) {
    if(this.data.startDate.length==0){
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
  onEndDatePickerChanged: function(e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  onEndTimePickerChanged: function(e) {
    if(this.data.endDate.length==0){
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
  pickChange1(e){
    this.setData({
      index1:e.detail.value,
      companyCode:this.data.companyLists[e.detail.value].companyCode
    })
  },
  pickChange2(e){
    this.setData({
      index2:e.detail.value
    })
  },
  bindinput(e) {
    this.setData({
      officeName1: e.detail.value
    })
  },
  toPage(e){
    console.log(e.currentTarget.dataset.type)
    wx.navigateTo({
      url: 'sonLists'
    })
  },
  showDetail(e){
    var that = this;
    var lists = that.data.lists;
    var index = e.currentTarget.dataset.index
    lists[index].mark = !lists[index].mark 
    that.setData({
      lists:lists,
    })
  },
  check(e){
    var that = this
    app.doMessage()
    var mark = e.currentTarget.dataset.mark
    if(mark==0){
      that.setData({
        lists: '',
        listIsFull: false,
        loading: false,
        startDate:'',
        startTime1:'',
        endDate:'',
        endTime1:'',
        startTime:'',
        endTime:""
      })
    }else if(mark==1){
      if(that.data.startTime1.length==0){
        if(that.data.startDate.length>1){
          that.setData({
            startTime1:'00:00'
          })
        }
      }
      if(that.data.endTime1.length==0){
        if(that.data.endDate.length>1){
          that.setData({
            endTime1:'00:00'
          })
        }
      } 
      that.setData({
        lists: '',
        listIsFull: false,
        loading: false,
        startTime:that.data.startDate+' '+that.data.startTime1,
        endTime:that.data.endDate+' '+that.data.endTime1
      })
    }

    that.getLists()
  },
  // getSelectLists(e){
  //   var that = this
  //   var data={}
  //   postRequest(getApiHost(), 'platform/v1/api/wxmini/getCompanyList.json', 'body', data, 0, false, true).then(
  //     res => {
  //       if(res.result){
  //         if(that.data.flag==1){
  //         var lists = res.data
  //         var array1 = []
  //         lists.map((item)=>{
  //           array1.push(item.companyName)
  //         })
  //         console.log(array1)
  //           that.setData({
  //             companyLists:lists,
  //             array1:array1,
  //             companyCode:lists[0].companyCode
  //           })
  //         }
         
  //       }else{
  //         wx.showModal({
  //           title: '错误',
  //           content: res.message,
  //           showCancel: false,
  //           confirmText: '知道了',
  //           confirmColor: '#1890FF'
  //         })
  //       }
  //     }
  //   ).catch(res => {
  //     wx.showModal({
  //       title: '错误',
  //       content: '获取公司列表失败，请联系管理员',
  //       showCancel: false,
  //       confirmText: '知道了',
  //       confirmColor: '#1890FF'
  //     })
  //   });
  // },
  confirm(e){
    app.doMessage()
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认该订单吗',
      success(res) {
        if (res.confirm) {
          var data={
            dailyNo:that.data.dailyNo,
            status:2,
            __sid:that.data.sid,
            __ajax:'json',
          }
          getRequest(getApiHost(), 'platform/v1/api/dayily/issue.json', 'body', data, 0, false, true).then(
            res => {
              that.setData({
                disabled1:true
              })
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
  },
  wconfirm(e){
    app.doMessage()
    var that = this
    var lists = that.data.lists
    var array = []
    lists.map((item)=>{
      array.push(item.id-1+1)
    })
    console.log(array)
    wx.showModal({
      title: '提示',
      content: '确认该订单吗',
      success(res) {
        if (res.confirm) {
          var data={
            dailyNo:that.data.dailyNo,
            status:3,
            __sid:that.data.sid,
            __ajax:'json',
          }
          getRequest(getApiHost(), 'platform/v1/api/dayily/wshopissue.json', 'body', data, 0, false, true).then(
            res => {
              that.setData({
                disabled2:true
              })
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
  },
  dconfirm(e){
    app.doMessage()
    var that = this
    console.log(e.currentTarget.dataset.index)
    wx.showModal({
      title: '提示',
      content: '确认该订单吗',
      success(res) {
        if (res.confirm) {
          var data={
            id:e.currentTarget.dataset.id,
            orgId:that.data.officeCode,
            status:4,
            __sid:that.data.sid,
            __ajax:'json',
          }
          getRequest(getApiHost(), 'platform/v1/api/dayily/orgissue.json', 'body', data, 0, false, true).then(
            res => {
              var lists = that.data.lists
              lists[e.currentTarget.dataset.index].status = 4
              that.setData({
                lists:lists
              })
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
