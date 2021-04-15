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
    array1: ['通过', '不通过'],
    index1: 3,
    array2: ['通过', '不通过', '延长试用期'],
    index2: -1,
    array3: ['是', '否'],
    index3: -1,
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
    month: '',
    id: "",
    oriId: '',
    showRight1: false,
    list: [],
    imglist: '',
    proLists: '',
    bizKey: '',
    filelist: '',
    url: '',
    loadAll: true,
    remarks: '',
    can: false,
    ifAgree: 3,
    ifClick: false,
    leave:'',
    remarks:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id
    var status = options.status
    var current = options.current
    var bizKey = options.biz

    var url = ''
    if (current == 3) {
      url = 'bpm/bpmMyRuntime/form.json'
    } else {
      url = 'bpm/bpmMyTask/form.json'
    }
    that.setData({
      current: current,
      oriId: id,
      bizKey: bizKey,
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
                lists: res.data.oaRegular,
                id: res.data.oaRegular.id,
                loadAll: false
              })
              var lists = res.data.oaRegular
              if (lists.managerAdvise) {
                that.setData({
                  index1: Math.abs(lists.managerAdvise - 1)
                })
              }
              if (lists.regularState) {
                let x = ''
                if(lists.regularState==0){
                  x = 1
                }else if(lists.regularState==1){
                  x = 0
                }else if(lists.regularState==2){
                  x = 2
                }
                that.setData({
                  index2: x
                })
              }
              if (lists.salaryChange) {
                that.setData({
                  index3: Math.abs(lists.salaryChange - 1)
                })
              }
              // if(res.data.oaRegular.remarks){
              //   that.setData({
              //     remarks:res.data.oaRegular.remarks,
              //   })
              // }
              // console.log(that.data.current)
              // if(!res.data.oaRegular.remarks&&that.data.current==1){
              //   that.setData({
              //     remarks:wx.getStorageSync('remarks'),
              //   })
              // }
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
      url: app.globalData.url + 'file/fileList',
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        bizKey: that.data.bizKey,
        __t: new Date().getTime(),
        bizType: 'oaRegular_image'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        let arr = []
        let data = res.data
        if (data.length > 0) {
          for (let x in data) {
            arr.push(app.globalData.pathurl + '/hr' + data[x].fileUrl)
          }
          that.setData({
            imglist: arr
          })
        }

      }
    })
    wx.request({
      url: app.globalData.url + 'file/fileList',
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        bizKey: that.data.bizKey,
        __t: new Date().getTime(),
        bizType: 'oaRegular_file'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        let data = res.data
        if (data.length > 0) {
          for (let x in data) {
            data[x].fileUrl = app.globalData.pathurl + '/hr' + data[x].fileUrl
          }
          that.setData({
            filelist: data
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
  pickChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  pickChange2: function (e) {
    console.log(e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },
  pickChange3: function (e) {
    console.log(e.detail.value)
    this.setData({
      index3: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      leave: e.detail.value
    })
  },
  remarkInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      remarks: e.detail.value
    })
    wx.setStorageSync('remarks', e.detail.value)
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
      month: e.detail.value
    })
  },
  hinput2: function (e) {
    console.log(e.detail.value)
    this.setData({
      remarks: e.detail.value
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
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        'bpm.comment': that.data.hint,
        // regularState:Math.abs(that.data.index1-1),
        id: that.data.id,
        empCode: that.data.lists.empCode,
        empName: that.data.lists.empName,
        'bpm.taskId': that.data.lists.bpm.taskId,
        'bpm.procInsId': that.data.lists.bpm.procInsId,
        'bpm.activityId': that.data.lists.bpm.activityId,
        status: 4
      }
      if (that.data.lists.bpm.activityId == 'leader') {//主管节点
        if (that.data.index1 == 3) {
          $Toast({
            content: "请选择是否转正",
            type: "warning"
          })
          that.setData({
            visible: false
          });
          return;
        } else {
          data.managerAdvise = Math.abs(that.data.index1 - 1)
          data.remarks = that.data.remarks
        }
      }
      if (that.data.lists.bpm.activityId == 'hrbp') { //hrbp节点
        if (that.data.index2 == -1) {
          $Toast({
            content: "请选择是否转正",
            type: "warning"
          })
          that.setData({
            visible: false
          });
          return;
        } else if(that.data.index2 == 0){//转正通过
          if (that.data.index3 == -1) {
            $Toast({
              content: "请选择是否调薪",
              type: "warning"
            })
            that.setData({
              visible: false
            });
            return;
          }else{
            data.salaryChange = Math.abs(that.data.index3 - 1)
          }
        }else if(that.data.index2 == 1){//转正不通过
          if(that.data.leave.length<1){
            $Toast({
              content: "请选择最后工作日",
              type: "warning"
            })
            that.setData({
              visible: false
            });
            return;
          }else{
            data.lastDate = that.data.leave
          }
        }else if(that.data.index2 == 2){//延长试用期
          if(that.data.month.length<1){
            $Toast({
              content: "请选择延长月数",
              type: "warning"
            })
            that.setData({
              visible: false
            });
            return;
          }else{
            data.extensionMonth = that.data.month
          }
        }
          let x = ''
          if(that.data.index2==0){
            x = 1
          }else if(that.data.index2==1){
            x = 0
          }else if(that.data.index2==2){
            x = 2
          }
          data.regularState = x
      }
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action,
        ifClick: true
      });
      wx.request({
        url: app.globalData.url + 'oa/oaRegular/save.json',
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
                wx.removeStorageSync('remarks')
                wx.switchTab({
                  url: '../inform',
                })
              }, 1000)
            }, 1000);
          } else {
            action[0].loading = false;
            that.setData({
              visible: false,
              ifInput: false,
              actions: action,
              ifClick: false
            });
            $Toast({
              content: res.data.message,
              type: 'error'
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
  showImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.mark,
      urls: this.data.imglist
    })
  },
  showFile(e) {
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid
      },
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail(e) {
            $Toast({
              content: "该文件文法预览",
              type: 'error'
            })
          }
        })
      },
      fail(e) {
        $Toast({
          content: "该文件文法预览",
          type: 'error'
        })
      }
    })
  }
})