// pages/index/check.js
const {
  $Message,
  $Toast
} = require('../../component/iview/base/index');
const md5 = require('../../utils/md5')
var app = getApp();
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classLists: [],
    classArray:[],
    cindex: -1,
    array: [],
    array2:[],
    sonIndex:0,
    lists: [],
    img: [],
    total: 9,
    limit: 1,
    actions: [{
      name: '提交',
      color: '#2d8cf0',
      loading: false
    }],
    visible: false,
    today: '',
    time: '',
    title: '',
    classes: 0,
    isRec: false,
    proLists: [],
    codeLists: [],
    typeLists:[],
    current: 1,
    swiperHeight: '',
    secLists: [],
    officeLists: [{
        officeName: '名品部',
        officeCode: '601'
      },
      {
        officeName: '女装部',
        officeCode: '602'
      },
      {
        officeName: '男装部',
        officeCode: '603'
      }
    ],
    visibility:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getToday()
    let userDetails = wx.getStorageSync('userDetails')
    var type = options.type
    var title = ''
    console.log(type)
    switch (type) {
      case '1':
        title = '物业巡检'
        break;
      case '2':
        title = '楼管巡检'
        break;
      case '3':
        title = '总值班巡检'
        break;
      case '4':
        title = '安保巡检'
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight
        let clientWidth = res.windowWidth
        let ratio = 750 / clientWidth
        let rpxHeight = ratio * clientHeight
        that.setData({
          swiperHeight: rpxHeight - 80
        })
      }
    })

    this.setData({
      title: title,
      type: type,
      userDetails: userDetails,

    })
    this.showList2()
    var lists = wx.getStorageSync('checkLists')
    var secLists = wx.getStorageSync('secLists')
    if (lists && wx.getStorageSync('type') == type) {
      wx.showModal({
        title: '提示',
        content: '你有未保存巡检记录，是否重新编辑',
        success(res) {
          if (res.confirm) {
            that.setData({
              lists: lists,
              secLists: secLists ? secLists : [],
              isRec: true,
              cindex: wx.getStorageSync('cindex')
            })
          } else if (res.cancel) {
            wx.removeStorageSync('checkLists')
            wx.removeStorageSync('secLists')
            wx.removeStorageSync('cindex')
            wx.removeStorageSync('type')
            that.setData({
              lists: [],
              secLists:[]
            })
          }
        }
      })
    }
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
    wx.showLoading()
    setTimeout(()=>{
      wx.hideLoading()
    },2000)
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
      this.onLoad()
    })
  },
  showList1(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      checkType: that.data.type,
      companyCode: that.data.userDetails.companyCode,
      classes: that.data.classes
    }
    postRequest(getApiHost(), 'api/merchant/findSignatureList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        var data = res.data
        if (data.length < 1) {
          $Toast({
            content: '暂无签字点',
            type: 'warning'
          })
        }
        var lists = []
        console.log(data)
        var date = new Date()
        var hour = date.getHours()
        var minute = date.getMinutes()
        data.map((item) => {
          console.log(hour < item.signatureTime.slice(0, 2))
          console.log(hour + ',,,,' + item.signatureTime.slice(0, 2))
          if (hour > item.signatureTime.slice(0, 2)) {
            var over = true
          } else {
            var over = false
          }
          if (hour == item.signatureTime.slice(0, 2)) {
            if (minute > item.signatureTime.slice(3, 5)) {
              var over = true
            } else {
              var over = false
            }
          }
          var x = {
            id: item.id,
            code: item.signatureCode,
            area: item.signatureName,
            time: item.signatureTime.substring(0, 5),
            pic: '',
            imgId: '',
            mark: false,
            over: over
          }
          lists.push(x)
        })
        that.setData({
          lists: lists
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
  showList2(e) {
    var that = this
    var data1 = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      checkType: that.data.type,
      companyCode: that.data.userDetails.companyCode,
    }
    postRequest(getApiHost(), 'api/merchant/findClassList', 'url', data1, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        
        if (res.data) {
          let classLists = res.data
          console.log(classLists)

          let classArray = []
          classLists.map((item) => {
            classArray.push(item.dictLabelOrig)
          })
          that.setData({
            classLists,
            classArray
          })
        }
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
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      type: that.data.type,
      companyCode: that.data.userDetails.companyCode,
    }
    postRequest(getApiHost(), 'api/merchant/findMerchantProjectList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let proLists = res.data
        console.log(proLists)
        if (proLists.length > 0) {
          let array = []
          proLists.map((item) => {
            array.push(item.projectName)
          })
          that.setData({
            proLists: proLists,
            array: array
          })
        }
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
    var data3 = {
      __sid: wx.getStorageSync('userDetails').sid,
      __ajax: 'json',
      type: 'work_contact_type'
    }
    postRequest(getApiHost(), 'api/merchant/getDicTypeList', 'url', data3, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let lists = res.data
        let array2 = []
        console.log(lists)
        lists.map((item) => {
          array2.push(item.treeNames)
        })
        that.setData({
          typeLists: lists,
          array2,
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
    wx.request({
      url: getApiHost() + 'api/merchant/listOffice',
      data: {
        __sid: that.data.userDetails.sid,
        __ajax: 'json',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.result && res.data.result == 'login') {
            that.login()
            console.log('未登录')
            return;
          }
          console.log(res.data)
          var officeLists = res.data
          if (officeLists.length > 0) {
            let array = []
            officeLists.map((item) => {
              array.push(item.officeName)
            })
            that.setData({
              officeLists: officeLists,
              array1: array
            })
          }

        } else {
          $Toast({
            content: '系统错误',
            type: 'error'
          })
        }
      }
    })
  },
  upload(e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var current = e.currentTarget.dataset.current
    if (current == '1') {
      var lists = that.data.lists
      if (lists[index].pic.length == 0) {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            console.log(tempFilePaths)
            var timestamp = Date.parse(new Date())
            // wx.getFileSystemManager().readFile({
            //   filePath: tempFilePaths[0], //选择图片返回的相对路径
            //   encoding: 'base64', //编码格式
            //   success:(res) =>{
            //     var baseImg = 'data:image/png;base64,' + res.data
            //     lists[index].pic = baseImg
            //   }
            // })
            wx.uploadFile({
              url: getApiHost() + 'file/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths.toString(),
              name: 'file',
              formData: {
                fileMd5: timestamp + '.png',
                fileName: timestamp + '.png',
                __sid: that.data.userDetails.sid,
                __ajax: 'json',
              },
              success(res) {
                wx.hideLoading()
                console.log(JSON.parse(res.data))
                var res = JSON.parse(res.data)
                if (res.result == 'true') {
                  lists[index].pic = tempFilePaths.toString()
                  lists[index].imgId = res.fileUpload.id
                  lists[index].error = false
                  that.setData({
                    lists: lists
                  })
                  wx.removeStorageSync('checkLists')
                  wx.setStorageSync('checkLists', lists)
                } else {
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
                wx.showModal({
                  title: '错误',
                  content: '上传失败，请稍后再试',
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#1890FF'
                });
              }
            })
          },
          fail(res) {
            wx.hideLoading()
          }
        })
      }
    } else if (current == 2) {
      var secLists = that.data.secLists
      if (secLists[index].pic.length == 0) {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['camera'],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            console.log(tempFilePaths)
            var timestamp = Date.parse(new Date())
            // wx.getFileSystemManager().readFile({
            //   filePath: tempFilePaths[0], //选择图片返回的相对路径
            //   encoding: 'base64', //编码格式
            //   success:(res) =>{
            //     var baseImg = 'data:image/png;base64,' + res.data
            //     secLists[index].pic = baseImg
            //   }
            // })
            wx.uploadFile({
              url: getApiHost() + 'file/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths.toString(),
              name: 'file',
              formData: {
                fileMd5: timestamp + '.png',
                fileName: timestamp + '.png',
                __sid: that.data.userDetails.sid,
                __ajax: 'json',
              },
              success(res) {
                wx.hideLoading()
                console.log(JSON.parse(res.data))
                var res = JSON.parse(res.data)
                if (res.result == 'true') {
                  secLists[index].pic = tempFilePaths.toString()
                  secLists[index].imgId = res.fileUpload.id
                  that.setData({
                    secLists: secLists
                  })
                  wx.setStorageSync('secLists', secLists)
                } else {
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
                wx.showModal({
                  title: '错误',
                  content: '上传失败，请稍后再试',
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#1890FF'
                });
              }
            })

          },
          fail(res) {
            wx.hideLoading()
          }
        })
      }
    }
  },
  pickChange(e) {
    console.log(e.currentTarget.dataset.index)
    var proLists = this.data.proLists
    var index = e.currentTarget.dataset.index
    var secLists = this.data.secLists
    secLists[index].index = e.detail.value
    secLists[index].score = proLists[e.detail.value].score
    secLists[index].projectName = proLists[e.detail.value].projectName
    secLists[index].projectCode= proLists[e.detail.value].projectCode
    if (proLists[e.detail.value].flow == "workContact") {
      secLists[index].mark = true
    } else {
      secLists[index].mark = false
      secLists[index].dealUserCode = ''
      secLists[index].dealUserName = ''
      secLists[index].keywords = ''
    }
    this.setData({
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
  },
  officeChange(e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var secLists = this.data.secLists
    var officeLists = this.data.officeLists
    secLists[index].index1 = e.detail.value
    secLists[index].officeName = officeLists[e.detail.value].officeName
    secLists[index].officeCode = officeLists[e.detail.value].officeCode
    this.setData({
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
  },
  typeChange(e){
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var secLists = this.data.secLists
    secLists[index].index2 = e.detail.value
    this.setData({
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
  },
  delete(e) {
    var index = e.currentTarget.dataset.index
    var current = e.currentTarget.dataset.current
    var lists = this.data.lists
    var secLists = this.data.secLists
    if (current == '1') {
      lists[index].pic = ''
      lists[index].imgId = ''
      this.setData({
        lists: lists
      })
      wx.setStorageSync('checkLists', lists)
      wx.setStorageSync('type', this.data.type)
    } else if (current == '2') {
      secLists[index].pic = ''
      secLists[index].imgId = ''
      this.setData({
        secLists: secLists
      })
      wx.setStorageSync('secLists', secLists)
      wx.setStorageSync('type', this.data.type)
    }

  },
  showPic(e) {
    var array = []
    array.push(e.currentTarget.dataset.url)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: array
    })
  },
  handleCancel() {
    const action = [...this.data.actions];
    action[0].loading = false;
    this.setData({
      visible: false,
      actions: action
    });
  },

  handleClickItem({
    detail
  }) {
    var that = this
    var lists = that.data.lists
    var secLists = that.data.secLists
    var proLists = that.data.proLists
    console.log(lists)
    console.log(secLists)
    for (let x in lists) {
      if (lists[x].imgId.length < 1) {
        $Toast({
          content: '请上传' + lists[x].area + '巡检照片',
          type: 'warning'
        })
        const action = [...this.data.actions];
        action[0].loading = false;
        this.setData({
          visible: false,
          actions: action,
          current: 1
        });
        return;
      }
    }
    if (secLists.length > 0) {
      for (let y in secLists) {
        if (secLists[y].mark && secLists[y].dealUserCode.length < 1) {
          $Toast({
            content: '请正确选择处理人',
            type: 'warning'
          })
          const action = [...this.data.actions];
          action[0].loading = false;
          this.setData({
            visible: false,
            actions: action
          });
          return;
        }
        console.log(secLists[y].remark.length)
        if (secLists[y].remark.length < 1) {
          $Toast({
            content: '请填写考核项目('+(y-1+2)+')的问题描述',
            type: 'warning'
          })
          const action = [...this.data.actions];
          action[0].loading = false;
          this.setData({
            visible: false,
            actions: action
          });
          return;
        }
      }
    }
    secLists.map((item)=>{
      item.open = false
    })
    that.setData({
      secLists
    })
    const action = [...this.data.actions];
    action[0].loading = true;
    this.setData({
      actions: action
    });
    for (let x in secLists) {
      console.log(proLists[secLists[x].index].flow)
      if (proLists[secLists[x].index].flow == 'reportFail') {
        var imgId = secLists[x].imgId
        secLists[x].imgId = ''
        var data = {
          __sid: that.data.userDetails.sid,
          __ajax: 'json',
          remark: secLists[x].remark,
          merchantReportFail_image: imgId,
          type: 1,
          status: 4
        }
        console.log(data)
        postRequest(getApiHost(), 'api/merchant/merchantReportFailSave', 'url', data, 0, false, false, false).then(
          res => {
            console.log(res)
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

      } else if (proLists[secLists[x].index].flow == 'workContact') {
        var imgId = secLists[x].imgId
        secLists[x].imgId = ''
        var data = {
          __sid: that.data.userDetails.sid,
          __ajax: 'json',
          dealUserName: secLists[x].dealUserName,
          dealUserCode: secLists[x].dealUserCode,
          type: secLists[x].index2,
          remark: secLists[x].remark,
          merchantWorkContact_image: imgId,
          status: 4,
        }
        console.log(data)
        postRequest(getApiHost(), 'api/merchant/merchantWorkContactSave', 'url', data, 0, false, false, false).then(
          res => {
            console.log(res)
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
      }
    }

    console.log(that.data.lists)
    var array = []
    var proArray = []
    var imgLists = []
    var lists = that.data.lists
    var proLists = that.data.proLists
    console.log(secLists)
    lists.map((item, index) => {
      var x = {
        signatureId: item.id,
        signatureName: item.area,
        remark: item.remark
      }
      array.push(x)
      if (item.imgId && item.imgId.length > 0) {
        imgLists.push(item.imgId)
      }
    })
    secLists.map((item) => {
      if (item.imgId && item.imgId.length > 0) {
        imgLists.push(item.imgId)
      }
    })
    imgLists = imgLists.toString()
    let postData = []
    postData.__sid = that.data.userDetails.sid
    postData.__ajax = 'json'
    postData.type = that.data.type
    postData.companyName = that.data.userDetails.companyName
    postData.companyCode = that.data.userDetails.companyCode
    postData.merchantCheckupOrder_image = imgLists
    for (let x in array) {
      postData['merchantCheckupOrderDetailList[' + x + '].signatureId'] = array[x].signatureId
      postData['merchantCheckupOrderDetailList[' + x + '].signatureName'] = array[x].signatureName
    }
    for (let y in secLists) {
      postData['merchantCheckupOrderProList[' + y + '].projectCode'] = secLists[y].projectCode
      postData['merchantCheckupOrderProList[' + y + '].projectName'] = secLists[y].projectName
      postData['merchantCheckupOrderProList[' + y + '].officeCode'] = secLists[y].officeCode
      postData['merchantCheckupOrderProList[' + y + '].officeName'] = secLists[y].officeName
      postData['merchantCheckupOrderProList[' + y + '].remark'] = secLists[y].remark
      postData['merchantCheckupOrderProList[' + y + '].score'] = secLists[y].score
    }

    // var data = {
    //   __sid: that.data.userDetails.sid,
    //   __ajax: 'json',
    //   type:that.data.type,
    //   merchantCheckupOrderDetailList:array,
    //   merchantCheckupOrder_image:imgLists,
    //   merchantCheckupOrderProList:proArray
    // }
    console.log(postData)
    wx.request({
      url: getApiHost() + 'api/merchant/merchantCheckupOrderSave',
      method: 'post',
      data: postData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.result == 'login') {
            action[0].loading = false;
            that.setData({
              visible: false,
              actions: action
            });
            $Toast({
              content: '登录失效，自动登录后重新提交',
              type: 'error'
            })
            that.login()
            console.log('登录失效')
            return;
          }
          if (res.data.result == 'false') {
            $Toast({
              content: res.data.data.message,
              type: 'error'
            })
            return;
          }
          if (res.data.result == 'true') {
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
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/my/my',
                })
                wx.removeStorageSync('checkLists')
                wx.removeStorageSync('cindex')
                wx.removeStorageSync('type')
              }, 500)
            }, 3000);
          }
        } else {
          $Toast({
            content: res.data.message||'系统错误，请稍后再试',
            type: 'error'
          });
          const action = [...that.data.actions];
          action[0].loading = false;
          that.setData({
            visible: false,
            actions: action
          });
        }
      }
    })
    // postRequest(getApiHost(), 'api/merchant/merchantCheckupOrderSave', 'url', postData, 0, false, false).then(
    //   res => {
    //     if (res.result && res.result == 'login') {
    //       that.login()
    //       console.log('登录失效')
    //       return;
    //     }
    //     console.log(res)
    //     setTimeout(() => {
    //       action[0].loading = false;
    //       that.setData({
    //         visible: false,
    //         actions: action
    //       });
    //       $Toast({
    //         content: '提交成功！',
    //         type: 'success'
    //       });
    //       setTimeout(()=>{
    //         wx.switchTab({
    //           url: '/pages/index/inform',
    //         })
    //       },1000)
    //     }, 1000);
    //   }
    // ).catch(res => {
    //   wx.showModal({
    //     title: '错误',
    //     content: res.message,
    //     showCancel: false,
    //     confirmText: '知道了',
    //     confirmColor: '#1890FF'
    //   });
    //   const action = [...this.data.actions];
    //   action[0].loading = false;
    //   this.setData({
    //     visible: false,
    //     actions: action
    //   });
    // });
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
  areaInput(e) {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var secLists = that.data.secLists;
    secLists[index].remark = e.detail.value;
    that.setData({
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
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
  showAll(e) {
    var that = this
    var lists = that.data.lists
    var index = e.currentTarget.dataset.index
    lists[index].mark = !lists[index].mark

    that.setData({
      lists: lists
    })
    wx.setStorageSync('checkLists', lists)
    wx.setStorageSync('type', that.data.type)
  },
  classChange(e) {
    var that = this
    if (that.data.isRec) {
      wx.showModal({
        title: '提示',
        content: '切换类别将会清除当前记录，是否确认',
        success(res) {
          if (res.confirm) {
            that.setData({
              cindex: e.detail.value,
              classes: that.data.classLists[e.detail.value].dictValue
            })
            wx.removeStorageSync('checkLists')
            wx.setStorageSync('cindex', e.detail.value)
            wx.setStorageSync('type', that.data.type)
            that.showList1()
            that.showList2()
          }
        }
      })
    } else {
      that.setData({
        cindex: e.detail.value,
        classes: that.data.classLists[e.detail.value].dictValue
      })
      wx.setStorageSync('cindex', e.detail.value)
      wx.setStorageSync('type', that.data.type)
      that.showList1()
      that.showList2()
    }
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
              sex: item.sex
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
      code: '',
      name: '',
    })
  },
  selectItem(e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var secLists = this.data.secLists
    secLists[index].dealUserCode = e.currentTarget.dataset.code
    secLists[index].dealUserName = e.currentTarget.dataset.name
    secLists[index].keywords = e.currentTarget.dataset.name + '(' + e.currentTarget.dataset.office + ')'
    this.setData({
      sonvisibility: false,
      keywords: e.currentTarget.dataset.name + '(' + e.currentTarget.dataset.office + ')',
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
  },
  onChange(e) {
    var x = e.detail.value
    var index = e.currentTarget.dataset.index
    var lists = this.data.lists
    lists[index].index3 = x
    if (!x) {
      lists[index].index1 = -1
    }
    this.setData({
      lists: lists
    })
    wx.setStorageSync('checkLists', lists)
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    })
  },
  addPro(e) {
    var that = this
    let secLists = that.data.secLists
    secLists.map((item)=>{
      item.open = false
    })
    that.setData({
    })
    that.setData({
      sonIndex:0,
      visibility:true,
      secLists
    })
  },
  sonpickChange(e){
    this.setData({
      sonIndex:e.detail.value
    })
  },
  addOne(e) {
    var that = this
    that.setData({
      visibility:false
    })
    var secLists = that.data.secLists
    var officeLists = that.data.officeLists
    var proLists = that.data.proLists
    var mark = false
    if(proLists[that.data.sonIndex].flow=='workContact'){
      mark = true
    }
    var array = {
      projectCode: proLists[that.data.sonIndex].projectCode,
      projectName: proLists[that.data.sonIndex].projectName,
      officeName: officeLists[0].officeName,
      officeCode: officeLists[0].officeCode,
      dealUserCode: '',
      dealUserName: '',
      keywords: '',
      remark: '',
      pic: '',
      imgId: '',
      score: proLists[0].score,
      mark: mark,
      index: that.data.sonIndex,
      index1: 0,
      index2: 0,
      open: true
    }
    secLists.push(array)
    that.setData({
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
  },
  remove(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log(index)
    var secLists = that.data.secLists
    secLists.splice(index, 1)
    that.setData({
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
  },
  showReport(e) {
    var that = this
    var secLists = that.data.secLists
    var index = e.currentTarget.dataset.index
    secLists[index].open = !secLists[index].open
    that.setData({
      secLists: secLists
    })
    wx.setStorageSync('secLists', secLists)
  },
  swiperChange(e){
    console.log(e.detail.current)
    this.setData({
      current:e.detail.current+1
    })
  }
})