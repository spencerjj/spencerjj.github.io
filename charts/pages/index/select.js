import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import areaList from '../../utils/area.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    role: '',
    storeList: [
      {
        storeName:'购物中心',
        camNum:'1821',
        month:'3334',
        year:'11143'
      },
      {
        storeName:'新世纪',
        camNum:'1101',
        month:'34',
        year:'143'
      },
      {
        storeName:'百货大楼',
        camNum:'675',
        month:'34',
        year:'143'
      },
      {
        storeName:'蓝豹',
        camNum:'321',
        month:'34',
        year:'143'
      }
    ],
    storeShow:false,
    goodsShow:false,
    typeShow:false,
    steps: [
      {
        text: '物流1',
        desc: '2019-1-1 12:40',
      },
      {
        text: '物流2',
        desc: '2019-1-1 12:40',
      },
      {
        text: '物流3',
        desc: '2019-1-1 12:40',
      },
      {
        text: '物流4',
        desc: '2019-1-1 12:40',
      },
    ],
    show:false,
    areaList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      storeShow:true,
      areaList:areaList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // setTimeout(()=>{
    //   this.setData({
    //     show:true
    //   })
    // },1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onStoreSelected(e){
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    if(index==3){
      wx.switchTab({
        url: 'index',
      })
    }else if(index==0){
      wx.redirectTo({
        url: 'depart?mark=gou',
      })
    }else if(index==1){
      wx.redirectTo({
        url: 'depart?mark=xin',
      })
    }else if(index==2){
      wx.redirectTo({
        url: 'depart?mark=bai',
      })
    }
   
  },

   onTypeSelected(e){
 

   },
   back(e){
     let index = e.currentTarget.dataset.index
     console.log(index)
       index==3?this.setData({
                  storeShow:true,
                  typeShow:false
                })
                :
                this.setData({
                  goodsShow:true,
                  typeShow:false
                })

   },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
})