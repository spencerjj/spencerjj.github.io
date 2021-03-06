import Dialog from '../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';
var app = getApp()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  //组件的对外属性，是属性名到属性设置的映射表
  properties: {
    lists:{
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [],
    }
  },
  //组件的数据
  data: {
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
    itemTab(e){
      let index = e.currentTarget.dataset.index
      let id = this.data.lists[index].id
      let title = this.data.lists[index].title
      let array = []
      array.id = id
      array.title = title
      array.event = this.data.lists[index].whyEventTimeList
      app.globalData.eventDetail = array
      wx.navigateTo({
        url: 'reportDetail'
      })
    },
    know(e){
      let array = []
      let index = e.currentTarget.dataset.index
      array.title = this.data.lists[index].title
      array.remarks = this.data.lists[index].remarks
      array.fileUrl = this.data.lists[index].fileUrl
      array.time = this.data.lists[index].actTime
      this.triggerEvent("show",array)
    }
  }
})