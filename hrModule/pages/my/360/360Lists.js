// pages/index/progress/voteList.js
const {
    $Message
  } = require('../../../component/iview/base/index')
  const { $Toast } = require('../../../component/iview/base/index');
  var app = getApp();
  Page({
  
    /**
     * 页面的初始数据
     */
    data: {
      lists:'',
      pageSize:20,
      pageNo:1,
      loadAll:true,
      loading:false,
      listIsFull:false,
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this
        let userDetails = wx.getStorageSync('userDetails')
        that.setData({
          userDetails: userDetails,
        })
        that.showList()
       
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
      this.onLoad()
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
      // this.gotoHomePage();
    },
    gotoHomePage: function () {//自定义页面跳转方法
      let that = this;
      if (that.data.clickFlag) {
          return;
      } else {
          that.setData({ clickFlag: true });
      }
      wx.switchTab({
          url: '../my/my',
      });
  },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.setData({
        pageNo: 1,
        listIsFull: false,
        loading: false,
        loadAll:true
      })
      this.onLoad();
  
      wx.showNavigationBarLoading()
      setTimeout(function () {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }, 500);
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
        that.showList()
      }
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    },
    login(e){
      app.doLogin().then(data => {
        this.onLoad()
      })
    },
    toPage(e){
        wx.navigateTo({
        url: 'estimate?id='+e.currentTarget.dataset.id
      })
    },
    showList(e){
      var that = this
      wx.request({
        url: app.globalData.url + 'api/estimate/list.json',
        data: {
          __sid: app.globalData.__sid,
          // __sid: app.globalData.tempSid,
          __ajax: 'json',
          operatorId: that.data.userDetails.userId,
          pageNo:that.data.pageNo,
          pageSize:that.data.pageSize
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          
          if(res.statusCode==200){
            if(res.data.result&&res.data.result=='login'){
              that.login()
              console.log('未登录')
              return;
            }
            if (res.data.data.result == 'false') {
              $Toast({
                content: res.data.data.message,
                type:'error'
              })
              return;
            }
            if(res.data.data.list){
              if(res.data.data.list.length==0){
                  that.setData({
                    loading:false,
                    listIsFull:false,
                    loadAll:false
                  })
                  $Toast({
                    content:'暂无评估卷',
                    type:'warning'
                  })
              }else{
                if(that.data.pageNo>1){
                  console.log('第'+that.data.pageNo+'页')
                  var list = that.data.lists
                  list = list.concat(res.data.data.list)
                  list.map((item)=>{
                    item.mark = 0
                  })
                  that.setData({
                    lists:list,
                    loadAll:false
                  })
                }else{
                  var list = res.data.data.list
                  console.log(res.data.data.list)
                  list.map((item)=>{
                    item.mark = 0
                  })
                  that.setData({
                  lists:list,
                  loadAll:false
                })
                }
                
                
                if(res.data.data.count>that.data.pageSize){
                  that.setData({
                    loading:true,
                    listIsFull:false
                  })
                  if(Math.ceil(res.data.data.count/that.data.pageSize)>that.data.pageNo){
                    that.setData({
                      isMore:true
                    })
                  }else{
                    that.setData({
                      isMore:false,
                      loading:false,
                      listIsFull:true
                    })
                  }
                }else{
                  that.setData({
                    loading:false,
                    listIsFull:true
                  })
                }
              }
            }
      }else{
        $Toast({
          content:'评估卷列表获取失败',
          type:'warning'
        })
    }
    }
      })
    },
    showDetail(e){
      var that = this;
      var lists = that.data.lists;
      var index = e.currentTarget.dataset.index
      lists[index].mark = !lists[index].mark 
      that.setData({
        lists:lists
      })
    }
  })