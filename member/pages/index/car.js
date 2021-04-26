// pages/index/car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    plateNumber:"苏D".split('')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(new Date().getTime())
    wx.requestPayment(
      {
      "timeStamp":new Date().getTime(),
      "nonceStr": "",
      "package": "prepay_id=123",
      "signType": "MD5",
      "paySign": "",
      "success":function(res){},
      "fail":function(res){},
      "complete":function(res){}
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
  onChange(e){
    this.setData({
      plateNumber:e.detail
    })
    console.log(e.detail.join(''));
 }
})