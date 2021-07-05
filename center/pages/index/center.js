// pages/index/center.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    isShow:false,
    swiperH:'',
    card:3,
    imgLists:[1,2,3,4]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.ifUser().then((data)=>{
      let current = 0
      switch (data.tier){
        case '银星卡会员':
          current = 0
          break;
        case '金星卡会员':
          current = 1
          break;
        case '黑金卡会员':
          current = 2
          break;
        case '黑钻卡会员':
          current = 3
          break;
      }
      that.setData({
        userInfo:data,
        current
      })
    }).then()
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

  onShareAppMessage: function(res) {

  },
  onShareTimeline: function () {
		return {
	      title: '',
	      query: {
	        key: value
	      },
	      imageUrl: ''
	    }
	},
  onChange(e){
    console.log(e.detail.index)
    this.setData({
      current:e.detail.index
    })
  },
  toPage(){
    wx.navigateTo({
      url: 'detail',
    })
  }

})