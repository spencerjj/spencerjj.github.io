// pages/index/check.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../../utils/api.js'
var app = getApp();
const {
  $Toast
} = require('../../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    array:[],
    content:'',
    imgLists:[],
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
    remark:'',
    type:'',
    userDetails:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
      index:options.index,
      type:options.type
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
    this.showList()
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
      this.onShow()
    })
  },
  showList(e){
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      type:'report_fail_type'
    }
    postRequest(getApiHost(), 'api/merchant/getDicTypeList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let lists = res.data
        let array = that.data.array
        console.log(lists)
        lists.map((item)=>{
          array.push(item.treeNames)
        })
        that.setData({
          lists:lists,
          array:array
        })

      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      });
    });
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
          var imgLists = that.data.imgLists
          if(tempFilePaths.length>1){
            imgLists = imgLists.concat(tempFilePaths)
          }else{
            imgLists.push(tempFilePaths.toString())
          }
          console.log(imgLists)
          var limit = that.data.total-imgLists.length
          that.setData({
            imgLists:imgLists,
            limit:limit
          })
        }
      })
    }
  },
  pickChange(e){
    this.setData({
      index:e.detail.value,
      type:this.data.lists[e.detail.value].dictCode
    })

  },
  delete(e){
    var index = e.currentTarget.dataset.index
    console.log(index)
    var imgLists = this.data.imgLists
    imgLists.splice(index, 1)
    var limit = this.data.total-imgLists.length
    this.setData({
      imgLists:imgLists,
      limit:limit
    })
  },
  showPic(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.imgLists
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
      if(that.data.remark.length<1){
        $Toast({
          content:'请填写报障内容',
          type:'error'
        })
        return;
      }
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action
      });
      var data = {
        __sid: that.data.userDetails.sid,
        __ajax: 'json',
        remark:that.data.remark,
        type:that.data.type,
        status:4
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
input(e){
  var content = e.detail.value
  console.log(content)
  this.setData({
    remark:content
  })
}
})