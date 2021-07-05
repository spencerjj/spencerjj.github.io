import {
  getApiHost,
  postRequest,
  getRequest
} from '../../utils/api.js'
var app = getApp();
import {
  doLogin
} from '../../utils/login.js'
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
    sex: '先生',
    region: [],
    regionCode: [],
    id: '',
    address: '',
    hasBir: false,
    hasCard: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.ifUser().then((data) => {
      console.log(data)
      let region = [data.province, data.city, data.area]
      let hasBir = false
      let hasCard = false
      if (data.birthDate) {
        hasBir = true
      }
      if (data.cardNum) {
        hasCard = true
      }
      that.setData({
        region,
        userInfo: data,
        cardNum: data.cardNum,
        id: data.cardNum,
        sex: data.sex || '先生',
        address: data.address,
        name: data.name,
        birthday: data.birthDate || '',
        hasBir,
        hasCard
      })
    }).then()
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
  onShareAppMessage: function(res) {

  },
  onShareTimeline: function () {
		return {
	      title: '',
	      query: {
	        key: value
	      },
	      imageUrl: ''
	    }
	},
  nameInput(e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value,
    })
  },
  idInput(e) {
    console.log(e.detail.value)
    this.setData({
      id: e.detail.value,
    })
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      birthday: e.detail.value,
    })
  },
  addressInput(e) {
    console.log(e.detail.value)
    this.setData({
      address: e.detail.value,
    })
  },
  sexChange(e) {
    this.setData({
      sex: e.currentTarget.dataset.sex
    })
  },
  bindRegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value,
      regionCode: e.detail.code
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
    let ifCard = false
    let ifBir = false
    data.ajax = '_json'
    if (that.data.name.length > 0) {
      data.name = that.data.name
    } else {
      Toast({
        message: '请填写姓名',
        type: 'warning'
      });
      return;
    }
    if (!that.data.hasCard&&that.data.id.length >0) {
      if (that.data.id.length==18) {
        data.parameter1 = that.data.id
        ifCard = true
      } else {
        Toast({
          message: '请正确填写身份证号',
          type: 'warning'
        });
        return;
      }
    }
    if (!that.data.hasBir) {
      if (that.data.birthday.length > 0) {
        data.birthDate = that.data.birthday
        ifBir = true
      } else {
        Toast({
          message: '请填写生日',
          type: 'warning'
        });
        return;
      }
    }

    data.province = that.data.region[0]
    data.city = that.data.region[1]
    data.area = that.data.region[2]
    data.address = that.data.address
    data.memNum = that.data.userInfo.memNum
    data.sex = that.data.sex
    data.channel = '微会员'
    console.log(data)
    getRequest(getApiHost(), 'customer/bh/api/crm/wechatMemberUpdate', 'body', data, 0, false, true).then(
      res => {
        console.log(res)
        if (res.code == 'SEL_000') {
          if(ifCard){
            that.setData({
              hasCard:true
            })
          }
          if(ifBir){
            that.setData({
              hasBir:true
            })
          }
          doLogin(that.data.userInfo.phone).then((res) => {
            Toast({
              message: '修改成功',
              type: 'success'
            })
          })
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