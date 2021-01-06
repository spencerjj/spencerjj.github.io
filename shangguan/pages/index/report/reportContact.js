// pages/index/check.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../../utils/api.js'
const md5 = require('../../../utils/md5')
var app = getApp();
const {
  $Toast
} = require('../../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    codeLists: [],
    actions: [{
      name: '提交',
      color: '#2d8cf0',
      loading: false
    }],
    visibility: false,
    visible: false,
    sonvisibility: false,
    keywords: '',
    keycode: '',
    keyname: '',
    imgLists: [],
    imgIdLists:[],
    total: 6,
    limit: 1,
    array: [],
    index: 0,
    userDetails: '',
    remark: '',
    typeLists: [],
    userName: '',
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let userDetails = wx.getStorageSync('userDetails')
    that.setData({
      userDetails: userDetails,
      index:options.index,
    })
    this.showList()
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
  showList(e) {
    var that = this
    var data = {
      __sid: wx.getStorageSync('userDetails').sid,
      __ajax: 'json',
      type: 'work_contact_type'
    }
    postRequest(getApiHost(), 'api/merchant/getDicTypeList', 'url', data, 0, false, false).then(
      res => {
        if (res.result && res.result == 'login') {
          that.login()
          console.log('登录失效')
          return;
        }
        let lists = res.data
        let array = []
        console.log(lists)
        lists.map((item) => {
          array.push(item.treeNames)
        })
        that.setData({
          typeLists: lists,
          array: array,
          type:lists[0].dictValue
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
              sex:item.sex
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
      office: '',
      keyname: '',
    })
  },
  selectItem(e) {
    this.setData({
      sonvisibility: false,
      keyname: e.currentTarget.dataset.name,
      office: e.currentTarget.dataset.office,
      phone: e.currentTarget.dataset.phone,
      code: e.currentTarget.dataset.code,
      sex:e.currentTarget.dataset.sex,
      keywords: e.currentTarget.dataset.name + '(' + e.currentTarget.dataset.office + ')'
    })
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
  addOne(e) {
    console.log(this.data.keywords)
    if (this.data.keywords.length > 0) {
      var user = {
        name: this.data.keyname,
        office: this.data.office,
        phone: this.data.phone,
        code: this.data.code,
        sex:this.data.sex
      }
      console.log(user)
      this.setData({
        user: user
      })
    }
    this.setData({
      visibility: false,
      sonvisibility: false
    })
  },
  delete(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    var imgLists = this.data.imgLists
    imgLists.splice(index, 1)
    var imgIdLists = this.data.imgIdLists
    imgIdLists.splice(index, 1)
    var limit = this.data.total - imgLists.length
    this.setData({
      imgLists: imgLists,
      imgIdLists: imgIdLists,
      limit: limit
    })
  },
  handleCancel() {
    this.setData({
      visible: false
    });
  },
  handleOpen() {
    this.setData({
      visible: true
    });
    const action = [...this.data.actions];
    action[0].loading = false;
    this.setData({
      actions: action
    });
  },
  handleClickItem({
    detail
  }) {
    var that = this
    const index = detail.index + 1;
    if (index == 1) {
      if (!that.data.user.name) {
        $Toast({
          content: '请选择处理人',
          type: 'warning'
        })
        that.setData({
          visible: false
        })
      } else if (that.data.remark.length < 1) {
        $Toast({
          content: '请填写工作内容',
          type: 'warning'
        })
        that.setData({
          visible: false
        })
      } else {
        const action = [...this.data.actions];
        action[0].loading = true;
        this.setData({
          actions: action
        });
        var data = {
          __sid: that.data.userDetails.sid,
          __ajax: 'json',
          dealUserName: that.data.user.name,
          dealUserCode: that.data.user.code,
          type: that.data.type,
          remark: that.data.remark,
          merchantWorkContact_image:that.data.imgIdLists.toString(),
          status: 4,
        }
        console.log(data)
        postRequest(getApiHost(), 'api/merchant/merchantWorkContactSave', 'url', data, 0, false, false, false).then(
          res => {
            if (res.result && res.result == 'login') {
              that.login()
              console.log('登录失效')
              return;
            }
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
              setTimeout(()=>{
                wx.switchTab({
                  url: '/pages/my/my',
                })
              },500)
            }, 1000);
          }
        ).catch(res => {
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#1890FF'
          });
          const action = [...this.data.actions];
          action[0].loading = false;
          that.setData({
            visible: false,
            actions: action
          });
        });
      }
    }
  },
  upload() {
    var that = this
    if (that.data.limit > 0) {
      wx.showLoading({
      })
      wx.chooseImage({
        count: that.data.limit,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
   
          const tempFilePaths = res.tempFilePaths
          var imgLists = that.data.imgLists
          if (tempFilePaths.length > 1) {
            imgLists = imgLists.concat(tempFilePaths)
          } else {
            var timestamp = Date.parse(new Date())
            wx.uploadFile({
              url: getApiHost() + 'file/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths.toString(),
              name: 'file',
              formData: {
                fileMd5: timestamp+'.png',
                fileName:timestamp+'.png',
                __sid: that.data.userDetails.sid,
                __ajax: 'json',
              },
              success(res) {
                wx.hideLoading()
                console.log(JSON.parse(res.data))
                var res = JSON.parse(res.data)
                if(res.result=='true'){
                  var imgIdLists = that.data.imgIdLists
                  imgIdLists.push(res.fileUpload.id)
                  imgLists.push(tempFilePaths.toString())
                  var limit = that.data.total - imgLists.length
                  that.setData({
                    imgIdLists:imgIdLists,
                    imgLists: imgLists,
                    limit: limit
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
        }
      })
    }
  },
  showPic(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.imgLists
    })
  },
  input(e) {
    var content = e.detail.value
    console.log(content)
    this.setData({
      remark: content
    })
  },
  pickChange(e) {
    console.log(this.data.typeLists[e.detail.value].dictValue)
    this.setData({
      index: e.detail.value,
      type: this.data.typeLists[e.detail.value].dictValue
    })
  },
})