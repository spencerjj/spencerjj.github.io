// pages/index/index.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:2,
    active: 3,
    date: '2020-12-16',
    time: '11:30',
    start: '普林仕集团办公楼门口',
    end: '常州高铁总站',
    num: 3,
    flight:'UK2356',
    type:'接机',
    disUser: '王总',
    comment: '同意',
    show: false,
    imgUrl: '',
    imgLists:[],
    km:'',
    btnText:'开始行程',
    photoText:'行程开始照片',
    steps: [{
        text: '11-10 11:10',
        desc: '预约用车',
      },
      {
        text: '11-10 12:10',
        desc: '分配处理',
      },
      {
        text: '11-10 13:10',
        desc: '开始行程',
      },
      {
        text: '　',
        desc: '结束行程',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
    var today = date.getFullYear() + '-' + (month) + '-' + (day)
    this.setData({
      today: today
    })
    this.compare(this.data.date)
    if(this.data.state==1){
      wx.setNavigationBarTitle({
        title: '开始行程',
      })
      this.setData({
        btnText:'开始行程',
        photoText:'行程开始照片',
        active:2
      })
    }else{
      wx.setNavigationBarTitle({
        title: '结束行程',
      })
      this.setData({
        btnText:'结束行程',
        photoText:'行程结束照片',
        active:3
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
  showComment(e) {
    this.setData({
      show: this.data.comment.length == 0 ? false : true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  kmInput(e){
    this.setData({
      km:e.detail.value
    })
  },
  upload() {
    var that = this
      wx.chooseImage({
        count: that.data.limit,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths[0]
          var imgLists = that.data.imgLists.push(tempFilePaths)
          that.setData({
            imgUrl: tempFilePaths,
            imgLists
          })
          // var timestamp = Date.parse(new Date())
          // wx.uploadFile({
          //   url: getApiHost() + 'file/upload',
          //   filePath: tempFilePaths.toString(),
          //   name: 'file',
          //   formData: {
          //     fileMd5: timestamp+'.png',
          //     fileName:timestamp+'.png',
          //     __sid: that.data.userDetails.sid,
          //     __ajax: 'json',
          //   },
          //   success(res) {
          //     wx.hideLoading()
          //     console.log(JSON.parse(res.data))
          //     var res = JSON.parse(res.data)
          //     if(res.result=='true'){
          //       var imgIdLists = that.data.imgIdLists
          //       imgIdLists.push(res.fileUpload.id)
          //       imgLists.push(tempFilePaths.toString())
          //       var limit = that.data.total - imgLists.length
          //       that.setData({
          //         imgIdLists:imgIdLists,
          //         imgLists: imgLists,
          //         limit: limit
          //       })

          //     }else{
          //       wx.showModal({
          //         title: '错误',
          //         content: res.message,
          //         showCancel: false,
          //         confirmText: '知道了',
          //         confirmColor: '#1890FF'
          //       });
          //     }
          //   },
          //   fail(res) {
          //     wx.hideLoading({
          //     })
          //     wx.showModal({
          //       title: '错误',
          //       content: '上传失败，请稍后再试',
          //       showCancel: false,
          //       confirmText: '知道了',
          //       confirmColor: '#1890FF'
          //     });
          //   }
          // })
        }
      })

  },
  confirm(e) {
    var that = this;
    if(that.data.imgUrl.length==0){
      Dialog.alert({
        title: '提示',
        message: '请上传行程照片',
      })
      return;
    }
    if(that.data.km.length==0){
      Dialog.alert({
        title: '提示',
        message: '请填写公里数',
      })
      return;
    }
    Dialog.confirm({
        title: '提示',
        message: '确认结束行程吗',
        asyncClose: true
      })
      .then(() => {
        setTimeout(() => {
          Dialog.close();
          wx.navigateTo({
            url: 'recordLists',
          })
        }, 2000);
      })
      .catch(() => {
        Dialog.close();
      });
  },
  compare(e) {
    var that = this
    var myDate = new Date(e)
    var myYear = myDate.getFullYear()
    var myMonth = myDate.getMonth() + 1
    var myDay = myDate.getDate()
    var tdate = new Date()
    var year = tdate.getFullYear()
    var month = tdate.getMonth() + 1
    var day = tdate.getDate()
    console.log(day + ',' + myDay)
    if (myYear == year && myMonth == month && myDay >= day) {
      if (myDay == day) {
        that.setData({
          date: '今天'
        })
      } else if (myDay - day == 1) {
        that.setData({
          date: '明天'
        })
      } else if (myDay - day == 2) {
        that.setData({
          date: '后天'
        })
      } else {
        that.setData({
          date: that.dateForm(myDate)
        })
      }
    } else {
      that.setData({
        date: that.dateForm(myDate)
      })
    }
  },
  dateForm(e) {
    var date = new Date(e)
    var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
    var date = date.getFullYear() + '年' + (month) + '月' + (day) + '日'
    return date
  }
})