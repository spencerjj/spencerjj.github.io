// pages/class/class.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 10,
    lists: [
      {
        images:['http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg'],
        nameClass:"一年级三班",
        createTime:'昨天',
        likes:[
          {
            nameParent:'锟锟1'
          },
          {
            nameParent:'锟锟2'
          },
          {
            nameParent:'锟锟3'
          }
        ],
        comments:[
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          },
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          },
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          }
        ]
      },
      {
        images:['http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg'],
        nameClass:"一年级三班",
        createTime:'昨天',
        likes:[
          {
            nameParent:'锟锟1'
          },
          {
            nameParent:'锟锟2'
          },
          {
            nameParent:'锟锟3'
          }
        ],
        comments:[
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          },
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          },
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          }
        ]
      },
      {
        images:['http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg','http://tiebapic.baidu.com/forum/w%3D580/sign=37091576742762d0803ea4b790ed0849/977a3d9759ee3d6dcb1e2d9e54166d224e4ade57.jpg'],
        nameClass:"一年级三班",
        createTime:'昨天',
        likes:[
          {
            nameParent:'锟锟1'
          },
          {
            nameParent:'锟锟2'
          },
          {
            nameParent:'锟锟3'
          }
        ],
        comments:[
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          },
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          },
          {
            nameParent:'锟锟1',
            content:'好啊，美女'
          }
        ]
      }
    ],
    loading: true,
    isMore: false,
    pkTeacher: '',
    // height:'',
    inputShow: false,
    focus: false,
    myComment: '',
    cindex: '',
    notice: '评论',
    myType:'',
    showNo:false,
    mark1:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

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
    this.onLoad()
    this.setData({
      mark1:false
    })
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
    this.onLoad();
    this.setData({
      pageNum:1,
      listIsFull:false,
      loading:true
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    this.setData({
      mark1:true
    })
    console.log('到底了')
    if (that.data.isMore) {
      var pageNum = that.data.pageNum;
      pageNum++;
      that.setData({
        pageNum: pageNum
      })
      that.showList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showList: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    wx.request({
      url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/listMoment2',
      data: {
        pkTeacher: userInfo.pkTeacher,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var data = res.data.data;
        console.log(that.data.pkTeacher)
        for (let x in data) {
          if (data[x].likes.length != 0) {
            for (let y in data[x].likes) {
              if (data[x].likes[y].pkTeacher == that.data.pkTeacher) {
                data[x].isZan = true
              }
            }
          } else {
            data[x].isZan = false
          }
        }
        console.log(res.data)
        for (let x in data) {
          data[x].createTime = that.time(data[x].createTime)
          data[x].isCom = false
        }
        if (data.length < that.data.pageSize) {
          that.setData({
            isMore: false,
            loading: false,
            listIsFull: true,
          })
        } else if (data.length == that.data.pageSize) {
          that.setData({
            isMore: true,
            loading: true,
            listIsFull: false
          })
        }
        console.log(that.data.pageNum+',,,,,,,')
        if (that.data.pageNum == 1) {
          that.setData({
            lists: data
          })
        } else {
          console.log(data)
          if(that.data.mark1){
            var list = that.data.lists;
          list = list.concat(data)
          that.setData({
            lists: list
          })
          }
          
        }
      }
    })
  },
  showGuide: function () {
    wx.navigateTo({
      url: 'send',
    })
  },
  toPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  time: function (e) {
    var date = new Date(e);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear()
    var M = date.getMonth() + 1
    var D = date.getDate()

    var h = date.getHours();
    var m = date.getMinutes();
    if(h<10){
      h='0'+h
    }
    if(m<10){
      m='0'+m
    }

    var date1 = new Date();
    var Y1 = date1.getFullYear()
    var M1 = date1.getMonth() + 1
    var D1 = date1.getDate()

    var h1 = date1.getHours();
    var m1 = date1.getMinutes();
    if (D == D1) {
      var temp = h1 - h
      if (temp == 0) {
        return '刚刚'
      } else {
        return temp + '小时前'
      }
    } else if (D1 - D == 1) {
      return '昨天'
    } else {
      return Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m
    }
  },
  showImg1: function (e) {
    var mark = [];
    mark.push(e.target.dataset.mark)
    wx.previewImage({
      current: e.target.dataset.mark, // 当前显示图片的http链接
      urls: mark// 需要预览的图片http链接列表
    })
  },
  showImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.name, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.mark// 需要预览的图片http链接列表
    })
  },
  zan: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.mark)
    var pkCcMoment = e.currentTarget.dataset.name
    var index = e.currentTarget.dataset.mark
    var list = that.data.lists
    for(var x in list){
      if (list[x].pkCcMoment == pkCcMoment){
        list[x].isZan = true
      }
    }
    that.setData({
      lists: list
    })
    console.log(that.data.lists)
    wx.request({
      url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/like',
      data: {
        pkTeacher: app.globalData.currentTeacher.pkTeacher,
        pkCcMoment: e.currentTarget.dataset.name
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        wx.request({
          url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/getLikesAndComments',
          data: {
            pkCcMoment: e.currentTarget.dataset.name
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            var list = that.data.lists;
            list[index].likes = res.data.data.likes
            for (var x in list) {
              if (list[x].pkCcMoment == pkCcMoment) {
                list[x].likes = res.data.data.likes
              }
            }
            that.setData({
              lists: list
            })
            console.log(that.data.lists)
          }
        })
      }
    })
  },
  sendComment: function (e) {
    var that = this;
    if (that.data.myComment.length != 0) {
      if(that.data.myType==0){
        wx.request({
          url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/comment',
          data: {
            pkTeacher: app.globalData.currentTeacher.pkTeacher,
            pkCcMoment: that.data.pkCcMoment,
            content: that.data.myComment.trim(),
            isReply: 0
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            wx.request({
              url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/getLikesAndComments',
              data: {
                pkCcMoment: that.data.pkCcMoment
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                console.log(res.data)
                var list = that.data.lists;
                var index = that.data.cindex;
                console.log(index)
                list[index].comments = res.data.data.comments
                that.setData({
                  lists: list
                })
                console.log(that.data.lists)
              }
            })
          }
        })
      }else if(that.data.myType==1){
      wx.request({
        url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/comment',
        data: {
          pkTeacher: app.globalData.currentTeacher.pkTeacher,
          pkCcMoment: that.data.reMom,
          content: that.data.myComment.trim(),
          isReply: 1,
          pkUserReply: that.data.reUser,
          typeReply: that.data.reType
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          wx.request({
            url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/getLikesAndComments',
            data: {
              pkCcMoment: that.data.reMom
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              var list = that.data.lists;
              var index = that.data.reIndex;
              console.log(index)
              list[index].comments = res.data.data.comments
              that.setData({
                lists: list
              })
              console.log(that.data.lists)
            }
          })
        }
      })
      }

    }

  },
  getComment: function (e) {
    console.log(e.detail.value)
    this.setData({
      myComment: e.detail.value
    })
  },
  comment: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.mark)
    var index = e.currentTarget.dataset.mark
    that.setData({
      focus: true,
      inputShow: true,
      pkCcMoment: e.currentTarget.dataset.name,
      cindex: index,
      myType:0
    })
  },
  reply: function (e) {
    // var that = this;
    // console.log(e.currentTarget.dataset.pkuser + "," + e.currentTarget.dataset.index + ',' + e.currentTarget.dataset.pkmom + ',' + e.currentTarget.dataset.type + ',' + e.currentTarget.dataset.name)
    // if (e.currentTarget.dataset.pkuser != app.globalData.currentTeacher.pkTeacher){
    //   that.setData({
    //     focus: true,
    //     inputShow: true,
    //     myType: 1,
    //     reUser: e.currentTarget.dataset.pkuser,
    //     reIndex: e.currentTarget.dataset.index,
    //     reMom: e.currentTarget.dataset.pkmom,
    //     reType: e.currentTarget.dataset.type,
    //     notice: '回复' + e.currentTarget.dataset.name + '：'
    //   })
    // }
      // wx.request({
      //   url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/comment',
      //   data: {
      //     pkTeacher: app.globalData.currentTeacher.pkTeacher,
      //     pkCcMoment: e.currentTarget.dataset.pkmom,
      //     content: that.data.myComment,
      //     isReply: 1,
      //     pkUserReply: e.currentTarget.dataset.pkuser,
      //     typeReply: e.currentTarget.dataset.type
      //   },
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   success(res) {
      //     console.log(res.data)
      //     wx.request({
      //       url: app.globalData.ip+'/spc/api/cc/wx6334b87275e169ab/getLikesAndComments',
      //       data: {
      //         pkCcMoment: e.currentTarget.dataset.pkmom
      //       },
      //       header: {
      //         'content-type': 'application/json' // 默认值
      //       },
      //       success(res) {
      //         console.log(res.data)
      //         var list = that.data.lists;
      //         var index = e.currentTarget.dataset.index;
      //         console.log(index)
      //         list[index].comments = res.data.data.comments
      //         that.setData({
      //           lists: list
      //         })
      //         console.log(that.data.lists)
      //       }
      //     })
      //   }
      // })
  },
  bindfocus: function (e) {
    // wx.hideTabBar({})
    let that = this;
    let height = 0;
    console.log(e.detail)
    height = e.detail.height
    that.setData({
      // height: height,
    })
  },
  //监听input失去焦点
  bindblur: function (e) {
    // wx.showTabBar({})
    this.setData({
      // height: 0,
      inputShow: false,
      myComment: '',
      isReply: 0
    });
  },
  more:function(e){
    var that=this;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor:'#ff0000',
      success(res) {
        console.log(e.currentTarget.dataset.mark);
        var index = e.currentTarget.dataset.mark;
        var pkCcMoment = e.currentTarget.dataset.name;
        wx.request({
          url: app.globalData.ip + '/spc/api/cc/wx6334b87275e169ab/deleteMoment',
          data: {
            pkCcMoment: pkCcMoment
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
          }
        })
        var list = that.data.lists;
        list.splice(index,1)
        that.setData({
          lists:list
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})