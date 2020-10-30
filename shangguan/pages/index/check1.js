// pages/index/check.js
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
    index:0,
    array:['一般故障','物业故障','紧急故障'],
    index1:0,
    array1:['天台','楼道','储物间'],
    title:'添加备注',
    content:'无异常',
    lists:['http://tiebapic.baidu.com/forum/w%3D580/sign=cb059115dd8065387beaa41ba7dda115/11fef636afc3793152439272fcc4b74543a9114b.jpg'],
    total:9,
    limit:9,
    actions: [
      {
          name: '提交',
          color:'#2d8cf0',
          loading:false
      },
      {
        name: '退回',
        color:'#ff0000',
        loading:false
    }
    ],
    visible:false,
    today:'',
    time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToday()
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
  login(e){
    app.doLogin().then(data => {
        this.onLoad()
    })
  },
  pickChange(e){
    this.setData({
      index:e.detail.value
    })
      this.setData({
        title:!e.detail.value?'添加备注':'异常描述',
        content:!e.detail.value?'无异常':'异常情况'
      })
  },
  showPic(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.lists
    })
  },
  handleCancel() {
    this.setData({
        visible: false
    });
},

handleClickItem({
  detail
}) {
  var that = this
  const index = detail.index + 1;
  // 提交操作
  if (index == 1) {
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action
      });
      var data = {
        __sid: that.data.sid,
        __ajax: 'json',
      }
      getRequest(getApiHost(), 'platform/v1/api/minireport/lampo/findAreaDetailList', 'body', data, 0, false, false).then(
        res => {
          if (res.result && res.result == 'login') {
            that.login()
            console.log('登录失效')
            return;
          }
          console.log(res)
          setTimeout(() => {
            action[0].loading = false;
            that.setData({
              visible: false,
              ifInput: false,
              actions: action
            });
            $Toast({
              content: '提交成功！',
              type: 'success'
            });
          }, 1000);
        }
      ).catch(res => {
        wx.showModal({
          title: '错误',
          content: res.message,
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#1890FF'
        })
      });
  }else if(index==2){
    wx.navigateTo({
      url: 'back',
    })
  }
},
handleOpen() {
  this.setData({
      visible: true
  });
},
placeChange(e){
  this.setData({
    index1:e.detail.value
  })
},
timeChange(e){
  this.setData({
    time:e.detail.value
  })
},
getToday(e){
  var date = new Date()
  var year = date.getFullYear()>=10?date.getFullYear():'0'+date.getFullYear()
  var month = (date.getMonth()-1+2)>=10?(date.getMonth()-1+2):'0'+(date.getMonth()-1+2)
  var day = date.getDate()>=10?date.getDate():'0'+date.getDate()
  var hour = date.getHours()>=10?date.getHours():'0'+date.getHours()
  var second = date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes()
  var today = year+'-'+month+'-'+day
  var time = hour+':'+second
  this.setData({
    today:today,
    time:time
})
}
})