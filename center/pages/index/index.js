// pages/index/index.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {
  store,
  storeId,
  HOST_URI
} from '../../config.js'
var app = getApp();
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var oricode = require('../../utils/qrcode.js')
import {doLogin} from '../../utils/login.js'

Page({
  data: {
    title: [{
        id: 1,
        title: '商场活动',
        etitle: "WHAT'S NEW",
        active: true
      },
      {
        id: 2,
        title: '积分兑换',
        etitle: "POINTS",
        active: false
      },
      {
        id: 3,
        title: '活动报名',
        etitle: "SIGN UP",
        active: false
      },
      {
        id: 4,
        title: '种草笔记',
        etitle: "NOTES",
        active: false
      }
    ],
    guideFix: false,
    show: false,
    titleIndex: 1,
    userInfo: '',
    avatarUrl:'',
    actLists:[],
    repLists:[],
    noteLists:[],
    pointLists:[],
    banner:[],
    pro:0
  },
  onReady(e) {

  },
  onLoad: function (options) {
    this.getInfo()
    this.getRep()
    this.getBanner()
    this.getPoint()
  },
  onShow() {
    var that = this;
    var user = wx.getStorageSync('user')
    var userInfo = wx.getStorageSync('userInfo')
    var cardNum = wx.getStorageSync('cardNum')||0
    that.setData({
      cardNum:userInfo?cardNum:'',
      userInfo:userInfo||''
    })
    this.getNote()
    if (!user) {
      that.login()
    } 
  },

  onPullDownRefresh() {
    var that = this
    doLogin(wx.getStorageSync('userInfo').phone).then(data=>{
      that.setData({
        userInfo:wx.getStorageSync('userInfo')
      })
    })
    that.onLoad()
  },
  login(e) {
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  getBanner(e){
    var that = this;
    var data = {
      storeId:storeId,
      ajax:'_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getBannerList', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.result=='true') {
          let array = []
          res.data.map(item=>{
            let lists = res.data[0].fileUrl
            lists = lists.split(',')
            lists.map(son=>{
              array.push({
                url : HOST_URI+'customer'+son,
                link:item.link,
                linkType:item.linkType
              })
            })
          })
          console.log(array)
          that.setData({
            banner:array
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
        message: res.msg||'海报获取失败',
        type: 'warning'
      });
    });
  },
  getInfo(e) {
    var that = this;
    var data = {
      storeId:storeId,
      ajax:'_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getShoppingActiveTypeList', 'body', data, 0, false, false, true).then(
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
            message: res.message,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg||'商场活动获取失败',
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
          let pointLists = res.vdefinemessage
          pointLists.forEach(item=>{
            if(item.parameter2){
              item.parameter2 = HOST_URI+'customer/'+item.parameter2
            }
          })
          pointLists = pointLists.slice(0,6)
          that.setData({
            pointLists
          })
        } else {
          that.setData({
            pointLists:[]
          })
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg||'积分兑换获取失败',
        type: 'warning'
      });
    });
  },
  getRep(e) {
    var that = this;
    var data = {
      storeId:storeId,
      ajax:'_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getEventRegistrationList', 'body', data, 0, false, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.result=='true') {
          var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
          let actLists = res.data
          actLists.map(item=>{
            item.fileUrl=HOST_URI+'customer/'+item.fileUrl
            if(item.whyEventTimeList&&item.whyEventTimeList.length>0){
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
            message: res.message,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.message||'活动获取失败',
        type: 'warning'
      });
    });
  },
  getNote(e) {
    var that = this;
    var data = {
      storeId:storeId,
      mobile:wx.getStorageSync('userInfo').phone||'',
      ajax: '_json'
    }
    getRequest(getApiHost(), 'customer/bh/api/active/getNotesList', 'body', data, 0, false, false,false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.result=='true') {
          let noteLists = res.data
          noteLists.map(item=>{
            if(item.fileUrl.length>0){
              if(item.fileUrl.split(',').length>0){
                item.fileUrl = item.fileUrl.split(',')
                for(let x in item.fileUrl){
                  item.fileUrl[x] =  HOST_URI+'customer'+item.fileUrl[x]
                }
              }else{
                let array = []
                array.push(HOST_URI+'customer/'+item.fileUrl)
                item.fileUrl = array
              }
            }
            if(item.imgUrl.split(',').length>1){
              item.imgUrl = item.imgUrl.split(',')
              for(let x in item.imgUrl){
                item.imgUrl[x] =  HOST_URI+'customer'+item.imgUrl[x]
              }
            }else{
              let array = []
              array.push(HOST_URI+'customer'+item.imgUrl)
              item.imgUrl = array
            }
          })
          noteLists = noteLists.slice(0,4)
          that.setData({
            noteLists
          })
        } else {
          Toast({
            message: res.message,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      Toast({
        message: res.msg||'种草笔记获取失败',
        type: 'warning'
      });
    });
  },
  onClose() {
    this.setData({
      show1: false,
      show2:false
    })
    setTimeout(()=>{
      this.setData({
        show:false
      })
    },300)
  },
  use() {
    var that = this;
    new oricode('canvas', that.data.userInfo.parameter3, 250, 250);
    wx.showLoading({
      title: '加载中',
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
      setTimeout(()=>{
        this.setData({
          show2:true
        })
      },300)
    }, 300)
  },
  toPage(e) {
    var that = this
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    if (id == 'center' || id == "card" || id == "infos" || id == "mission" || id == "recommend" || id == "issus" || id == "point" || id == "exchange" || id == "store") {
      wx.navigateTo({
        url: id,
      })
    } else if (id == 'wei') {
      wx.navigateToMiniProgram({
        appId: 'wx342c05b4e39eda3b',
        path: '',
        success(res) {}
      })
    } else if (id == "order") {
      wx.navigateTo({
        url: 'order?name=' + that.data.userInfo.name + '&point=' + that.data.userInfo.availablePoints + '&level=' + that.data.userInfo.level,
      })
    }
  },
  showNav(e) {
    this.setData({
      leftShow: !this.data.leftShow
    })
  },
  leftClose(e) {
    this.setData({
      leftShow: false
    })
  },
  select(e) {
    let title = this.data.title
    if (!title[e.currentTarget.dataset.id - 1].active)
      title.map(item => {
        item.active = false
      })
    title[e.currentTarget.dataset.id - 1].active = true
    this.setData({
      title,
      titleIndex: e.currentTarget.dataset.id
    })
  },
  toPage(e) {
    let that = this;
    if(e.currentTarget.dataset.mark=='mainIndex'){
      wx.navigateTo({
        url: 'mainIndex?index='+that.data.titleIndex,
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.mark,
      })
    }
    
  },
  getUser(e){
    this.setData({
      avatarUrl:e.detail.avatarUrl
    })
  },
  toMy(e){
    wx.switchTab({
      url: 'my'
    })
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
      noteId:e.detail.id,
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
        message: res.msg,
        type: 'warning'
      });
    });
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
})