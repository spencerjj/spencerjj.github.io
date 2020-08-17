// pages/index/progress/voteList.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[
      {
        goodsName:'商品A',
        code:'123123123',
        brand:'爱马仕',
        num:'99',
        price:1000,
        mark:0,
        comment:''
      },
      {
        goodsName:'商品B',
        code:'32123123',
        brand:'香奈儿',
        num:'99',
        price:1000,
        mark:0,
        comment:''
      },
      {
        goodsName:'商品C',
        code:'123123123',
        brand:'LV',
        num:'99',
        price:1000,
        mark:0,
        comment:''
      },
      {
        goodsName:'商品D',
        code:'123123123',
        brand:'范思哲',
        num:'99',
        price:1000,
        mark:0,
        comment:''
      },

    ],
    pageSize:20,
    pageNo:1,
    loading:false,
    listIsFull:true,
    notice: '请输入备注信息',
    focus: false,
    myComment: '',
    inputShow: false,
    myTag:'',
    indexNow:'',
    bottom:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
      that.showList()
       let type = options.type
  if(type==1){
    wx.setNavigationBarTitle({
      title: '已提货已入账'
    })
  }else if(type==2){
    wx.setNavigationBarTitle({
      title: '未提货'
    })
  }else if(type==3){
    wx.setNavigationBarTitle({
      title: '已提货未入账'
    })
  }
  // Toast.fail('暂无任何订单');
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
  login(e){
    app.doLogin().then(data => {
      this.getInfo()
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.gotoHomePage();
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
  toPage(e){
      wx.navigateTo({
      url: 'sonLists?id='+e.currentTarget.dataset.id+'&title='+e.currentTarget.dataset.title
    })
  },
  showList(e){
    var that = this

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
  comment(e){
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    this.setData({
      focus: true,
      inputShow: true,
      myTag:e.currentTarget.dataset.mark,
      indexNow:index
    })
  },
  reply: function (e) {

  },
  bindfocus: function (e) {
    console.log(e.detail)
    this.setData({
      bottom: e.detail.height
    })
  },
  bindblur: function (e) {
    this.setData({
      inputShow: false,
      myTag: '',
      // bottom:0
    });
  },
  getTags: function (e) {
    this.setData({
      myTag: e.detail.value
    })
  },
  add(e){
    var that = this;
    if(that.data.myTag.length>0){
      console.log(that.data.myTag)
      var lists = that.data.lists
      var index = that.data.indexNow
      lists[index].comment = that.data.myTag
      console.log(lists)
      that.setData({
        lists:lists
      })
    }
  }
})