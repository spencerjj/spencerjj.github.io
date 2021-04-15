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
    user:"",
    birthday:'',
    name:'',
    email:'',
    phone:'',
    bchange:false,
    echange:false,
    nchange:false,
    lchange:false,
    gchange:false,
    index:11,
    array:['先生','女士'],
    index1:0,
    array1:['请选择','旅游','运动','阅读','购物','写作','看电影','美食','听音乐']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var phoneNo = wx.getStorageSync('phoneNo') || ''
    if(phoneNo.length>1){
      that.getInfo()
    }else{
      Toast({
        message: '登录失效，请重新授权登录',
        type: 'warning'
      });
      setTimeout(()=>{
        wx.redirectTo({
          url: 'index'
        })
      },1000)
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
  getInfo(e){
    var that = this;
    var data = {
      phone: wx.getStorageSync('phoneNo')
    }
    getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPQueryMemberAllInfo', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        that.setData({
          user:res
        })
        if(res.gender=='女士'){
          that.setData({
            index:1
          })
        }else{
          that.setData({
            index:0
          })
        }
        let temp = 0
        if(res.parameter4){
          for(let x in that.data.array1){
            if(that.data.array1[x]==res.parameter4){
              temp = x
            }
          }
          that.setData({
            index1:temp
          })
        }
        if(res.name){
          that.setData({
            name:res.name
          })
        }
        if(res.email){
          that.setData({
            email:res.email
          })
        }
        if(res.phone){
          that.setData({
            phone:res.phone
          })
        }
        if(res.birthday){
          that.setData({
            birthday:res.birthday
          })
        }
      }
    ).catch(res => {
      Toast({
        message: '系统错误，请联系管理员',
        type: 'warning'
      });
    });
  },
  change(e){
    wx.navigateTo({
      url: 'change',
    })
  },
  bindDateChange: function(e) {
    this.setData({
      birthday: e.detail.value,
      bchange:true
    })
  },
  bindGenderChange(e){
    this.setData({
      index:e.detail.value,
      gchange:true
    })
  },
  bindLikeChange(e){
    this.setData({
      index1:e.detail.value,
      lchange:true
    })
  },
  nameInput(e){
    this.setData({
      name:e.detail.value,
      nchange:true
    })
  },
  emailInput(e){
    this.setData({
      email:e.detail.value,
      echange:true
    })
  },
  save(e){
    var data = {}
    var that = this
    var mark = 0
    data.phone = that.data.phone
    data.ajax = '_json'
    if(that.data.birthday.length>0){
      data.parameter2 = that.data.birthday
    }else{
      Toast({
        message: '请填写生日',
        type: 'warning'
      });
      return;
    }
    if(that.data.index!=11){
      data.gender = that.data.array[that.data.index]
    }
    if(that.data.index1!=11&&that.data.index1!=0){
      data.parameter3 = that.data.array1[that.data.index1]
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
    if(that.data.email.length>0){
      if((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(that.data.email)){
        data.email = that.data.email
      }else{
        Toast({
          message: '邮箱号错误',
          type: 'warning'
        });
        return;
      }
    }
    if(that.data.bchange||that.data.echange||that.data.nchange||that.data.lchange||that.data.gchange){
      getRequest(getApiHost(), 'platform/v1/api/lampocrm/LPUpdateMemberInfo', 'body', data, 0, false, true).then(
        res => {
          console.log(res)
          if(res.status==0){
            Toast({
              message: res.msg,
              type: 'success'
            })
          }else{
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
  }
})

