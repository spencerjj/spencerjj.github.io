// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {store,storeId,HOST_URI} from '../../config.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    orderLists:[],
    show:false,
    nowNum:'',
    fileLists:[],
    imgLists:[],
    noteDetail:[],
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ifUser().then((data)=>{
      let noteDetail = app.globalData.noteDetail
      let imgLists = noteDetail.imgUrl
      let fileLists = noteDetail.fileUrl
      let wxWidth = (wx.getSystemInfoSync().windowWidth*0.9)+'px'
      console.log(wxWidth)
      let content = ''
      if(noteDetail.content){
        content = noteDetail.content
        .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<div>/ig, '<div style="font-size: 15px; line-height: 25px;color:#777;letter-spacing:1.5px">')
        content = content.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
    content = content.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
    content = content.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
        content = content.replace(/\<img/gi, '<img style="width:'+wxWidth+';height:auto;display:block;margin-top:10px"');
        content= content.replace(new RegExp(/src=\"/g), `src="`+HOST_URI)
      }
      console.log(noteDetail)
      that.setData({
        userInfo:data,
        fileLists,
        imgLists,
        noteDetail,
        content
      })
      // console.log(app.globalData.noteDetail)
      // that.getInfo()
    }).then()
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
    this.onLoad()
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
  getInfo(e){
    var that = this;
    var data = {
      phone: wx.getStorageSync('phoneNo'),
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberTxnInfo', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.status==0){
          that.setData({
            orderLists:res.memberTxnInfoList
          })
        }else{
          Toast({
            message: res.message,
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
  toPage(e){
    console.log(this.data.noteDetail.shopLink)
    wx.navigateToMiniProgram({ appId: 'wx63cb5457e4aed91b', path: this.data.noteDetail.shopLink, success(res) {  } })
  }
})