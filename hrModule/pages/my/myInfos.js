// pages/my/account/addAccount.js 
var app = getApp();
const { $Toast } = require('../../component/iview/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    temp: '',
    ifPic: false,
    index: 11,
    name: '',
    phone: '',
    title: '',
    store: '',
    profile: '',
    mark: false,
    path: '',
    imagesList:[],
    loadAll:true,
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let userDetails = wx.getStorageSync('userDetails')
    let path = app.globalData.pathurl + userDetails.avatarUrl
    that.setData({
      name:userDetails.userName,
      path:path,
      phone:userDetails.mobile,
      email:userDetails.email,
      office:userDetails.office,
      managername:userDetails.managername,
      userDetails:userDetails,
    })
    that.getTag()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  login(e) {
    app.doLogin().then(data => {
      this.onLoad()
      this.setData({
        loadAll: true
      })
    })
  },
  getTag(e) {
    var that = this
    wx.request({
      url: app.globalData.url + 'api/tag/TagAllByEmpCodeForMobile.json',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        empCode: that.data.userDetails.userId
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
          if (res.data.data.result == 'false') {
            $Toast({
              content: res.data.data.message,
              type: 'error'
            })
            return;
          }
          let lists = res.data.data;
          that.setData({
            count: lists.length,
            loadAll: false
          })
        } else {
          $Toast({
            content: '标签获取失败',
            type: 'warning'
          })
        }
      }
    })
  },
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          path: tempFilePaths,
          loadAll:true
        })
        //拿到图片地址
        const imagesList = that.data.imagesList.concat(res.tempFilePaths);
        that.data.imagesList = imagesList.length <= 1 ? imagesList : imagesList.slice(0, 1);
        //图片base64位
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success:(res) =>{
            var baseImg = 'data:image/png;base64,' + res.data
            var mobile = that.data.userDetails.mobile
            var sex = that.data.userDetails.sex
            var email = that.data.userDetails.email
            if(!mobile||mobile=='undefined'){
              mobile=''
            }
            if(!sex||sex=='undefined'){
              sex=''
            }
            if(!email||email=='undefined'){
              email=''
            }
            wx.request({
              url: app.globalData.url + 'sys/user/infoSaveBase',
              method: 'post',
              data: {
                __sid: app.globalData.__sid,
                __ajax: 'json',
                avatarBase64:baseImg,
                userName:that.data.userDetails.userName,
                mobile:mobile,
                sex:sex,
                email:email
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success(res) {
                console.log(res)
                if (res.statusCode != 200) {
                  $Toast({
                    content: '上传失败',
                    type: 'error'
                  })
                  return;
                }
                if (res.data.result == 'false') {
                  $Toast({
                    content: res.data.data.message,
                    type: 'error'
                  })
                  return;
                }
                that.setData({
                  loadAll:false
                })
                $Toast({
                  content:'上传成功',
                  type:'success'
                })
              }
            })
          }
        })
      }
    })
  },
  emailInput(e){
    var that = this
    if(e.detail.value.length==0){
      that.setData({
        mark:false
      })
    }else{
      that.setData({
        email:e.detail.value,
        mark:true
      })
    }
    that.setData({
      email:e.detail.value,
    })
  },
  phoneInput(e){
    var that = this
    if(e.detail.value.length==0){
      that.setData({
        mark:false
      })
    }else{
      that.setData({
        mark:true
      })
    }
    that.setData({
      phone:e.detail.value,
    })
  },
  save: function () {
    var that = this;
    if (that.data.mark) {
      console.log(that.data.email)
      if (!that.data.email||that.data.email.length==0) {
        $Toast({
          content: '请正确输入邮箱',
          type: 'warning'
        });
      } else if (!that.data.phone||that.data.phone.length==0) {
        $Toast({
          content: '请正确输入手机号',
          type: 'warning'
        });
      }else{
        that.setData({
          loadAll:true
        })
        var sex = that.data.userDetails.sex
        if(!sex){
          sex = 1
        }
        wx.request({
          url: app.globalData.url + 'sys/user/infoSaveBase',
          method: 'post',
          data: {
            __sid: app.globalData.__sid,
            __ajax: 'json',
            userName:that.data.userDetails.userName,
            mobile:that.data.phone,
            sex:sex,
            email:that.data.email
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success(res) {
            console.log(res)
            if (res.statusCode != 200) {
              $Toast({
                content: '修改失败',
                type: 'error'
              })
              return;
            }
            if (res.data.result == 'false') {
              $Toast({
                content: res.data.data.message,
                type: 'error'
              })
              return;
            }
            that.setData({
              loadAll:false
            })
            that.onLoad()
            $Toast({
              content:'修改成功',
              type:'success'
            })
          }
        })
      }

      }
  },
  toPage(e){
    wx.navigateTo({
      url: 'myTag',
    })
  }
})

