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
import {
  URI
} from '../../config.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classLists: [],
    classArray: [],
    cindex: -1,
    array: [],
    array2: [],
    sonIndex: 0,
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
    classes: 4,
    isRec: false,
    proLists: [],
    codeLists: [],
    typeLists: [],
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
    visibility: false,
    checkupNo: '',
    typeName: '',
    reLists: [],
    reSecLists: [],
    URI:URI,
    id:'',
    ifClick:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getToday()
    let userDetails = wx.getStorageSync('userDetails')
    var type = options.type
    var checkupNo = options.no
    var title = ''
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
      title,
      type,
      userDetails,
      checkupNo
    })
    this.showDetail()
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
    setTimeout(() => {
      wx.hideLoading()
    }, 2000)
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
        var date = new Date()
        var hour = date.getHours()
        var minute = date.getMinutes()
        data.map((item) => {
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
            signatureId: item.id,
            code: item.signatureCode,
            area: item.signatureName,
            time: item.signatureTime.substring(0, 5),
            id:'',
            pic: '',
            imgId: '',
            fileUrl: '',
            mark: false,
            over: over,
            ifUp: false
          }
          lists.push(x)
        })
        var reLists = that.data.reLists
        console.log(reLists)
        for (let x in lists) {
          for (let y in reLists) {
            if (reLists[y].signatureId == lists[x].signatureId) {
              lists[x].pic = reLists[y].fileUrl.split(',')[0]
              lists[x].imgId = reLists[y].fileUrl.split(',')[1]
              lists[x].id = reLists[y].id
              lists[x].ifUp = true
              console.log(lists[x])
            }
          }
        }
        console.log(lists)

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
  showList3() {
    var that = this;
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      type: that.data.type,
      companyCode: that.data.userDetails.companyCode,
      classes: that.data.classes
    }
    postRequest(getApiHost(), 'api/merchant/findMerchantProjectList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let proLists = res.data
        if (proLists.length > 0) {
          var array = []
          var secLists=  []
          var reSecLists = that.data.reSecLists
          reSecLists.map((item)=>{
              var item = {
                id:item.id,
                projectCode: item.projectCode,
                projectName: item.projectName,
                officeName: item.officeName,
                officeCode: item.officeCode,
                dealUserCode: item.flow.split(',')[3],
                dealUserName: item.flow.split(',')[2],
                keywords: '',
                remark: item.remark,
                pic:item.fileUrl.split(',')[0],
                imgId:item.fileUrl.split(',')[1],
                fileUrl: item.fileUrl,
                score: item.score,
                mark: item.flow.split(',')[0],
                index: item.flow.split(',')[4],
                index1: 0,
                index2: item.flow.split(',')[1],
                open: false,
                ifUp: false,
                status:0
              }
              secLists.push(item)
          })
          proLists.map((item) => {
            array.push(item.projectName)
          })
          that.setData({
            proLists: proLists,
            array: array,
            secLists
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
  },
  showDetail(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
      __ajax: 'json',
      checkupNo: that.data.checkupNo,
    }
    postRequest(getApiHost(), 'api/merchant/merchantCheckupOrderForm', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }

        var reLists = res.data.merchantCheckupOrderDetailList
        var reSecLists = res.data.merchantCheckupOrderProList
        var classes = res.data.classes
        var typeName = res.data.typeName
        var id = res.data.id

        that.setData({
          reLists: reLists,
          reSecLists: reSecLists,
          classes,
          typeName,
          id
        })
        that.showList1()
        that.showList2()
        that.showList3()
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
  upload(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var current = e.currentTarget.dataset.current
    if (current == '1') {
      var lists = that.data.lists
      if (lists[index].pic.length == 0) {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['camera'],
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            var timestamp = Date.now()
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
                var res = JSON.parse(res.data)
                if (res.result == 'true') {
                  lists[index].pic =res.fileUpload.fileUrl
                  lists[index].imgId = res.fileUpload.id
                  lists[index].fileUrl = res.fileUpload.fileUrl
                  lists[index].error = false
                  that.setData({
                    lists: lists
                  })
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
                var res = JSON.parse(res.data)
                if (res.result == 'true') {
                  secLists[index].pic = res.fileUpload.fileUrl
                  secLists[index].imgId = res.fileUpload.id
                  secLists[index].fileUrl = res.fileUpload.fileUrl
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
    var proLists = this.data.proLists
    var index = e.currentTarget.dataset.index
    var secLists = this.data.secLists
    secLists[index].index = e.detail.value
    secLists[index].score = proLists[e.detail.value].score
    secLists[index].projectName = proLists[e.detail.value].projectName
    secLists[index].projectCode = proLists[e.detail.value].projectCode
    if (proLists[e.detail.value].flow == "workContact") {
      secLists[index].mark = 1
    } else {
      secLists[index].mark = 0
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
  typeChange(e) {
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
      lists[index].fileUrl = ''
      this.setData({
        lists: lists
      })
    } else if (current == '2') {
      secLists[index].pic = ''
      secLists[index].imgId = ''
      secLists[index].fileUrl = ''
      this.setData({
        secLists: secLists
      })
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
      actions: action,
      ifClick:false
    });
  },
  save(e) {
    var that = this
    var lists = that.data.lists
    var secLists = that.data.secLists
    var array = []
    lists.map((item, index) => {
      if (item.pic.length > 1) {
        var x = {
          signatureId: item.signatureId,
          signatureName: item.area,
          fileUrl: item.pic + ',' + item.imgId,
          id:item.id,
          ifUp: item.ifUp
        }
        array.push(x)
      }
    })
    secLists.map((item) => {
      item.fileUrl = item.pic + ',' + item.imgId
    })
    let postData = []
    postData.__sid = that.data.userDetails.sid
    postData.__ajax = 'json'
    postData.type = that.data.type
    postData.status = 3
    postData.classes = that.data.classes
    postData.companyName = that.data.userDetails.companyName
    postData.companyCode = that.data.userDetails.companyCode
    postData.checkupNo = that.data.checkupNo
    postData.id = that.data.id
    for (let x in array) {
        postData['merchantCheckupOrderDetailList[' + x + '].signatureId'] = array[x].signatureId
        postData['merchantCheckupOrderDetailList[' + x + '].signatureName'] = array[x].signatureName
        postData['merchantCheckupOrderDetailList[' + x + '].fileUrl'] = array[x].fileUrl
        if(array[x].id&&array[x].id.length>0){
          postData['merchantCheckupOrderDetailList[' + x + '].checkuoNo.checkupNo'] = that.data.checkupNo
          postData['merchantCheckupOrderDetailList[' + x + '].id'] = array[x].id
        }
      }
    for (let y in secLists) {
      if (!secLists[y].ifUp) {
        postData['merchantCheckupOrderProList[' + y + '].projectCode'] = secLists[y].projectCode
        postData['merchantCheckupOrderProList[' + y + '].projectName'] = secLists[y].projectName
        postData['merchantCheckupOrderProList[' + y + '].officeCode'] = secLists[y].officeCode
        postData['merchantCheckupOrderProList[' + y + '].officeName'] = secLists[y].officeName
        postData['merchantCheckupOrderProList[' + y + '].remark'] = secLists[y].remark
        postData['merchantCheckupOrderProList[' + y + '].score'] = secLists[y].score
        postData['merchantCheckupOrderProList[' + y + '].fileUrl'] = secLists[y].fileUrl
        postData['merchantCheckupOrderProList[' + y + '].status'] = secLists[y].status
        postData['merchantCheckupOrderProList[' + y + '].flow'] = secLists[y].mark+','+secLists[y].index2+','+secLists[y].dealUserName+','+secLists[y].dealUserCode+','+secLists[y].index
        if(secLists[y].id&&secLists[y].id.length>0){
          postData['merchantCheckupOrderProList[' + y + '].checkuoNo.checkupNo'] = that.data.checkupNo
          postData['merchantCheckupOrderProList[' + y + '].id'] = secLists[y].id
        }
      }
    }
    wx.request({
      url: getApiHost() + 'api/merchant/merchantCheckupOrderSave',
      method: 'post',
      data: postData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.result == 'login') {
            action[0].loading = false;
            that.setData({
              visible: false,
              actions: action,
              ifClick:false
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
            $Toast({
              content: '保存成功！',
              type: 'success'
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 500)
          }
        } else {
          $Toast({
            content: res.data.message || '系统错误，请稍后再试',
            type: 'error'
          });
        }
      }
    })
  },
  handleClickItem({
    detail
  }) {
    var that = this
    var lists = that.data.lists
    var secLists = that.data.secLists
    var proLists = that.data.proLists
    if(that.data.ifClick){
      $Toast({
        content: '数据提交中，请稍等',
        type: 'warning'
      })
      return;
    }
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
          current: 1,
          ifClick:false
        });
        return;
      }
    }
    if (secLists.length > 0) {
      for (let y in secLists) {
        if (secLists[y].mark==1 && secLists[y].dealUserCode.length < 1) {
          $Toast({
            content: '请正确选择处理人',
            type: 'warning'
          })
          const action = [...this.data.actions];
          action[0].loading = false;
          this.setData({
            visible: false,
            actions: action,
            ifClick:false
          });
          return;
        }
        if (secLists[y].remark.length < 1) {
          $Toast({
            content: '请填写考核项目(' + (y - 1 + 2) + ')的问题描述',
            type: 'warning'
          })
          const action = [...this.data.actions];
          action[0].loading = false;
          this.setData({
            visible: false,
            actions: action,
            ifClick:false
          });
          return;
        }
      }
    }
    secLists.map((item) => {
      item.open = false
    })
    that.setData({
      secLists
    })
    const action = [...this.data.actions];
    action[0].loading = true;
    this.setData({
      actions: action,
      ifClick:true
    });
    for (let x in secLists) {
      if (proLists[secLists[x].index].flow == 'reportFail') {
        var imgId = secLists[x].imgId||''
        secLists[x].imgId = ''
        var data = {
          __sid: that.data.userDetails.sid,
          __ajax: 'json',
          remark: secLists[x].remark,
          merchantReportFail_image: imgId,
          type: 1,
          status: 4
        }
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
        var imgId = secLists[x].imgId||''
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

    var array = []
    var imgLists = []
    var lists = that.data.lists
    var proLists = that.data.proLists
    lists.map((item, index) => {
      var x = {
        signatureId: item.signatureId,
        signatureName: item.area,
        fileUrl: item.fileUrl,
        id:item.id,
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
    postData.classes = that.data.classes
    postData.companyName = that.data.userDetails.companyName
    postData.companyCode = that.data.userDetails.companyCode
    postData.checkupNo = that.data.checkupNo
    postData.merchantCheckupOrder_image = imgLists
    postData.status = 0
    postData.id = that.data.id
    for (let x in array) {
      postData['merchantCheckupOrderDetailList[' + x + '].signatureId'] = array[x].signatureId
      postData['merchantCheckupOrderDetailList[' + x + '].signatureName'] = array[x].signatureName
      postData['merchantCheckupOrderDetailList[' + x + '].fileUrl'] = array[x].fileUrl
      if(array[x].id&&array[x].id.length>0){
        postData['merchantCheckupOrderDetailList[' + x + '].checkuoNo.checkupNo'] = that.data.checkupNo
        postData['merchantCheckupOrderDetailList[' + x + '].id'] = array[x].id
      }
    }
    for (let y in secLists) {
      postData['merchantCheckupOrderProList[' + y + '].projectCode'] = secLists[y].projectCode
      postData['merchantCheckupOrderProList[' + y + '].projectName'] = secLists[y].projectName
      postData['merchantCheckupOrderProList[' + y + '].officeCode'] = secLists[y].officeCode
      postData['merchantCheckupOrderProList[' + y + '].officeName'] = secLists[y].officeName
      postData['merchantCheckupOrderProList[' + y + '].remark'] = secLists[y].remark
      postData['merchantCheckupOrderProList[' + y + '].score'] = secLists[y].score
      postData['merchantCheckupOrderProList[' + y + '].fileUrl'] = secLists[y].fileUrl
      if(secLists[y].id&&secLists[y].id.length>0){
        postData['merchantCheckupOrderProList[' + y + '].checkuoNo.checkupNo'] = that.data.checkupNo
        postData['merchantCheckupOrderProList[' + y + '].id'] = secLists[y].id
      }
    }

    // var data = {
    //   __sid: that.data.userDetails.sid,
    //   __ajax: 'json',
    //   type:that.data.type,
    //   merchantCheckupOrderDetailList:array,
    //   merchantCheckupOrder_image:imgLists,
    //   merchantCheckupOrderProList:proArray
    // }
    wx.request({
      url: getApiHost() + 'api/merchant/merchantCheckupOrderSave',
      method: 'post',
      data: postData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.result == 'login') {
            action[0].loading = false;
            that.setData({
              visible: false,
              actions: action,
              ifClick:false
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
                actions: action,
                ifClick:false
              });
              $Toast({
                content: '提交成功！',
                type: 'success'
              });
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }, 500)
            }, 3000);
          }
        } else {
          $Toast({
            content: res.data.message || '系统错误，请稍后再试',
            type: 'error'
          });
          const action = [...that.data.actions];
          action[0].loading = false;
          that.setData({
            visible: false,
            actions: action,
            ifClick:false
          });
        }
      }
    })
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
    var index = e.currentTarget.dataset.index;
    var secLists = that.data.secLists;
    secLists[index].remark = e.detail.value;
    that.setData({
      secLists: secLists
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
  showAll(e) {
    var that = this
    var lists = that.data.lists
    var index = e.currentTarget.dataset.index
    lists[index].mark = !lists[index].mark

    that.setData({
      lists: lists
    })
  },
  checkInput(e) {
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
    secLists.map((item) => {
      item.open = false
    })
    that.setData({})
    that.setData({
      sonIndex: 0,
      visibility: true,
      secLists
    })
  },
  sonpickChange(e) {
    this.setData({
      sonIndex: e.detail.value
    })
  },
  addOne(e) {
    var that = this
    that.setData({
      visibility: false
    })
    var secLists = that.data.secLists
    var officeLists = that.data.officeLists
    var proLists = that.data.proLists
    var mark = 0
    if (proLists[that.data.sonIndex].flow == 'workContact') {
      mark = 1
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
      fileUrl: '',
      score: proLists[that.data.sonIndex].score,
      mark: mark,
      index: that.data.sonIndex,
      index1: 0,
      index2: 0,
      open: true,
      ifUp: false,
      status:0
    }
    secLists.push(array)
    that.setData({
      secLists: secLists
    })
  },
  remove(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var secLists = that.data.secLists
    secLists[index].status = 1
    // secLists.splice(index, 1)
    that.setData({
      secLists: secLists
    })
  },
  showReport(e) {
    var that = this
    var secLists = that.data.secLists
    var index = e.currentTarget.dataset.index
    secLists[index].open = !secLists[index].open
    that.setData({
      secLists: secLists
    })
  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current + 1
    })
  }
})