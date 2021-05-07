Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  //组件的对外属性，是属性名到属性设置的映射表
  properties: {
    tips: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '警告', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },
  //组件的数据
  data: {
    // 省份简写
    provinces: [
      ['京', '沪', '粤', '津', '冀', '晋', '蒙', '辽', '吉', '黑'],
      ['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘'],
      ['桂', '琼', '渝', '川', '贵', '云', '藏'],
      ['陕', '甘', '青', '宁', '新'],
    ],
    // 车牌输入
    numbers: [
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"],
      ["L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"],
      ["W", "X", "Y", "Z", "港", "澳", "学"]
    ],
    carnum: [],
    showNewPower: false,
    KeyboardState: true

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
    bindChoose(e) {
      if (!this.data.carnum[6] || this.data.showNewPower) {
        var arr = [];
        arr[0] = e.target.dataset.val;
        this.data.carnum = this.data.carnum.concat(arr)
        this.setData({
          carnum: this.data.carnum
        })
      }
    },
    bindDelChoose() {
      if (this.data.carnum.length != 0) {
        this.data.carnum.splice(this.data.carnum.length - 1, 1);
        this.setData({
          carnum: this.data.carnum
        })
      }
    },
    showPowerBtn() {
      this.setData({
        showNewPower: true,
        KeyboardState: true
      })
    },
    closeKeyboard() {
      this.setData({
        KeyboardState: false
      })
    },
    openKeyboard() {
      this.setData({
        KeyboardState: true
      })
    },
    // 提交车牌号码
    submitNumber() {
      if (this.data.carnum[6]) {
        // 跳转到tabbar页面
      }
    }  
  }
})