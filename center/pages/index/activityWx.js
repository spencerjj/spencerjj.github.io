// pages/index/activityWx.js
var app = getApp();
import {
  getApiHost,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId,
  HOST_URI
} from '../../config.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxLink:'',
    id:'',
    typeid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.wxLink)
    this.setData({
      // wxLink:app.globalData.wxLink
      id:options.id,
      typeid:options.typeid
    })
    this.getInfo()
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
  getInfo(e) {
    var that = this;
    var data = {
      storeId:storeId,
      typeId:that.data.typeid,
      id:that.data.id,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getShoppingActiveSecondList', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result=='true') {
          let actLists = res.data
          that.setData({
            wxLink:actLists[0].wxLink
          })
        } else {
          Toast({
            message: '活动获取失败',
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg,
        type: 'warning'
      });
    });
  },
  onShareAppMessage: function(res) {
    let that = this
    return {
      path:"/pages/index/activityWx?typeid="+this.data.typeid+"&id="+that.data.id
    }
  },
  onShareTimeline: function () {
		return {
	      title: '',
	      query: {
	        key: value
	      },
	      imageUrl: ''
	    }
	},
})