// pages/index/check.js
const {
  $Message,$Toast
} = require('../../component/iview/base/index');
const md5 = require('../../utils/md5')
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
    array:['正常','异常'],
    index1:0,
    array1:['南区','北区','西区','东区','楼道','天台'],
    lists:[],
    img:[],
    total:9,
    limit:9,
    actions: [
      {
          name: '提交',
          color:'#2d8cf0',
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
    console.log(md5.b64Md5('1B2M2Y8AsgTpgAmY7PhCfg'))
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
          if (tempFilePaths.length > 1) {
            console.log('大于1')
            lists = lists.concat(tempFilePaths)
            // for (let x in lists) {
            //   wx.uploadFile({
            //     url: app.globalData.ip+'/spc/api/res/upload', //仅为示例，非真实的接口地址
            //     filePath: lists[x],
            //     name: 'res',
            //     formData: {
            //       'user': 'test'
            //     },
            //     success(res) {
            //       var data = JSON.parse(res.data).data
            //       console.log(JSON.parse(res.data).data)
            //       data = data.split('/');
            //       data = data[data.length - 1];
            //       console.log(data)
            //       var img1 = that.data.img
            //       img1.push(data)
            //       that.setData({
            //         img: img1
            //       })
            //       if (img1.length == list.length) {
            //         wx.showToast({
            //           title: '',
            //           icon: 'success',
            //           duration: 2000
            //         })
            //       }
            //     },
            //     fail(res) {
            //       console.log(res);
            //     }
            //   })
            // }
  
          } else {
            console.log('小于1')
            lists.push(tempFilePaths.toString())
            // wx.uploadFile({
            //   url: app.globalData.ip+'/spc/api/res/upload', //仅为示例，非真实的接口地址
            //   filePath: tempFilePaths.toString(),
            //   name: 'res',
            //   formData: {
            //     'user': 'test'
            //   },
            //   success(res) {
            //     var data = JSON.parse(res.data).data
            //     console.log(JSON.parse(res.data).data)
            //     data = data.split('/');
            //     data = data[data.length - 1];
            //     console.log(data)
            //     var img1 = that.data.img
            //     img1.push(data)
            //     that.setData({
            //       img: img1
            //     })
            //     wx.showToast({
            //       title: '',
            //       icon: 'success',
            //       duration: 2000
            //     })
            //   },
            //   fail(res) {
            //     console.log(res);
            //   }
            // })
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
    const action = [...this.data.actions];
    action[0].loading = false;
      this.setData({
        visible: false,
        actions: action
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
        });
          const action = [...this.data.actions];
          action[0].loading = false;
            this.setData({
              visible: false,
              actions: action
            });
      });
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