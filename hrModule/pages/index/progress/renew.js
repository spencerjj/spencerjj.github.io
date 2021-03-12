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
    array1: ['有固定期限', '无固定期限'],
    index1: 0,
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
    end: '',
    proLists: '',
    url: '',
    loadAll: true,
    can: false,
    ifClick: false
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
              // let x = res.data.oaContinue
              // x.startDate = x.startDate.slice(0,10)
              // x.endDate = x.startDate.slice(0,10)
              // x.startDate = x.startDate.slice(0,10)
              var limitType = res.data.oaContinue.limitType||'0'
              var index1;
              if(limitType=='B'){
                index1 = 1
              }else{
                index1 = 0
              }
              that.setData({
                lists: res.data.oaContinue,
                id: res.data.oaContinue.id,
                loadAll: false,
                startDate: res.data.oaContinue.startDate,
                end: res.data.oaContinue.endDate,
                day: res.data.oaContinue.continueYear,
                index1
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
      end: e.detail.value
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
  pickChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value,
    })
  },
  hinput1: function (e) {
    console.log(e.detail.value)
    var that = this
    var end = that.data.startDate
    // end = Number(end.slice(0, 4)) + Number(e.detail.value) + end.slice(4, end.length)
    // var year1 = Number(end.slice(0, 4)) + Number(e.detail.value)
    // var month1 = Number(end.slice(5, 7))
    // var lastDay = new Date(year1, month1, 0).getDate()
    // end = end.slice(0, 8) + lastDay + end.slice(10, end.length)
    console.log(end)
    var da = new Date(end)
    var yy = da.getFullYear()-1+1+Number(e.detail.value)
    var mm = da.getMonth()+1
    var dd = da.getDate()
    console.log(mm,dd)
    if (mm == '01' && dd == '01') {
      //如果是1-1,整N年
      end = (yy - 1) + "-12-31";
    } else {
      //1、2、3 => 03-31 4、5、6=>06-30 7、8、9=>09-30 10、11、12=>12-31
      if (mm == '01' || mm == '02' || mm == '03') {
        end = yy + "-03-31";
      } else if (mm == '04' || mm == '05' || mm == '06') {
        end = yy + "-06-30";
      } else if (mm == '07' || mm == '08' || mm == '09') {
        end = yy + "-09-30";
      } else {
        end = yy + "-12-31";
      }
    }

    this.setData({
      day: e.detail.value,
      end: end
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
      if(that.data.index1==0){
        if (!that.data.day || that.data.day.length < 1||Number(that.data.day)==0) {
          $Toast({
            content: "请正确填写续签年数",
            type: "warning"
          })
          that.setData({
            visible: false
          });
          return;
        }
      }
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action,
        ifClick: true
      });
      var limitType=that.data.index1==0?'A':'B'
      var data = {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        continueYear: that.data.day||'',
        startDate: that.data.startDate,
        endDate: that.data.end||'',
        'bpm.comment': that.data.hint,
        id: that.data.id,
        empCode: that.data.lists.empCode,
        empName: that.data.lists.empName,
        'bpm.taskId': that.data.lists.bpm.taskId,
        'bpm.procInsId': that.data.lists.bpm.procInsId,
        'bpm.activityId': that.data.lists.bpm.activityId,
        limitType:limitType,
        status: 4
      }
      wx.request({
        url: app.globalData.url + 'oa/oaContinue/save.json',
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
})