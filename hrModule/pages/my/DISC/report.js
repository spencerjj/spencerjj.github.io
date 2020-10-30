// pages/my/DISC/test.js
const {
  $Message
} = require('../../../component/iview/base/index')
const { $Toast } = require('../../../component/iview/base/index');
var app = getApp();
var my_carvas;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '',
    coordinate:[0,0],
    points:[
      {
        x:40,
        y:0,
      },
      {
        x:120,
        y:0,
      },
      {
        x:200,
        y:0,
      },
      {
        x:280,
        y:0,
      },
    ],
    mark:1,
    width:0,
    height:0,
    myWidth:0,
    ifhid:false,
    result:'',
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
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
    let userDetails = wx.getStorageSync('userDetails')
    let path = app.globalData.pathurl + userDetails.avatarUrl
    var result = wx.getStorageSync('result')
    if(result=='undefined'||!result){
      $Toast({
        content: '获取报告失败，请重新测试',
        type: 'warning'
      })
    }
    result.empCode = result.empCode.substring(0,6)
    console.log(result)

    this.setData({
      imgPath: path,
      userDetails: userDetails,
      result:result
    })
    // 获取分数
    var pointList = []
    var pointList1 = []
    var total = result.totalScore
    pointList1 = [result.dscore,result.iscore,result.sscore,result.cscore]
    pointList.push({
      id:'d',
      point:result.dscore
    })
    pointList.push({
      id:'i',
      point:result.iscore
    })
    pointList.push({
      id:'s',
      point:result.sscore
    })
    pointList.push({
      id:'c',
      point:result.cscore
    })
    pointList = pointList.sort(this.compare("point"))
    console.log(pointList)
    
    // 坐标判断
    var coordinate = []
    var x = pointList[3]
    var y = pointList[2]
    if(x.id=='d'){
      coordinate[0]=x.point*143/total
      coordinate[1]=y.point*143/total
    }
    if(x.id=='c'){
      coordinate[0]='-'+x.point*143/total
      coordinate[1]=y.point*143/total
    }
    if(x.id=='s'){
      coordinate[0]='-'+x.point*143/total
      coordinate[1]=y.point*143/total
    }
    if(x.id=='i'){
      coordinate[0]=x.point*143/total
      coordinate[1]='-'+y.point*143/total
    }
    
    if(coordinate[0]>=0&coordinate[1]>=0){
      this.setData({
        mark:1
      })
    }
    if(coordinate[0]<0&&coordinate[1]>=0){
      this.setData({
        mark:2
      })
    }
    if(coordinate[0]>=0&coordinate[1]<0){
      this.setData({
        mark:3
      })
    }
    if(coordinate[0]<0&&coordinate[1]<0){
      this.setData({
        mark:4
      })
    }
    var width = Math.abs(coordinate[0])*3>=240?240:Math.abs(coordinate[0])*3
    var height = Math.abs(coordinate[1])*3>=240?240:Math.abs(coordinate[1])*3
    var points = this.data.points
    console.log(pointList1)
    points[0].y = 270-pointList1[0]*270/total+30
    points[1].y = 270-pointList1[1]*270/total+30
    points[2].y = 270-pointList1[2]*270/total+30
    points[3].y = 270-pointList1[3]*270/total+30
    console.log(pointList[3].id)
    this.setData({
      width:width,
      height:height,
      type:pointList[3].id,
      points:points
    })
    my_carvas = wx.createCanvasContext('myCanvas', this)
    this.drawBorder()

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
  login(e) {
    app.doLogin().then(data => {
      this.onShow()
      this.setData({
        loadAll: true
      })
    })
  },
  getInfo(e) {

  },
  drawBorder(e){
    my_carvas.beginPath()
    my_carvas.setStrokeStyle('#000000');
    my_carvas.moveTo(80,0)
    my_carvas.lineTo(80,400)
    my_carvas.moveTo(160,0)
    my_carvas.lineTo(160,400)
    my_carvas.moveTo(240,0)
    my_carvas.lineTo(240,400)
    my_carvas.moveTo(0,170)
    my_carvas.lineTo(320,170)
    my_carvas.moveTo(0,40)
    my_carvas.lineTo(320,40)
    my_carvas.fillStyle="#000000"
    my_carvas.font = 'bold 20px 微软雅黑'
    my_carvas.fillText("D", 30, 30)
    my_carvas.fillText("I", 117, 30)
    my_carvas.fillText("S", 193, 30)
    my_carvas.fillText("C", 273, 30)
    my_carvas.stroke();
    this.confirm()
  },
  confirm(e){
   
    // my_carvas.beginPath();
    // my_carvas.setStrokeStyle('red');
    // my_carvas.fillStyle="#0000ff";
    // my_carvas.arc(10,10,8,0,2*Math.PI)
    // my_carvas.arc(100,100,8,0,2*Math.PI)
    
    // my_carvas.arc(250,50,8,0,2*Math.PI)
    // my_carvas.lineTo(end_x,end_y);
    // my_carvas.lineTo(100,200);
    // my_carvas.lineTo(200,300);
    // my_carvas.stroke();
    // my_carvas.draw();
    var points = this.data.points
    for (var i = 0, len = points.length; i < len; i++) {
      my_carvas.save()
      my_carvas.beginPath()
      my_carvas.arc(points[i].x, points[i].y, 7, 0, 2 * Math.PI)
      my_carvas.fillStyle="#69bcf9";
      my_carvas.fill()
      my_carvas.restore()
    } 
    my_carvas.setStrokeStyle('#69bcf9')
    my_carvas.moveTo(points[0].x, points[0].y)
    my_carvas.lineTo(points[1].x, points[1].y)
    my_carvas.lineTo(points[2].x, points[2].y)
    my_carvas.lineTo(points[3].x, points[3].y)
    my_carvas.stroke();
    my_carvas.draw();
  },
  compare(property) {
    return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
},
})  