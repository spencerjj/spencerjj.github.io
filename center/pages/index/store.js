// pages/index/store.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {store,storeId,HOST_URI} from '../../config.js'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      {},
    ],
    // option2: [
    //   { text: '全部排序', value: 0 },
    //   { text: '好评排序', value: 'shopLike desc' },
    //   { text: '销量排序', value: 'shopSale desc' },
    // ],
    value1: "购物中心1F",
    value2: 0,
    shopLists:[],
    shopName:'',
    shopFloor:'购物中心1F',
    orderBy:'',
    isMore: false,
    loading: false,
    listIsFull: false,
    pageNo:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // app.ifUser().then((data)=>{
    //   that.setData({
    //     userInfo:data
    //   })
      that.getInfo()
      that.getStore()
    // }).then()
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
    var that = this;
    console.log('到底了')
    if (that.data.isMore) {
      var pageNo = that.data.pageNo;
      pageNo++;
      that.setData({
        pageNo: pageNo
      })
      that.getStore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getInfo(e) {
    var that = this;
    var data = {
      storeId:storeId,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/floor/floorList', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result=='true') {
          let shopLists = res.data
          let array = []
          shopLists.map(item=>{
            let a = 
              {
                text:item.floor,
                value:item.floor
              }
            array.push(a)
          })
          console.log(that.data.option1)
          let option1 = that.data.option1
          option1.push(...array)
          that.setData({
            option1:option1
          })
        } else {
          Toast({
            message: res.message||'获取失败',
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg,
        type: 'warning'
      });
    });
  },
  getStore(e) {
    var that = this;
    console.log(that.data.shopFloor)

    var data = {
      storeId:storeId,
      pageNo:that.data.pageNo,
      pageSize:that.data.pageSize,
      shopName:that.data.shopName,
      shopFloor:that.data.shopFloor,
      orderBy:that.data.orderBy,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/floor/floorGuideList', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        if (res.result=='true') {
          let lists = res.data.list
          if(res.data.list.length==0){
            that.setData({
              loading:false,
              listIsFull:false,
              loadAll:false
            })
            return;
        }
          lists.map(item=>{
            item.shopPic = HOST_URI+'customer'+item.shopPic
            item.shopBg = HOST_URI+'customer'+item.shopBg
            item.shopEwm = HOST_URI+'customer'+item.shopEwm
          })
          if (that.data.pageNo > 1) {
            console.log('第' + that.data.pageNo + '页')
            var list = that.data.shopLists
            list = list.concat(res.data.list)
            that.setData({
              shopLists: list,
              loadAll: false
            })
            console.log(that.data.lists)
          } else {
            that.setData({
              shopLists: res.data.list,
              loadAll: false
            })
          }
          if (res.data.count > that.data.pageSize) {
            that.setData({
              loading: true,
              listIsFull: false
            })
            if (Math.ceil(res.data.count / that.data.pageSize) > that.data.pageNo) {
              that.setData({
                isMore: true
              })
            } else {
              that.setData({
                isMore: false,
                loading: false,
                listIsFull: true
              })
            }
          } else {
            that.setData({
              isMore: false,
              loading: false,
              listIsFull: true
            })
          }
        } else {
          Toast({
            message: res.message||'获取失败',
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.message,
        type: 'warning'
      });
    });
  },
  floorChange(e){
    console.log(e.detail)
    this.setData({
      shopFloor:e.detail||'',
      shopLists:[],
      pageNo:1
    })
    this.getStore()
  },
  orderChange(e){
    console.log(e.detail)
    this.setData({
      orderBy:e.detail||'',
      shopLists:[],
      pageNo:1
    })
    this.getStore()
  },
  nameChange(e){
    this.setData({
      shopLists:[],
      pageNo:1
    })
    this.getStore()
  },
  nameInput(e){
    console.log(e.detail.value)
    this.setData({
      shopName:e.detail.value||''
    })
  },
  toPage(e){
    let index = e.currentTarget.dataset.index
    app.globalData.storeDetail = this.data.shopLists[index]
    wx.navigateTo({
      url: 'storeDetail'
    })
  }
})