// pages/index/progress/voteList.js
const {
  $Message,$Toast
} = require('../../component/iview/base/index');
var app = getApp();
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:'',
    pageSize:20,
    pageNo:1,
    loadAll:true,
    loading:false,
    listIsFull:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
      let userDetails = wx.getStorageSync('userDetails')
      that.setData({
        userDetails: userDetails,
      })
      that.showList()
     
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
    this.onLoad()
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
    // this.gotoHomePage();
  },
  gotoHomePage: function () {//自定义页面跳转方法
    let that = this;
    if (that.data.clickFlag) {
        return;
    } else {
        that.setData({ clickFlag: true });
    }
    wx.switchTab({
        url: '../my/my',
    });
},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1,
      listIsFull: false,
      loading: false,
      loadAll:true
    })
    this.onLoad();

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
      this.onLoad()
    })
  },
  toPage(e){
      wx.navigateTo({
      url: 'estimate?id='+e.currentTarget.dataset.id
    })
  },
  showList(e){
    var that = this
    var  data = {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        operatorId: that.data.userDetails.userId,
        pageNo:that.data.pageNo,
        pageSize:that.data.pageSize
      }
    var lists = [
      {
        companyName:'百货',
        title:'报障',
        userName:'联系人',
        phone:'131123123123',
        tel:'0510-89887838',
        remark:'专业人员'
      },
      {
        companyName:'蓝豹',
        title:'检修',
        userName:'联系人',
        phone:'131123123123',
        tel:'0510-89887838',
        remark:'专业人员'
      },
      {
        companyName:'新世纪',
        title:'维护',
        userName:'联系人',
        phone:'131123123123',
        tel:'0510-89887838',
        remark:'专业人员'
      }]
      lists.map((item)=>{
        item.mark = 0
      })
      that.setData({
      lists:lists,
      loadAll:false,
      listIsFull:true
    })
  },
  showDetail(e){
    var that = this;
    var lists = that.data.lists;
    var index = e.currentTarget.dataset.index
    lists[index].mark = !lists[index].mark 
    that.setData({
      lists:lists
    })
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mark //仅为示例，并非真实的电话号码
    })
  }
})