// pages/index/card.js
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
    active:0,
    familyInfo:[],
    show:false,
    nowNum:'',
    index:0,
    index1:0,
    index2:0,
    array:['妻子','丈夫','儿子','女儿','父亲','母亲','司机','其他'],
    array1:['是','否'],
    name:'',
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if(phoneNo.length>1){
      that.setData({
        phone:options.famphone
      })
      that.getInfo()
    }else{
      Toast({
        message: '登录失效，请重新授权登录',
        type: 'warning'
      });
      setTimeout(()=>{
        wx.redirectTo({
          url: 'index'
        })
      },1000)
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
  getInfo(e){
    var that = this;
    var data = {
      memPhone: wx.getStorageSync('phoneNo'),
      famPhone:that.data.phone,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPH5QueryFamMemInfo', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.status==0){
          let re = res.relationship
          let array = that.data.array
          let i = 0
          for(let x in array){
            if(array[x]==re){
              i=x
            }
          }
          that.setData({
            familyInfo:res,
            name:res.name,
            index:i,
            index1:res.isCredits=='Y'?0:1,
            index2:res.isCoupons=='Y'?0:1
          })
        }else{
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
        
      }
    ).catch(res => {
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  nameInput(e){
    this.setData({
      name:e.detail.value
    })
  },
  phoneInput(e){
    this.setData({
      phone:e.detail.value
    })
  },
  relationChange(e){
    this.setData({
      index:e.detail.value
    })
  },
  pointChange(e){
    this.setData({
      index1:e.detail.value
    })
  },
  cardChange(e){
    this.setData({
      index2:e.detail.value
    })
  },
  onChange(e){
    this.setData({
      active:e.detail.index
    })
  },
  add(e){
    var that = this;
    if(that.data.name.length<1){
      Toast({
        message: '请正确填写姓名',
        type: 'warning'
      });
      return
    }
    if(that.data.phone.length!=11){
      Toast({
        message: '请正确填写手机号',
        type: 'warning'
      });
      return
    }
    Dialog.confirm({
      title: '提示',
      message: `确认修改该成员信息吗`,
    })
    .then(() => {
      var data = {
        memPhone:wx.getStorageSync('phoneNo'),
        name:that.data.name,
        famPhone:that.data.phone,
        relationship:that.data.array[that.data.index],
        isCredits:that.data.index1==0?'Y':'N',
        isCoupons:that.data.index2==0?'Y':'N',
        ajax: '_json'
      }
      console.log(data)
      getRequest(getApiHost(), 'platform/v1/api/lampocrm/AddFamilyMember', 'body', data, 0, false, false).then(
        res => {
          console.log(res)
          if(res.status==0){
            Toast({
              message: '修改成功',
              type: 'success'
            });
          }else{
            Toast({
              message: res.msg,
              type: 'warning'
            });
          }
        }
      ).catch(res => {
        Toast({
          message: '系统错误，请联系管理员',
          type: 'warning'
        });
      });
    })
  }
})