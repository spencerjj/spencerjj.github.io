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
    user: "",
    birthday: '',
    name: '',
    email: '',
    phone: '',
    bchange: false,
    echange: false,
    nchange: false,
    lchange: false,
    gchange: false,
    iflike:false,
    ifedu:false,
    ifjob:false,
    ifre:false,
    ifemail:false,
    index: 11,
    array: ['先生', '女士'],
    index1: 0,
    array1: ['请选择', '旅游', '运动', '阅读', '购物', '写作', '看电影', '美食', '听音乐'],
    index2: 11,
    array2: ['公务员', '企业高层', '企业中层管理人员', '公司职员', '私营业主', '专业人士', '自由职业者', '其他'],
    index3: 11,
    array3: ['保密', '已婚', '单身', '离异', '丧偶', '恋爱', '其他'],
    index4: 11,
    array4: ['未定义', '大专以下', '本科', '研究生或以上'],
    region: [],
    regionCode:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if (phoneNo.length > 1) {
      that.getInfo()
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
      phone: wx.getStorageSync('phoneNo')
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberAllInfo', 'body', data, 0, false, true).then(
      res => {
        console.log(res)

        if (res.gender == '女士') {
          that.setData({
            index: 1
          })
        } else {
          that.setData({
            index: 0
          })
        }
        let temp = 0
        if (res.parameter4) {
          for (let x in that.data.array1) {
            if (that.data.array1[x] == res.parameter4) {
              temp = x
            }
          }
          that.setData({
            index1: temp,
            iflike:true
          })
        }
        let temp1 = 0
        if (res.educationalLevel) {
          for (let x in that.data.array4) {
            if (that.data.array4[x] == res.educationalLevel) {
              temp1 = x
            }
          }
          that.setData({
            index4: temp1,
            ifedu:true
          })
        }
        let temp2 = 0
        if (res.job) {
          for (let x in that.data.array2) {
            if (that.data.array2[x] == res.job) {
              temp2 = x
            }
          }
          that.setData({
            index2: temp2,
            ifjob:true
          })
        }
        if(res.city){
          let region = [res.city,res.parameter1]
          console.log(region)
          that.setData({
            region,
            ifre:true
          })
        }
        if (res.name) {
          that.setData({
            name: res.name
          })
        }
        if (res.email) {
          that.setData({
            email: res.email,
            ifemail:true
          })
        }
        if (res.phone) {
          that.setData({
            phone: res.phone
          })
        }
        if (res.birthday) {
          that.setData({
            birthday: res.birthday
          })
        }
        that.setData({
          user: res
        })
      }
    ).catch(res => {
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  change(e) {
    wx.navigateTo({
      url: 'change',
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value,
      bchange: true
    })
  },
  bindGenderChange(e) {
    this.setData({
      index: e.detail.value,
      gchange: true
    })
  },
  bindLikeChange(e) {
    this.setData({
      index1: e.detail.value,
      lchange: true
    })
  },
  bindJobChange(e) {
    this.setData({
      index2: e.detail.value,
    })
  },
  bindEduChange(e) {
    this.setData({
      index4: e.detail.value,
    })
  },
  bindMarryChange(e) {
    this.setData({
      index3: e.detail.value,
    })
  },
  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value,
      regionCode:e.detail.code
    })
  },
  nameInput(e) {
    this.setData({
      name: e.detail.value,
      nchange: true
    })
  },
  emailInput(e) {
    this.setData({
      email: e.detail.value,
      echange: true
    })
  },
  save(e) {
    var data = {}
    var that = this
    var mark = 0
    data.phone = that.data.phone
    data.ajax = '_json'
    if (that.data.birthday.length > 0) {
      data.parameter2 = that.data.birthday
    } else {
      Toast({
        message: '请填写生日',
        type: 'warning'
      });
      return;
    }
    if (that.data.index != 11) {
      data.gender = that.data.array[that.data.index]
    }
    if(that.data.name.length>0){
      data.name = that.data.name
    }else{
        Toast({
          message: '姓名错误',
          type: 'warning'
        });
        return;
    }
    if (that.data.index1 != 11 && that.data.index1 != 0) {
      data.parameter3 = that.data.array1[that.data.index1]
    } else {
      Toast({
        message: '请选择爱好',
        type: 'warning'
      });
      return;
    }
    if (that.data.regionCode.length>1) {
      data.parameter1 = that.data.regionCode[2]
      data.province = that.data.regionCode[0]
      data.city = that.data.regionCode[1]
    } else {
      Toast({
        message: '请选择地区',
        type: 'warning'
      });
      return;
    }
    if (that.data.index2 != 11) {
      data.job = that.data.array2[that.data.index2]
    } else {
      Toast({
        message: '请选择职业',
        type: 'warning'
      });
      return;
    }
    if (that.data.index4 != 11) {
      data.educationalLevel = that.data.array4[that.data.index4]
    } else {
      Toast({
        message: '请选择教育程度',
        type: 'warning'
      });
      return;
    }
    // if (that.data.index3 != 11) {
    //   data.parameter3 = that.data.array1[that.data.index1]
    // } else {
    //   Toast({
    //     message: '请选择婚姻状况',
    //     type: 'warning'
    //   });
    //   return;
    // }
    if (that.data.email.length > 0) {
      if ((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(that.data.email)) {
        data.email = that.data.email
      } else {
        Toast({
          message: '邮箱号错误',
          type: 'warning'
        });
        return;
      }
    }
    console.log(data)
      getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPUpdateMemberInfo', 'body', data, 0, false, true).then(
        res => {
          console.log(res)
          if (res.status == 0) {
            Toast({
              message: res.msg,
              type: 'success'
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 500)
          } else {
            Toast({
              message: res.msg,
              type: 'warning'
            })
          }

        }
      ).catch(res => {
        Toast({
          message: '系统错误，请联系管理员',
          type: 'warning'
        });
      });
  }
})