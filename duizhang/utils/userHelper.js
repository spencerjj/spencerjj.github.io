const config = require('../config.js');
var Api = require('../utils/api');
const K_TOKEN = "token";
const K_USERINFO = "userInfo";

export default {
  _userInfo: null,
  _token: "",

  isLogin() {
    if(!this._token || this._token === "") {
      this._token = wx.getStorageSync(K_TOKEN);
    }

    if (!this._token || this._token === "") {
      return false;
    }
    return true;
  },

  /**
   * 获取本地用户信息
   */
  userInfo() {
    this._userInfo = wx.getStorageSync(K_USERINFO);  

    if (this._userInfo && this._userInfo.nickname) {
      return this._userInfo;
    } else {
      return null;
    }
  },

  saveUserInfo(){
    wx.setStorageSync(K_USERINFO, this._userInfo);
  },
}