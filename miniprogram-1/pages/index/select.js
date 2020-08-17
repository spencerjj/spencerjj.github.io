var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: '',
    storeList: [
      {
        storeName:'百货',
        camNum:10
      },
      {
        storeName:'蓝豹',
        camNum:8
      },
      {
        storeName:'新世纪',
        camNum:1
      },
    ],
    // goodsList:[
    //   {
    //     goodsName:'包包',
    //     goodsNum:10
    //   },
    //   {
    //     goodsName:'衣服',
    //     goodsNum:20
    //   }
    // ],
    typeList:[
      {
        typeName:'品牌方',
        typeNum:5
      },
      {
        typeName:'财务',
        typeNum:8
      },
      {
        typeName:'收银',
        typeNum:18
      }
    ],
    storeShow:false,
    goodsShow:false,
    typeShow:false,
    steps: [
      {
        text: '物流1',
        desc: '2019-1-1 12:40',
      },
      {
        text: '物流2',
        desc: '2019-1-1 12:40',
      },
      {
        text: '物流3',
        desc: '2019-1-1 12:40',
      },
      {
        text: '物流4',
        desc: '2019-1-1 12:40',
      },
    ],
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      storeShow:true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // setTimeout(()=>{
    //   this.setData({
    //     show:true
    //   })
    // },1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onStoreSelected(){
   this.setData({
    storeShow:false,
    typeShow:true
   })
  },
  onGoodsSelected(){
    this.setData({
     goodsShow:false,
      typeShow:true
    })
   },
   onTypeSelected(e){
    var index = e.currentTarget.dataset.index
    wx.requestSubscribeMessage({
      tmplIds: ['-RCILlm7nALXM6jxiYNiZuTbf6D5LBCwYPB-K6qDNn4'],
      success (res) {
        if(index==1){
          wx.navigateTo({
            url: 'index1',
          })
        }else{
          wx.navigateTo({
            url: 'index'
          })
        }
        console.log(res)
      },
      fail(res){
        wx.showModal({
          title: '订阅失败',
          content: res.errMsg,
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#1890FF'
        })
      }
    })


   },
   back(e){
     let index = e.currentTarget.dataset.index
     console.log(index)
       index==3?this.setData({
                  storeShow:true,
                  typeShow:false
                })
                :
                this.setData({
                  goodsShow:true,
                  typeShow:false
                })

   },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
})