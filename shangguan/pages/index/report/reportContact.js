// pages/index/check.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../../utils/api.js'
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
    total: 6,
    limit: 6,
    array: [],
    index: 0,
    userDetails: '',
    remark: '',
    typeLists: [],
    userName: ''
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
      type:options.type
    })
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
    this.showList()
    this.showContact()
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
      this.onShow()
    })
  },
  showList(e) {
    var that = this
    var data = {
      __sid: that.data.userDetails.sid,
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
        let array = that.data.array
        console.log(lists)
        lists.map((item) => {
          array.push(item.treeNames)
        })
        that.setData({
          typeLists: lists,
          array: array
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
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var imgLists = this.data.imgLists
    imgLists.splice(index, 1);
    this.setData({
      imgLists: imgLists
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
          status: 4,
        }
        console.log(data)
        getRequest(getApiHost(), 'api/merchant/merchantWorkContactSave', 'body', data, 0, false, false).then(
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
      wx.chooseImage({
        count: that.data.limit,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          var imgLists = that.data.imgLists
          if (tempFilePaths.length > 1) {
            imgLists = imgLists.concat(tempFilePaths)
          } else {
            imgLists.push(tempFilePaths.toString())
          }
          console.log(imgLists)
          var limit = that.data.total - imgLists.length
          that.setData({
            imgLists: imgLists,
            limit: limit
          })
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
    this.setData({
      index: e.detail.value,
      type: this.data.typeLists[e.detail.value].dictCode
    })
  },
})