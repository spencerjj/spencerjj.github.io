// pages/my/account/addAccount.js 
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    temp: '',
    username: '',
    mark: false,
    count: 0,
    array1: [],
    index1: 0,
    array2: [],
    index2: 0,
    array3: [],
    index3: 0,
    officeCode: '',
    companyCode: '',
    roleCode: '',
    openid: '',
    phoneNo: '',
    checked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
        wx.login({
          success: function (res) {
            var code = res.code //返回code
            var data = {
              code: code,
              ajax: '_json'
            }
            getRequest(getApiHost(), 'platform/v1/api/wxmini/code2session.json', 'body', data, 0, false, true).then(
              res => {
                that.setData({
                  openid:res.data.openid,
                  sessionKey:res.data.sessionKey
                })
                var data = {
                  openid: res.data.openid,
                  __ajax: 'json'
                }
                getRequest(getApiHost(), 'platform/v1/api/wxmini/checkOpenid', 'body', data, 0, false, true).then(
                  res => {
                    console.log(res.data.status)

                  }
                ).catch(res => {
                  console.log(res)
                  if(res.data.status==4){
                    wx.redirectTo({
                      url: '../index/success',
                    })
                  }else if(res.data.status==0){
                    wx.redirectTo({
                      url: '../index/mainList',
                    })
                  }else if(res.data.status==2){
                    url:'../index/error'
                  }
                  // wx.showModal({
                  //   title: '登录失败',
                  //   content: '没有访问权限，请联系管理员',
                  //   showCancel: false,
                  //   confirmText: '知道了',
                  //   confirmColor: '#1890FF'
                  // })
                });
              }
            ).catch(res => {
              console.log(res)
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
    that.getLists()
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
    wx.hideHomeButton()
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
  getLists(e) {
    var that = this
    var data = {}
    postRequest(getApiHost(), 'platform/v1/api/wxmini/getCompanyList.json', 'body', data, 0, false, true).then(
      res => {
        if (res.result) {
          var lists = res.data
          var array1 = []
          lists.map((item) => {
            array1.push(item.companyName)
          })
          that.setData({
            companyLists: lists,
            array1: array1,
            companyCode: lists[0].companyCode
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#1890FF'
          })
        }
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: '获取公司列表失败，请联系管理员',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
    postRequest(getApiHost(), 'platform/v1/api/wxmini/getRoleList.json', 'body', data, 0, false, true).then(
      res => {
        var lists = res.data
        var array2 = []
        lists.map((item) => {
          array2.push(item.roleName)
        })
        that.setData({
          roleLists: lists,
          array2: array2,
          roleCode: lists[0].roleCode
        })
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: '获取角色列表失败，请联系管理员',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
    postRequest(getApiHost(), 'platform/v1/api/wxmini/getOfficeList.json', 'body', data, 0, false, false).then(
      res => {
        var lists = res.data
        var array3 = []
        lists.map((item) => {
          array3.push(item.officeName)
        })
        that.setData({
          officeLists: lists,
          array3: array3,
          officeCode: lists[0].officeCode
        })
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: '获取机构列表失败，请联系管理员',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  },
  usernameInput(e) {
    var that = this
    if (e.detail.value.length == 0) {
      that.setData({
        mark: false
      })
    } else {
      that.setData({
        mark: true
      })
    }
    that.setData({
      username: e.detail.value,
    })
  },
  companyChange(e) {
    this.setData({
      index1: e.detail.value,
      companyCode: this.data.companyLists[e.detail.value].companyCode
    })
  },
  officeChange(e) {
    this.setData({
      index3: e.detail.value,
      officeCode: this.data.officeLists[e.detail.value].officeCode
    })
  },
  roleChange(e) {
    this.setData({
      index2: e.detail.value,
      roleCode: this.data.roleLists[e.detail.value].roleCode
    })
  },
  domessage(e){
    console.log(123)
    app.doMessage()
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
      getRequest(getApiHost(), 'platform/v1/api/wxmini/getPhoneNumber.json', 'body', data, 0, false, false).then(
        res => {
          console.log(res.data)
          that.setData({
            phoneNo:res.data
          })
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
          content: res.message,
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#1890FF'
        })
      });
    }
  },
  save: function () {
    var that = this;
    if(that.data.phoneNo.length==0){
      Notify({
        message: '请先获取手机号码再登录',
        type: 'warning'
      });
      return;
    }
    if (that.data.mark&&that.data.phoneNo.length>1) {
      wx.requestSubscribeMessage({
        tmplIds: ['-RCILlm7nALXM6jxiYNiZuTbf6D5LBCwYPB-K6qDNn4'],
        success(res) {
          console.log(res)
          var datavalue = [];
          for (var key in res) {
            datavalue.push(res[key]);
            console.log(datavalue);
          }
          console.log(datavalue.indexOf('accept') )
          if (datavalue.indexOf('accept') != -1) {
            wx.showModal({
              title: '提示',
              content: '确认提交注册吗',
              success(res) {
                if (res.confirm) {
                  var data = {
                    username: that.data.username,
                    companyCode: that.data.companyCode,
                    officeCode: that.data.officeCode,
                    roleCode: that.data.roleCode,
                    __ajax: 'json',
                    openid: that.data.openid,
                    phoneNo: that.data.phoneNo
                  }
                  console.log(data)
                  getRequest(getApiHost(), 'platform/v1/api/wxmini/registByMini.json', 'body', data, 0, false, true).then(
                    res => {
                      console.log(res)
                      if (res.result == 'true') {
                        // wx.showModal({
                        //   title: '注册成功',
                        //   content: '请重新登录',
                        //   showCancel: false,
                        //   confirmText: '知道了',
                        //   confirmColor: '#1890FF'
                        // })
                        wx.navigateTo({
                          url: '../index/success',
                        })
                      }
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
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            wx.showModal({
              title: '获取订阅权限失败',
              content: '订阅后方可注册',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#1890FF'
            })
          }
        },
        fail(res) {
          wx.showModal({
            title: '获取订阅权限失败',
            content: res.errMsg,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#1890FF'
          })
        }
      })

    }
  },
  toPage(e) {
    wx.navigateTo({
      url: 'myTag',
    })
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
})