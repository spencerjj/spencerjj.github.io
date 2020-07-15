// pages/publish/homework.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deadline: "请选择截止时间",
    imglist: [],
    touchType: '',
    pkMsgCate: '',
    title:'',
    img: [],
    departList: '请选择班级',
    selectClass: [],
    idList: [],
    date1: '请选择开始时间',
    number: '',
    hint: '',
    isBottom: false,
    array1:[1,2,3,4,5],
    index1:'',
    showRight:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // wx.request({
    //   url: app.globalData.ip +'/spc/api/msg/wx6334b87275e169ab/getMsgNoticeTpl',
    //   data: {
    //     pkSchool: 1,
    //     pkMsgCate: options.pk
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data);
    //     that.setData({
    //       content: res.data.data.content,
    //       hint: res.data.data.hint,
    //       title: res.data.data.title,
    //       detail: res.data.data.detail
    //     })
    //   }
    // })
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
    var temp = wx.getStorageSync('userInfo')
    app.globalData.currentTeacher.pkTeacher = temp.pkTeacher
    var that = this;
    // wx.request({
    //   url: app.globalData.ip + '/spc/api/select/class2',
    //   data: {
    //     pkTeacher: app.globalData.currentTeacher.pkTeacher
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     var list = res.data.data
    //     console.log(list)
    //     var temp = [];
    //     temp.push(list[0].nameClass)
    //     if (list.length == 1) {
    //       var pk = []
    //       pk.push(list[0].pkClass)
    //       that.setData({
    //         selectClass: temp,
    //         idList: pk,
    //       })
    //     }
    //   }
    // })
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
  departChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value
    })
    
  },
  uploadImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '加载中'
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        var list = that.data.imglist
        if (tempFilePaths.length > 1) {
          console.log('大于1')
          list = list.concat(tempFilePaths)
          for (let x in list) {
            // wx.uploadFile({
            //   url: app.globalData.ip +'/spc/api/res/upload', //仅为示例，非真实的接口地址
            //   filePath: list[x],
            //   name: 'res',
            //   formData: {
            //     'user': 'test'
            //   },
            //   success(res) {
            //     var data = JSON.parse(res.data).data
            //     console.log(JSON.parse(res.data).data)
            //     data = data.split('/');
            //     data = data[data.length - 1];
            //     console.log(data)
            //     var img1 = that.data.img
            //     img1.push(data)
            //     that.setData({
            //       img: img1
            //     })
            //     if (img1.length == list.length) {
            //       wx.showToast({
            //         title: '',
            //         icon: 'success',
            //         duration: 2000
            //       })
            //     }
            //   },
            //   fail(res) {
            //     console.log(res);
            //   }
            // })
          }

        } else {
          console.log('小于1')
          list.push(tempFilePaths.toString())
          // wx.uploadFile({
          //   url: app.globalData.ip +'/spc/api/res/upload', //仅为示例，非真实的接口地址
          //   filePath: tempFilePaths.toString(),
          //   name: 'res',
          //   formData: {
          //     'user': 'test'
          //   },
          //   success(res) {
          //     var data = JSON.parse(res.data).data
          //     console.log(JSON.parse(res.data).data)
          //     data = data.split('/');
          //     data = data[data.length - 1];
          //     console.log(data)
          //     var img1 = that.data.img
          //     img1.push(data)
          //     that.setData({
          //       img: img1
          //     })
          //     wx.showToast({
          //       title: '',
          //       icon: 'success',
          //       duration: 2000
          //     })
          //   },
          //   fail(res) {
          //     console.log(res);
          //   }
          // })
        }
        that.setData({
          imglist: list
        })
      }
    })
  },
  touchStart: function (e) {
    let timeStart = this.getTime();
    let isTouch = true;
    this.setData({ timeStart, isTouch }, this.getNum)
  },

  touchEnd: function (e) {
    var that = this
    that.setData({ isTouch: false }, that.getNum)
    if (that.data.touchType == 1) {
      var list = that.delete(that.data.imglist, e.target.dataset.url);
      that.setData({
        imglist: list
      })
    } else if (that.data.touchType == 0) {
      wx.previewImage({
        current: e.target.dataset.url, // 当前显示图片的http链接
        urls: that.data.imglist // 需要预览的图片http链接列表
      })
    }

  },
  delete: function (arr, item) {
    var that = this;
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] != item) {
        result.push(arr[i])
      } else {
        that.data.img.splice(i, 1)
      }
    }
    return result;
  },
  toggleRight() {
    this.setData({
        showRight: !this.data.showRight
    });
},
  publish: function () {
    var that = this;
    if (that.data.date1.length != 10) {
      wx.showToast({
        title: '请输入开始时间',
        image: '../../images/00-8.png',
        duration: 2000
      })
    } else if (that.data.date2.length != 10) {
      wx.showToast({
        title: '请输入结束时间',
        image: '../../images/00-8.png',
        duration: 2000
      })
    } else if (that.data.date3.length != 10) {
      wx.showToast({
        title: '请输入返园时间',
        image: '../../images/00-8.png',
        duration: 2000
      })
    } else if (that.data.idList.length == 0) {
      wx.showToast({
        title: '请选择班级',
        image: '../../images/00-8.png',
        duration: 2000
      })
    }else{
    wx.showModal({
      title: '提示',
      content: '确定提交发布吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '发布中',
          })
          var img = that.data.img.join(',')
          var idList = that.data.idList.join(',')
          var data = {
            pkTeacherSend: app.globalData.currentTeacher.pkTeacher,
            pkMsgCate: that.data.pkMsgCate,
            title: that.data.title,
            content: that.data.content,
            hint: that.data.hint,
            qiniuKeys: img,
            pkClasses: idList,
            deadline: that.data.date3,
            start: that.data.date1,
            end: that.data.date2,
          }
          console.log(data)
          wx.request({
            url: app.globalData.ip +'/spc/api/msg/wx6334b87275e169ab/sendNotice',
            data: data,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              if (res.data.code == 0) {
                wx.showToast({
                  title: '发布成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(() => {
                  wx.switchTab({
                    url: '../index/inform',
                  })
                }, 2000)
              } else if (res.data.code == -1) {
                wx.showToast({
                  title: res.data.msg,
                  image: '../../images/00-8.png',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.hideToast();
        }
      }
    })
    }
  },
  departPick: function () {

  }
})