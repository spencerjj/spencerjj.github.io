
Component({
  options: {
    styleIsolation: 'apply-shared'
},
  //组件的对外属性，是属性名到属性设置的映射表
  properties: {
    startDate: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '请选择时间', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },
  //组件的数据
  data: {
    startDate: "",
    trueDate:'',
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],

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
  //组件的方法，包括(事件响应函数)和(任意的自定义方法)
  methods: {
    change: function (newVal, oldVal) {
      console.log('我从'+oldVal+'变成'+newVal)
    },
    pickerTap:function() {
      var date = new Date();
  
      var monthDay = ['今天','明天'];
      var hours = [];
      var minute = [];
      
      var currentHours = date.getHours();
      var currentMinute = date.getMinutes();
  
      // 月-日
      for (var i = 2; i <= 28; i++) {
        var date1 = new Date(date);
        date1.setDate(date.getDate() + i);
        var md = (date1.getMonth() + 1) + "-" + date1.getDate();
        monthDay.push(md);
      }
  
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
  
      if(data.multiIndex[0] === 0) {
        if(data.multiIndex[1] === 0) {
          this.loadData(hours, minute);
        } else {
          this.loadMinute(hours, minute);
        }
      } else {
        this.loadHoursMinute(hours, minute);
      }
  
      data.multiArray[0] = monthDay;
      data.multiArray[1] = hours;
      data.multiArray[2] = minute;
  
      this.setData(data);
    },
  
  
  
  
    bindMultiPickerColumnChange:function(e) {
      var date = new Date();
  
      var that = this;
  
      var monthDay = ['今天', '明天'];
      var hours = [];
      var minute = [];
  
      var currentHours = date.getHours();
      var currentMinute = date.getMinutes();
  
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      // 把选择的对应值赋值给 multiIndex
      data.multiIndex[e.detail.column] = e.detail.value;
  
      // 然后再判断当前改变的是哪一列,如果是第1列改变
      if (e.detail.column === 0) {
        // 如果第一列滚动到第一行
        if (e.detail.value === 0) {
  
          that.loadData(hours, minute);
          
        } else {
          that.loadHoursMinute(hours, minute);
        }
  
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
  
        // 如果是第2列改变
      } else if (e.detail.column === 1) {
  
        // 如果第一列为今天
        if (data.multiIndex[0] === 0) {
          if (e.detail.value === 0) {
            that.loadData(hours, minute);
          } else {
            that.loadMinute(hours, minute);
          }
          // 第一列不为今天
        } else {
          that.loadHoursMinute(hours, minute);
        }
        data.multiIndex[2] = 0;
  
        // 如果是第3列改变
      } else {
        // 如果第一列为'今天'
        if (data.multiIndex[0] === 0) {
  
          // 如果第一列为 '今天'并且第二列为当前时间
          if(data.multiIndex[1] === 0) {
            that.loadData(hours, minute);
          } else {
            that.loadMinute(hours, minute);
          }
        } else {
          that.loadHoursMinute(hours, minute);
        }
      }
      data.multiArray[1] = hours;
      data.multiArray[2] = minute;
      this.setData(data);
    },
  
    loadData: function (hours, minute) {
  
      var minuteIndex;
      var currentMinute;
      var currentHours = 0;
      if (currentMinute > 0 && currentMinute <= 10) {
        minuteIndex = 10;
      } else if (currentMinute > 10 && currentMinute <= 20) {
        minuteIndex = 20;
      } else if (currentMinute > 20 && currentMinute <= 30) {
        minuteIndex = 30;
      } else if (currentMinute > 30 && currentMinute <= 40) {
        minuteIndex = 40;
      } else if (currentMinute > 40 && currentMinute <= 50) {
        minuteIndex = 50;
      } else {
        minuteIndex = 60;
      }
  
      if (minuteIndex == 60) {
        // 时
        for (var i = currentHours + 1; i < 24; i++) {
          hours.push(i+'点');
        }
        // 分
        for (var i = 0; i < 60; i += 10) {
          minute.push(i+'分');
        }
      } else {
        // 时
        for (var i = currentHours; i < 24; i++) {
          hours.push(i+'点');
        }
        // 分
        for (var i = minuteIndex; i < 60; i += 10) {
          minute.push(i+'分');
        }
      }
    },
  
    loadHoursMinute: function (hours, minute){
      // 时
      for (var i = 0; i < 24; i++) {
        hours.push(i+'点');
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i+'分');
      }
    },
  
    loadMinute: function (hours, minute) {
      var minuteIndex;
      var currentMinute;
      var currentHours = 0;
      if (currentMinute > 0 && currentMinute <= 10) {
        minuteIndex = 10;
      } else if (currentMinute > 10 && currentMinute <= 20) {
        minuteIndex = 20;
      } else if (currentMinute > 20 && currentMinute <= 30) {
        minuteIndex = 30;
      } else if (currentMinute > 30 && currentMinute <= 40) {
        minuteIndex = 40;
      } else if (currentMinute > 40 && currentMinute <= 50) {
        minuteIndex = 50;
      } else {
        minuteIndex = 60;
      }
  
      if (minuteIndex == 60) {
        // 时
        for (var i = currentHours + 1; i < 24; i++) {
          hours.push(i+'点');
        }
      } else {
        // 时
        for (var i = currentHours; i < 24; i++) {
          hours.push(i+'点');
        }
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i+'分');
      }
    },
  
    bindStartMultiPickerChange: function (e) {
      var that = this;
      var date = new Date()
      var monthDay = that.data.multiArray[0][e.detail.value[0]];
      var hours = that.data.multiArray[1][e.detail.value[1]];
      var minute = that.data.multiArray[2][e.detail.value[2]];
  
      if (monthDay === "今天") {
        var year = date.getFullYear()
        var month = date.getMonth()+1;
        var day = date.getDate();
        var trueDate = year+'-'+month+'-'+day
        monthDay = month + "月" + day + "日";
      } else if (monthDay === "明天") {
        var date1 = new Date(date);
        date1.setDate(date.getDate() + 1);
        monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
        var year = date.getFullYear()
        var month = date.getMonth()+1;
        var day = date.getDate()+1;
        var trueDate = year+'-'+month+'-'+day
      } else {
        var year = date.getFullYear()
        var month = monthDay.split("-")[0]; // 返回月
        var day = monthDay.split("-")[1]; // 返回日
        var trueDate = year+'-'+month+'-'+day
        monthDay = month + "月" + day + "日";
      }
      
      hours = hours.slice(0,hours.length-1)<10?'0'+hours.slice(0,hours.length-1):hours.slice(0,hours.length-1)
      minute = minute.slice(0,minute.length-1)<10?'0'+minute.slice(0,minute.length-1):minute.slice(0,minute.length-1)
      trueDate =trueDate+' '+hours+':'+minute
      // console.log(trueDate)
      var startDate = monthDay + " " + hours + ":" + minute;
      var time = {
        startDate:startDate,
        trueDate:trueDate
      }
      that.triggerEvent('change', time);
      that.setData({
        startDate: startDate,
        trueDate:trueDate
      })
    }
  }
})