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
    array4: [],
    index4: 0,
    officeCode: '',
    officeCode1:'',
    companyCode: '',
    roleCode: '',
    openid: '',
    phoneNo: '',
    checked:false,
    ifBra:false,
    ifFin:false,
    mark1:true,
    mark2:true,
    mark3:true,
    mark4:true,
    officeLists1:''
  },
  // 6010214
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
    wx.hideHomeButton()
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code //返回code
        var data = {
          code: code,
          ajax: '_json'
        }
        getRequest(getApiHost(), 'platform/v1/api/wxmini/code2session', 'body', data, 0, false, false, false).then(
          res => {
            that.setData({
              openid:res.data.openid,
              sessionKey:res.data.sessionKey
            })
            var data = {
              openid: res.data.openid,
              __ajax: 'json'
            }
            getRequest(getApiHost(), 'platform/v1/api/wxmini/checkOpenid', 'body', data, 0, false, false, false).then(
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
                  url: '../index/finList',
                })
              }else if(res.data.status==2){
                wx.redirectTo({
                  url: '../index/error',
                })
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
    getRequest(getApiHost(), 'platform/v1/api/wxmini/getCompanyList', 'body', data, 0, false, false, false).then(
      res => {
        if (res.result) {
          var lists = res.data
          var array1 = []
          lists.map((item) => {
            array1.push(item.companyName)
          })
          that.setData({
            companyLists: lists,
            array1: array1
            // companyCode: lists[0].companyCode
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
      // wx.showModal({
      //   title: '错误',
      //   content: '获取公司列表失败，请联系管理员',
      //   showCancel: false,
      //   confirmText: '知道了',
      //   confirmColor: '#1890FF'
      // })
    });
    getRequest(getApiHost(), 'platform/v1/api/wxmini/getRoleList', 'body', data, 0, false, false, false).then(
      res => {
        var lists = res.data
        var array2 = []
        lists.map((item) => {
          array2.push(item.roleName)
        })
        that.setData({
          roleLists: lists,
          array2: array2
          // roleCode: lists[0].roleCode
        })
        if(lists[0].roleName=='品牌'){
          that.setData({
            ifBra:true
          })
        }
      }
    ).catch(res => {
      // wx.showModal({
      //   title: '错误',
      //   content: '获取角色列表失败，请联系管理员',
      //   showCancel: false,
      //   confirmText: '知道了',
      //   confirmColor: '#1890FF'
      // })
    });
    var data3={
      officeType:3
    }
    getRequest(getApiHost(), 'platform/v1/api/wxmini/getOfficeList', 'body', data3, 0, false, false, false).then(
      res => {
        var lists = res.data
        var array3 = []
        lists.map((item) => {
          array3.push(item.officeName)
        })
        that.setData({
          officeLists: lists,
          array3: array3
          // officeCode: lists[0].officeCode
        })
      }
    ).catch(res => {
      // wx.showModal({
      //   title: '错误',
      //   content: '获取部门列表失败，请联系管理员',
      //   showCancel: false,
      //   confirmText: '知道了',
      //   confirmColor: '#1890FF'
      // })
    });
    var data4={
      officeType:1
    }
    getRequest(getApiHost(), 'platform/v1/api/wxmini/getOfficeList', 'body', data4, 0, false, false).then(
      res => {
        var lists = res.data
        var array4 = []
        lists.map((item) => {
          array4.push(item.officeName)
        })
        that.setData({
          officeLists: lists,
          array4: array4
          // officeCode: lists[0].officeCode
        })
      }
    ).catch(res => {
      // wx.showModal({
      //   title: '错误',
      //   content: '获取机构列表失败，请联系管理员',
      //   showCancel: false,
      //   confirmText: '知道了',
      //   confirmColor: '#1890FF'
      // })
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
    var that = this;
    this.setData({
      index1: e.detail.value,
      companyCode: this.data.companyLists[e.detail.value].companyCode,
      mark1:false
    })
    var data3={
      officeType:3,
      officeCode:this.data.companyLists[e.detail.value].companyCode
    }
    getRequest(getApiHost(), 'platform/v1/api/wxmini/getOfficeList', 'body', data3, 0, false, false).then(
      res => {
        var lists = res.data
        var array3 = []
        lists.map((item) => {
          array3.push(item.officeName)
        })
        that.setData({
          officeLists: lists,
          array3: array3,
          mark3:true,
          index3:0,
          array4: that.data.array4,
          mark4:true,
        })
      }
    )
  },
  officeChange(e) {
    var that = this
    this.setData({
      index3: e.detail.value,
      officeCode: this.data.officeLists[e.detail.value].officeCode,
      mark3:false
    })
    console.log(this.data.officeLists[e.detail.value].officeCode)
    var data4={
      officeType:1,
      officeCode:this.data.officeLists[e.detail.value].officeCode
    }
    getRequest(getApiHost(), 'platform/v1/api/wxmini/getOfficeList', 'body', data4, 0, false, false).then(
      res => {
        var lists = res.data
        var array4 = []
        lists.map((item) => {
          array4.push(item.officeName)
        })
        console.log(array4)
        that.setData({
          officeLists1: lists,
          array4: array4,
          mark4:true,
          index4:0,
        })
      })
  },
  braChange(e) {
    if(this.data.mark3){
      Notify({
        message: '请先选择部门',
        type: 'warning'
      });
      return;
    }
    this.setData({
      index4: e.detail.value,
      officeCode1: this.data.officeLists1[e.detail.value].officeCode,
      mark4:false
    })
  },
  roleChange(e) {
    this.setData({
      index2: e.detail.value,
      roleCode: this.data.roleLists[e.detail.value].roleCode,
      mark2:false
    })
    if(this.data.array2[e.detail.value]=='品牌'){
      this.setData({
        ifBra:true,
      })
    }else{
      this.setData({
        ifBra:false
      })
    }
    if(this.data.array2[e.detail.value]=='财务'){
      this.setData({
        ifFin:true
      })
    }else{
      this.setData({
        ifFin:false
      })
    }
    this.setData({
      mark3:true,
      index3:0
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
      getRequest(getApiHost(), 'platform/v1/api/wxmini/getPhoneNumber', 'body', data, 0, false, false).then(
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
  // 1、公司 2、角色 3、机构 4、品牌
    console.log(that.data.ifBra)
    if(that.data.ifBra){
      if(that.data.mark2){
        Notify({
          message: '请选择您的角色',
          type: 'warning'
        });
        return;
      }
      if(that.data.mark1){
        Notify({
          message: '请选择您的公司',
          type: 'warning'
        });
        return;
      }
      if(that.data.mark3&&!that.data.ifFin){
        Notify({
          message: '请选择您的部门',
          type: 'warning'
        });
        return;
      }
      if(that.data.mark4){
        Notify({
          message: '请选择您的品牌',
          type: 'warning'
        });
        return;
      }
    }
    if(!that.data.ifBra){
      if(that.data.mark2){
        Notify({
          message: '请选择您的角色',
          type: 'warning'
        });
        return;
      }
      if(that.data.mark1){
        Notify({
          message: '请选择您的公司',
          type: 'warning'
        });
        return;
      }
      if(that.data.mark3&&!that.data.ifFin){
        Notify({
          message: '请选择您的部门',
          type: 'warning'
        });
        return;
      }
    }
    if(that.data.ifFin){
      that.setData({
        officeCode:'6010214'
      })
    }
    if(that.data.ifBra){
      that.setData({
        officeCode:that.data.officeCode1
      })
    }
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
                  getRequest(getApiHost(), 'platform/v1/api/wxmini/registByMini', 'body', data, 0, false, true).then(
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
  }
})