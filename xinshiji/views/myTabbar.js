var app = getApp();
var QRCode = require('../utils/code.js')
var oricode = require('../utils/qrcode.js')
import {barcode} from '../utils/index.js'
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  //组件的对外属性，是属性名到属性设置的映射表
  properties: {
    show: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    nowIndex:{
      type:String,
      value:0
    }
  },
  //组件的数据
  data: {
    ifRun:false
  }, // 私有数据，可用于模版渲染
  relations: {}, //组件间关系定义
  externalClass: [], //组件接受的外部样式类
  //一些选项
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created: function () {}, //在组件实例刚刚被创建时执行，注意此时不能调用 setData
    attached: function () {}, //在组件实例进入页面节点树时执行
    ready: function () {
      let weInfo = wx.getStorageSync('weInfo')
      console.log(weInfo)
      if(weInfo){
        this.setData({
          ifShow:false
        })
      }else{
        this.setData({
          ifShow:true
        })
      }
    }, //在组件布局完成后执行
    moved: function () {}, //在组件实例被移动到节点树另一个位置时执行
    detached: function () {}, //在组件实例被从页面节点树移除时执行
    error: function () {
      // 页面被展示
    },
    show: function () {
      
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    created: function () {

    }, //在组件实例刚刚被创建时执行，注意此时不能调用 setData
    attached: function () {}, //在组件实例进入页面节点树时执行
    ready: function () {}, //在组件布局完成后执行
    moved: function () {}, //在组件实例被移动到节点树另一个位置时执行
    detached: function () {}, //在组件实例被从页面节点树移除时执行
    error: function () {
      // 页面被展示
    },
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  //组件的方法，包括(事件响应函数)和(任意的自定义方法)
  methods: {
    run(){
      console.log(this.data.ifRun)
      this.setData({
        ifRun:!this.data.ifRun
      })
    },
    toPage(e){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },
    onPreventTouchMove(){
      console.log(123)
      
      }
  }
})