// pages/my/myTag.js
var app = getApp();
const {
  $Message
} = require('../../component/iview/base/index');
const { $Toast } = require('../../component/iview/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath:'',
    userDetails:'',
    loadAll:false,
    lists:[],
    array:['开心','乐观','悲伤'],
    index1:0,
    showRight1:false,
    list:[],
    currentType:'',
    loadAll:true,
    oriList:'',
    currentIndex:'',
    notice: '请输入标签名称',
    focus: false,
    myComment: '',
    inputShow: false,
    myTag:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      let userDetails = wx.getStorageSync('userDetails')
      let path = app.globalData.pathurl+userDetails.avatarUrl
      that.setData({
        imgPath:path,
        userDetails:userDetails,
      })
      that.getTag()
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
  login(e){
    app.doLogin().then(data => {
      this.onLoad()
    })
  },
  pickerChange(e){
    console.log(e.detail.value)
    this.setData({
      index1:e.detail.value
    })
  },
  showSelection(e){
    console.log(e.currentTarget.dataset.id+','+e.currentTarget.dataset.index)
    if(e.currentTarget.dataset.mark=='1'){
      var that = this
      var index = e.currentTarget.dataset.index
      var id = e.currentTarget.dataset.id
      var list = that.data.lists[index].employeeTagValueList
      that.setData({
        showRight1:true,
        list:list,
        currentType:id,
        currentIndex:index
      })
    }
    
  },
  close(e){
    this.setData({
      showRight1:false,
    })
  },
  select: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    var list1 = that.data.list
    if(that.data.currentType==2){
      for(let x in list1){
        list1[x].sel = 0
      }
    }
    list1[index].sel = !list1[index].sel
    that.setData({
      list: list1
    })
  },
  save(e){
    var that = this
    let list1 = that.data.list
    var selected = ''
    console.log(that.data.currentType)
    that.setData({
      loadAll:true,
      showRight1:false
    })
    if(that.data.currentType==2){
      for(let x in list1){
        if(list1[x].sel==1){
          selected = list1[x].id
        }
      }
      wx.request({
        url: app.globalData.url + 'api/tag/saveTagForCenter.json',
        method: 'post',
        data: {
          empCode:that.data.lists[that.data.currentIndex].empCode,
          tagId:that.data.lists[that.data.currentIndex].tagId,
          // 'employeeTag.name':that.data.lists[that.data.currentIndex].employeeTag.name,
          // '!scopType':0,
          tagValue:selected,
          __ajax:'json',
          __sid:app.globalData.__sid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            if(res.data.result=='true'){
              $Toast({
                content:'修改成功',
                type:'success'
              })

              that.onLoad()
            }
          }else{
            $Toast({
              content:res.data.message,
              type:'error'
            })
          }

        }
      })
      console.log(selected)
    }else if(that.data.currentType==3){
      let arr = []
      for(let x in list1){
        if(list1[x].sel==1){
          arr.push(list1[x].id)
        }
      }
      console.log(arr)
      wx.request({
        url: app.globalData.url + 'api/tag/saveTagForCenter.json',
        method: 'post',
        data: {
          empCode:that.data.lists[that.data.currentIndex].empCode,
          tagId:that.data.lists[that.data.currentIndex].tagId,
          // 'employeeTag.name':that.data.lists[that.data.currentIndex].employeeTag.name,
          // '!scopType':0,
          tagValue:arr,
          __ajax:'json',
          __sid:app.globalData.__sid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            if(res.data.result=='true'){
              $Toast({
                content:'修改成功',
                type:'success'
              })
              that.setData({
                loadAll:true,
                showRight1:false
              })
              that.onLoad()
            }
          }else{
            $Toast({
              content:res.data.message,
              type:'error'
            })
          }

        }
      })
    }
  },
  getTags: function (e) {
    console.log(e.detail.value)
    this.setData({
      myTag: e.detail.value
    })
  },
  comment: function (e) {
    var that = this;
    that.setData({
      focus: true,
      inputShow: true,
    })
  },
  reply: function (e) {

  },
  bindfocus: function (e) {
    console.log(e.detail)
    this.setData({
      bottom: e.detail.height
    })
  },
  bindblur: function (e) {
    this.setData({
      inputShow: false,
      myTag: '',
    });
  },
  add(e){
    var that = this;
    if(that.data.myTag.length>0){
      console.log(that.data.myTag)
      wx.request({
        url: app.globalData.url + 'api/tag/addTagForMobile.json',
        method: 'post',
        data: {
          userCode:that.data.userDetails.userId,
          username:that.data.userDetails.username,
          name:that.data.myTag,
          __ajax:'json',
          __sid:app.globalData.__sid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            if(res.data.result=='true'){
              $Toast({
                content:'新增标签成功',
                type:'success'
              })
              that.setData({
                loadAll:true,
                showRight1:false
              })
              that.getTag()
            }
          }else{
            $Toast({
              content:res.data.message,
              type:'error'
            })
          }
        }
      })
    }
  },
  getTag(e){
    var that = this
    wx.request({
      url:app.globalData.url+'api/tag/TagAllByEmpCodeForMobile.json',
      data: {
        __sid: app.globalData.__sid,
        // __sid:app.globalData.tempSid,
        __ajax:'json',
        empCode:that.data.userDetails.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if(res.statusCode==200){
          if(res.data.result&&res.data.result=='login'){
            that.login()
            console.log('未登录')
            return;
          }
          let lists= res.data.data;
          if(lists.length==0){
            $Toast({
              content:'暂无任何标签',
              type:'warning'
            })
          }
          for(let x in lists){
            if(lists[x].employeeTag.type=='2'){
              for(let y in lists[x].employeeTagValueList){
                if(lists[x].tagValue==lists[x].employeeTagValueList[y].id){
                  lists[x].employeeTagValueList[y].sel = 1
                  console.log(lists[x].employeeTagValueList[y].name)
                  lists[x].value = lists[x].employeeTagValueList[y].name
                }
              }
            }
            if(lists[x].employeeTag.type=='3'){
              for(let y in lists[x].employeeTagValueList){
                if(lists[x].selectedValue==lists[x].employeeTagValueList[y].id){
                  lists[x].value = lists[x].employeeTagValueList[y].name
                }
                if(lists[x].tagValue){
                  for(let z in lists[x].tagValue.split(',')){
                    if(lists[x].tagValue.split(',')[z]==lists[x].employeeTagValueList[y].id){
                      lists[x].employeeTagValueList[y].sel = 1
                    }
                  }
                }
                
              }
            }
          }
          console.log(lists)

          that.setData({
            lists:lists,
            loadAll:false
          })
        }else{
          $Toast({
            content:'标签获取失败',
            type:'warning'
          })
        }
      }
    })
  },
  toPage(){
    wx.navigateTo({
      url: 'leaderTag',
    })
  }
})