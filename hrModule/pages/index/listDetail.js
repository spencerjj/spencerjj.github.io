// pages/index/listDetail.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imglist: '',
    pkMsgNotice:'',
    list:'',
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  detail: function (e) {
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  attendDetail:function(e){
    var that = this;
    var url;
    if (that.data.list.typeMsg==2){
      url = 'attendDetail1'
    }else{
      url = 'attendDetail'
    }
    wx.navigateTo({
      url: url + '?pkClass=' + e.currentTarget.dataset.name + '&pkMsgNotice=' + that.data.pkMsgNotice+'&nameClass='+that.data.list.title
    })
  },
  time: function (e) {
    if(e){
      if(e.length==5){
        return e
      }else{
        var date = new Date(e);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '年';
        var M = date.getMonth() + 1 + '月'
        var D = date.getDate() + '日';
        return Y + M + D
      }
      
    }else{
      return null
    }
    
  },
  more: function (e) {
    var that = this;

  }
})