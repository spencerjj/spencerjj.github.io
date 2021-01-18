// pages/index/check.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../../utils/api.js'
var app = getApp();
const md5 = require('../../../utils/md5')
const {
  $Toast
} = require('../../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    array: [],
    content: '',
    imgLists: [],
    imgIdLists:[],
    total: 6,
    limit: 6,
    actions: [{
      name: '提交',
      color: '#2d8cf0',
      loading: false
    }],
    visible: false,
    remark: '',
    type: '',
    userDetails: '',
    name:'',
    ifClick:false
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
    this.showList()
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
    wx.showLoading()
    setTimeout(()=>{
      wx.hideLoading()
    },2000)    
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
      this.onLoad()
    })
  },
  showList(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      type: 'report_fail_type'
    }
    postRequest(getApiHost(), 'api/merchant/getDicTypeList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let lists = res.data
        let array = []
        console.log(lists)
        lists.map((item) => {
          array.push(item.treeNames)
        })
        that.setData({
          lists: lists,
          array: array,
          type: lists[0].dictValue
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
  upload() {
    var that = this
    if (that.data.limit > 0) {
      wx.chooseImage({
        count: that.data.limit,
        sizeType: ['compressed'],
        sourceType: ['album','camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          var imgLists = that.data.imgLists
          if (tempFilePaths.length > 1) {
            imgLists = imgLists.concat(tempFilePaths)
          } else {
            var timestamp = Date.parse(new Date())
            wx.uploadFile({
              url: getApiHost() + 'file/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths.toString(),
              name: 'file',
              formData: {
                fileMd5: timestamp+'.png',
                fileName:timestamp+'.png',
                __sid: that.data.userDetails.sid,
                __ajax: 'json',
              },
              success(res) {
                wx.hideLoading()
                console.log(JSON.parse(res.data))
                var res = JSON.parse(res.data)
                if(res.result=='true'){
                  var imgIdLists = that.data.imgIdLists
                  imgIdLists.push(res.fileUpload.id)
                  imgLists.push(tempFilePaths.toString())
                  var limit = that.data.total - imgLists.length
                  that.setData({
                    imgIdLists:imgIdLists,
                    imgLists: imgLists,
                    limit: limit
                  })
                  
                }else{
                  wx.showModal({
                    title: '错误',
                    content: res.message,
                    showCancel: false,
                    confirmText: '知道了',
                    confirmColor: '#1890FF'
                  });
                }
              },
              fail(res) {
                wx.hideLoading({
                })
                wx.showModal({
                  title: '错误',
                  content: '上传失败，请稍后再试',
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#1890FF'
                });
              }
            })
          }
        }
      })
    }
  },
  pickChange(e) {
    this.setData({
      index: e.detail.value,
      type: this.data.lists[e.detail.value].dictValue
    })
  },
  delete(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    var imgLists = this.data.imgLists
    imgLists.splice(index, 1)
    var imgIdLists = this.data.imgIdLists
    imgIdLists.splice(index, 1)
    var limit = this.data.total - imgLists.length
    this.setData({
      imgLists: imgLists,
      imgIdLists: imgIdLists,
      limit: limit
    })
  },
  showPic(e) {
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
      if(that.data.ifClick){
        $Toast({
          content: '数据提交中，请稍等',
          type: 'warning'
        })
        return;
      }
      if (that.data.remark.length < 1) {
        $Toast({
          content: '请填写报障内容',
          type: 'error'
        })
        that.setData({
          visible: false
        })
        return;
      }
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action,
        ifClick:true
      });
      var data = {
        __sid: that.data.userDetails.sid,
        __ajax: 'json',
        remark: that.data.remark,
        type: that.data.type,
        merchantReportFail_image:that.data.imgIdLists.toString(),
        status: 4
      }
      console.log(data)
      postRequest(getApiHost(), 'api/merchant/merchantReportFailSave', 'url', data, 0, false, false, false).then(
        res => {
          if (res.result && res.result == 'login') {
            that.login()
            console.log('登录失效')
            return;
          }
          console.log(res)
            action[0].loading = false;
            that.setData({
              visible: false,
              actions: action,
              ifClick:false
            });
            $Toast({
              content: '提交成功！',
              type: 'success'
            });
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/my/my',
              })
            },1000)
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
        that.setData({
          visible: false,
          actions: action,
          ifClick:false
        });
      });
    }
  },
  handleOpen() {
    this.setData({
      visible: true
    });
  },
  input(e) {
    var content = e.detail.value
    this.setData({
      remark: content
    })
  },
  mainInput(e){
    this.setData({
      name:e.detail.value
    })
  }
})