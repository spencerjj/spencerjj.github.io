Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  //组件的对外属性，是属性名到属性设置的映射表
  properties: {
    color: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 'rgba(0,0,0,.1)', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(a,b){
        console.log(a+b)
      }
    },
  },
  //组件的数据
  data: {
    temp:''
  }, // 私有数据，可用于模版渲染
  relations: {}, //组件间关系定义
  externalClass: [], //组件接受的外部样式类
  //一些选项
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    created: function () {
      
    }, //在组件实例刚刚被创建时执行，注意此时不能调用 setData
    attached: function () {}, //在组件实例进入页面节点树时执行
    ready: function () {
      this.drowsyUserInfo()
    }, //在组件布局完成后执行
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
    ready: function () {
    }, //在组件布局完成后执行
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
          // 添加水印
          drowsyUserInfo () {
            var that= this
            // var userInfo = wx.getStorageSync('userInfo');
            // var name_xx = userInfo.username || userInfo.nickName;
            var ctx = wx.createCanvasContext("myCanvas1",that);
         
            ctx.rotate(45 * Math.PI / 180);//设置文字的旋转角度，角度为45°；
         
            //对斜对角线以左部分进行文字的填充
            for (let j = 1; j < 10; j++) { //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
              ctx.beginPath();
              ctx.setFontSize(15);
              ctx.setFillStyle(this.data.color);
         
              ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, 50 * j);
              for (let i = 1; i < 10; i++) {//这个for循环代表横向循环，
                ctx.beginPath();
                ctx.setFontSize(15);
                ctx.setFillStyle(this.data.color);
                ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, 100 * j);
              }
            }//两个for循环的配合，使得文字充满斜对角线的左下部分
         
            //对斜对角线以右部分进行文字的填充逻辑同上
            for (let j = 0; j < 10; j++) {
              ctx.beginPath();
              ctx.setFontSize(15);
              ctx.setFillStyle(this.data.color);
         
              ctx.fillText(wx.getStorageSync('chartsUser').userName, 0, -50 * j);
              for (let i = 1; i < 10; i++) {
                ctx.beginPath();
                ctx.setFontSize(15);
                ctx.setFillStyle(this.data.color);
                ctx.fillText(wx.getStorageSync('chartsUser').userName, 100 * i, -100 * j);
              }
            }

          ctx.draw(true, function () {
            console.log('draw')
              wx.canvasToTempFilePath({
                canvasId: 'myCanvas1',
                success: function (res) {
                  console.log(res.tempFilePath)
                  that.setData({
                    temp:res.tempFilePath
                  })
                },
                fail(e){
                  console.log(e)
                }
              },that)
          })
        }
  }
})