// pages/my/selectLists.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop : 0,
    lists:[
      {
        id:1,
        content:[
          {
            name:'注册程序'
          },
          {
            name:'注册程序'
          },
          {
            name:'注册程序'
          },
          {
            name:'注册程序'
          },
          {
            name:'注册程序'
          },
          {
            name:'注册程序'
          },
          {
            name:'注册程序'
          },
        ]
      },
      {
        id:2,
        content:[
          {
            name:'卸载程序'
          },
          {
            name:'卸载程序'
          },
          {
            name:'卸载程序'
          },
          {
            name:'卸载程序'
          },
          {
            name:'卸载程序'
          },
          {
            name:'卸载程序'
          },
          {
            name:'卸载程序'
          },
        ]
      },
      {
        id:3,
        content:[
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
        ]
      },
      {
        id:4,
        content:[
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
        ]
      },
      {
        id:5,
        content:[
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
          {
            name:'删除程序'
          },
        ]
      },
    ]
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
  onChange(event){
    console.log(event.detail,'click right menu callback data')
  },
  onPageScroll(event){
      this.setData({
          scrollTop : event.scrollTop
      })
      console.log(event.scrollTop)
  },
  select(e){
    console.log(e.currentTarget.dataset.index)
  }
})