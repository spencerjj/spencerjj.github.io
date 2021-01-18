// pages/publish/homework.js
const {
  $Message,
  $Toast
} = require('../../../component/iview/base/index');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    number: '',
    hint: '',
    isBottom: false,
    array1: ['是', '否'],
    index1: 0,
    index2: 3,
    index3: 3,
    index4: 3,
    notice: '请输入终止原因',
    focus: false,
    myComment: '',
    actions: [{
        name: '提交',
        color: '#2d8cf0',
        loading: false
      },
      {
        name: '退回',
        color: 'red',
      }
      // {
      //     name: '中止',
      //     color:'red'
      // }
    ],
    visible: false,
    lists: '',
    ifoa: 0,
    ifdoor: '',
    ifemail: '',
    iftrain: '',
    current: '',
    id: '',
    oriId:'',
    showRight1: false,
    list:[],
    proLists:'',
    loadAll:true,
    url:'',
    can:false,
    safeLevel:'',
    ifClick:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      console.log(123)
      var id = options.id
      var status = options.status
      var current = options.current
      var bizKey = options.biz
      var key = options.key
      console.log(current)
      that.setData({
        oriId:id
      })
      if(current!=1){
        that.setData({
          ifoa:1,
          ifdoor:1,
          ifemail:1,
          iftrain:1
        })
      }
        var url = ''
        if(current==3){
          url='bpm/bpmMyRuntime/form.json'
        }else{
          url='bpm/bpmMyTask/form.json'
        }
        that.setData({
          current: current,
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
  getInfo(e){
    var that = this;
    wx.request({
      url: app.globalData.url + that.data.url,
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
        console.log(res)
        if (res.statusCode == 200) {
          if(res.data.result&&res.data.result=='login'){
            that.login()
            console.log('未登录')
            return;
          }
          if(res.data.result=='false'){
            $Toast({
              content:res.data.message,
              type:"error"
            })
            return;
          }
          wx.request({
            url: app.globalData.pathurl + res.data.mobileUrl,
            data: {
              // __sid: app.globalData.__sid,
              __sid: app.globalData.tempSid,
              __ajax: 'json',
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)
              if(res.data.result=='false'){
                $Toast({
                  content:res.data.message,
                  type:"error"
                })
                return;
              }
              that.setData({
                id: res.data.oaEmployEntry.id,
                loadAll:false,
                oaPwd:res.data.oaEmployEntry.oaPwd?res.data.oaEmployEntry.oaPwd:'',
                emailAccount:res.data.oaEmployEntry.emailAccount?res.data.oaEmployEntry.emailAccount:'',
                emailPwd:res.data.oaEmployEntry.emailPwd?res.data.oaEmployEntry.emailPwd:'',
                safeLevel:res.data.oaEmployEntry.safeLevel?res.data.oaEmployEntry.safeLevel:''
              })
              var post = res.data.postList
              var lists = res.data.oaEmployEntry
              for (let x in post) {
                if (post[x].id == lists.postCode) {
                  post = post[x].postName
                  break;
                }
              }
              lists.postName = post
              if (lists.isoa != undefined) {
                that.setData({
                  ifoa:1
                })
                if (lists.isoa == 1) {
                  that.setData({
                    index1: 0,
                  })
                } else {
                  that.setData({
                    index1: 1
                  })
                }
              }
              if (lists.isdoor != undefined) {
                that.setData({
                  ifdoor:1
                })
                if (lists.isdoor == 1) {
                  that.setData({
                    index2: 0,
                  })
                } else {
                  that.setData({
                    index2: 1
                  })
                }
              }
              if (lists.isemail != undefined) {
                that.setData({
                  ifemail:1
                })
                if (lists.isemail == 1) {
                  that.setData({
                    index3: 0,
                  })
                } else {
                  that.setData({
                    index3: 1
                  })
                }
              }
              if (lists.istraining != undefined) {
                that.setData({
                  iftrain:1
                })
                if (lists.istraining == 1) {
                  that.setData({
                    index4: 0,
                  })
                } else {
                  that.setData({
                    index4: 1
                  })
                }
              }

              that.setData({
                lists: lists
              })
            }
          })
        } else {
          $Toast({
            content: '系统错误，请稍后再试',
            type: "error"
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
      oaPwd: e.detail.value
    })
  },
  hinput2: function (e) {
    console.log(e.detail.value)
    this.setData({
      emailAccount: e.detail.value
    })
  },
  hinput3: function (e) {
    console.log(e.detail.value)
    this.setData({
      emailPwd: e.detail.value
    })
  },
  hinput4: function (e) {
    console.log(e.detail.value)
    this.setData({
      safeLevel: e.detail.value
    })
  },
  pickChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value,
      ifoa: e.detail.value
    })
  },
  pickChange2: function (e) {
    console.log(e.detail.value)
    this.setData({
      index2: e.detail.value,
      ifdoor: e.detail.value,
    })
  },
  pickChange3: function (e) {
    console.log(e.detail.value)
    this.setData({
      index3: e.detail.value,
      ifemail: e.detail.value
    })
  },
  pickChange4: function (e) {
    console.log(e.detail.value)
    this.setData({
      index4: e.detail.value,
      iftrain: e.detail.value
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
      if(that.data.ifClick){
        $Toast({
          content: '数据提交中，请稍等',
          type: 'warning'
        })
        return;
      }
      if (that.data.ifoa.length != 0 && that.data.ifdoor.length != 0 && that.data.ifemail.length != 0) {
        const action = [...this.data.actions];
        action[0].loading = true;

        this.setData({
          actions: action,
          ifClick:true
        });
        var data = {
          // __sid: app.globalData.__sid,
          __sid: app.globalData.tempSid,
          __ajax: 'json',
          isoa: 1,
          isemail: Math.abs(that.data.index2 - 1),
          isdoor: Math.abs(that.data.index3 - 1),
          istraining: Math.abs(that.data.index4 - 1),
          oaPwd:that.data.oaPwd,
          emailAccount:that.data.emailAccount,
          emailPwd:that.data.emailPwd,
          safeLevel:that.data.safeLevel,
          'bpm.comment': that.data.hint,
          id: that.data.id,
          'bpm.taskId':that.data.lists.bpm.taskId,
          'bpm.procInsId':that.data.lists.bpm.procInsId,
          'bpm.activityId':that.data.lists.bpm.activityId,
          status:4
        }
        wx.request({
          url: app.globalData.url + 'oa/oaEmployEntry/save.json',
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
                  actions: action,
                  ifClick:false
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
                  actions: action,
                  ifClick:false
                });
            }

          }
        })

      } else {
        $Toast({
          content: "请完整选择需要开通的权限",
          type: 'warning'
        })
        that.setData({
          visible: false
        })

      }

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
copy(e){
  wx.setClipboardData({
    data: e.currentTarget.dataset.cont,
    success (res) {
      wx.getClipboardData({
        success (res) {
          console.log(res.data) // data
        }
      })
    }
  })
}
})