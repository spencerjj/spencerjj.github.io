//app.js
const config = require('config.js');
const HOST_URI = config.HOST_URI;
import {
  getApiHost,
  postRequest,
  getRequest
} from 'utils/api.js'
App({
  onLaunch: function () {

  },
  onHide(e){

  },
  globalData: {
    userInfo: null,
    url: HOST_URI
  },

  doLogin(e) {


  }
})