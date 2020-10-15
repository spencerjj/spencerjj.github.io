// pages/index/check.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[

    ],
    codeLists:[
      {
        name:'西服染色',
        code:'XF123321'
      },
      {
        name:'西服熨烫',
        code:'XF123321'
      },
      {
        name:'西服贴标',
        code:'XF123321'
      },
      {
        name:'西服拷边',
        code:'XF123321'
      },
      {
        name:'西服染色',
        code:'XF123321'
      },
      {
        name:'西服熨烫',
        code:'XF123321'
      },
      {
        name:'西服贴标',
        code:'XF123321'
      },
      {
        name:'西服拷边',
        code:'XF123321'
      }
    ],
    actions: [
      {
          name: '确认提交',
          color:'#2d8cf0',
          loading:false
      }
    ],
    visibility:false,
    visible:false,
    sonvisibility:false,
    everyNum:1,
    keywords:'',
    keycode:'',
    keyname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showDrawer(e){
    this.setData({
      visibility:!this.data.visibility,
      keywords:'',
      keycode:'',
      keyname:'',
      everyNum:1
    })
  },
  handleChange ({ detail }) {
    var point1 = detail.value
    console.log(point1)
    this.setData({
      everyNum:point1
    })
  },
  selectItem(e){
    this.setData({
      sonvisibility:false,
      keywords:e.currentTarget.dataset.name+'('+e.currentTarget.dataset.code+')',
      keyname:e.currentTarget.dataset.name,
      keycode:e.currentTarget.dataset.code
    })
  },
  checkInput(e){
    console.log(e.detail.value)
    if(e.detail.value.length<1){
      this.setData({
        sonvisibility:false
      })
    }else{
      this.setData({
        sonvisibility:true,
        keywords:e.detail.value
      })
    }
  },
  confirm(e){
    console.log(123)
    this.setData({
      sonvisibility:false
    })
  },
  addOne(e){
    if(this.data.keywords.length>0){
      var list = {
        name:this.data.keyname,
        code:this.data.keycode,
        count:this.data.everyNum,
      }
      var lists= this.data.lists
      lists.push(list)
      this.setData({
        lists:lists
      })
    }
    this.setData({
      visibility:false,
      sonvisibility:false
    })
  },
  delete(e){
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var lists = this.data.lists
    lists.splice(index,1);
    this.setData({
      lists:lists
    }) 
  },
  handleCancel() {
    this.setData({
        visible: false
    });
  },
  handleOpen() {
    this.setData({
        visible: true
    });
  },
  handleClickItem({
    detail
  }){
    var that = this
    const index = detail.index + 1;
    if (index == 1) {
      const action = [...this.data.actions];
      action[0].loading = true;
      this.setData({
        actions: action
      });
      setTimeout(()=>{
        wx.redirectTo({
          url: 'success',
        })
      },1000)
    }
  }
})