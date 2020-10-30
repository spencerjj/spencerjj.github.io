// pages/index/progress/back.js
var app = getApp()
const {
  $Message,
  $Toast
} = require('../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
    ],
    selectedId:'',
    activityId:'',
    hint:'',
    ifInput:false,
    visible:false,
    task:'',
    actions: [
      {
          name: '取消'
      },
      {
          name: '提交',
          color: '#2d8cf0',
          loading: false
      }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id)
    var id = options.id
    that.setData({
      id:id
    })
    wx.request({
      url: app.globalData.url + 'bpm/bpmTask/back.json',
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.statusCode==200){
          if(res.data.result&&res.data.result=='login'){
            that.login()
            console.log('未登录')
            return;
          }
          console.log(res)
          var task = res.data.task.name
          var list1 = res.data.backActivity
          for(let x in list1){
            list1[x].sel = 0
          }
          that.setData({
            list:list1,
            task:task
          })
        }else{
          $Toast({
            content:'系统错误',
            type:'error'
          })
        }
      }
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
  hinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      hint: e.detail.value
    })
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
        current: detail.value
    });
},
select: function (e) {
  var that = this;
  var index = e.currentTarget.dataset.index
  var activityId = e.currentTarget.dataset.actid
  var list1 = that.data.list
  for(let x in list1){
    list1[x].sel = 0
  }
  list1[index].sel = 1
  that.setData({
    list: list1,
    activityId:activityId
  })
},
publish(){
  var that = this
  if(that.data.list.length==0){
    $Toast({
      content:"无可退回节点",
      type:"warning"
    })
  }else{
    if(that.data.activityId==''){
      $Toast({
        content:"请选择退回节点",
        type:"warning"
      })
    }else{
      console.log(that.data.hint+','+that.data.activityId)
      that.setData({
        visible:true,
        ifInput:true
      })
    }
  }
},
handleClick ({ detail }) {
  var that = this
  if (detail.index === 0) {
      that.setData({
          visible: false,
          ifInput:false
      });
  } else {
    const action = [...that.data.actions];
          action[1].loading = true;
    
          that.setData({
              actions: action
          });
    wx.request({
      url: app.globalData.url + 'bpm/bpmTask/backTask.json',
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        id: that.data.id,
        comment:that.data.hint,
        activityId:that.data.activityId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.result=='true') {
          
    
          setTimeout(() => {
              action[1].loading = false;
              that.setData({
                  visible: false,
                  ifInput:false,
                  actions: action
              });
              $Toast({
                  content: '退回成功！',
                  type: 'success'
              });
              setTimeout(()=>{
                wx.switchTab({
                  url: '../inform',
                })
              },1000)
          }, 1000);
        }else{
          const action = [...that.data.actions];
          action[1].loading = false;
          that.setData({
              visible: false,
              ifInput:false,
              actions: action
          });
          $Toast({
            content: res.data.message,
            type: 'error'
          });
        }
      }
    })
     
  }
}
})