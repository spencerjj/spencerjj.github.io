// pages/index/index.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var QRCode = require('../../utils/code.js')
var oricode = require('../../utils/qrcode.js')
import {barcode} from '../../utils/index.js'
import dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  data: {
    show: false,
    leftShow:false,
    imgLists: ['/images/cut/b1.png','/images/cut/b2.png','/images/cut/b3.png'],
    hasPhone: false,
    phoneNo: '',
    userInfo:'',
    animationMain:null,//正面
    animationBack:null,//背面
    imagePath:'',
    padtop:'',
    sshow:true
  },
  onReady(e){
    this.setData({
      padtop:wx.getMenuButtonBoundingClientRect().top,
      height:wx.getMenuButtonBoundingClientRect().height+10
    })
  },
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('loginphone') || ''
    var userInfo = wx.getStorageSync('userInfo') || ''
    console.log(userInfo)
    if(!userInfo){
      this.login()
    }else{
      console.log(phoneNo)
      that.setData({
        phoneNo
      })
      if(phoneNo.length>1){
        that.getInfo()
      }
    }
  },
  onShow() {

  },
  onPullDownRefresh(){
    this.onLoad()
  },
  login(e){
    app.doLogin().then(data => {
      this.onLoad()
    })
  },
  getPhone(e) {
    console.log(e)
    var that = this;
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      Toast({
        message: '授权失败，请重新授权登录',
        type: 'warning'
      });
    } else {
      app.doLogin().then(myData => {
        console.log(myData)
        var data = {
          openid: myData.openid,
          sessionKey: myData.sessionKey,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          ajax: '_json',
        }
        getRequest(getApiHost(), 'platform/v1/api/lampocrm/getPhoneNumber', 'body', data, 0, false, false,false).then(
          res => {
            that.setData({
              phoneNo: res.data
            })
            wx.setStorageSync('loginphone', res.data)
            that.getInfo()
          }
        ).catch(res => {
          Toast({
            message: '系统错误，登录失败',
            type: 'warning'
          });
        });
      })

    }
  },
  // register() {
  //   var that = this;
  //     var data = {
  //       phone: wx.getStorageSync('phoneNo'),
  //       gender: wx.getStorageSync('userInfo').gender,
  //       name: wx.getStorageSync('userInfo').nickName,
  //       openid: wx.getStorageSync('user').openid||'99999',
  //       ajax: '_json'
  //     }
  //     getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPMemberRegister', 'body', data, 0, false, false).then(
  //       res => {
  //         console.log(res)
  //           that.getInfo()
  //       }
  //     ).catch(res => {
  //       wx.showModal({
  //         title: '系统错误，登录失败',
  //         showCancel: false,
  //         confirmText: '知道了',
  //         confirmColor: '#1890FF'
  //       })
  //     });
  // },
  getInfo(e){
    var that = this;
    var data = {
      phone: that.data.phoneNo,
      ajax: '_json'
    }
    console.log(data)
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberAllInfo', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        if(res.status==2){
          Dialog.confirm({
            title: '提示',
            message: `您尚未注册账号，立即注册吧`,
          })
          .then(() => {
            wx.navigateTo({
              url: 'register',
            })
          })
          return;
        }else if(res.status==1||res.status==3){
          Toast({
            message: res.msg,
            type: 'warning'
          });
          return;
        }
        wx.stopPullDownRefresh()
        res.avatarUrl = wx.getStorageSync('userInfo').avatarUrl
        that.setData({
          userInfo:res,
          sshow:false
        })
        wx.setStorageSync('phoneNo', res.phone)
        // var code = new QRCode('canvas1', res.memberBarCode,100,100);
        that.createQrCode(res.memberBarCode,'canvas1',150,150)
      }
    ).catch(res => {
      console.log(res)
      Toast({
        message: '系统错误，登录失败',
        type: 'warning'
      });
    });
  },
  createQrCode: function (content, canvasId, cavW, cavH) {
    QRCode.api.draw(content, canvasId, cavW, cavH, this, this.canvasToTempImage);
  },
  
  //获取临时缓存图片路径，存入data中
  canvasToTempImage: function (canvasId) {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId:'canvas1',
      success: function (res) {
        let tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath:tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  onClose() {
    this.setData({
      show: false
    })
    wx.setNavigationBarTitle({
      title: '会员中心'
    })
  },
  use() {
    var that = this;
    wx.setNavigationBarTitle({
      title: '会员码'
    })
    new oricode('canvas', that.data.userInfo.memberBarCode,250,250);
    barcode('barcode', that.data.userInfo.memberBarCode, 700, 180);
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        show: true
      })
    }, 300)
  },
  toPage(e){
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    if(id=='center'||id=="card"||id=="order"||id=="infos"||id=="mission"||id=="recommend"||id=="issus"||id=="point"||id=="exchange"){
      wx.navigateTo({
        url: id,
      })
    }else if(id=='wei'){
      wx.navigateToMiniProgram({ appId: 'wx342c05b4e39eda3b', path: '', success(res) {  } })
    }
  },
  showNav(e){
    this.setData({
      leftShow:!this.data.leftShow
    })
  },
  leftClose(e){
    this.setData({
      leftShow:false
    })
  },
  change(e){
    var that = this
    Dialog.confirm({
      title: '提示',
      message: `是否注销当前账号`,
    })
    .then(() => {
      wx.clearStorageSync()
      this.setData({
        phoneNo: '',
        userInfo:'',
        imagePath:'',
        sshow:true
      })
      that.onLoad()
    })
  }
})