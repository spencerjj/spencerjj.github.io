// pages/publish/homework.js
const {
  $Message,$Toast
} = require('../../../component/iview/base/index');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    number: '',
    hint: '',
    isBottom: false,
    index1:10,
    focus:false,
    myComment:'',
    actions: [
      {
          name: '提交',
          color:'#2d8cf0',
          loading:false
      }
    ],
    visible:false,
    lists:'',
    current:'',
    day:'',
    id:"",
    oriId:'',
    showRight1: false,
    list:[
    ],
    proLists:'',
    loadAll:true,
    url:'',
    ifOut:0,
    can:false,
    userDetails:'',
    userInfo:'',
    today:'',
    trueDate:'',
    today:'',
    ifClick:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let userDetails = wx.getStorageSync('userDetails')
    this.setData({
      userDetails,
      today:this.getToday()[0],
      trueDate:this.getToday()[1]
    })
    this.getInfo()
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
    this.setData({
      isBottom: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  login(e){
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  getInfo(){
    var that = this
    wx.request({
      url: app.globalData.url + 'sys/empUser/getByUserCode',
      data: {
        __sid: app.globalData.__sid,
        // __sid: app.globalData.tempSid,
        __ajax: 'json',
        userCode:that.data.userDetails.userId
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
              content: res.errMsg,
              type: 'error'
            })
            return;
          }
          that.setData({
            loadAll: false,
            userInfo:res.data
          })
        } else {
          $Toast({
            content: res.errMsg,
            type: 'error'
          })
        }
      }
    })
  },
  hinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      hint: e.detail.value
    })
  },
  hinput1: function (e) {
    console.log(e.detail.value)
    this.setData({
      day: e.detail.value
    })
  },
  handleOpen() {
      this.setData({
          visible: true
      });
  },
  handleCancel() {
      this.setData({
          visible: false
      });
  },

  handleClickItem({
    detail
  }) {
    var that = this
    const index = detail.index + 1;
    // 提交操作
    if (index == 1) {
      if(that.data.ifClick){
        $Toast({
          content: '数据提交中，请稍等',
          type: 'warning'
        })
        return;
      }

      if(that.data.hint.length<1){
        $Toast({
          content:'请填写离职原因',
          type:'warning'
        })
        that.setData({
          visible: false
        })
        return;
      }
        const action = [...this.data.actions];
        action[0].loading = true;
        this.setData({
          actions: action,
          ifClick:true
        });
        var data = {
          __sid: app.globalData.tempSid,
          __ajax: 'json',
          empNo:that.data.userInfo.employee.empNo,
          userCode:that.data.userInfo.userCode,
          userName:that.data.userInfo.userName,
          companyName:that.data.userInfo.employee.company.companyName,
          companyCode:that.data.userInfo.employee.company.companyCode,
          officeCode:that.data.userInfo.refObj.office.officeCode,
          officeName:that.data.userInfo.refObj.office.officeName,
          applyDate:that.data.trueDate,
          remarks:that.data.hint
        }

        wx.request({
          url: app.globalData.url + 'oa/oaEmployOut/save',
          method: 'post',

          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success(res) {
            console.log(res)
            if (res.data.result=='true') {
                action[0].loading = false;
                that.setData({
                  visible: false,
                  ifInput: false,
                  actions: action,
                  ifClick:false
                });
                $Toast({
                  content: '提交成功！',
                  type: 'success'
                });
                setTimeout(() => {
                  wx.switchTab({
                    url: '../../my/my',
                  })
                },1000)
            }else{
              $Toast({
                content: res.data.message,
                type: 'error'
              });
              action[0].loading = false;
                that.setData({
                  visible: false,
                  ifInput: false,
                  actions: action,
                  ifClick:false
                });
            }
          }
        })
    }
},
getToday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + '年' + month + '月' + strDate + '日';
    var truedate = year + '-' + month + '-' + strDate;
    return [currentdate,truedate];
  },
})