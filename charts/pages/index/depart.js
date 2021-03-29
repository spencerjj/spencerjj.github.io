import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
var wxCharts = require('../../utils/wxcharts2.js');
var line = null;
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
    changeShow:false,
    waterShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.drowsyUserInfo()
    let active = options.active || 'all'
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
    this.getTab()
    if(that.data.active!='all'){
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
            totalLists: res.data
          })
        }
      }
    ).catch(res => {
      wx.showToast({
        title: res.message=="您的操作权限不足！"?'操作权限不足':res.message,
        image:'/images/00-8.png'
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
      storeId:that.data.active
    }
    getRequest(getApiHost(), 'platform/v1/api/minireport/bh/findShopDataByShopId', 'body', data, 0, false, false).then(
      res => {
        // console.log(res)
        wx.stopPullDownRefresh();
        if (res.data == undefined) {
          wx.showToast({
            title: '暂无销售数据',
            image: '/images/00-8.png',
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
          deptData.slice(0,5)
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
      storeId:that.data.active
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
    wx.navigateTo({
      url: e.detail.value == 1 ? `demember?active=${this.data.active}` : ''
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
      showDate,
    })
  },
  fresh() {
    
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
  },
      // 添加水印
      drowsyUserInfo () {
        var that= this
        // var userInfo = wx.getStorageSync('userInfo');
        // var name_xx = userInfo.username || userInfo.nickName;
        var ctx = wx.createCanvasContext("myCanvas1");
     
        ctx.rotate(45 * Math.PI / 180);//设置文字的旋转角度，角度为45°；
     
        //对斜对角线以左部分进行文字的填充
        for (let j = 1; j < 10; j++) { //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
          ctx.beginPath();
          ctx.setFontSize(20);
          ctx.setFillStyle("rgba(0,0,0,.2)");
     
          ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, 50 * j);
          for (let i = 1; i < 10; i++) {//这个for循环代表横向循环，
            ctx.beginPath();
            ctx.setFontSize(20);
            ctx.setFillStyle("rgba(0,0,0,.2)");
            ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, 100 * j);
          }
        }//两个for循环的配合，使得文字充满斜对角线的左下部分
     
        //对斜对角线以右部分进行文字的填充逻辑同上
        for (let j = 0; j < 10; j++) {
          ctx.beginPath();
          ctx.setFontSize(20);
          ctx.setFillStyle("rgba(0,0,0,.2)");
     
          ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, -50 * j);
          for (let i = 1; i < 10; i++) {
            ctx.beginPath();
            ctx.setFontSize(20);
            ctx.setFillStyle("rgba(0,0,0,.2)");
            ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, -100 * j);
          }
        }
      ctx.draw(true, function () {
        //保存临时文件
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas1',
          success: function (res) {
            console.log(res.tempFilePath)
            that.setData({
              temp:res.tempFilePath
            })
          }
        },this)
      })
    }
})