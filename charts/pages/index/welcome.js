// pages/index/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pro:0,
    gifLeft:2
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
    var set = setInterval(()=>{
      this.setData({
        pro:this.data.pro+1,
      })
      if(this.data.gifLeft<90){
        this.setData({
          gifLeft:this.data.gifLeft+0.9
        })
      }
      if(this.data.pro==100){
        clearInterval(set)
        wx.switchTab({
          url: 'index',
        })
      }
    },20)
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

  }
})