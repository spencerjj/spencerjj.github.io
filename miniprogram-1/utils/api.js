'use strict';

import Promise from '../libs/es6-promise.min'

const config = require('../config.js');
const MD5 = require('../libs/md5')
const _ = require('../libs/underscore')
const HOST_URI = config.HOST_URI;

var DEFAULT_REQUEST_HEADER = {
  _aid: config.EFITBOX_APP_ID,
  _sm: 'md5',
  _ch: config.CHANNEL_ID
};

const DEBUG = false;
/**
 * @function sign
 * @param  {Map}      params           参与请求签名的实体
 * @param  {Boolean}  isForceUserLogin 是否需要强制登陆
 */
function sign(params, security_type, isForceUserLogin) {
  var map = {
    'None': function(data, force) {
      return _.extend(data, {
        _sig: encrypt(data, config.APPEND_WORD)
      });
    },
    'RegisteredDevice': function(data, force) {
      var deviceInfo = wx.getStorageSync('deviceInfo');
      var deviceSecret = deviceInfo.deviceSecret;
      return _.extend(data, {
        _sig: encrypt(data, deviceSecret)
      });
    },
    'UserLogin': function(data, force) {
      var deviceInfo = wx.getStorageSync('deviceInfo');
      var deviceSecret = deviceInfo.deviceSecret;
      return _.extend(data, {
        _sig: encrypt(data, deviceSecret)
      });
    }
  };
  if (_.isFunction(map[security_type])) {
    // 过滤所有的undefined和null的数据
    _.each(params, function(value, key, list) {
      if (_.isUndefined(value) || _.isNull(value)) {
        delete params[key];
      }
    });
    // 将参数附加上必须要传递的标记
    var required = _.extend(params, DEFAULT_REQUEST_HEADER);
    var deviceInfo = wx.getStorageSync('deviceInfo');
    if (deviceInfo && deviceInfo.deviceId) {
      required = _.extend(required, {
        _did: deviceInfo.deviceId,
        _dtk: deviceInfo.deviceToken
      });
    }
    var token = wx.getStorageSync('token');
    if (token) {
      required = _.extend(required, {
        _tk: token
      });
    }
    // 做加密生产_sig对象
    var _sig = map[security_type].call(this, required, isForceUserLogin);
    // 返回数据可以直接做请求
    return _.extend(required, _sig);
  } else {
    return params;
  }
}

/**
 * @function encrypt
 * @param  {Map}    params      需要加密的参数
 * @param  {String} appendWord  加言
 */
function encrypt(params, appendWord) {
  var arr = [];

  // 将Map变成Array，使用key=value的方式进行拼接
  _.each(params, function(value, key) {
    arr.push(key + '=' + value);
  });

  // 以ascii进行排序
  arr.sort();

  // 将队列拼接成String
  var str = arr.join('');
  str = str + appendWord;
  // 做md5加密
  return MD5.md5(str);
}

//URL参数编码
function obj2uri(obj) {
  return Object.keys(obj).map(function(k) {
    return k + '=' + encodeURIComponent(obj[k]);
  }).join('&');
}

//获取带验签的参数字符串
function getSignParams(params, security_type, isForceUserLogin) {
  return sign(params, security_type, isForceUserLogin);
}

/**
 * 发送get 请求
 * @param method 请求方法
 * @param param 参数，可选
 * @param showLog 是否打印日志
 * @param showLoading 是否显示加载框
 * @param showError 是否显示错误框
 * @returns {Promise}
 */
export function getRequest(host = HOST_URI, method, paramsLocation,params = {}, security_type, isForceUserLogin, showLog = false, showLoading = true, showError = true) {
  return request('GET', host, method, paramsLocation, params, security_type, isForceUserLogin, showLog, showLoading, showError);
}

/**
 * 发送POST请求
 * @param method 请求方法
 * @param param 参数，可选
 * @param showLog 是否打印日志
 * @param showLoading 是否显示加载框
 * @param showError 是否显示错误框
 * @returns {Promise}
 */
export function postRequest(host = HOST_URI, method, paramsLocation,params = {}, security_type, isForceUserLogin, showLog = false, showLoading = true, showError = true) {
  return request('POST', host, method, paramsLocation,params, security_type, isForceUserLogin, showLog, showLoading, showError);
}

/**
 * 接口请求基类方法
 * @param method 请求方法
 * @param relativeUrl 相对路径
 * @param param 参数，可选
 * @param showLog 是否打印日志
 * @param showLoading 是否显示加载框
 * @param showError 是否显示错误框
 * @returns {Promise}
 */
function request(requestMethod, host, path, paramsLocation, params, security_type, isForceUserLogin, showLog, showLoading, showError) {
  // var data = getSignParams(params, security_type, isForceUserLogin)
  var formData = '';
  if ('url' == paramsLocation){
    var formData = obj2uri(params);
    path = path + '?' + formData;
  } else if ('body' == paramsLocation){
    var formData = params;
  }
  //console.log(formData);

  if (showLoading) wx.showLoading({
    title: '加载中',
  });
  if (DEBUG && showLog) {
    console.log('方法:', requestMethod);
    console.log('接口:', path);
    console.log("参数:", params);
  }

  var token = wx.getStorageSync('token');
  var header = { 'content-type': 'application/json' }
  if (token) {
    header['Authorization'] = 'Bearer ' + token
  }

  // if (requestMethod == 'GET') {
  //   path = path + '?' + formData;
  // }
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + path,
      method: requestMethod,
      header: header,
      data: formData,
      success: function(res) {
        if (DEBUG) console.log("服务器返回数据：", res.data);
        if (showLoading) wx.hideLoading();
        var code = res.data.result;
        console.log(code == 'true'||code=='login')
        if (code == 'true'||code=='login') {
          resolve(res.data);
        } 
        // else if (code == 'login') {
          // token过期，重新登录
          // getApp().login(code);
        // }
         else {
          console.log(res)
          console.log("请求失败：", res.data.message);
          reject(res.data);
          // if (showError) wx.showToast({
          //   title: res.data.returnMsg,
          //   duration: 2000,
          //   image: '/resources/images/00-8.png'
          // });
        }
      },
      fail: function(res) {
        if (showLoading) wx.hideLoading();
        //reject(res);
        wx.showToast({
          title: '连接服务器失败',
          duration: 2000,
          image: '/images/00-8.png'
        });
        console.error("连接服务器失败：", res);
      },
      complete: function(res) {}
    })
  });
}

/**
 * 上传文件
 * todo【注意】请确认上传路径
 * @param resPath 文件路径
 * @param showLoading 是否显示加载框
 * @returns {Promise}
 */
export function upload(resPath, showLoading = true) {
  if (showLoading) wx.showLoading({
    title: '资源上传中',
  });
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: rootUrl + "/user/upload",
      filePath: resPath,
      name: 'file',
      success(res) {
        console.log(res);
        let data = JSON.parse(res.data);
        if (data.status && data.status.succeed == 1) {
          let voiceUrl = data.data.link;
          resolve(voiceUrl);
        } else {
          reject(res.data);
        }
      },
      fail(error) {
        reject(error);
      },
      complete() {
        if (showLoading) wx.hideLoading();
      }
    });
  });
}

module.exports = {
  //获取host
  getApiHost: function() {
    return config.HOST_URI;
  },
  request: request,
  //发送GET请求
  getRequest: getRequest,
  //发送POST请求
  postRequest: postRequest
};