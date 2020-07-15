// pages/index/vote.js
const {
  $Message
} = require('../../../component/iview/base/index')
const { $Toast } = require('../../../component/iview/base/index');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit: false,
    btnLoad: false,
    btnText: '提交',
    visible: false,
    loadAll: true,
    actions: [
      {
        name: '确认提交',
        color: '#2d8cf0',
        loading: false
      }
    ],
    index1: 100,
    ifVote: -1,
    lists: '',
    id: '',
    currentPage: 1,
    currentList: '',
    employeeTagJoinList: [],
    indexmark:'',
    ifStart:true,
    starIndex1:0,
    totalIndex:0,
    value1: 100,
    point1:'10.00',
    gjsl1:'',
    value2: 100,
    point2:'10.00',
    gjsl2:'',
    value3: 100,
    point3:'10.00',
    gjsl3:'',
    value4: 100,
    point4:'10.00',
    gjsl4:'',
    value5: 100,
    point5:'60.00',
    gjsl5:'',
    data:[],
    totalPoint:'100.00',
    fzjh:3,
    zhpj:'',
    gxsl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(!options.id){
      $Toast({
        content: '当前评估已失效!',
        type: 'warning'
      })
      return
    }
    that.setData({
      id:options.id
    })
    that.getInfo()
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
      this.getInfo()
    })
  },
  getInfo(e){
    var that = this
    console.log(that.data.id)
    wx.request({
      url: app.globalData.url + 'api/estimate/detail.json',
      data: {
        __sid: app.globalData.__sid,
        // __sid: app.globalData.tempSid,
        __ajax: 'json',
        id:that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data)
        if (res.statusCode == 200) {
          if(res.data.result=='login'){
            that.login()
            console.log('未登录')
            return;
          }
          if (res.data.data.result == 'false') {
            $Toast({
              content: res.data.data.message,
              type:'error'
            })
            return;
          }
          var lists = res.data.data
          if(lists.status=='2'){
            that.setData({
              value1:lists.dxpf1,
              value2:lists.dxpf2,
              value3:lists.dxpf3,
              value4:lists.dxpf4,
              value5:lists.dxpf5,
              point1:lists.dxdf1.toFixed(2),
              point2:lists.dxdf2.toFixed(2),
              point3:lists.dxdf3.toFixed(2),
              point4:lists.dxdf4.toFixed(2),
              point5:lists.dxdf5.toFixed(2),
              gjsl1:lists.gjsl1,
              gjsl2:lists.gjsl2,
              gjsl3:lists.gjsl3,
              gjsl4:lists.gjsl4,
              gjsl5:lists.gjsl5,
              totalPoint:lists.zhdf.toFixed(2),
              zhpj:lists.zhpj,
              gxsl:lists.gxsl
            })
          }

          that.setData({
            loadAll: false,
            lists: lists
          })
        } else {
          $Toast({
            content: '当前评估已失效!',
            type: 'warning'
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '../my/my',
            })
          },1000)
        }
      }
    })
  },
  handleOpen() {
    this.setData({
      visible: true
    });
  },
  handleCancel() {
    this.setData({
        visible: false
    });
},
  handleClick({
    detail
  }) {
    var that = this
    console.log(that.data.data)
      const action = [...that.data.actions];
      console.log(action)
      action[0].loading = true;
      that.setData({
        actions: action
      });
      var data = that.data.data;
      data.__sid = app.globalData.__sid;
      data.__ajax = 'json'
      wx.request({
        url: app.globalData.url + 'api/estimate/save.json',
        method: 'post',
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success(res) {
          console.log(res)
          if(res.statusCode==200){
            if (res.data.result == 'false') {
              $Toast({
                content: res.data.data.message,
                type:'error'
              })
              return;
            }
            if(res.data.result=='true'){
            setTimeout(() => {
              action[0].loading = false;
              that.setData({
                visible: false,
                actions: action
              });
              $Toast({
                content: '提交成功!',
                type: 'success'
              });
                wx.navigateTo({
                  url:'success?indexmark='+1
                });
            }, 1000);
            }
          }else{
            const action = [...that.data.actions];
            action[0].loading = false;
            $Toast({
              content: '当前方案已失效!',
              type: 'warning'
            });
            that.setData({
              visible: false,
              actions: action
            });
          }
        }
      })
      
  },
  start(e){
    this.setData({
      ifStart:false,
      totalIndex:1
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onChange1(e){
    const index = e.detail.index;
    this.setData({
        'starIndex1' : index
    })
  },
  handleChange1 ({ detail }) {
    var point1 = (detail.value*this.data.lists.estimateModel.estimateModelContentList[0].contentWeight).toFixed(2)
    console.log(point1)
    var totalPoint = parseFloat(point1)+parseFloat(this.data.point2)+parseFloat(this.data.point3)+parseFloat(this.data.point4)+parseFloat(this.data.point5)
    console.log(totalPoint)
    this.setData({
      value1: detail.value,
      point1:point1,
      totalPoint:totalPoint.toFixed(2)
    })
  },
  handleinput1(e){
    console.log(e.detail.value)
    this.setData({
      gjsl1:e.detail.value
    })
  },
  handleChange2 ({ detail }) {
    var point2 = (detail.value*this.data.lists.estimateModel.estimateModelContentList[1].contentWeight).toFixed(2)
    console.log(point2)
    var totalPoint = parseFloat(this.data.point1)+parseFloat(point2)+parseFloat(this.data.point3)+parseFloat(this.data.point4)+parseFloat(this.data.point5)
    console.log(totalPoint)
    this.setData({
      value2: detail.value,
      point2:point2,
      totalPoint:totalPoint.toFixed(2)
    })
  },
  handleinput2(e){
    console.log(e.detail.value)
    this.setData({
      gjsl2:e.detail.value
    })
  },
  handleChange3 ({ detail }) {
    var point3 = (detail.value*this.data.lists.estimateModel.estimateModelContentList[2].contentWeight).toFixed(2)
    console.log(point3)
    var totalPoint = parseFloat(this.data.point1)+parseFloat(this.data.point2)+parseFloat(point3)+parseFloat(this.data.point4)+parseFloat(this.data.point5)
    console.log(totalPoint)
    this.setData({
      value3: detail.value,
      point3:point3,
      totalPoint:totalPoint.toFixed(2)
    })
  },
  handleinput3(e){
    console.log(e.detail.value)
    this.setData({
      gjsl3:e.detail.value
    })
  },
  handleChange4 ({ detail }) {
    var point4 = (detail.value*this.data.lists.estimateModel.estimateModelContentList[3].contentWeight).toFixed(2)
    console.log(detail.value)
    var totalPoint = parseFloat(this.data.point1)+parseFloat(this.data.point2)+parseFloat(this.data.point3)+parseFloat(point4)+parseFloat(this.data.point5)
    console.log(totalPoint)
    this.setData({
      value4: detail.value,
      point4:point4,
      totalPoint:totalPoint.toFixed(2)
    })
  },
  handleinput4(e){
    console.log(e.detail.value)
    this.setData({
      gjsl4:e.detail.value
    })
  },
  handleChange5 ({ detail }) {
    var point5 = (detail.value*this.data.lists.estimateModel.estimateModelContentList[4].contentWeight).toFixed(2)
    console.log(point5)
    var totalPoint = parseFloat(this.data.point1)+parseFloat(this.data.point2)+parseFloat(this.data.point3)+parseFloat(this.data.point4)+parseFloat(point5)
    console.log(totalPoint)
    this.setData({
      value5: detail.value,
      point5:point5,
      totalPoint:totalPoint.toFixed(2)
    })
  },
  handleinput5(e){
    console.log(e.detail.value)
    this.setData({
      gjsl5:e.detail.value
    })
  },
  next(e){
    var that = this;
    var data = that.data.data;
    var totalIndex = that.data.totalIndex;
    var point1 = that.data.point1
    var point2 = that.data.point2
    var point3 = that.data.point3
    var point4 = that.data.point4
    var point5 = that.data.point5
    console.log(that.data.point1.length)
    if(totalIndex==1){
      // if(that.data.gjsl1.length==0){
      //   $Toast({
      //     content:'请填写关键行为事迹',
      //     type:"warning"
      //   })
      //   return;
      // }
      if(point1.length>0){
        totalIndex=2
        that.setData({
          totalIndex:totalIndex
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
        data.dxpf1 = that.data.value1;
        data.dxdf1 = that.data.point1;
        data.gjsl1 = that.data.gjsl1;
        console.log(data)
        that.setData({
          data:data
        })
      }else{
        $Toast({
          content:'请完成评分',
          type:"warning"
        })
      }

    }else if(totalIndex==2){
      // if(that.data.gjsl2.length==0){
      //   $Toast({
      //     content:'请填写关键行为事迹',
      //     type:"warning"
      //   })
      //   return;
      // }
      if(point2.length>0){
        totalIndex=3
        that.setData({
          totalIndex:totalIndex
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
        data.dxpf2 = that.data.value2;
        data.dxdf2 = that.data.point2;
        data.gjsl2 = that.data.gjsl2;
        console.log(data)
        that.setData({
          data:data
        })
      }else{
        $Toast({
          content:'请完成价值观评分',
          type:"warning"
        })
      }
    }else if(totalIndex==3){
      // if(that.data.gjsl3.length==0){
      //   $Toast({
      //     content:'请填写关键行为事迹',
      //     type:"warning"
      //   })
      //   return;
      // }
      if(point3.length>0){
        totalIndex=4
        that.setData({
          totalIndex:totalIndex
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
        data.dxpf3 = that.data.value3;
        data.dxdf3 = that.data.point3;
        data.gjsl3 = that.data.gjsl3;
        console.log(data)
        that.setData({
          data:data
        })
      }else{
        $Toast({
          content:'请完成价值观评分',
          type:"warning"
        })
      }
    }else if(totalIndex==4){
      // if(that.data.gjsl4.length==0){
      //   $Toast({
      //     content:'请填写关键行为事迹',
      //     type:"warning"
      //   })
      //   return;
      // }
      if(point4.length>0){
        totalIndex=5
        that.setData({
          totalIndex:totalIndex
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
        data.dxpf4 = that.data.value4;
        data.dxdf4 = that.data.point4;
        data.gjsl4 = that.data.gjsl4;
        console.log(data)
        that.setData({
          data:data
        })
      }else{
        $Toast({
          content:'请完成价值观评分',
          type:"warning"
        })
      }
    }else if(totalIndex==5){
      // if(that.data.gjsl5.length==0){
      //   $Toast({
      //     content:'请填写关键行为事迹',
      //     type:"warning"
      //   })
      //   return;
      // }
      if(point5.length>0){
        totalIndex=6
        that.setData({
          totalIndex:totalIndex
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
        data.dxpf5 = that.data.value5;
        data.dxdf5 = that.data.point5;
        data.gjsl5 = that.data.gjsl5;
        console.log(data)
        var totalPoint = parseFloat(that.data.point1)+parseFloat(that.data.point2)+parseFloat(that.data.point3)+parseFloat(that.data.point4)+parseFloat(that.data.point5)
        data.zhdf = totalPoint
        console.log(totalPoint)
        if(totalPoint>10){
          var x = Math.floor(totalPoint)
          var y = totalPoint-x
          that.setData({
            totalPoint:'0.00'
          })
          var z = 0
          var in1 = setInterval(()=>{
              if(z<=x-5){
                that.setData({
                  totalPoint:(z).toFixed(2)
                })
                if(z==x-5){
                  that.setData({
                    totalPoint:(z+y).toFixed(2)
                  })
                  clearInterval(in1)
                  var in2 = setInterval(()=>{
                    if(z<=x){
                      that.setData({
                        totalPoint:(z).toFixed(2)
                      })
                      if(z==x){
                        that.setData({
                          totalPoint:(z+y).toFixed(2)
                        })
                        clearInterval(in2)
                      }
                      z++
                    }
                  },100)  
                }
                z++
              }
            },10)
        }else{
          that.setData({
            totalPoint:totalPoint.toFixed(2)
          })
        }


        that.setData({
          data:data
        })
      }else{
        $Toast({
          content:'请完成价值观评分',
          type:"warning"
        })
      }
    }
  },
  checkChange(e){
    this.setData({
      fzjh:e.detail.value
    })
  },
  handleinput6(e){
    var data = this.data.data
    data.zhpj = e.detail.value
    this.setData({
      data:data,
      zhpj:e.detail.value
    })
  },
  handleinput7(e){
    var data = this.data.data
    data.gxsl = e.detail.value
    this.setData({
      data:data,
      gxsl:e.detail.value
    })
  },
  back(e){
    var that = this;
    var totalIndex = that.data.totalIndex
    switch(totalIndex) {
      case 6:
         that.setData({
          totalIndex:1
         })
         wx.pageScrollTo({
          scrollTop: 0
        })
         break;
      case 5:
        that.setData({
          totalIndex:4
         })
         wx.pageScrollTo({
          scrollTop: 0
        })
         break;
         case 4:
        that.setData({
          totalIndex:3
         })
         wx.pageScrollTo({
          scrollTop: 0
        })
         break;
         case 3:
        that.setData({
          totalIndex:2
         })
         wx.pageScrollTo({
          scrollTop: 0
        })
         break;
         case 2:
        that.setData({
          totalIndex:1
         })
         wx.pageScrollTo({
          scrollTop: 0
        })
         break;
 } 
  },
  save(e){
    var data = this.data.data
    var lists = this.data.lists
    if(this.data.zhpj.length==0){
      $Toast({
        content:'请填写综合评价',
        type:"warning"
      })
      return;
    }
    if(lists.relation=='直接上级'){
      data.fzjh = this.data.fzjh
    }
    data.id = this.data.id
    this.setData({
      visible:true,
      data:data
    })
  }
})