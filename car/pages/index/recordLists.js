import { resolve } from '../../libs/es6-promise.min.js';
// pages/index/recordLists.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:3,
    comment:'行李较多，早点过来',
    lists:[
      {
        date:'2020年11月21日 10:35',
        start:'蓝豹集团办公楼',
        end:'常州奔牛机场',
        driver:'王师傅',
        type:1
      },
      {
        date:'2020年11月21日 10:35',
        start:'普林仕集团办公楼',
        end:'常州北站',
        driver:'张师傅'
      },
      {
        date:'2020年11月21日 10:35',
        start:'新世纪门口',
        end:'百货大楼楼顶',
        driver:'李师傅'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`哈哈哈${this.data.num}哈哈哈`)
    var lists = this.data.lists
    var lists1 = {
      date:'2020年11月21日 10:35',
      start:'蓝豹集团办公楼',
      end:'常州奔牛机场',
      driver:'王师傅1',
      type:1
    }
    let x = [lists1,...lists]
    this.setData({
      lists:x
    })
     this.set().then(x=>{console.log(123+x)})
   
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
  toPage(e){
    wx.navigateTo({
      url: 'detail'
    })
  },
  async set(){
    let x =  new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve(18927381723)
      },1000)
    })
    x.then((res)=>{
      console.log(res)
    })
  }
})