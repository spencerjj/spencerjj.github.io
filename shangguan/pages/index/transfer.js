// pages/index/check.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
const {
  $Toast
} = require('../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    codeLists: [],
    actions: [{
      name: '提交',
      color: '#2d8cf0',
      loading: false
    }],
    visibility: false,
    visible: false,
    sonvisibility: false,
    keywords: '',
    keycode: '',
    keyname: '',
    imgLists: [],
    total: 6,
    limit: 6,
    array: [],
    index: 0,
    userDetails: '',
    remark: '',
    typeLists: [],
    userName: '',
    id:'',
    task:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
      index:options.index,
      type:options.type,
      id:options.id
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
    this.showDetail()
    this.showContact()
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
  login(e) {
    app.doLogin().then(data => {
      this.onShow()
    })
  },
  showDetail(e){
    var that = this
    wx.request({
      url: app.globalData.url + 'bpm/bpmTask/back.json',
      data: {
        __sid: that.data.userDetails.sid,
        __ajax: 'json',
        id: that.data.id
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
          that.setData({
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
  showContact(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      pageNo: 1,
      pageSize: 30,
      userName: that.data.userName
    }
    wx.request({
      url: getApiHost() + 'sys/empUser/listData',
      method: 'post',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.statusCode == 200) {
          var list = res.data.list
          var codeLists = []
          list.map((item) => {
            codeLists.push({
              name: item.userName,
              office: item.employee.office.officeName,
              code: item.userCode,
              phone: item.mobile,
              sex:item.sex
            })
          })
          console.log(codeLists)
          that.setData({
            codeLists: codeLists
          })
        } else {
          $Toast({
            content: '处理人列表获取失败',
            type: 'warning'
          })
        }
      }
    })
  },
  showDrawer(e) {
    this.setData({
      visibility: !this.data.visibility,
      keywords: '',
      office: '',
      keyname: '',
    })
  },
  selectItem(e) {
    this.setData({
      sonvisibility: false,
      keyname: e.currentTarget.dataset.name,
      office: e.currentTarget.dataset.office,
      phone: e.currentTarget.dataset.phone,
      code: e.currentTarget.dataset.code,
      sex:e.currentTarget.dataset.sex,
      keywords: e.currentTarget.dataset.name + '(' + e.currentTarget.dataset.office + ')'
    })
  },
  checkInput(e) {
    console.log(e.detail.value)
    if (e.detail.value.length < 1) {
      this.setData({
        sonvisibility: false
      })
    } else {
      this.setData({
        sonvisibility: true,
        keywords: e.detail.value,
        userName: e.detail.value
      })

      this.showContact()
    }
  },
  confirm(e) {
    console.log(123)
    this.setData({
      sonvisibility: false
    })
  },
  addOne(e) {
    console.log(this.data.keywords)
    if (this.data.keywords.length > 0) {
      var user = {
        name: this.data.keyname,
        office: this.data.office,
        phone: this.data.phone,
        code: this.data.code,
        sex:this.data.sex
      }
      console.log(user)
      this.setData({
        user: user
      })
    }
    this.setData({
      visibility: false,
      sonvisibility: false
    })
  },
  handleCancel() {
    this.setData({
      visible: false
    });
  },
  handleOpen() {
    this.setData({
      visible: true
    });
    const action = [...this.data.actions];
    action[0].loading = false;
    this.setData({
      actions: action
    });
  },
  handleClickItem({
    detail
  }) {
    var that = this
    const index = detail.index + 1;
    if (index == 1) {
      if (!that.data.user.name) {
        $Toast({
          content: '请选择处理人',
          type: 'warning'
        })
        that.setData({
          visible: false
        })
      } else {
        const action = [...this.data.actions];
        action[0].loading = true;
        this.setData({
          actions: action
        });
        var data = {
          __sid: that.data.userDetails.sid,
          __ajax: 'json',
          id: that.data.id,
          userCode: that.data.user.code,
          comment: that.data.remark,
        }
        console.log(data)
        getRequest(getApiHost(), 'bpm/bpmTask/turnTask', 'body', data, 0, false, false).then(
          res => {
            if (res.result && res.result == 'login') {
              that.login()
              console.log('登录失效')
              return;
            }
            console.log(res)
            setTimeout(() => {
              action[0].loading = false;
              that.setData({
                visible: false,
                actions: action
              });
              $Toast({
                content: '提交成功！',
                type: 'success'
              });
              setTimeout(()=>{
                wx.switchTab({
                  url: 'inform',
                })
              },1000)
            }, 1000);
          }
        ).catch(res => {
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#1890FF'
          });
          const action = [...this.data.actions];
          action[0].loading = false;
          that.setData({
            visible: false,
            actions: action
          });
        });
      }
    }
  },
  input(e) {
    var content = e.detail.value
    console.log(content)
    this.setData({
      remark: content
    })
  },
  pickChange(e) {
    this.setData({
      index: e.detail.value,
      type: this.data.typeLists[e.detail.value].dictCode
    })
  },
})