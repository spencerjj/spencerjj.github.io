// pages/index/progress/voteList.js
const {
  $Message
} = require('../../../component/iview/base/index')
const {
  $Toast
} = require('../../../component/iview/base/index');
const wxCharts = require('../../../utils/wxcharts.js')
var app = getApp();
var radarChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    titles:[],
    loadAll: true,
    selection: ['激情', '综合得分', '成果', '共赢', '极致', '开放'],
    array:['2019下半年度','2019上半年度'],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let userDetails = wx.getStorageSync('userDetails')
    wx.request({
      url: app.globalData.url + 'lampo/estimateResult/listDataChild.json',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        // user1Code: userDetails.userId,
        user1Code: '000320_wj7g'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res)
        
      }
    })
    wx.request({
      url: app.globalData.url + 'api/estimate/radar.json',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        user1Code: userDetails.userId,
        // user1Code: '000089_jinb'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)

        if (res.statusCode == 200) {
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.result == 'false') {
            $Toast({
              content: res.data.data.message,
              type: 'error'
            })
            return;
          }
          if (res.data.leidatu) {
            let arr = res.data.leidatu.seriesData
            let arr1 = res.data.modelContentList
            let weight = []
            for(let x in arr1){
              weight.push(arr1[x].contentWeight)
            }
            let titles = []
            arr.map(item=>{
              item['data'] =  item['value']
              delete item['value']
              titles.push(item['name'])
            })
            for(let x in arr){
              for(let y in arr[x].data){
                console.log(arr[x].data[y])
                
                if(y<5){
                  arr[x].data[y] = arr[x].data[y]*(1/weight[y])
                }else{
                  arr[x].data[y] = arr[x].data[y]
                }
              }
            }
            for(let x in arr){
              arr[x].data.pop()
            }
            console.log(arr)
            console.log(titles)
            that.setData({
              list:arr,
              titles:titles
            })
            that.getCharts()
          } else {
            $Toast({
              content: '您暂无评估结果',
              type: 'warning'
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
          that.setData({
            loadAll: false
          })
        } else {
          $Toast({
            content: '评估结果获取失败',
            type: 'warning'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var that = this
    
  },
  touchHandler: function (e) {
    console.log(radarChart.getCurrentDataIndex(e));
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
  pickerChange(e){
    console.log(e.detail.value)
    this.setData({
      index:e.detail.value
    })
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
  login(e) {
    app.doLogin().then(data => {
      this.onLoad()
    })
  },
  getCharts(e){
    var that = this
    var list = that.data.list
    var windowWidth = 350;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    radarChart = new wxCharts({
      canvasId: 'radarCanvas',
      type: 'radar',
      categories: ['激情','开放','极致','共赢','成果'],
      series:list,
      width: windowWidth,
      height: 300,
      extra: {
        radar: {
          max: 100
        }
      }
    });
  }
})