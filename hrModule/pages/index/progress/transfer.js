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
    array1: ['平调', '晋升', '降职(仍为管理)', '降职(非管理)'],
    index1: 10,
    array2: ['否', '是'],
    index2: 10,
    array3:[],
    index3:-1,
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
    current: '',
    day: '',
    id: "",
    oriId: '',
    showRight1: false,
    list: [{
        activityId: '1',
        assigneeName: '张总',
        activityName: '填写'
      },
      {
        activityId: '2',
        assigneeName: '留总',
        activityName: '审批'
      }
    ],
    proLists: '',
    url: '',
    loadAll: true,
    ifOut: 0,
    can: false,
    ifClick: false,
    codeLists: [],
    keywords: '',
    visibility: false,
    userName: '',
    officeCode: '',
    officeName: '',
    dicLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id
    var status = options.status
    var current = options.current

    var url = ''
    if (current == 3) {
      url = 'bpm/bpmMyRuntime/form.json'
    } else {
      url = 'bpm/bpmMyTask/form.json'
    }
    that.setData({
      current: current,
      oriId: id,
      url: url
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
  login(e) {
    app.doLogin().then(data => {
      this.getInfo()
    })
  },
  getInfo() {
    var that = this
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
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.result == 'false') {
            $Toast({
              content: res.data.message,
              type: "error"
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
              if (res.data.result == 'false') {
                $Toast({
                  content: res.data.message,
                  type: "error"
                })
                return;
              }
              that.setData({
                lists: res.data.oaTransfer,
                id: res.data.oaTransfer.id,
                loadAll: false
              })
              if (res.data.oaTransfer.changeType && res.data.oaTransfer.changeType.length > 0) {
                that.setData({
                  index1: res.data.oaTransfer.changeType - 1,
                  ifOut: 1
                })
              }
              if (res.data.oaTransfer.salaryChange && res.data.oaTransfer.salaryChange.length > 0) {
                that.setData({
                  index2: res.data.oaTransfer.salaryChange,
                })
              }
              // if (res.data.oaTransfer.empRelationIn && res.data.oaTransfer.empRelationIn.length > 0) {
              //   that.setData({
              //     index3: res.data.oaTransfer.empRelationIn-1,
              //   })
              // }
              if (res.data.oaTransfer.feeOfficeNameIn && res.data.oaTransfer.feeOfficeNameIn.length > 0) {
                that.setData({
                  keywords: res.data.oaTransfer.feeOfficeNameIn,
                })
              }
              var lists = res.data.oaTransfer
              wx.request({
                url: app.globalData.url + 'lampo/dict/getDictList',
                data: {
                  // __sid: app.globalData.__sid,
                  __sid: app.globalData.tempSid,
                  __ajax: 'json',
                  dictType: 'lampo_emp_relation',
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  let list = res.data
                  let array3 = []
                  let index3
                  list.map((item,index) => {
                    array3.push(item.dictLabel)
                    if(lists.empRelationOut==item.dictValue){
                      lists.empRelationOut = item.dictLabel
                    }
                    if(lists.empRelationIn==item.dictValue){
                      index3 = index
                    }
                  })
                  that.setData({
                    dicLists:list,
                    array3,
                    lists,
                    index3
                  })
                }
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
        if (res.data.status == '1') {
          console.log('can action')
          that.setData({
            can: true
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
      day: e.detail.value
    })
  },
  pickChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value,
    })
  },
  pickChange2: function (e) {
    console.log(e.detail.value)
    this.setData({
      index2: e.detail.value,
    })
  },
  pickChange3: function (e) {
    console.log(e.detail.value)
    this.setData({
      index3: e.detail.value,
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
        office: e.detail.value
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
  showContact(e) {
    var that = this
    var data = {
      __sid: app.globalData.tempSid,
      __ajax: 'json',
      pageNo: 1,
      pageSize: 30,
      officeName: that.data.office
    }
    wx.request({
      url: app.globalData.url + 'sys/office/mobileSelect',
      method: 'post',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.statusCode == 200) {
          var list = res.data
          var codeLists = []
          list.map((item) => {
            codeLists.push({
              name: item.officeName,
              office: item.officeName,
              code: item.officeCode,
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
  selectItem(e) {
    this.setData({
      sonvisibility: false,
      keywords: e.currentTarget.dataset.name,
      officeCode: e.currentTarget.dataset.code,
      officeName: e.currentTarget.dataset.name,
    })
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
        url: 'back?id=' + that.data.oriId,
      })
    }
    // 提交操作
    if (index == 1) {
      if (that.data.ifClick) {
        $Toast({
          content: '数据提交中，请稍等',
          type: 'warning'
        })
        return;
      }
      var data = {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        'bpm.comment': that.data.hint,
        id: that.data.id,
        empCode: that.data.lists.empCode,
        'bpm.taskId': that.data.lists.bpm.taskId,
        'bpm.procInsId': that.data.lists.bpm.procInsId,
        'bpm.activityId': that.data.lists.bpm.activityId,
        status: 4
      }
      if (that.data.lists.bpm.activityId == 'hrbp') {
        if (that.data.index1 == 10) {
          $Toast({
            content: '请选择调动类型',
            type: 'warning'
          })
          that.setData({
            visible: false
          })

          wx.pageScrollTo({
            scrollTop: 0
          })
          return;
        }
        if (that.data.index2 == 10) {
          $Toast({
            content: '请选择是否调薪',
            type: 'warning'
          })
          that.setData({
            visible: false
          })
          wx.pageScrollTo({
            scrollTop: 0
          })
          return;
        }
        data.changeType = that.data.index1 - 1 + 2
        data.salaryChange = that.data.index2
      }
      if (that.data.lists.bpm.activityId == 'caiwu') {
        if (that.data.officeCode.length < 1 && that.data.officeName.length < 1) {
          $Toast({
            content: '请正确选择调入费用归属',
            type: 'warning'
          })
          that.setData({
            visible: false
          })
          return;
        }
        data.feeOfficeCodeIn = that.data.officeCode
        data.feeOfficeNameIn = that.data.officeName
      }
      if (that.data.lists.bpm.activityId == 'ssc607'||that.data.lists.bpm.activityId == 'sscother') {
        if (that.data.index3 == -1) {
          $Toast({
            content: '请选择调入劳动关系',
            type: 'warning'
          })
          that.setData({
            visible: false
          })
          return;
        }
        data.empRelationIn = that.data.dicLists[that.data.index3].dictValue
      }
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action,
        ifClick: true
      });
      
      wx.request({
        url: app.globalData.url + 'oa/oaTransfer/save.json',
        method: 'post',

        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res) {
          console.log(res)
          if (res.data.result == 'true') {
            setTimeout(() => {
              action[0].loading = false;
              that.setData({
                visible: false,
                ifInput: false,
                actions: action,
                ifClick: false
              });
              $Toast({
                content: '提交成功！',
                type: 'success'
              });
              setTimeout(() => {
                wx.switchTab({
                  url: '../inform',
                })
              }, 1000)
            }, 1000);
          } else {
            $Toast({
              content: res.data.message,
              type: 'error'
            });
            action[0].loading = false;
            that.setData({
              visible: false,
              ifInput: false,
              actions: action,
              ifClick: false
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
      url: app.globalData.url + 'bpm/display/app/rest/process-instances/' + tempurl + '/trace-json',
      method: 'post',
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            proLists: res.data
          })
        }
      }
    })
  },
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.cont,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
})