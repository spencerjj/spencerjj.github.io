Component({
  // options: {
  //   styleIsolation: 'apply-shared'
  // },
  //组件的对外属性，是属性名到属性设置的映射表
  properties: {
    showPop: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal) {
        let that = this
        console.log(newVal)
        
        if(!newVal){
          setTimeout(()=>{
            that.setData({
              ifShow:newVal
            })
          },500)
        }else{
        that.setData({
          ifShow:newVal
        })
      }
      }
		},
		type:{
			type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "", 
		}
  },
  data: {
    ifShow:false,
		floor:[
			{choose:true,type:"0", name:"全部",id:"0",},
			{choose:false,type:"0", name:"1F美妆精品馆",id:"1"},
			{choose:false,type:"0", name:"2F鞋履珠宝馆",id:"2"},
			{choose:false,type:"0", name:"3F时尚女装馆",id:"3"},
			{choose:false,type:"0", name:"4F少淑女装馆",id:"4"},
			{choose:false,type:"0", name:"5F休闲运动馆",id:"5"},
			{choose:false,type:"0", name:"6F商务男装馆",id:"6"},
			{choose:false,type:"0", name:"7F家居儿童馆",id:"7"},
			{choose:false,type:"0", name:"8F儿童/游玩馆",id:"8"},
			{choose:false,type:"0", name:"9F半山食集",id:"9"},
			{choose:false,type:"1", name1:"10F",name2:"半山·寻味街", id:"10"},
			{choose:false,type:"1", name1:"10F",name2:"半山·食尚汇", id:"11"},
			{choose:false,type:"1", name1:"12F-13F",name2:"中影电影院", id:"12"},
			{choose:false,type:"1", name1:"14F",name2:"半山书局·生活", id:"13"},
			{choose:false,type:"1", name1:"15F",name2:"半山书局·人文", id:"14"},
			{choose:false,type:"1", name1:"16F",name2:"半山书局·美学", id:"15"},
			{choose:false,type:"0", name:"-1F",id:"16"},
		],
		major:[
			{choose:true,name:"全部",id:"0"},
			{choose:false,name:"珠宝",id:"1"},
			{choose:false,name:"腕表",id:"2"},
			{choose:false,name:"国际名品",id:"3"},
			{choose:false,name:"配饰",id:"4"},
			{choose:false,name:"鞋履",id:"5"},
			{choose:false,name:"美妆护肤",id:"6"},
			{choose:false,name:"时尚服饰",id:"7"},
			{choose:false,name:"内衣",id:"8"},
			{choose:false,name:"儿童",id:"9"},
			{choose:false,name:"运动",id:"10"},
			{choose:false,name:"床品家居",id:"11"},
			{choose:false,name:"餐饮美食",id:"12"},
			{choose:false,name:"超市",id:"13"},
			{choose:false,name:"影院",id:"14"},
			{choose:false,name:"休闲体验",id:"15"},
			{choose:false,name:"其他",id:"16"},
    ]
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
    onPreventTouchMove(){},
    onFloor(e){
      let that = this
      let i = e.currentTarget.dataset.index
      let arr = this.data.floor
      arr[i].choose = !arr[i].choose

      // if(i!=0){
      //   await that.ifAll(i).then(res=>{arr[0].choose = res})
      // }
      this.setData({
        floor:arr
      })
      // let all = 0
      // let allsel = false
      // arr.forEach(item=>{
      //   if (item.choose&&!arr[0].choose){
      //     all++
      //   }
      //   if (all===15){
      //     arr[0].choose = true
      //     allsel = true
      //     console.log(arr)
      //     that.setData({
      //       floor:arr
      //     })
      //   }else{
      //     allsel = false
      //   }
      // })

      // arr.forEach((item,index)=>{
      //   if (button.id==='0'){
      //     if (arr[0].choose){
      //       arr[0].choose = false
      //     }else{
      //       this.unAll()
      //     }
      //     return
      //   }
      //   if(button.id!=0&&!allsel){
      //     arr[0].choose = false
      //   }
      //   if (item.id===button.id){
      //     arr[index].choose = !arr[index].choose
      //   } 
      //   if (all===17&&button.id!=='0'&&item.id===button.id){
      //     arr[index].choose = !arr[index].choose
      //   }
      // })
    },
    // ifAll(i){
    //   let that = this
    //   return new Promise((resolve,reject)=>{
    //     let arr = that.data.floor
    //     console.log(arr.shift)
    //     let isall = false
    //       arr.forEach((item,index)=>{
    //         if(item.choose){
    //           isall = true
    //         }else{
    //           isall = false
    //           resolve(isall)
    //         }
    //       })
    //   })
    // },
    unAll(){
      let arr = this.data.floor
      arr.forEach((item,index)=>{
        if (index===0){
          arr[0].choose = true
        }else{
          arr[index].choose = false
        }
      })
      this.setData({
        floor:arr
      })
    },
    onChooseitem(){
      let arr = []
      if(this.data.type=='floor'){
        this.data.floor.forEach(e=>{
          if (e.choose){
            arr.push(e.id)
          }
        })
      }else{
        this.data.major.forEach(e=>{
          if (e.choose){
            arr.push(e.id)
          }
        })
      }
      this.setData({
        showPop:false
      })
      this.triggerEvent('callback',arr)
    },
    onMajor(e){
      let that = this
      let i = e.currentTarget.dataset.index
      let arr = this.data.major
      arr[i].choose = !arr[i].choose
      this.setData({
        major:arr
      })
      // let all = 0
      // let allsel = false
      // arr.forEach(item=>{
      //   if (item.choose&&!arr[0].choose){
      //     all++
      //   }
      //   if (all===15){
      //     arr[0].choose = true
      //     allsel = true
      //     that.setData({
      //       major:arr
      //     })
      //   }else{
      //     allsel = false
      //   }
      // })
      // this.setData({
      //   major:arr
      // })
      // arr.forEach((item,index)=>{
      //   if (button.id==='0'){
      //     if (arr[0].choose){
      //       arr[0].choose = false
      //     }else{
      //       this.unMajorAll()
      //     }
      //     return
      //   }
      //   if(button.id!=0&&!allsel){
      //     arr[0].choose = false
      //   }
      //   if (item.id===button.id){
      //     arr[index].choose = !arr[index].choose
      //   } 
      //   if (all===17&&button.id!=='0'&&item.id===button.id){
      //     arr[index].choose = !arr[index].choose
      //   }
      // })
    },
    unMajorAll(){
      let arr = this.data.major
      arr.forEach((item,index)=>{
        if (index===0){
          arr[0].choose = true
        }else{
          arr[index].choose = false
        }
      })
      this.setData({
        major:arr
      })
    },
  }
})