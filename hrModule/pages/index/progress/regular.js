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
    index1: 3,
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
    current: '',
    day: '',
    id: "",
    oriId: '',
    showRight1: false,
    list: [],
    imglist: '',
    proLists: '',
    bizKey: '',
    filelist:'',
    url:'',
    loadAll:true,
    remarks:'',
    can:false,
    ifAgree:3
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
              that.setData({
                lists: res.data.oaRegular,
                id: res.data.oaRegular.id,
                loadAll:false
              })
              if (res.data.oaRegular.regularState != undefined) {
                that.setData({
                  ifAgree:1
                })
                if (res.data.oaRegular.regularState == 1) {
                  that.setData({
                    index1: 0,
                  })
                } else {
                  that.setData({
                    index1: 1
                  })
                }
              }
              if(res.data.oaRegular.remarks){
                that.setData({
                  remarks:res.data.oaRegular.remarks,
                })
              }
              console.log(that.data.current)
              if(!res.data.oaRegular.remarks&&that.data.current==1){
                that.setData({
                  remarks:wx.getStorageSync('remarks'),
                })
              }
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
      if(data.length>0){
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
      if(data.length>0){
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
      if(res.data.status=='1'){
        console.log('can action')
        that.setData({
          can:true
        })
      }
    }
  })
  },
  pickChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value,
      ifAgree: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
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
        url: 'back?id=' + that.data.oriId,
      })
    }
    // 提交操作
    if (index == 1) {
      if(that.data.ifAgree==3){
        $Toast({
          content:"请选择是否转正",
          type:"warning"
        })
        that.setData({
          visible: false
        });
        return;
      }
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action
      });
      console.log(that.data.remarks)
      
      var data = {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        'bpm.comment': that.data.hint,
        // remarks:that.data.remarks,
        regularState:Math.abs(that.data.index1-1),
        id: that.data.id,
        empCode: that.data.lists.empCode,
        empName: that.data.lists.empName,
        'bpm.taskId': that.data.lists.bpm.taskId,
        'bpm.procInsId': that.data.lists.bpm.procInsId,
        'bpm.activityId': that.data.lists.bpm.activityId,
        status: 4
      }
      wx.request({
        url: app.globalData.url + 'oa/oaRegular/save.json',
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
          fail(e){
            $Toast({
              content:"该文件文法预览",
              type:'error'
            })
          }
        })
      },
      fail(e){
        $Toast({
          content:"该文件文法预览",
          type:'error'
        })
      }
    })
  }
})