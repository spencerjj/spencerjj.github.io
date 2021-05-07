import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
var wxCharts = require('../../utils/wxcharts2.js');
var line = null;
import {getNow, getToday} from '../../utils/today.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 'all',
    title: '购物中心',
    totalLists: [],
    array: ['销售面板', '会员面板'],
    index: 0,
    showDate: '',
    today: '',
    ifRound: false,
    tabList: [],
    tab0:false,
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
    ifTopData:true,
    changeShow:false,
    waterShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let active = options.active || 'all'
    var userStoreList = wx.getStorageSync('userStoreList')
    if(!userStoreList[4].ifStore){
      if(userStoreList[0].ifStore){
        active = '601'
      }else if(userStoreList[1].ifStore){
        active = '602'
      }else if(userStoreList[2].ifStore){
        active = '603'
      }
    }
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
    this.setData({
      active,
      // showDate: getToday().todayTrue,
      today:getToday().todayTrue,
      nowTime:getNow().nowTrue,
      changeShow:app.globalData.changeShow
    })
this.drowsyUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  //   var that = this
  //   wx.onUserCaptureScreen(function(res) {
  //     that.setData({
  //       waterShow:true
  //     })
  //     setTimeout(()=>{
  //       that.setData({
  //         waterShow:false
  //       })
  //     },500)
  //     console.log('用户截屏了')
  // })
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
    var tab1, tab2, tab3, tab0
    // if(userStoreList){
    //   tab0 = userStoreList[4].ifStore
    // }
    if(userStoreList){
        tab0 = true
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
      tab0,
      tab1,
      tab2,
      tab3,
      secondShow: true,
      firstShow: true
    })
    if(userStoreList[4].ifStore){
      this.getTab()
    }else{
      
    }
    if(that.data.active!='all'||!tab0){
      that.getShopData()
    }
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
    this.setData({
      showDate:''
    })
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
      showDate: '',
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
    } else if (e.detail.name == 'all') {
      wx.setNavigationBarTitle({
        title: '业务总览'
      })
      setTimeout(() => {
        this.getTab()
        wx.setNavigationBarTitle({
          title: '业务总览'
        })
        this.setData({
          firstShow: true,
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
  getTab() {
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json'
    }
    // 业务总览
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/findOverviewList', 'body', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        // console.log(res)
        wx.stopPullDownRefresh();
        if (res.data == undefined) {
          wx.showModal({
            title: '提示',
            content: '当天暂无销售数据',
          })
          return;
        } else {
          var totalLists = res.data
          totalLists.map((item) => {
            if (item.storeName.indexOf('常州') != -1) {
              item.storeName = item.storeName.substring(2, item.storeName.length)
            }
            item.moM = item.moM
            item.yoY = item.yoY
            item.sales = item.sales
          })
          that.setData({
            totalLists: res.data,
            ifTopData:true
          })
        }
      }
    ).catch(res => {
      wx.showToast({
        title: res.message=="您的操作权限不足！"?'操作权限不足':res.message,
        image:'/images/00-8.png'
      })
      that.setData({
        ifTopData:false
      })
    });
  },
  getShopData(e) {
    var that = this
    that.getDeptData();
    that.getLineData()
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      storeId:that.data.active,
      saleDate:that.data.showDate
    }
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/findShopDataByShopId', 'body', data, 0, false, false).then(
      res => {
        // console.log(res)
        wx.stopPullDownRefresh();
        if (res.result && res.result == 'login') {
          wx.redirectTo({
            url: 'welcome',
          })
          console.log('登录失效')
          return;
        }
        if (res.data == undefined) {
          wx.showToast({
            title: '暂无销售数据',
            image: '/images/00-8.png',
          })
          that.setData({
            storeData:'',
          })
          return;
        } else {
          var storeData =res.data
          storeData.yearGoalRatio = storeData.yearGoalRatio + '%'
          storeData.goalRatio = storeData.goalRatio + '%'
          storeData.moM = storeData.moM
          storeData.yoY = storeData.yoY
          that.setData({
            storeData:res.data,
            ifStoreData:true
          })
        }
      }
    ).catch(res => {
      // wx.showModal({
      //   title: '错误',
      //   content: res.message,
      //   showCancel: false,
      //   confirmText: '知道了',
      //   confirmColor: '#1890FF'
      // })
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
      saleDate:that.data.showDate,
      pageSize:10,
      pageNo:1
    }
    // 业务总览
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/findDeptDataByShopId', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        if (res.data == undefined) {
          wx.showToast({
            title: '当天暂部门销售排行数据',
            image: '/images/00-8.png',
          })
          return;
        } else {
          var deptData = res.data
          // deptData.slice(0,5)
          for(let x in deptData){
            if(deptData[x].financeMonthSales){
              deptData[x].financeMonthSales = deptData[x].financeMonthSales.toFixed(0)
            }
            if(deptData[x].financeLastMonthSales){

            deptData[x].financeLastMonthSales = deptData[x].financeLastMonthSales.toFixed(0)
          }
          }
          that.setData({
            deptData,
            ifDeptData:true
          })
        }
      }
    ).catch(res => {
      // wx.showModal({
      //   title: '错误',
      //   content: res.message,
      //   showCancel: false,
      //   confirmText: '知道了',
      //   confirmColor: '#1890FF'
      // })
      that.setData({
        ifDeptData:false
      })
    });
  },
  getLineData(){
    var that = this
    var data = {
      __sid: that.data.sid,
      __ajax: 'json',
      storeId:that.data.active,
      salesYear:new Date(that.data.showDate).getFullYear()
    }
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/findMonthlyChartList', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        if (res.data == undefined) {
          wx.showToast({
            title: '当天逐月销售趋势数据',
            image: '/images/00-8.png',
          })
          return;
        } else {
          var lineData = res.data
          var dataArray = []
          var cateArray = []
          lineData.map((item)=>{
            dataArray.push(item.financeMonthSales.toFixed(2))
            cateArray.push(item.salemonth+'月')
          })
          that.setData({
            dataArray,
            cateArray,
            ifLineData:true
          })
          that.doLine()
        }
      }
    ).catch(res => {
      // wx.showModal({
      //   title: '错误',
      //   content: res.message,
      //   showCancel: false,
      //   confirmText: '知道了',
      //   confirmColor: '#1890FF'
      // })
      that.setData({
        ifLineData:false
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
      categories: that.data.cateArray,
      series: [{
        name: '销售额',
        data: that.data.dataArray,
        format: function (val) {
          return val;
        }
      }],
      yAxis: {
        title: '',
        format: function (val) {
          return val;
        },
        min: 0
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
    if(e.detail.value == 1)
      wx.navigateTo({
        url:`demember?active=${this.data.active}`
      })
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
      showDate:e.detail.value,
    })
    this.getShopData()
  },
  fresh() {
    
  },
  toTab(e) {
    this.setData({
      active: e.currentTarget.dataset.name
    })
    if(e.currentTarget.dataset.name=='601'&&this.data.tab1){
      this.setData({
        title: '购物中心',
      })
      wx.setNavigationBarTitle({
        title: '购物中心'
      })
    }else if(e.currentTarget.dataset.name=='602'&&this.data.tab2){
      this.setData({
        title: '百货大楼',
      })
      wx.setNavigationBarTitle({
        title: '百货大楼'
      })
    }else if(e.currentTarget.dataset.name=='603'&&this.data.tab3){
      this.setData({
        title: '新世纪商城',
      })
      wx.setNavigationBarTitle({
        title: '新世纪商城'
      })
    }
    this.getShopData()
  },
  drowsyUserInfo () {
    var that= this
    // var userInfo = wx.getStorageSync('userInfo');
    // var name_xx = userInfo.username || userInfo.nickName;
    var ctx = wx.createCanvasContext("myCanvas1",that);
 
    ctx.rotate(45 * Math.PI / 180);//设置文字的旋转角度，角度为45°；
 
    //对斜对角线以左部分进行文字的填充
    for (let j = 1; j < 10; j++) { //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
      ctx.beginPath();
      ctx.setFontSize(15);
      ctx.setFillStyle('rgba(0,0,0,.1)');
 
      ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, 50 * j);
      for (let i = 1; i < 10; i++) {//这个for循环代表横向循环，
        ctx.beginPath();
        ctx.setFontSize(15);
        ctx.setFillStyle('rgba(0,0,0,.1)');
        ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, 100 * j);
      }
    }//两个for循环的配合，使得文字充满斜对角线的左下部分
 
    //对斜对角线以右部分进行文字的填充逻辑同上
    for (let j = 0; j < 10; j++) {
      ctx.beginPath();
      ctx.setFontSize(15);
      ctx.setFillStyle(this.data.color);
 
      ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, -50 * j);
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.setFontSize(15);
        ctx.setFillStyle(this.data.color);
        ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, -100 * j);
      }
    }

  ctx.draw(true, function () {
    console.log('draw')
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas1',
        success: function (res) {
          console.log(res.tempFilePath)
          that.setData({
            temp:res.tempFilePath
          })
        },
        fail(e){
          console.log(e)
        }
      },that)
  })
}

})