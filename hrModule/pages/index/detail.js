// pages/index/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    msg:'',
    teacherReply:'',
    pkMsgLeave:'',
    content:'',
    inputShow: false,
    focus: false,
    myComment: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id)
    that.setData({
      pkMsgLeave: options.id
    })
    // wx.request({
    //   url: app.globalData.ip+'/spc/api/msg/wx6334b87275e169ab/leave/'+options.id,
    //   data: {},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data.data)
    //     res.data.data.createTime = that.time(res.data.data.createTime)
    //     that.setData({
    //       content:res.data.data.content,
    //       msg:res.data.data,
    //       imglist: res.data.data.images,
    //       teacherReply: res.data.data.pkTeacher,
    //       list:res.data.data
    //     })
    //   }
    // })
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
    var temp = wx.getStorageSync('userInfo')
    app.globalData.currentTeacher.pkTeacher = temp.pkTeacher
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
  detail:function(e){
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  time: function (e) {
    var date = new Date(e);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '年';
    var M = date.getMonth() + 1 + '月'
    var D = date.getDate() + '日';
    return Y + M + D
  },
  action:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定同意请假吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '审批中',
          })
          console.log(that.data.pkMsgLeave)
          wx.request({
            url: app.globalData.ip+'/spc/api/msg/wx6334b87275e169ab/leaveReply',
            data: {
              pkMsgLeave: that.data.pkMsgLeave,
              status: 1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              wx.showToast({
                title: '审批成功',
              })
              setTimeout(function(){
                wx.navigateBack({})
              },1000)
            }
          })
        }
      }
    })
  },
  action1: function (e) {
    var that = this;
    if(that.data.myComment.length==0){
      wx.showToast({
        title: '请输入理由',
        image: '../../images/00-8.png',
        duration: 2000
      })
    }else{
          wx.showModal({
      title: '提示',
      content: '确定拒绝请假吗',
      success(res) {
        console.log(that.data.myComment)
        if (res.confirm) {
          wx.showLoading({
            title: '审批中',
          })
          console.log(that.data.pkMsgLeave)
          wx.request({
            url: app.globalData.ip + '/spc/api/msg/wx6334b87275e169ab/leaveReply',
            data: {
              pkMsgLeave: that.data.pkMsgLeave,
              status: -1,
              teacherReply: that.data.myComment.trim()
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              wx.showToast({
                title: '审批成功',
              })
              setTimeout(function () {
                wx.navigateBack({})
              }, 1000)
            }
          })
        }else{
          that.setData({
            myComment:''
          })
        }
      }
    })
    }

  },
  comment: function (e) {
    var that = this;
    that.setData({
      focus: true,
      inputShow: true,
    })
  },
  bindblur: function (e) {
    // wx.showTabBar({})
    this.setData({
      // height: 0,
      inputShow: false,
    });
  },
  getComment:function(e){
    console.log(e.detail.value)
    this.setData({
      myComment: e.detail.value
    })
  }
})