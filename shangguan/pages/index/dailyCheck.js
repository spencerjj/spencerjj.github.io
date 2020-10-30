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
    array1:['南区','北区','西区','东区','楼道','天台'],
    lists:[
      {
        id:111,
        area:'南区',
        pic:''
      },
      {
        id:222,
        area:'北区',
        pic:''
      },
      {
        id:333,
        area:'西区',
        pic:''
      },
      {
        id:444,
        area:'东区',
        pic:''
      },
      {
        id:555,
        area:'楼道',
        pic:''
      },
      {
        id:666,
        area:'南区',
        pic:''
      },
      {
        id:777,
        area:'天台',
        pic:''
      },
    ],
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
    var lists = wx.getStorageSync('checkLists')
    if(lists){
      this.setData({
        lists:lists
      })
    }

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
  upload(e){
    var that = this
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var lists = that.data.lists
    if(lists[index].pic.length==0){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          lists[index].pic = tempFilePaths.toString()
          that.setData({
            lists:lists
          })
          console.log(lists)
          wx.removeStorageSync('checkLists')
          wx.setStorageSync('checkLists', lists)
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
    lists[index].pic=''
    this.setData({
      lists:lists
    })
  },
  showPic(e){
    var array = []
    array.push(e.currentTarget.dataset.url)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: array
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