// pages/index/hobby.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId
} from '../../config.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pro:[
			{choose:false, name:"时装配饰",id:"0",},
			{choose:false, name:"时尚运动",id:"1"},
			{choose:false, name:"珠宝首饰",id:"2"},
			{choose:false, name:"设计师品牌",id:"3"},
			{choose:false, name:"彩妆护肤",id:"4"},
			{choose:false, name:"亲子类",id:"5"},
			{choose:false, name:"潮童萌娃",id:"6"},
			{choose:false, name:"美食餐饮",id:"7"},
			{choose:false, name:"咖啡甜品",id:"8"}
		],
		act:[
			{choose:false,name:"艺术活动",id:"0"},
			{choose:false,name:"运动健身",id:"1"},
			{choose:false,name:"购物",id:"2"},
			{choose:false,name:"手工艺制作",id:"3"},
			{choose:false,name:"美妆课堂",id:"4"},
			{choose:false,name:"插画艺术",id:"5"},
			{choose:false,name:"旅游摄影",id:"6"},
			{choose:false,name:"表演",id:"7"},
			{choose:false,name:"烹饪",id:"8"}
    ]
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
  select(e){
      let i = e.currentTarget.dataset.index
      let arr = this.data.pro
      arr[i].choose = !arr[i].choose
      this.setData({
        pro:arr
      })
  },
  select1(e){
      let i = e.currentTarget.dataset.index
      let arr = this.data.act
      arr[i].choose = !arr[i].choose
      this.setData({
        act:arr
      })
  },
  confirm(e){
    wx.redirectTo({
      url: 'my',
    })
    // var data = {
    //   store: store,
    //   ajax: '_json',
    // }
    // console.log(data)
    // getRequest(getApiHost(), 'customer/bh/api/crm/', 'body', data, 0, false, false).then(
    //   res => {
    //     console.log(res)
    //     if (res.code == "SEL_000") {
    //       doLogin(that.data.phoneNo).then((res) => {
    //         console.log('success register')
    //       })
    //     } else {
    //       wx.navigateTo({
    //         url: 'hobby',
    //       })
    //       Toast({
    //         message: res.msg,
    //         type: 'warning'
    //       });
    //     }
       
    //   }
    // ).catch(res => {
    //   wx.showModal({
    //     title: '系统错误，登录失败',
    //     showCancel: false,
    //     confirmText: '知道了',
    //     confirmColor: '#1890FF'
    //   })
    // });
  }
})