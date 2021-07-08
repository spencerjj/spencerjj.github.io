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
    array1:['主动','被动','其他'],
    index1:1,
    array2:['完整','简易'],
    index2:10,
    array3:['否','是'],
    index3:10,
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
          color:'red',
      }
      // {
      //     name: '中止',
      //     color:'red'
      // }
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
    filelist:'',
    outType:0,
    easyMode:'',
    can:false,
    lastDate:'',
    salaryDate:'',
    ifClick:false
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
        url:url,
        bizKey:bizKey,
        today:that.getToday()
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
        __sid: app.globalData.__sid,
        // __sid:app.globalData.tempSid,
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
          if(res.data.result=='false'){
            $Toast({
              content:res.data.message,
              type:"error"
            })
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
              if(res.data.result=='false'){
                $Toast({
                  content:res.data.message,
                  type:"error"
                })
                return;
              }
              that.setData({
                lists:res.data.oaEmployOut,
                id:res.data.oaEmployOut.id,
                loadAll:false,
                lastDate:res.data.oaEmployOut.lastDate||'',
                salaryDate:res.data.oaEmployOut.salaryDate||'',
              })
              if (res.data.oaEmployOut.outType&&res.data.oaEmployOut.outType.length>0) {
                  that.setData({
                    index1: res.data.oaEmployOut.outType-1+1,
                    outType:res.data.oaEmployOut.outType-1+2
                  })
              }
              if (res.data.oaEmployOut.easyMode&&res.data.oaEmployOut.easyMode.length>0) {
                that.setData({
                  index2: res.data.oaEmployOut.easyMode-1+1,
                  easyMode:res.data.oaEmployOut.easyMode-1+1
                })
            }
            if (res.data.oaEmployOut.sfsyj&&res.data.oaEmployOut.sfsyj.length>0) {
              that.setData({
                index3: res.data.oaEmployOut.sfsyj-1+1,
              })
          }
              if (res.data.oaEmployOut.remainHoliday&&res.data.oaEmployOut.remainHoliday.length>0) {
                that.setData({
                  day: res.data.oaEmployOut.remainHoliday,
                })
            }
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
      url: app.globalData.url + 'file/fileList',
      data: {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        bizKey: that.data.bizKey,
        __t: new Date().getTime(),
        bizType: 'oaEmployOut_file'
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
  pickChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value,
      outType:e.detail.value-1+2
    })
  },
  pickChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      index2: e.detail.value,
      easyMode:e.detail.value
    })
  },
  pickChange3: function (e) {
    console.log(e.detail.value)
    this.setData({
      index3: e.detail.value,
    })
  },
  bindDateChange: function(e) {
    console.log( e.detail.value)
    this.setData({
      lastDate: e.detail.value
    })
  },
  bindSalaryChange: function(e) {
    console.log( e.detail.value)
    this.setData({
      salaryDate: e.detail.value
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
      if(that.data.lists.bpm.activityId!='start'&&that.data.lastDate.length<1){
        $Toast({
          content:'请选择最后工作日',
          type:'warning'
        })
        that.setData({
          visible: false
        })
        return;
      }
      if(that.data.lists.bpm.activityId=='hrbp'&&that.data.index2==10){
        $Toast({
          content:'请选择移交类型',
          type:'warning'
        })
        that.setData({
          visible: false
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
        return;
      }
      var data = {
        // __sid: app.globalData.__sid,
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        // remainHoliday:that.data.day,
        lastDate:that.data.lastDate,
        // salaryDate:that.data.salaryDate,
        'bpm.comment': that.data.hint,
        id: that.data.id,
        userCode:that.data.lists.userCode,
        outType:that.data.outType,
        easyMode:that.data.easyMode,
        'bpm.taskId':that.data.lists.bpm.taskId,
        'bpm.procInsId':that.data.lists.bpm.procInsId,
        'bpm.activityId':that.data.lists.bpm.activityId,
        status:4
      }
      if(that.data.lists.bpm.activityId=='hrbp'){
        if(that.data.index3==10){
          $Toast({
            content:'请选择移是否领取失业金',
            type:'warning'
          })
          that.setData({
            visible: false
          })
          return;
        }else{
          data.sfsyj = that.data.index3
        }
      }
        const action = [...this.data.actions];
        action[0].loading = true;
        this.setData({
          actions: action,
          ifClick:true
        });


        wx.request({
          url: app.globalData.url + 'oa/oaEmployOut/save.json',
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
      __sid: app.globalData.__sid,
      // __sid:app.globalData.tempSid,
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
},
getToday(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
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