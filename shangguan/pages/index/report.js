// pages/index/check.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
const {
  $Toast
} = require('../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    array:['日常维修','突发故障'],
    content:'',
    lists:[],
    total:6,
    limit:6,
    actions: [
      {
          name: '提交',
          color:'#2d8cf0',
          loading:false
      }
    ],
    visible:false,
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
  upload(){
    var that = this
    if(that.data.limit>0){
      wx.chooseImage({
        count: that.data.limit,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          var lists = that.data.lists
          if(tempFilePaths.length>1){
            lists = lists.concat(tempFilePaths)
          }else{
            lists.push(tempFilePaths.toString())
          }
          console.log(lists)
          var limit = that.data.total-lists.length
          that.setData({
            lists:lists,
            limit:limit
          })
        }
      })
    }
  },
  pickChange(e){
    this.setData({
      index:e.detail.value
    })
  },
  delete(e){
    var index = e.currentTarget.dataset.index
    console.log(index)
    var lists = this.data.lists
    lists.splice(index, 1)
    var limit = this.data.total-lists.length
    this.setData({
      lists:lists,
      limit:limit
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
      // wx.request({
      //   url: app.globalData.url + 'oa/oaPostRecruitment/save.json',
      //   method: 'post',

      //   data: data,
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded',
      //   },
      //   success(res) {
      //     console.log(res)
      //     if (res.data.result=='true') {
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
          // }

        // }
      // })
  }
},
handleOpen() {
  this.setData({
      visible: true
  });
},
})