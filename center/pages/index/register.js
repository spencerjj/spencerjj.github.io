// pages/index/register.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index1: 0,
    array1: ['先生', '女士'],
    name: '',
    birthday: '',
    phoneNo: '',
    user: '',
    familyList:[],
    show:false,
    rePhone:'',
    cardNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.doLogin().then(data => {
      // var userInfo = wx.getStorageSync('userInfo')
      this.setData({
        index1: 0,
        name: '',
        user: data
      })
    })
    if(options.scene){
      let scene=decodeURIComponent(options.scene);
      console.log(scene)
      let rePhone=scene.split("/")[0];
      let cardNo=scene.split('/')[1]||'';
      console.log(rePhone+','+cardNo)
      this.setData({
        rePhone,
        cardNo
      })
     }
     if(options.cardNo){
       console.log(options.cardNo)
      this.setData({
        cardNo:options.cardNo
      })
     }
     if(options.rePhone){
      console.log(options.rePhone)
      this.setData({
        rePhone:options.rePhone
      })
     }
  },
  login(e) {
    // app.doLogin().then(data => {
    //   this.onLoad()
    // })
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

  onShareAppMessage: function(res) {

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
  dateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  getPhoneNumber(e) {
    var that = this
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      Toast({
        message: '授权失败，请重新授权登录',
        type: 'warning'
      });
    } else {
    var data = {
      openid: that.data.user.openid,
      sessionKey: that.data.user.sessionKey,
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/getPhoneNumber', 'body', data, 0, false, false, false).then(
      res => {
        console.log(res.data)
        that.setData({
          phoneNo: res.data
        })
        wx.setStorageSync('loginphone', res.data)
      }
    ).catch(res => {
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  }
  },
  sexChange(e){
    this.setData({
      index1:e.detail.value
    })
  },
  nameInput(e){
    this.setData({
      name:e.detail.value
    })
  },
  onClose(e){
    this.setData({
      show:false
    })
  },
  checkFamily() {
    var that = this
    if (that.data.name.length < 1) {
      Toast({
        message: '请填写姓名',
        type: 'warning'
      });
      return;
    } else if (that.data.birthday.length < 1) {
      Toast({
        message: '请填写生日',
        type: 'warning'
      });
      return;
    } else if (that.data.phoneNo.length < 1) {
      Toast({
        message: '请获取手机号',
        type: 'warning'
      });
      return;
    }
    var data={
      phone:that.data.phoneNo
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/H5QueryFamilyBinder', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        if (res.status == 0) {
          var familyList = res.familyBinderEntryList
          that.setData({
            familyList,
            show:true
          })
        }else{
          that.save()
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg.length>10?'系统错误，登录失败':res.msg,
        type: 'warning'
      });
    });
  },
  familyBind(e){
    var that = this
    var id = e.currentTarget.dataset.id
    var data={
      phone:that.data.phoneNo,
      mainPhone:that.data.familyList[0].phone,
      type:id==1?'已绑定':'已拒绝',
      openid:that.data.user.openid
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/BindConfirm', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        if (res.status == 0) {
          that.setData({
            show:false
          })
          that.save()
        }else{
          that.setData({
            show:false
          })
          Dialog.confirm({
            title: '提示',
            message: `${res.msg}，是否直接注册？`,
          })
          .then(() => {
            that.save()
          })
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg.length>10?'系统错误，绑定失败':res.msg,
        type: 'warning'
      });
    });
  },
  save(e) {
    var that = this
    var data = {
      phone: that.data.phoneNo,
      gender: that.data.index1 == 0 ? '先生' : '女士',
      name: that.data.name,
      birthday: that.data.birthday,
      openid: wx.getStorageSync('user').openid || '99999',
      ajax: '_json'
    }
    if(that.data.rePhone){
      data.referPhone = that.data.rePhone
    }
    if(that.data.cardNo){
      data.parameter1 = that.data.cardNo
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPMemberRegister', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        if(res.status==0){
          Toast({
            message: '注册成功',
            type: 'success'
          });
          wx.setStorageSync('loginphone', that.data.phoneNo)
          setTimeout(() => {
            wx.redirectTo({
              url: 'index',
            })
          }, 1000);
        }else{
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg.length>10?'系统错误，注册失败':res.msg,
        type: 'warning'
      });
    });
  }
})