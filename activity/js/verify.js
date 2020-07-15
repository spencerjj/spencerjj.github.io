var app = angular.module('myApp', []);
app.controller('myController',['$scope','$http',function($scope,$http){
  // $scope.url = 'http://192.168.2.50:8080'
  $scope.url = 'http://web.princesky.com:8088'
  getCode=function(e){
		console.log($('#code').val().length)
		if($('#code').val().length>11){
			$('#code').val(($('#code').val()).substring(0,11))
		}
	}
  	$scope.check = function(){
      $('.cus').hide({
        duration: 200,
      })
		if($('#code').val().length==11){
			// var dialog1 = $(document).dialog({
   //      type : 'notice',
   //      infoIcon: 'images/loading.gif',
   //      infoText: '正在加载中'
	  //   	});
   //    setTimeout(()=>{
   //            dialog1.close()
   //          },500)
      var data = {
            mobile:$('#code').val()
          };
          data = JSON.stringify(data)
          $.ajax({
          type: 'POST',
          url: $scope.url+'/dp-pro/lampo/activity1/getByMobile',
          data: data,
          contentType:'application/json',
          success: function(res){
                if(res){
                  var info = JSON.parse(res)
                  console.log(info)
                  $scope.info = info
                  $scope.$apply()
                  $('.cus').show({
                    duration: 200
                  })
                  }else{
                    var dialog1 = $(document).dialog({
                        content:'无此用户',
                    });
                  }
          },
          error:function(res){
            var dialog2 = $(document).dialog({
                            content: '系统错误，请稍后再试',
                            overlayClose: true
                        });
          }
        });
		}else{
      var dialog3 = $(document).dialog({
        type : 'notice',
        infoIcon: 'images/fail.png',
        infoText: '手机号码错误'
      });
      setTimeout(()=>{
        dialog3.close()
      },500)
		}
	}
  $scope.confirm = function(e){
    $(document).dialog({
        type : 'confirm',
        content: '确定核验该用户吗',
        onClickConfirmBtn: function(){
          var data = {
            mobile:$scope.info.mobile
          };
          data = JSON.stringify(data)
          $.ajax({
          type: 'POST',
          url: $scope.url+'/dp-pro/lampo/activity1/hexiao',
          data: data,
          contentType:'application/json',
          success: function(res){
                var info = JSON.parse(res)
                console.log(info)
                if(info.code==0){
                  $scope.check()
                  }else{
                    var dialog1 = $(document).dialog({
                        content:'操作失败',
                    });
                  }
          },
          error:function(res){
            var dialog2 = $(document).dialog({
                            content: '系统错误，请稍后再试',
                            overlayClose: true
                        });
          }
        });
        }
    });
  }
}])
