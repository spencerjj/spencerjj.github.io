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
    endTime: '00:00',
    startDate:'',
    startTime:'00:00',
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
    id:''
  },
  onLoad: function () {
    console.log(this.options.id)
    this.setData({
      id:this.options.id
    })
  },
  onShow:function(){
    var that = this;
    var now = new Date();
    that.setData({
      endDate: now.format('yyyy-MM-dd'),
      startDate:now.format('yyyy-MM-dd'),
      // endTime: now.format('hh:mm'),
      today: now.format('yyyy-MM-dd')
    });
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      name:userInfo.username,
      phoneNo:userInfo.loginCode,
      sid:userInfo.sid
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
  login(e){
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  getLists(x){
    var that = this
    if(x){
      var data = x
    }else{
      var data={
        __sid:that.data.sid,
        __ajax:'json',
        pageNo:that.data.pageNo,
        pageSize:that.data.pageSize,
        dailyNo:that.data.id
      }
    }
    getRequest(getApiHost(), 'platform/v1/api/dayily/getDailyOrderGroupByOrg.json', 'body', data, 0, false, true).then(
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
      this.setData({
        startTime: e.detail.value
      });
  },
  onEndDatePickerChanged: function(e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  onEndTimePickerChanged: function(e) {
      this.setData({
        endTime: e.detail.value
      });
  },
  pickChange1(e){
    this.setData({
      index1:e.detail.value
    })
  },
  pickChange2(e){
    this.setData({
      index2:e.detail.value
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
    var data = {
      companyCode:that.data.companyCode,
      startTime:that.data.startDate+' '+that.data.startTime,
      endTime:that.data.endDate+' '+that.data.endTime,
      pageSize:that.data.pageSize,
      pageNo:that.data.pageNo,
      dailyNo:that.data.id,
      __sid:that.data.sid,
      __ajax:'json',
    }
    that.setData({
      lists:''
    })
    that.getLists(data)
  },
  getSelectLists(e){
    var that = this
    var data={}
    postRequest(getApiHost(), 'platform/v1/api/wxmini/getCompanyList.json', 'body', data, 0, false, true).then(
      res => {
        if(res.result){
          var lists = res.data
          var array1 = []
          lists.map((item)=>{
            array1.push(item.companyName)
          })
          console.log(array1)
          that.setData({
            companyLists:lists,
            array1:array1,
            companyCode:lists[0].companyCode
          })
        }else{
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#1890FF'
          })
        }
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: '获取公司列表失败，请联系管理员',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  }
})
