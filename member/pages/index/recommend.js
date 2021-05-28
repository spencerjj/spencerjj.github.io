// pages/index/card.js
import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    orderLists: [],
    show: false,
    nowNum: '',
    img: '',
    cshow: false,
    tshow: false,
    point:0,
    num:0,
    reLists: [
      // {
      // phone:123123123,
      // membershipdate:'2019-02-03',
      // },
      // {
      //   phone:123123123,
      //   membershipdate:'2019-02-03',
      //   },
      //   {
      //     phone:123123123,
      //     membershipdate:'2019-02-03',
      //     }
    ],
    phoneNo: '',
    imagePath: '',
    banner: '/images/cut/haibao.png',
    p1: [],
    p2: [],
    no:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if (phoneNo.length > 1) {
      var img = ''
      if (options.no) {
        var img = getApiHost() + `platform/v1/api/lampocrm/getwxacodeunlimit?__ajax=json&scene=${phoneNo}/${options.no}&page=pages/index/register`
        that.setData({
          no:options.no
        })
      } else {
        var img = getApiHost() + `platform/v1/api/lampocrm/getwxacodeunlimit?__ajax=json&scene=${phoneNo}&page=pages/index/register`
      }
      console.log(img)
      wx.downloadFile({
        url: img,
        success(res) {
          if (res.statusCode === 200) {
            that.setData({
              img: res.tempFilePath
            })
            that.getImageInfo(res.tempFilePath).then(res => {
              that.setData({
                p1: res
              })
            })
          }
        }
      })
      that.getImageInfo(that.data.banner).then(res => {
        that.setData({
          p2: res
        })
      })
      // wx.getSystemInfo({
      //   success: (result) => {
      //     console.log(result.screenWidth/300)
      //     let sca = 1
      //     if(result.screenWidth<=320){
      //       sca = 1
      //     }else if(result.screenWidth>320&&result.screenWidth<=375){
      //       sca = 1
      //     }else if(result.screenWidth>375&&result.screenWidth<=420){
      //       sca = 1
      //     }else if(result.screenWidth>420){
      //       sca = 1
      //     }
      //     that.setData({
      //       sca
      //     })
      //   },
      // })
      that.setData({
        phoneNo,
      })
      that.getInfo()
      that.getNum()
    } else {
      Toast({
        message: '登录失效，请重新授权登录',
        type: 'warning'
      });
      setTimeout(() => {
        wx.redirectTo({
          url: 'index'
        })
      }, 1000)
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
    // this.onLoad()
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
  getInfo(e) {
    var that = this;
    var data = {
      phone: wx.getStorageSync('phoneNo'),
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/QueryReferInfo', 'body', data, 0, false, false).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if (res.status == 0) {
          that.setData({
            reLists: res.referEntryList
          })
        } else {
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }

      }
    ).catch(res => {
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  getNum(e) {
    var that = this;
    var data = {
      phone: wx.getStorageSync('phoneNo'),
      ajax: '_json'
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberAllInfo', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        wx.stopPullDownRefresh()
        if(res.status==0){
          that.setData({
            point: res.nInvPoints,
            num:res.nInvFriends,
          })
        }else{
          Toast({
            message: res.msg,
            type: 'warning'
          });
        }
      }
    ).catch(res => {
      console.log(res)
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  save(e) {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success: function (data) {
        console.log(data)
        that.setData({
          cshow: false
        })
        wx.showToast({
          title: '保存成功,快去分享吧',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
          console.log("当初用户拒绝，再次发起授权")
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }
      }
    });


  },
  send(e) {
    var that = this;
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        tshow: false,
        cshow: true
      });
    }, 1000)
  },
  cclose(e) {
    this.setData({
      cshow: false
    })
  },
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas', this);
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, 375, 500)
    console.log(that.data.p2.path)
    context.drawImage('/' + that.data.p2.path, 0, 0, 375, 375 * that.data.p2.height / that.data.p2.width);
    // context.drawImage(path, 0, 0, 375);
    context.rect(0, 350, 375, 150);
    context.strokeStyle = "#ffffff";
    context.fillStyle = '#ffffff';
    context.fill();
    context.stroke();
    //绘制code码
    context.setFontSize(15);
    context.setFillStyle('#333333');
    context.fillText('加入LAMPO会员中心,', 20, 420);
    context.stroke();
    //绘制code码
    context.setFontSize(15);
    context.setFillStyle('#333333');
    context.fillText('开启全新之旅！', 20, 450);
    context.stroke();

    //绘制右下角扫码提示语
    context.drawImage(that.data.p1.path, 230, 360, 130, 130 * that.data.p1.height / that.data.p1.width);
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                cshow: false
              })
            }
          },
          fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  getImageInfo: function (url) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: function (res) {
          resolve(res);
        },
        fail(res) {
          reject('fail');
        }
      });
    })
  },
  showTab() {
    this.setData({
      tshow: true
    })
  },
  tclose() {
    this.setData({
      tshow: false
    })
  },
  onShareAppMessage: function(res) {
    let that = this
    if (res.from === 'button') {
    // 来自页面内转发按钮
    }
    let path = 'pages/index/register?rePhone='+that.data.phoneNo
    if(that.data.no){
      path = 'pages/index/register?rePhone='+that.data.phoneNo+'&cardNo='+that.data.no
    }
    return {
    title: "加入LAMPO会员中心",
    path: path,
    imageUrl: '/images/logo.png',
    }
    },
})