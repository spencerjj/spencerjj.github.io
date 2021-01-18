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
    index1:3,
    index2:3,
    index3:0,
    index4:3,
    index5:0,
    ifCaiwu:true,
    ifTongxia:true,
    ifOA:true,
    ifEmail:true,
    ifSsc:true,
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
    loadAll:false,
    url:'',
    filelist:'',
    can:false,
    lastDate:'',
    imgLists:'',
    imgId:'',
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
                lists:res.data.oaEmployOutTransfer,
                id:res.data.oaEmployOutTransfer.id,
                loadAll:false,
              })
              var lists = res.data.oaEmployOutTransfer
              if (lists.sfCaiwu != undefined) {
                if (lists.sfCaiwu == '1') {
                  that.setData({
                    index1: 0,
                  })
                } else if(lists.sfCaiwu == '0') {
                  that.setData({
                    index1: 1
                  })
                }
              }
              if (lists.sfTongxia != undefined) {
                if (lists.sfTongxia == '1') {
                  that.setData({
                    index2: 0,
                  })
                } else if(lists.sfTongxia == '0') {
                  that.setData({
                    index2: 1
                  })
                }
              }
              // if (lists.sfOa != undefined) {
              //   if (lists.sfOa == '1') {
              //     that.setData({
              //       index3: 0,
              //     })
              //   } else if(lists.sfOa == '0'){
              //     that.setData({
              //       index3: 1
              //     })
              //   }
              // }
              if (lists.sfYouxiang != undefined) {
                if (lists.sfYouxiang == '1') {
                  that.setData({
                    index4: 0,
                  })
                } else if(lists.sfYouxiang == '0'){
                  that.setData({
                    index4: 1
                  })
                }
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
        __sid: app.globalData.tempSid,
        __ajax: 'json',
        bizKey: that.data.bizKey,
        __t: new Date().getTime(),
        bizType: 'oaEmployOutTransfer_image'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        let data = res.data
        if(data.length>0){
          that.setData({
            imgLists: app.globalData.pathurl+'/hr'+data[0].fileUrl
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
  hinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      hint: e.detail.value
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
      ifOut: 1,
      outType:e.detail.value-1+2
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
      // if(that.data.lists.bpm.activityId=='hrbp'&&that.data.index1==3){
      //   $Toast({
      //     content:'请选择是否财务审批',
      //     type:'warning'
      //   })
      //   that.setData({
      //     ifCaiwu: false,
      //     visible: false
      //   })
      //   return;
      // }
      // if(that.data.lists.bpm.activityId=='hrbp'&&that.data.index2==3){
      //   $Toast({
      //     content:'请选择是否统辖审批',
      //     type:'warning'
      //   })
      //   that.setData({
      //     ifTongxia: false,
      //     visible: false
      //   })
      //   return;
      // }
       
      // if(that.data.lists.bpm.activityId=='hrbp'&&that.data.index4==3){
      //   $Toast({
      //     content:'请选择是否邮箱审批',
      //     type:'warning'
      //   })
      //   that.setData({
      //     ifEmail: false,
      //     visible: false
      //   })
      //   return;
      // }
       
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
          id: that.data.id,
          // userCode:that.data.lists.userCode,
          sfCaiwu:that.data.index1==3?'':Math.abs(that.data.index1 - 1),
          sfTongxia:that.data.index2==3?'':Math.abs(that.data.index2 - 1),
          sfOa:1,
          sfYouxiang:that.data.index4==3?'':Math.abs(that.data.index4 - 1),
          sfSsc:1,
          oaEmployOutTransfer_image:that.data.imgId,
          'bpm.taskId':that.data.lists.bpm.taskId,
          'bpm.procInsId':that.data.lists.bpm.procInsId,
          'bpm.activityId':that.data.lists.bpm.activityId,
          'bpm.comment': that.data.hint,
          status:4
        }
        wx.request({
          url: app.globalData.url + 'oa/oaEmployOutTransfer/save.json',
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
                content: res.data.message||'系统错误，请联系管理员',
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
  },
  upload() {
    var that = this
      wx.chooseImage({
        count: that.data.limit,
        sizeType: ['compressed'],
        sourceType: ['album','camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          var imgLists = that.data.imgLists
            var timestamp = Date.parse(new Date())
            wx.showLoading({
              title: '图片上传中',
            })
            wx.uploadFile({
              url: app.globalData.url + 'file/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths.toString(),
              name: 'file',
              formData: {
                fileMd5: timestamp+'.png',
                fileName:timestamp+'.png',
                __sid: app.globalData.tempSid,
                __ajax: 'json',
              },
              success(res) {
                wx.hideLoading()
                console.log(JSON.parse(res.data))
                var res = JSON.parse(res.data)
                if(res.result=='true'){
                  that.setData({
                    imgId:res.fileUpload.id,
                    imgLists:tempFilePaths.toString()
                  })
                }else{
                  wx.showModal({
                    title: '错误',
                    content: res.message,
                    showCancel: false,
                    confirmText: '知道了',
                    confirmColor: '#1890FF'
                  });
                }
              },
              fail(res) {
                wx.hideLoading({
                })
                wx.showModal({
                  title: '错误',
                  content: '上传失败，请稍后再试',
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#1890FF'
                });
              }
            })
        }
      })
  },
  pickChange(e) {
    console.log(e.currentTarget.dataset.mark)
    let mark = e.currentTarget.dataset.mark
    switch(mark){
      case 'caiwu':
        this.setData({
          index1:e.detail.value
        })
      break;
      case 'tongxia':
        this.setData({
          index2:e.detail.value
        })
      break;
      case 'oa':
        this.setData({
          index3:e.detail.value
        })
      break;
      case 'email':
        this.setData({
          index4:e.detail.value
        })
      break;
      case 'ssc':
        this.setData({
          index5:e.detail.value
        })
      break;
    }
  },
  delete(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      imgLists: '',
    })
  },
  showPic(e) {
    let x=  []
    x.push(e.currentTarget.dataset.url)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: x
    })
  },
})