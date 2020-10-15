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
    array1:['是','否'],
    index1:'',
    index2:'',
    index3:'',
    index4:'',
    notice:'请输入终止原因',
    focus:false,
    myComment:'',
    actions: [
      {
          name: '提交',
          color:'#2d8cf0',
          loading:false
      },
      {
        name: '退回',
        color: 'red',
      }
    ],
    visible:false,
    lists:'',
    current:'',
    day:'',
    id:"",
    oriId:'',
    showRight1: false,
    list:[],
    proLists:'',
    url:'',
    loadAll:true,
    can:false,
    reason:'',
    inputShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id
    var status = options.status
    var current = options.current
    
    console.log(id)
      var url = ''
      if(current==3){
        url='bpm/bpmMyRuntime/form.json'
      }else{
        url='bpm/bpmMyTask/form.json'
      }
      that.setData({
        current:current,
        oriId:id,
        url:url
      })
that.getInfo()
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
      this.getInfo()
    })
  },
  getInfo(){
    var that = this
    wx.request({
      url: app.globalData.url +that.data.url,
      data: {
        // __sid: app.globalData.__sid,
        __sid:app.globalData.tempSid,
        __ajax:'json',
        id:that.data.oriId
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
          wx.request({
            url: app.globalData.pathurl+res.data.mobileUrl,
            data: {
              // __sid: app.globalData.__sid,
              __sid:app.globalData.tempSid,
              __ajax:'json',
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)
              var lists = res.data.oaPostRecruitment
              if(lists.bpm.activityId=='hrbp'&&lists.status!='1'){
                let x = that.data.actions
                let y =
                {
                    name: '终止',
                    color:'red'
                }
                x.push(y)
                that.setData({
                  actions:x
                })
              }
              that.setData({
                lists:lists,
                id:lists.id,
                loadAll:false
              })
             that.showLabel()
            }
          })
        }else{
          $Toast({
            content:'系统错误，请稍后再试',
            type:"error"
          })
        }
      }
    })
    wx.request({
      url: app.globalData.url + 'bpm/bpmTask/getTask',
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        id: that.data.oriId
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
  },
  showLabel(){
    var that = this
    var lists = that.data.lists
    wx.request({
      url: app.globalData.url+'lampo/dict/getDictLabel',
      data: {
        // __sid: app.globalData.__sid,
        __sid:app.globalData.tempSid,
        __ajax:'json',
        dictType:'oa_recruitment_reason_type',
        DictValue:lists.reasonType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        lists.reasonType=res.data.dictLabel
        that.setData({
          lists:lists
        })
      }
    })
    wx.request({
      url: app.globalData.url+'lampo/dict/getDictLabel',
      data: {
        // __sid: app.globalData.__sid,
        __sid:app.globalData.tempSid,
        __ajax:'json',
        dictType:'sys_post_type',
        DictValue:lists.postType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        lists.postType=res.data.dictLabel
        that.setData({
          lists:lists
        })
      }
    })
    wx.request({
      url: app.globalData.url+'lampo/dict/getDictLabel',
      data: {
        // __sid: app.globalData.__sid,
        __sid:app.globalData.tempSid,
        __ajax:'json',
        dictType:'lampo_emp_education',
        DictValue:lists.education
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        lists.education=res.data.dictLabel
        that.setData({
          lists:lists
        })
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
  },
  mainInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  numberInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      number: e.detail.value
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
    console.log(index)
    // 退回操作
    if (index == 2) {
      wx.navigateTo({
        url: 'back?id='+that.data.oriId,
      })
    }
    // 提交操作
    if (index == 1) {
        const action = [...this.data.actions];
        action[0].loading = true;
        this.setData({
          actions: action
        });
        var data = {
          // __sid: app.globalData.__sid,
          __sid: app.globalData.tempSid,
          __ajax: 'json',
          'bpm.comment': that.data.hint,
          id: that.data.id,
          userCode:that.data.lists.userCode,
          'bpm.taskId':that.data.lists.bpm.taskId,
          'bpm.procInsId':that.data.lists.bpm.procInsId,
          'bpm.activityId':that.data.lists.bpm.activityId,
          status:4
        }
        wx.request({
          url: app.globalData.url + 'oa/oaPostRecruitment/save.json',
          method: 'post',

          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success(res) {
            console.log(res)
            if (res.data.result=='true') {
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
                setTimeout(() => {
                  wx.switchTab({
                    url: '../inform',
                  })
                },1000)
              }, 1000);
            }else{
              $Toast({
                content: res.data.message,
                type: 'error'
              });
              action[0].loading = false;
                that.setData({
                  visible: false,
                  ifInput: false,
                  actions: action
                });
            }

          }
        })


    }
    // 中止操作
    if (index == 3) {
      that.setData({
        visible: false,
        inputShow: true,
        focus: true
      })
    }
    
},
progress() {
  var that = this;
  var tempurl = that.data.lists.bpm.procInsId
  that.setData({
      showRight1: !that.data.showRight1
  });
  wx.request({
    url: app.globalData.url+'bpm/display/app/rest/process-instances/'+tempurl+'/trace-json',
    method:'post',
    data: {
      // __sid: app.globalData.__sid,
      __sid:app.globalData.tempSid,
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
      }
    }
    })
},
getComment(e){
  console.log(e.detail.value)
  this.setData({
    reason:e.detail.value
  })
},
bindblur(e){
  this.setData({
    reason:'',
    inputShow:false
  })
},
cancelApply(e){
  var that = this
  that.setData({
    loadAll:true
  })
        var data = {
          // __sid: app.globalData.__sid,
          __sid: app.globalData.tempSid,
          __ajax: 'json',
          remarks: that.data.reason,
          id: that.data.lists.bpm.procInsId,
          'bpm.taskId':that.data.lists.bpm.taskId,
          'bpm.procInsId':that.data.lists.bpm.procInsId,
          'bpm.activityId':that.data.lists.bpm.activityId
        }
        wx.request({
          url: app.globalData.url + 'oa/oaPostRecruitment/stopBpm.json',
          method: 'post',
          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success(res) {
            console.log(res)
            if (res.data.result=='true') {
              setTimeout(() => {
                that.setData({
                  inputShow: false,
                  loadAll:false
                });
                $Toast({
                  content: '终止成功！',
                  type: 'success'
                });
                setTimeout(() => {
                  wx.switchTab({
                    url: '../inform',
                  })
                },1000)
              }, 1000);
            }else{
              $Toast({
                content: res.data.message,
                type: 'error'
              });
                that.setData({
                  inputShow: false,
                  loadAll:false
                });
            }

          }
        })
}
})