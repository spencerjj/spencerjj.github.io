var app = getApp();
const { $Message } = require('../../component/iview/base/index')
const { $Toast } = require('../../component/iview/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    array: ['美国', '中国', '巴西', '日本'],
    visible1: false,
    actions1: [
      {
        name: '选项1',
      },
      {
        name: '选项2'
      },
      {
        name: '去分享',
        icon: 'share',
        openType: 'share'
      },
    ],
    starIndex2:3,
    verticalCurrent:2
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
    // $Message({
    //   content: '获取预警记录失败',
    //   type: 'error'
    // });

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
    return {
      title: 'iView Weapp',
      imageUrl: 'https://file.iviewui.com/iview-weapp-logo.png'
    };
  },
  handleOpen1() {
    this.setData({
      visible1: true
    });
  },
  handleCancel1() {
    this.setData({
      visible1: false
    });
  },
  toPage(){
    wx.navigateTo({
      url: '/pages/my/360/estimate?id=1265491217622814720'
    })
  },
  handleClickItem1({ detail }) {
    const index = detail.index + 1;

    $Message({
      content: '点击了选项' + index
    });
  },
  dosth:function(event){
    console.log(event.currentTarget.dataset.id)
  },
  handleChange({detail}) {
    this.setData({
      current: detail.key
    });
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  onChange2(e){
    const index = e.detail.index;
    this.setData({
        'starIndex2' : index
    })
},
})