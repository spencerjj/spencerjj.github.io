import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId,
  HOST_URI
} from '../../config.js'
import {
  doLogin
} from '../../utils/login.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: "",
    birthday: '',
    name: '',
    email: '',
    phone: '',
    sex: '先生',
    region: [],
    regionCode: [],
    id: '',
    address: '',
    hasBir: false,
    hasCard: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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
  nameInput(e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value,
    })
  },
  phoneInput(e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value,
    })
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      birthday: e.detail.value,
    })
  },
  addressInput(e) {
    console.log(e.detail.value)
    this.setData({
      address: e.detail.value,
    })
  },
  sexChange(e) {
    this.setData({
      sex: e.currentTarget.dataset.sex
    })
  },
  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value,
      regionCode: e.detail.code
    })
  },

  emailInput(e) {
    this.setData({
      email: e.detail.value,
      echange: true
    })
  },
  save(e) {
    var data = {}
    var that = this
    let ifCard = false
    let ifBir = false
    data.ajax = '_json'
    if (that.data.name.length > 0) {
      data.name = that.data.name
    } else {
      Toast({
        message: '请填写姓名',
        type: 'warning'
      });
      return;
    }
    if (that.data.phone.length == 11) {
      data.phone = that.data.phone
    } else {
      Toast({
        message: '请正确填写手机号',
        type: 'warning'
      });
      return;
    }
    if (!that.data.hasBir) {
      if (that.data.birthday.length > 0) {
        data.birthDate = that.data.birthday
        ifBir = true
      } else {
        Toast({
          message: '请填写生日',
          type: 'warning'
        });
        return;
      }
    }

    data.province = that.data.region[0]||''
    data.city = that.data.region[1]||''
    data.area = that.data.region[2]||''
    data.address = that.data.address||''
    data.channel = '微会员'
    data.sex = wx.getStorageSync('weInfo').gender ? '先生' : '女士'
    data.store = store
    data.openid = wx.getStorageSync('user').openid || '88888'
    data.ajax = '_json'
    console.log(data)
    getRequest(getApiHost(), 'customer/bh/api/crm/LPMemberRegister', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        if (res.code == "SEL_000") {
          doLogin(that.data.phoneNo).then((res) => {
            console.log('success register')
          })
        } else {
          wx.navigateTo({
            url: 'hobby',
          })
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
       
      }
    ).catch(res => {
      wx.showModal({
        title: '系统错误，登录失败',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });
  }
})