const {
  $Message,$Toast
} = require('../../component/iview/base/index');
var app = getApp();
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {
  HOST_URI
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    listIsFull:false,
    showNo:false,
    loadAll:true,
    pageNo:1,
    pageSize:10,
    status:1,
    current:1,
    lists:'',
    isMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    let userDetails = wx.getStorageSync('userDetails')
      that.setData({
        userDetails: userDetails,
          lists:[]
        })
      that.showList()
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
    this.setData({
      pageNo: 1,
      listIsFull: false,
      loading: false,
      loadAll:true,
      showNo:false
    })
    this.onShow();

    wx.showNavigationBarLoading()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log('到底了')
    if (that.data.isMore) {
      var pageNo = that.data.pageNo;
      pageNo++;
      that.setData({
        pageNo: pageNo
      })
      that.showList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  login(e){
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  showList:function(){
    console.log('获取列表了了来了')
    var that = this;
    var requestUrl = ''
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      status:that.data.status
    }
    if(that.data.current!=3){
      requestUrl = 'bpm/bpmMyTask/listData.json'
    }else{
      requestUrl = 'bpm/bpmMyRuntime/listData.json'
    }
    
    wx.request({
      url: HOST_URI+requestUrl,
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if(res.statusCode==200){
          if(res.data.result&&res.data.result=='login'){
            that.login()
            console.log('未登录')
            return;
          }
        if(res.data.list){
          if(res.data.list.length==0){
              that.setData({
                loading:false,
                listIsFull:false,
                showNo:true,
                loadAll:false
              })
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
                isMore:false,
                loading:false,
                listIsFull:true
              })
            }
          }
        }else{
          that.onShow()
        }
      }else{
        $Toast({
          content:'流程列表获取失败',
          type:'warning'
        })
      }
    }
    })

  },
  toPage: function (e) {
    var data = e.currentTarget.dataset;
    wx.navigateTo({
      url: data.url
    })
  },
  showDetail:function(e){
    var url = e.currentTarget.dataset.type
    console.log(e.currentTarget.dataset.biz)
    if(url=='reportFail'){
      url = 'checkFail'
    }
    wx.navigateTo({
      url: url+'?id='+e.currentTarget.dataset.id+'&c='+this.data.current+'&bizKey='+e.currentTarget.dataset.biz,
    })
  },
  handleChange({detail}){
    this.setData({
      current:detail.key,
      status:detail.key
    })
    this.setData({
      pageNo: 1,
      listIsFull: false,
      loading: false,
      loadAll:true,
      showNo:false,
      isMore:false,
      lists:''
    })
    if(detail.key==1){
      wx.setNavigationBarTitle({
        title: '待办事项'
      })
    }else if(detail.key==2){
      wx.setNavigationBarTitle({
        title: '已办事项'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '我发起的'
      })
    }
    
 
    this.showList();
    wx.pageScrollTo({
      scrollTop: 0
    })
    
  }
})