// pages/index/check.js
const {
  $Message,
  $Toast
} = require('../../component/iview/base/index');
var app = getApp();
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
import {
  URI
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    array: [],
    lists:[],
    list:[],
    title: '添加备注',
    content: '无异常',
    imgLists: [],
    total: 9,
    limit: 9,
    actions: [{
        name: '提交',
        color: '#2d8cf0',
        loading: false
      },
      {
        name: '转办',
        color: '#2d8cf0',
        loading: false
      },
      {
        name: '退回',
        color: '#ff0000',
        loading: false
      }
    ],
    visible: false,
    today: '',
    time: '',
    id: '',
    current:0,
    can:false,
    showRight1:false,
    proLists:'',
    url:'',
    bizKey:'',
    hint:'',
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = ''
    var current = options.current
    var name = options.name
    if(current==3){
      url='bpm/bpmMyRuntime/form.json'
    }else{
      url='bpm/bpmMyTask/form.json'
    }
    console.log(options.bizKey)
    this.setData({
      id: options.id,
      current:current,
      url:url,
      bizKey:options.bizKey,
      name:name
    })
    console.log(options.bizKey)
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
    var that = this;
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
    })
    that.getToday()
    that.getDetail()
    that.showList()
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
  showList(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      type: 'work_contact_type'
    }
    postRequest(getApiHost(), 'api/merchant/getDicTypeList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let lists = res.data
        let array = []
        console.log(lists)
        lists.map((item) => {
          array.push(item.treeNames)
        })
        that.setData({
          lists: lists,
          array: array,
          index:0,
          type: lists[0].dictValue
        })

      }
    ).catch(res => {
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      });
    });
  },
  getDetail(e) {
    var that = this;
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      id: that.data.id
    }
    wx.showLoading({
      title: '加载中',
    })
    getRequest(getApiHost(), that.data.url, 'body', data, 0, false, false,false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        console.log(res)
        wx.request({
          url: URI + res.mobileUrl,
          data: {
            __sid: that.data.userDetails.sid,
            __ajax: 'json',
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data.merchantWorkContact)
            var list = res.data.merchantWorkContact
            list.type = list.type - 1
            that.setData({
              list:list,
              starIndex:list.score?list.score:'-1'
              // imgLists:res.data.merchantReportFail.imgLists?res.data.merchantReportFail.imgLists:''
            })
            wx.hideLoading({
            })
              wx.request({
                url: app.globalData.url + 'bpm/bpmTask/getTask',
                data: {
                  __sid: that.data.userDetails.sid,
                  __ajax: 'json',
                  id: that.data.id
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  if(res.data.status=='1'){
                    console.log('can action')
                    that.setData({
                      can:true
                    })
                  }
                }
              })
            

          }
        })

      }
    ).catch(res => {
      wx.hideLoading({
      })
      wx.showModal({
        title: '错误',
        content: res.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#1890FF'
      })
    });


    wx.request({
      url: getApiHost()+'file/fileList',
      data: {
        __sid: that.data.userDetails.sid,
        __ajax: 'json',
        bizKey: that.data.bizKey,
        bizType:'merchantWorkContact_image'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.result!='false'){
          let array  = res.data
          let imgLists = []
          array.map((item)=>{
            imgLists.push(URI+'platform/'+item.fileUrl)
          })
          that.setData({
            imgLists:imgLists
          })
        }
        
      }
    })
  },
  pickChange(e) {
    this.setData({
      index: e.detail.value
    })
    this.setData({
      title: !e.detail.value ? '添加备注' : '异常描述',
      content: !e.detail.value ? '无异常' : '异常情况'
    })
  },
  showPic(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.imgLists
    })
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
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action
      });
      if(that.data.list.bpm.activityId=='pj_work_contact'){
        if(that.data.starIndex==-1){
          $Toast({
            content:'请进行打分',
            type:'warning'
          })
          action[0].loading = false;
            that.setData({
              visible: false,
              ifInput: false,
              actions: action
            });
          return;
        }
        var data = {
          __sid: that.data.userDetails.sid,
          __ajax: 'json',
          score:that.data.starIndex,
          id: that.data.list.id,
          'bpm.comment': that.data.hint,
          'bpm.taskId':that.data.list.bpm.taskId,
          'bpm.procInsId':that.data.list.bpm.procInsId,
          'bpm.activityId':that.data.list.bpm.activityId,
          dealUserCode:that.data.list.dealUserCode,
          status:4
        }
      }else{
        var data = {
          __sid: that.data.userDetails.sid,
          __ajax: 'json',
          id: that.data.list.id,
          'bpm.comment': that.data.hint,
          'bpm.taskId':that.data.list.bpm.taskId,
          'bpm.procInsId':that.data.list.bpm.procInsId,
          'bpm.activityId':that.data.list.bpm.activityId,
          dealUserCode:that.data.list.dealUserCode,
          status:4
        }
      }
      postRequest(getApiHost(), 'api/merchant/merchantWorkContactSave', 'url', data, 0, false, false, false).then(
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
              ifInput: false,
              actions: action
            });
            $Toast({
              content: '提交成功！',
              type: 'success'
            });
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/index/inform',
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
        })
        action[0].loading = false;
            that.setData({
              visible: false,
              ifInput: false,
              actions: action
            });
      });
    } else if (index ==2) {
      console.log(that.data.id)
      wx.navigateTo({
        url: 'transfer?id='+that.data.id,
      })
    }else if (index ==3) {
      console.log(that.data.id)
      wx.navigateTo({
        url: 'back?id='+that.data.id,
      })
    }
  },
  handleOpen() {
    this.setData({
      visible: true
    });
  },
  placeChange(e) {
    this.setData({
      index1: e.detail.value
    })
  },
  timeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  progress() {
    var that = this;
    if(!that.data.showRight1){
      wx.showLoading({
        title: '加载中',
      })
    }
    var tempurl = that.data.list.bpm.procInsId
    that.setData({
        showRight1: !that.data.showRight1
    });
    wx.request({
      url: app.globalData.url+'bpm/display/app/rest/process-instances/'+tempurl+'/trace-json',
      method:'post',
      data: {
        __sid:that.data.userDetails.sid,
        __ajax:'json'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res)
        if(res.statusCode==200){
          that.setData({
            proLists:res.data
          })
          wx.hideLoading({
          })
        }
      }
      })
},
  getToday(e) {
    var date = new Date()
    var year = date.getFullYear() >= 10 ? date.getFullYear() : '0' + date.getFullYear()
    var month = (date.getMonth() - 1 + 2) >= 10 ? (date.getMonth() - 1 + 2) : '0' + (date.getMonth() - 1 + 2)
    var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
    var hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
    var second = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
    var today = year + '-' + month + '-' + day
    var time = hour + ':' + second
    this.setData({
      today: today,
      time: time
    })
  },
  input(e){
    this.setData({
      hint:e.detail.value
    })
  },
  onChange(e){
    const index = e.detail.index;
    this.setData({
        starIndex: index
    })
},
})