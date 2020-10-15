// pages/index/inform.js
var app = getApp();
const { $Toast } = require('../../component/iview/base/index');
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
    wx.setNavigationBarTitle({
      title: '流程列表'
    })
 
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
      that.setData({
          // __sid:app.globalData.__sid
          __sid:app.globalData.tempSid,
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
    var requestData = ''
    var requestUrl = ''
    if(that.data.status==1){
      requestData = {
        __sid: that.data.__sid,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        status:that.data.status,
        __ajax:'json'
      }
      requestUrl = 'bpm/bpmMyTask/listData.json'

    }else if(that.data.status==2){
      requestData = {
        __sid: that.data.__sid,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        status:that.data.status,
        'procIns.name':that.data.name,
        __ajax:'json'
      }
      requestUrl = 'bpm/bpmMyTask/listData.json'
    }else{
      requestData = {
        __sid: that.data.__sid,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        __ajax:'json'
      }
      requestUrl = 'bpm/bpmMyRuntime/listData.json'
    }
    
    wx.request({
      url: app.globalData.url+requestUrl,
      data: requestData,
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
            
            
            if(res.data.count>10){
              that.setData({
                loading:true,
                listIsFull:false
              })
              if(Math.ceil(res.data.count/10)>that.data.pageNo){
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
    var url = ''
    var current = this.data.current
    if(e.currentTarget.dataset.key=='entry'){
      url = 'progress/entry'
    }else if(e.currentTarget.dataset.key=='out'){
      url = 'progress/leave'
    }else if(e.currentTarget.dataset.key=='recruitment'){
      url = 'progress/apply'
    }else if(e.currentTarget.dataset.key=='regular'){
      url = 'progress/regular'
    }else if(e.currentTarget.dataset.key=='transfer'){
      url = 'progress/transfer'
    }else if(e.currentTarget.dataset.key=='continue'){
      url = 'progress/renew'
    }
    console.log(url+'?id='+e.currentTarget.dataset.id+'&status='+e.currentTarget.dataset.status+'&current='+current+'&biz='+e.currentTarget.dataset.biz+'&key='+e.currentTarget.dataset.key)
    wx.navigateTo({
      url: url+'?id='+e.currentTarget.dataset.id+'&status='+e.currentTarget.dataset.status+'&current='+current+'&biz='+e.currentTarget.dataset.biz+'&key='+e.currentTarget.dataset.key
    })
  },
  handleChange({detail}){
    this.setData({
      current:detail.key,
      status:detail.key
    })
    this.setData({
      pageNo: 1,
      pageSize:10,
      listIsFull: false,
      loading: false,
      loadAll:true,
      showNo:false,
      isMore:false,
      lists:'',
      name:''
    })
    this.showList();
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
})