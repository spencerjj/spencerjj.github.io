// pages/index/progress/voteList.js
const {
  $Message
} = require('../../component/iview/base/index')
const { $Toast } = require('../../component/iview/base/index');
var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:""
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
      wx.request({
        url: app.globalData.url + 'api/tag/findSchemeListByUser.json',
        data: {
          __sid: app.globalData.__sid,
          // __sid: app.globalData.tempSid,
          __ajax: 'json',
          empCode: userDetails.userId
          // empCode:'000236_0dln'
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            if(res.data.result&&res.data.result=='login'){
              that.login()
              console.log('未登录')
              return;
            }
            if (res.data.data.result == 'false') {
              $Toast({
                content: res.data.data.message,
                type:'error'
              })
              return;
            }
          let lists = res.data.data;
          if(lists.length==0){
            $Toast({
              content:'暂无投票方案！',
              type:'warning'
            })
            setTimeout(()=>{
                wx.switchTab({
                  url:'../my/my'
              })
            },1000)
          }
          let all = 0;
          lists.map((item)=>{
            if(item.status=='4'){
              all++
            }
          })
          if(all==0){
            $Toast({
              content:'暂无可用投票方案！',
              type:'warning'
            })
          }
          console.log('值'+all)
          lists.map(item=>{
            console.log(item.endDate)
            let x = item.endDate.replace("-","/")
            let now=new Date()
            x = new Date(Date.parse(x)); 
            if(x>now){  
              item.ifExpired = false
            }else{
              item.ifExpired = true
            }
          })
          that.setData({
            lists:lists
          })
        }else{
            $Toast({
              content:'投票列表获取失败',
              type:'warning'
            })
        }
      }
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
    if(e.currentTarget.dataset.mark=='3'){
      $Toast({
        content:'该方案已过期!',
        type:'warning'
      })
    }else{
      wx.navigateTo({
      url: 'vote?schemeId='+e.currentTarget.dataset.id+'&indexmark='+1
    })
    }
    
  }
})