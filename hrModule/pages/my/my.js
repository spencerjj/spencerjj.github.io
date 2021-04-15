// pages/mine/mine.js
var app = getApp();
const {
  $Toast
} = require('../../component/iview/base/index');
import {
  APP_VER
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '',
    url: "",
    userDetails: '',
    loadAll: true,
    lists: '',
    appVersion: APP_VER,
    voteCount: 0,
    resCount: 0
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
    var that = this;
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    let userDetails = wx.getStorageSync('userDetails')
    console.log(app.globalData.pathurl.length)
    let path = app.globalData.pathurl + userDetails.avatarUrl
    that.setData({
      imgPath: path,
      userDetails: userDetails,
    })
    that.getTag()
    that.getVote()
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
    this.setData({
      imgPath: '../../images/back.png',
    })
    this.login()
    wx.showNavigationBarLoading()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

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
  toPage: function (e) {
    var data = e.currentTarget.dataset;
    if(data.url=='money'){
      $Toast({
        content:'暂未开放',
        type:'warning'
      })
      return;
    }
    wx.navigateTo({
      url: data.url
    })
  },
  switchPage(e) {
    wx.switchTab({
      url: 'inform',
    })
  },
  change(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
      }
    })
  },
  getTag(e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'api/tag/TagAllByEmpCodeForMobile.json',
      data: {
        __sid: app.globalData.__sid,
        // __sid:app.globalData.tempSid,
        __ajax: 'json',
        empCode: that.data.userDetails.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.data.result == 'false') {
            $Toast({
              content: res.data.data.message,
              type: 'error'
            })
            return;
          }
          let lists = res.data.data;
          if (lists.length > 5) {
            lists = lists.slice(-5)
          }
          for (let x in lists) {
            if (lists[x].employeeTag.type == '2') {
              for (let y in lists[x].employeeTagValueList) {
                if (lists[x].tagValue == lists[x].employeeTagValueList[y].id) {
                  lists[x].value = lists[x].employeeTagValueList[y].name
                }
              }
            }
            if (lists[x].employeeTag.type == '3') {
              for (let y in lists[x].employeeTagValueList) {
                if (lists[x].selectedValue == lists[x].employeeTagValueList[y].id) {
                  lists[x].value = lists[x].employeeTagValueList[y].name
                }

              }
            }
          }
          that.setData({
            lists: lists,
            loadAll: false
          })
        } else {
          $Toast({
            content: '标签获取失败',
            type: 'warning'
          })
        }
      }
    })
  },
  getVote(e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'api/tag/findSchemeListByUser.json',
      data: {
        __sid: app.globalData.__sid,
        // __sid: app.globalData.tempSid,
        __ajax: 'json',
        empCode: that.data.userDetails.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode != 200) {
          $Toast({
            content: '投票信息获取失败',
            type: 'error'
          })
          return;
        }
        if (res.data.result == 'login') {
          return;
        }
        if (res.data.data.result == 'false') {
          $Toast({
            content: res.data.data.message,
            type: 'error'
          })
          return;
        }
        let lists = res.data.data
        let all = 0;
        lists.map((item) => {
          if (item.status == '4') {
            all++
          }
        })
        if(all>=99){
          all=99
        }
        that.setData({
          voteCount: all
        })
      }
    })
    wx.request({
      url: app.globalData.url + 'api/estimate/list.json',
      data: {
        __sid: app.globalData.__sid,
        // __sid: app.globalData.tempSid,
        __ajax: 'json',
        operatorId: wx.getStorageSync('userDetails').userId,
        pageNo: 1,
        pageSize: 200
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.statusCode == 200) {
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.data.result == 'false') {
            $Toast({
              content: res.data.data.message,
              type: 'error'
            })
            return;
          }
          let lists = res.data.data.list;
          let all = 0;
          lists.map((item) => {
            if (item.status == '0') {
              all++
            }
          })
          if(all>=99){
            all=99
          }
          that.setData({
            resCount: all
          })
        } else {
          $Toast({
            content: '评估卷列表获取失败',
            type: 'warning'
          })
        }
      }
    })
  }

})