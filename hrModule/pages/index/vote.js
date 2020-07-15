// pages/index/vote.js
const {
  $Message
} = require('../../component/iview/base/index')
const { $Toast } = require('../../component/iview/base/index');
var wxCharts = require('../../utils/wxcharts.js');
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
    actions: [{
        name: '取消'
      },
      {
        name: '提交',
        color: '#2d8cf0',
        loading: false
      }
    ],
    index1: 100,
    ifVote: -1,
    lists: '',
    schemeId: '',
    currentPage: 1,
    currentList: '',
    employeeTagJoinList: [],
    indexmark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(!options.schemeId){
      $Toast({
        content: '当前方案无效!',
        type: 'warning'
      })
      return
    }
    that.setData({
      schemeId:options.schemeId,
      indexmark:options.indexmark
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
    console.log(that.data.schemeId)
    wx.request({
      url: app.globalData.url + 'api/tag/findSchemeInfoById.json',
      data: {
        __sid: app.globalData.__sid,
        __ajax: 'json',
        schemeId:that.data.schemeId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
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
          for (let y in lists) {
            for(let x in lists[y].voterList){
              let path = lists[y].voterList[x].avatar
              if (path.indexOf("/ctxStatic") != -1) {
                path = '/hr/static' + path.slice(10, path.length)
              } else if (path.indexOf("/ctxPath") != -1) {
                path = '/hr' + path.slice(8, path.length)
              } else if (path.indexOf("/ctx") != -1) {
                path = '/hr/v1' + path.slice(4, path.length)
              }
              lists[y].voterList[x].avatar = app.globalData.pathurl+path
            }
          }
          that.setData({
            loadAll: false,
            lists: lists,
            currentList: lists[0]
          })
        } else {
          $Toast({
            content: '当前方案已失效!',
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
  formSubmit(e) {
    console.log(e.detail.value)
    var that = this
    var data = e.detail.value
    for (var x in data) {
      if (data[x].length == 0) {
        $Toast({
          content: '请完整选择投票内容',
          type: 'warning'
        })
        return;
      }
    }
    if (that.data.currentPage <= that.data.lists.length) {
      let x = that.data.currentPage
      var lists = that.data.lists[x - 1]
      var tempList = []
      if (lists.employeeTag.type == 3) {
        tempList.tagId = lists.employeeTag.id
        tempList.empCode = wx.getStorageSync('userDetails').userId
        tempList.voterCode = []
        tempList.voterName = []
        for (let x in lists.voterList) {
          tempList.voterCode.push(lists.voterList[x].empCode)
          tempList.voterName.push(lists.voterList[x].empName)
        }
        tempList.contents = []
        for (let x in data) {
          tempList.contents.push({
            empCode: x,
            id: data[x]
          })
        }
        console.log(tempList)
      }
      if (lists.employeeTag.type == 2) {
        tempList.tagId = lists.employeeTag.id
        tempList.empCode = wx.getStorageSync('userDetails').userId
        tempList.voterCode = []
        tempList.voterName = []
        for (let x in lists.voterList) {
          tempList.voterCode.push(lists.voterList[x].empCode)
          tempList.voterName.push(lists.voterList[x].empName)
        }
        tempList.contents = []
        for (let x in data) {
          tempList.contents.push({
            empCode: x,
            id: data[x]
          })
        }
        console.log(tempList)
      }
      if (lists.employeeTag.type == 4) {
        console.log(lists)
        tempList.tagId = lists.employeeTag.id
        tempList.empCode = wx.getStorageSync('userDetails').userId
        tempList.voterCode = data.selectiontest
        for (let x in lists.voterList) {
          if (lists.voterList[x].empCode == data.selectiontest) {
            tempList.voterName = lists.voterList[x].empName
          }
        }
        tempList.contents = lists.employeeTag.name
        console.log(tempList)
      }
      var employeeTagJoinList = that.data.employeeTagJoinList
      if (employeeTagJoinList.length < that.data.lists.length) {
        // if(that.data.lists.length==1){
        //   employeeTagJoinList = tempList
        // }else{
        employeeTagJoinList.push(tempList)
        // }
      }
      console.log(employeeTagJoinList)
      if (that.data.currentPage == that.data.lists.length) {
        that.setData({
          employeeTagJoinList: employeeTagJoinList
        })
        this.handleOpen()
      } else {
        that.setData({
          currentPage: x + 1,
          currentList: that.data.lists[x],
          employeeTagJoinList: employeeTagJoinList
        })
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    }

  },
  handleOpen() {
    this.setData({
      visible: true
    });
  },

  handleClick({
    detail
  }) {
    var that = this
    console.log(detail.index)

    if (detail.index === 0) {
      that.setData({
        visible: false
      });
    } else {
      const action = [...that.data.actions];
      action[1].loading = true;
      that.setData({
        actions: action
      });
      console.log(that.data.employeeTagJoinList)
      let tempList = that.data.employeeTagJoinList
      let postData = []
      postData.__sid = app.globalData.__sid
      postData.__ajax = 'json'
      if(that.data.lists.length==1){
        if (that.data.lists[0].employeeTag.type == 4) {
          postData['employeeTagJoinList[0].contents'] = tempList[0].contents
          postData['employeeTagJoinList[0].tagId'] = tempList[0].tagId
          postData['employeeTagJoinList[0].empCode'] = tempList[0].empCode
          postData['employeeTagJoinList[0].voterCode'] = tempList[0].voterCode
          postData['employeeTagJoinList[0].voterName'] = tempList[0].voterName
        }
        if (that.data.lists[0].employeeTag.type == 3 || that.data.lists[0].employeeTag.type == 2) {
        //   for (let x in tempList[0].contents) {
        //     postData['employeeTagJoinList.contents[' + x + '].empCode'] = tempList[0].contents[x].empCode
        //     postData['employeeTagJoinList.contents[' + x + '].id'] = tempList[0].contents[x].id
        //   }
        // }
        // postData['employeeTagJoinList.tagId'] = tempList[0].tagId
        // postData['employeeTagJoinList.empCode'] = tempList[0].empCode
        // postData['employeeTagJoinList.voterCode'] = tempList[0].voterCode
        // postData['employeeTagJoinList.voterName'] = tempList[0].voterName
        for (let x in tempList[0].contents) {
          postData['employeeTagJoinList[' + x + '].contents'] = tempList[0].contents[x].id
          postData['employeeTagJoinList[' + x + '].voterCode'] = tempList[0].voterCode[x]
          postData['employeeTagJoinList[' + x + '].voterName'] = tempList[0].voterName[x]
          postData['employeeTagJoinList[' + x + '].tagId'] = tempList[0].tagId
          postData['employeeTagJoinList[' + x + '].empCode'] = tempList[0].empCode
        }
      }
      }else{
        let temp = 0
        for (let y in tempList) {
          if (that.data.lists[y].employeeTag.type == 4) {
            postData['employeeTagJoinList[' + temp + '].contents'] = tempList[y].contents
            postData['employeeTagJoinList[' + temp + '].tagId'] = tempList[y].tagId
            postData['employeeTagJoinList[' + temp + '].empCode'] = tempList[y].empCode
            postData['employeeTagJoinList[' + temp + '].voterCode'] = tempList[y].voterCode
            postData['employeeTagJoinList[' + temp + '].voterName'] = tempList[y].voterName
            temp++
          }
          if (that.data.lists[y].employeeTag.type == 3 || that.data.lists[y].employeeTag.type == 2) {
            // for (let x in tempList[y].contents) {
            //   postData['employeeTagJoinList[' + y + '].contents[' + x + '].empCode'] = tempList[y].contents[x].empCode
            //   postData['employeeTagJoinList[' + y + '].contents[' + x + '].id'] = tempList[y].contents[x].id
            // }
            for (let x in tempList[y].contents) {
              postData['employeeTagJoinList[' + temp + '].contents'] = tempList[y].contents[x].id
              postData['employeeTagJoinList[' + temp + '].voterCode'] = tempList[y].voterCode[x]
              postData['employeeTagJoinList[' + temp + '].voterName'] = tempList[y].voterName[x]
              postData['employeeTagJoinList[' + temp + '].tagId'] = tempList[y].tagId
              postData['employeeTagJoinList[' + temp + '].empCode'] = tempList[y].empCode
              temp++
            }
          }
          // postData['employeeTagJoinList[' + y + '].tagId'] = tempList[y].tagId
          // postData['employeeTagJoinList[' + y + '].empCode'] = tempList[y].empCode
          // postData['employeeTagJoinList[' + y + '].voterCode'] = tempList[y].voterCode
          // postData['employeeTagJoinList[' + y + '].voterName'] = tempList[y].voterName
        }
      }
      
      postData.schemeId = that.data.schemeId
      console.log(postData)
      wx.request({
        url: app.globalData.url + 'api/tag/batchSaveForMobile.json',
        method: 'post',
        data: postData,
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
              action[1].loading = false;
              that.setData({
                visible: false,
                actions: action
              });
              // $Toast({
              //   content: '提交成功!',
              //   type: 'success'
              // });
                wx.navigateTo({
                  url:'success?indexmark='+that.data.indexmark
                  });
            }, 1000);
            }
          }else{
            const action = [...that.data.actions];
            action[1].loading = false;
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
      
    }
  },
  pickChange(e) {
    // var arr = this.data.objectArray
    var value = e.detail.value;
    var list = this.data.array;
    var index = e.currentTarget.dataset.index;
    var arr = this.data.arr
    list[index].option = value
    arr[index] = list[index].objectArray[value].id
    console.log(arr)
    this.setData({
      array: list,
      arr: arr
    })
  },
  bossRadioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      ifVote: e.detail.value
    })
  },
  bossCheckboxChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      ifVote: e.detail.value
    })
  },
  slide(){
    wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
  }
})