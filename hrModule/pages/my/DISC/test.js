// pages/my/DISC/test.js
// pages/index/vote.js
const {
  $Message
} = require('../../../component/iview/base/index')
const { $Toast } = require('../../../component/iview/base/index');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    index:0,
    current:'',
    ifConfirm:false,
    result:['D','I'],
    loadAll:true,
    discId:'',
    discTitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userDetails = wx.getStorageSync('userDetails')
    this.setData({
      discId:options.id,
      discTitle:options.title,
      userDetails: userDetails
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    console.log(options.id)
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
    this.getInfo()
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
  login(e) {
    app.doLogin().then(data => {
      this.onShow()
      this.setData({
        loadAll: true
      })
    })
  },
  getInfo(e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'lampo/disc/mDiscDetail',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        discId: that.data.discId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.result == 'false') {
            $Toast({
              content: res.data.message,
              type: 'error'
            })
            return;
          }
          console.log(res.data)
          that.setData({
            lists:res.data.lists,
            current:res.data.lists[0].choise,
            loadAll:false
          })
        } else {
          $Toast({
            content: res.data.message,
            type: 'warning'
          })
        }
      }
    })
  },
  preview(e){
    if(this.data.index>0){
      this.setData({
        index:this.data.index-1,
        current:this.data.lists[this.data.index-1].choise
      })
    }
  },
  next(e){
    var index = this.data.index
    var lists = this.data.lists
    var ifChoose = false
    for(let x in lists[index].choise){
      if(lists[index].choise[x].mark){
        ifChoose  = true
      }
    }
    if(!ifChoose){
      $Toast({
        content: '请先完成当前题目!',
        type: 'warning'
      })
      return;
    }
    if(this.data.index<this.data.lists.length-1){
      this.setData({
        index:this.data.index+1,
        current:this.data.lists[this.data.index+1].choise
      })
    }
    if(this.data.index==this.data.lists.length-1){
      $Toast({
        content: '已是最后一题!',
        type: 'warning'
      })
    }
  },
  select(e){
    console.log(this.data.index+','+this.data.lists.length)
    var index = this.data.index
    var currentIndex = e.currentTarget.dataset.mark
    var lists = this.data.lists
    var result = this.data.result
    for(let x in lists[index].choise){
      lists[index].choise[x].mark = false
    }
    lists[index].choise[currentIndex].mark = true
    this.setData({
      lists:lists,
      current:this.data.lists[index].choise,
    })
    if(index<=this.data.lists.length-1){
      result[index]=(lists[index].choise[currentIndex].id)
      this.setData({
        result:result
      })
    }
    if(index<this.data.lists.length-1){
      this.setData({
        index:index+1
      })
      if(index<this.data.lists.length-1){
        setTimeout(()=>{
          this.setData({
            current:this.data.lists[index+1].choise
          })
        },200)
      }
    }
    if (index==this.data.lists.length-1){
      console.log(12312312)
      this.setData({
        ifConfirm:true
      })
    }
  },
  confirm(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认提交吗',
      success(res) {
        console.log(that.data.result)
        that.setData({
          loadAll:true
        })
        var data = {
          empCode:that.data.userDetails.userId,
          empName:that.data.userDetails.userName,
          discId:that.data.discId,
          discTitle:that.data.discTitle,
          list:that.data.result
        }
        wx.request({
          url: app.globalData.url + 'lampo/disc/mDiscSave',
          data: {
            __sid: app.globalData.__sid,
            __ajax: 'json',
            data: JSON.stringify(data)
          },
          // header: {
          //   'content-type': 'application/json' // 默认值
          // },
          success(res) {
            if (res.statusCode == 200) {
              if (res.data.result == 'false') {
                $Toast({
                  content: res.data.message,
                  type: 'error'
                })
                return;
              }
              console.log(res.data)
              if(res.data.result='true'){
                wx.redirectTo({
                  url: 'loading',
                })
              }
            } else {
              $Toast({
                content: res.data.message,
                type: 'warning'
              })
            }
          }
        })
      }
    })
  }
})