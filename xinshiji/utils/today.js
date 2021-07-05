module.exports = {
  getToday:getToday,
  getNow:getNow,
  shit:'哈哈哈'
}

function getToday(){
  let now = new Date()
  var month = (now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)
  var day = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()
  var today = now.getFullYear() + '年' + month + '月' + day + '日'
  var today1 = now.getFullYear() + '-' + month + '-' + day
  var today2 = {
    todayShow:today,
    todayTrue:today1
  }
  return today2
}
function getNow(){
  let now = new Date()
  var month = (now.getMonth() + 1) >= 10 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)
  var day = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()
  var hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()
  var minute = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()
  var second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds()
  var today = now.getFullYear() + '年' + month + '月' + day + '日'
  var nowTime = now.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  var nowTime1 = today+' ' + hour + ':' + minute + ':' + second
  var nowTime2 = {
    nowShow:nowTime1,
    nowTrue:nowTime
  }
  return nowTime2
}

