// pages/login/login.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {HOST_URI} from '../../config.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    state:2,
    openid:'',
    sessionKey:'',
    phoneNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.login({
      //获取code
      success: function(res) {
        var code = res.code //返回code
        console.log(code)
        that.setData({
          code: code
        })
      var data = {
        code:code,
        ajax: '_json'
      }
      getRequest(getApiHost(), 'platform/v1/api/wxmini/code2session.json', 'body', data, 0, false, true).then(
        res => {
          console.log(res)
          that.setData({
            openid:res.data.openid,
            sessionKey:res.data.sessionKey
          })
        }
      ).catch(res => {
        wx.showModal({
          title: '登录失败',
          content: '没有访问权限，请联系管理员',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#1890FF'
        })
      });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getPhoneNumber(e) {
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      Notify({
        message: '授权失败，请重新授权登录',
        type: 'warning'
      });
    } else {
      var that = this;
      var data = {
        openid:that.data.openid,
        sessionKey:that.data.sessionKey,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        code: that.data.code,
        ajax: '_json',
      }
      getRequest(getApiHost(), 'platform/v1/api/wxmini/getPhoneNumber.json', 'body', data, 0, false, true).then(
        res => {
          console.log(res.data)
          that.setData({
            phoneNo:res.data
          })
          that.doLogin()
          // wx.removeStorageSync('token');
          // wx.setStorageSync('token', res.data.token);
          // var userInfo = {};
          // userInfo.headUrl = res.data.headurl;
          // wx.removeStorageSync('userInfo');
          // wx.setStorageSync('userInfo', userInfo);
        }
      ).catch(res => {
        wx.showModal({
          title: '登录失败',
          content: '没有访问权限，请联系管理员',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#1890FF'
        })
      });
    }
  },
  doLogin(e){
    var that = this;
    app.doMessage()
    var data = {
      loginCode:that.data.phoneNo,
      param_deviceType:'mobileApp',
      ajax: '_json',
    }
    wx.request({
      url: HOST_URI+ 'platform/v1/api/wxmini/miniLogin.json',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
          if (!res.data.result&&res.data.result!='false') {
            wx.showModal({
              title: '登录失败',
              content: '服务器错误，请联系管理员',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#1890FF'
            })
            return;
          }
          if (res.data.result == 'false') {
            if(res.data.data==404){
                wx.navigateTo({
                  url: 'regist?openid='+that.data.openid+'&phoneNo='+that.data.phoneNo
                })
            }else if(res.data.data==4){
              wx.navigateTo({
                url: '../index/success'
              })
            }
          }else if(res.data.result == 'true'){
            var userInfo = {};
            userInfo.companyName = res.data.companyName;
            userInfo.officeName = res.data.officeName;
            userInfo.username = res.data.username;
            userInfo.sid = res.data.sid;
            userInfo.loginCode = res.data.loginCode;
            userInfo.roleCodes = res.data.roleCodes;
            wx.removeStorageSync('userInfo');
            wx.setStorageSync('userInfo', userInfo);
            wx.navigateTo({
              url: '../index/mainList',
            })
          }
      }
    })
  },
  action:function(){
    var that = this;
    if(that.data.state==1){
      that.setData({
        state:2
      })
    } else if (that.data.state == 2) {
      that.setData({
        state: 3
      })
    } else if (that.data.state == 3) {
      that.setData({
        state: 2
      })
    }
  },
  doSelect:function(){
    Notify({
      message: '请先同意《智能客流用户协议及隐私保护政策》',
      type: 'warning'
    });
  },
  goAgreementPage:function(){
    wx.navigateTo({
      url: 'agreement',
    })
  }
})