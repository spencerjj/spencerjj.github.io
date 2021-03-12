import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
var wxCharts = require('../../utils/wxcharts2.js');
var line = null;
var pie = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: '601',
    title: '购物中心',
    totalLists: [],
    array: ['会员详情', '销售面板'],
    index: 0,
    showDate: '',
    today: '',
    ifRound: false,
    tabList: [],
    tab1: false,
    tab2: false,
    tab3: false,
    secondShow: false,
    firstShow: false,
    storeData:[],
    deptData:[],
    dataArray:[],
    cateArray:[],
    ifLineData:true,
    ifDeptData:true,
    ifStoreData:true,
    changeShow:false,
    tempData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let active = options.active || '601'
    if(active=='601'){
      this.setData({
        title: '购物中心',
      })
      wx.setNavigationBarTitle({
        title: '购物中心'
      })
    }else if(active=='602'){
      this.setData({
        title: '百货大楼',
      })
      wx.setNavigationBarTitle({
        title: '百货大楼'
      })
    }else if(active=='603'){
      this.setData({
        title: '新世纪商城',
      })
      wx.setNavigationBarTitle({
        title: '新世纪商城'
      })
    }
    let now = new Date()
    var today = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + (now.getDate()) + '日'
    var hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()
    var minute = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()
    var second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds()
    var nowTime = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + (now.getDate()) + '日 ' + hour + ':' + minute + ':' + second
    this.setData({
      active,
      showDate: today,
      today,
      nowTime,
      changeShow:app.globalData.changeShow
    })
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
    var that = this
    var chartsUser = wx.getStorageSync('chartsUser');
    var userStoreList = wx.getStorageSync('userStoreList')
    console.log(userStoreList)
    this.setData({
      sid: chartsUser.sid,
      userMenus: chartsUser.userMenus,
      userStoreList
    })
    let totalLists = that.data.totalLists
    var tab1, tab2, tab3
    if(userStoreList){
        tab1 = userStoreList[0].ifStore
        tab2 = userStoreList[1].ifStore
        tab3 = userStoreList[2].ifStore
    }else{
      wx.redirectTo({
        url: 'welcome',
      })
      return;
    }
    that.setData({
      totalLists,
      tab1,
      tab2,
      tab3,
      secondShow: true,
      firstShow: true
    })
    that.getShopData()
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
    this.onShow()
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
  login(e) {
    // app.doLogin().then(data => {
    //   if(this.data.active=='all'){
    //     this.onShow()
    //   }else{
    //     this.onShow()
    //     this.getShopData()
    //   }
    // })
    wx.redirectTo({
      url: 'welcome',
    })
  },
  onChange(e) {
    this.setData({
      active: e.detail.name,
      showDate: this.data.today,
      secondShow: false,
      firstShow: false
    })
    wx.pageScrollTo({
      scrollTop: 0
    });
    if (e.detail.name == '601') {
      setTimeout(() => {
        this.getShopData()
        this.setData({
          title: '购物中心',
        })
        wx.setNavigationBarTitle({
          title: '购物中心'
        })
      }, 300)
    } else if (e.detail.name == '602') {
      setTimeout(() => {
        this.getShopData()
        this.setData({
          title: '百货大楼',
        })
        wx.setNavigationBarTitle({
          title: '百货大楼'
        })
      }, 300)
    } else if (e.detail.name == '603') {
      setTimeout(() => {
        this.getShopData()
        this.setData({
          title: '新世纪商城',
        })
        wx.setNavigationBarTitle({
          title: '新世纪商城'
        })
      }, 300)
    }
    setTimeout(() => {
      this.setData({
        secondShow: true,
      })
    }, 300)

  },
  toPage(e) {
    var storeId = this.data.active
    var departCode2 = e.currentTarget.dataset.code
    wx.navigateTo({
      url: 'group?storeId='+storeId+'&departCode2='+departCode2,
    })
  },
  getShopData(e) {
    var that = this
    that.getDeptData();
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      leadStore:that.data.active
    }
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/vip/findShopNewVipShopId', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh();
        if (res.data == undefined) {
          wx.showToast({
            title: '暂无会员数据',
            image: '/images/00-8.png',
          })
          return;
        } else {
          that.setData({
            storeData:res.data,
            ifStoreData:true
          })
            that.doPie()
          // that.doLine()
        }
      }
    ).catch(res => {
      console.log(res.message)
      wx.showToast({
        title: res.message=="您的操作权限不足！"?'操作权限不足':res.message,
        image:'/images/00-8.png'
      })
      that.setData({
        ifStoreData:false
      })
    });
  },
  getDeptData(){
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      storeId:that.data.active,
      pageSize:10,
      pageNo:1
    }
    // 业务总览
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/vip/findDepartNewVipShopId', 'body', data, 0, false, false).then(
      res => {
        
        if (res.data == undefined||res.data.length<1) {
          wx.showToast({
            title: '暂无会员销售数据',
            image: '/images/00-8.png',
          })
          return;
        } else {
          console.log(res)
          var deptData = res.data
          let tempData = []
          for(let x in deptData){
            let arr = {
              departName:deptData[x].departName,
              salesOldmemberMonth:deptData[x].salesOldmemberMonth||0,
              ppmOldMonth:deptData[x].ppmOldMonth||0,
              salesNewmemberMonth:deptData[x].salesNewmemberMonth||0,
              ppmMonth:deptData[x].ppmMonth||0
            }
            tempData.push(arr)
          }
          tempData.sort(function(a, b) { return Number(a.salesOldmemberMonth) < Number(b.salesOldmemberMonth) ? 1 : -1;} );
          console.log(tempData)
          that.setData({
            deptData,
            tempData,
            ifDeptData:true
          })
        }
      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
      that.setData({
        ifDeptData:false
      })
    });
  },
  doLine(e) {
    var windowWidth = 320;
    var that = this
    console.log(that.data.dataArray)
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    line = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      background: '#000000',
      categories: ['1月','2月','3月'],
      series: [{
        name: '销售占比',
        data: ['22','33','44'],
        format: function (val) {
          return val+'%';
        }
      }],
      yAxis: {
        title: '',
        format: function (val) {
          return val+'%';
        },
        min: 0,
        max: 100
      },
      width: windowWidth - 10,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
    });
  },
  touchHandler: function (e) {
    console.log(line.getCurrentDataIndex(e));
    line.showToolTip(e, {
      format: function (item, category) {
        return item.name + ':' + item.data
      }
    });
  },
  toSelect(e) {
    wx.redirectTo({
      url: 'select',
    })
  },
  bindPickerChange(e) {
    // this.setData({
    //   index: e.detail.value
    // })
    // wx.redirectTo({
    //   url: e.detail.value == 1 ? `depart?active=${this.data.active}` : ''
    // })
  },
  bindDateChange(e) {
    var date = new Date(e.detail.value)
    var thisYear = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var today = date.getFullYear() + '年' + (month) + '月' + (day) + '日'
    var showDate = thisYear + '年' + month + '月' + day + '日'
    this.setData({
      date: e.detail.value,
      showDate,
    })
  },
  doPie(){
    var that= this;
    var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        pie = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'ring',
            series: [{ name: '新会员', data: that.data.storeData.ratioStoreEntity.numMemberMonth,color: '#fa5c5c'}, { name: '老会员', data: that.data.storeData.ratioStoreEntity.salesOldmemberMonth,color: '#37a1df'}],
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
  },
  touchHandler: function (e) {
    console.log(line.getCurrentDataIndex(e));
    line.showToolTip(e, {
      format: function (item, category) {
        return item.name+':'+item.data
      }
    });
  },
  toTab(e) {
    this.setData({
      active: e.currentTarget.dataset.name
    })
    if(e.currentTarget.dataset.name=='601'){
      this.setData({
        title: '购物中心',
      })
      wx.setNavigationBarTitle({
        title: '购物中心'
      })
    }else if(e.currentTarget.dataset.name=='602'){
      this.setData({
        title: '百货大楼',
      })
      wx.setNavigationBarTitle({
        title: '百货大楼'
      })
    }else if(e.currentTarget.dataset.name=='603'){
      this.setData({
        title: '新世纪商城',
      })
      wx.setNavigationBarTitle({
        title: '新世纪商城'
      })
    }
    this.getShopData()
  }
})