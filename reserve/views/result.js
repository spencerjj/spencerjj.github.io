Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  //组件的对外属性，是属性名到属性设置的映射表
  properties: {
    name: {
      type: String,
      value: '半山书局',
    },
    address: {
      type: String,
      value: '常州市 钟楼区 新世纪半山书局',
    },
    mydate: {
      type: String,
      value: '2021-01-01',
    },
    myqua: {
      type: String,
      value: '00:00-00:00',
    },
    number:{
      type:Number,
      value:1
    }
  },
  //组件的数据
  data: {
    show:true
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
    close(e){
      this.triggerEvent('close')
    },
    check(e){
      this.triggerEvent('check')
    },
    convert2TecentMap(lng, lat) {
      if (lng == '' && lat == '') {
        return {
          lng: '',
          lat: ''
        }
      }
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0
      var x = lng - 0.0065
      var y = lat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
      var qqlng = z * Math.cos(theta)
      var qqlat = z * Math.sin(theta)
      return {
        lng: qqlng,
        lat: qqlat
      }
    }
  }
})