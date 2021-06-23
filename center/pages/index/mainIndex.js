// pages/index/card.js
import {
  getApiHost,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  store,
  storeId,
  HOST_URI
} from '../../config.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    cards:[],
    show:false,
    nowNum:'',
    title:[
      {
       id:1,
       title:'商场活动',
       etitle:"WHAT'S NEW",
       active:true
      },
      {
       id:2,
       title:'积分兑换',
       etitle:"POINTS",
       active:false
      },
      {
       id:3,
       title:'活动报名',
       etitle:"SIGN UP",
       active:false
      },
      {
       id:4,
       title:'种草笔记',
       etitle:"NOTES",
       active:false
      }
    ],
    guideFix:false,
    show:false,
    titleIndex:1,
    actLists:[],
    repLists:[],
    title1:'',
    fileUrl:'',
    remarks:'',
    noteLists:[],
    pointLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    app.ifUser().then((data)=>{
      var title = that.data.title
      var index = options.index||that.data.titleIndex
      title.map(item => {
        item.active = false
      })
      title[index - 1].active = true
      that.setData({
        userInfo:data,
        titleIndex:index,
        title
      })
      that.getInfo()
      that.getRep()
      that.getNote()
      that.getPoint()
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
    getRequest(getApiHost(), 'customer/bh/api/active/getShoppingActiveTypeList', 'body', data, 0, false, false,).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.result=='true') {
          let actLists = res.data
          actLists.map(item=>{
            item.fileUrl=HOST_URI+'customer'+item.fileUrl
            item.bannerUrl = HOST_URI+'customer'+item.bannerUrl
          })
          that.setData({
            actLists:res.data
          })
        } else {
          Toast({
            message: '活动获取失败',
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
  getPoint(e) {
    var that = this;
    var data = {
      store:store,
      vType:'',
      ajax:'_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/crm/queryVoucherDefinition', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.code=="SEL_000") {
          that.setData({
            pointLists:res.vdefinemessage
          })
        } else {
          that.setData({
            pointLists:[]
          })
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg,
        type: 'warning'
      });
    });
  },
  getRep(e) {
    var that = this;
    var data = {
      storeId:storeId,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getEventRegistrationList', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.result=='true') {
          var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
          let actLists = res.data
          actLists.map(item=>{
            item.fileUrl=HOST_URI+'customer/'+item.fileUrl
            if(item.whyEventTimeList.length>0){
            item.compare = new Date().getTime()>new Date(item.whyEventTimeList[0].startTime.replace(/-/g,'/')).getTime()?'进行中':'即将开始'
              if(item.whyEventTimeList[0].startTime==item.whyEventTimeList[item.whyEventTimeList.length-1].endTime){
                var myDate = new Date(Date.parse(item.whyEventTimeList[0].startTime.slice(0,10)));  
                item.whyEventTimeList[0].actTime = item.whyEventTimeList[0].startTime.slice(0,10).replace(/-/g,'/')+' '+weekDay[myDate.getDay()]+' '+item.whyEventTimeList[0].startTime.slice(-5)
              }else{
                item.whyEventTimeList[0].actTime = item.whyEventTimeList[0].startTime.slice(0,10).replace(/-/g,'/')+' ~ '+item.whyEventTimeList[item.whyEventTimeList.length-1].endTime.slice(5,10).replace(/-/g,'/')
              }
            }
          })
          that.setData({
            repLists:res.data
          })
        } else {
          Toast({
            message: '活动获取失败',
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
  getNote(e) {
    var that = this;
    var data = {
      storeId:storeId,
      mobile:that.data.userInfo.phone,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getNotesList', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.result=='true') {
          let noteLists = res.data
          noteLists.map(item=>{
            if(item.fileUrl.split(',').length>1){
              item.fileUrl = item.fileUrl.split(',')
              for(let x in item.fileUrl){
                item.fileUrl[x] =  HOST_URI+'customer'+item.fileUrl[x]
              }
            }else{
              let array = []
              array.push(HOST_URI+'customer/'+item.fileUrl)
              item.fileUrl = array
            }

            if(item.imgUrl.split(',').length>1){
              item.imgUrl = item.imgUrl.split(',')
              for(let x in item.imgUrl){
                item.imgUrl[x] =  HOST_URI+'customer'+item.imgUrl[x]
              }
            }else{
              let array = []
              array.push(HOST_URI+'customer/'+item.imgUrl)
              item.imgUrl = array
            }
          })
          that.setData({
            noteLists:res.data
          })
        } else {
          Toast({
            message: '活动获取失败',
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
  onChange(e){
    this.setData({
      current:e.detail.index
    })
  },
  onClose() {
    this.setData({
      show1: false
    })
    setTimeout(()=>{
      this.setData({
        show:false
      })
    },300)
  },
  recommend(e){
    wx.navigateTo({
      url: 'recommend?no='+e.currentTarget.dataset.no,
    })
  },
  select(e){
    let title = this.data.title
    if(!title[e.currentTarget.dataset.id-1].active)
      title.map(item=>{
        item.active = false
      })
      title[e.currentTarget.dataset.id-1].active = true
    this.setData({
      title,
      titleIndex:e.currentTarget.dataset.id
    })
  },
  toPage(e){
      console.log(e.currentTarget.dataset.id)
  },
  showDetail(e){
    let that = this;
    that.setData({
      title1:e.detail.title,
      fileUrl:e.detail.fileUrl,
      remarks:e.detail.remarks
    })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        show: true
      })
      setTimeout(()=>{
        this.setData({
          show1:true,
        })
      },50)
    }, 300)
  },
  like(e){
    var that = this;
    let lists = this.data.noteLists
    lists[e.detail.index].likesCountSelf = 1
    lists[e.detail.index].likesCount++
    this.setData({
      noteLists:lists
    })
    var data = {
      storeId:storeId,
      noteId:e.detail,
      mobile:that.data.userInfo.phone,
      nickName:that.data.userInfo.name,
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/saveNoteGiveLike', 'body', data, 0, false, false, false).then(
      res => {
        console.log(res)
        if (res.result=='true') {
        } else {
          Toast({
            message: '活动获取失败',
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
  }
})