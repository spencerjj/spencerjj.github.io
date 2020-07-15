var app = angular.module('myApp', []);
app.controller('myController',['$scope','$http',function($scope,$http){
	if($.cookie('ifLampoReport')&&$.cookie('ifLampoReport')==1){
		location.replace("success.html")
	}else{
		$('.content').show()
	}
	// $scope.url = 'http://192.168.2.50:8080'
	$scope.url = 'http://web.princesky.com:8088'
	$scope.mark = 1;
	$scope.ifbottom = 0;
	$scope.code = '';
	 // $(window).scroll(function(){
  //       if ($(window).scrollTop() + $(window).height() == $(document).height()) {
  //       	$('.login').removeClass('ifbottom')
  //       	$scope.ifbottom = 1
  //       }
  //   });


	setTimeout(()=>{
		$('.login').removeClass('ifbottom')
        $scope.ifbottom = 1
	},1000)
	getName=function(e){
		if($('#name').val().length>20){
			$('#name').val(($('#name').val()).substring(0,20))
		}
	}
	getNum=function(e){
		if($('#number').val().length>11){
			$('#number').val(($('#number').val()).substring(0,11))
		}
	}
	getNum1=function(e){
		if($('#code').val().length>6){
			$('#code').val(($('#code').val()).substring(0,6))
		}
	}
	send = function(){
		var ifPhone = /^1[3456789]\d{9}$/.test($('#number').val())
		if(!ifPhone){
			var dialog1 = $(document).dialog({
				content: '请输入正确的手机号',
				overlayClose: true
	    	});
		}else{
			if($scope.mark==1){
				$scope.mark = 2;
      		var data = {
            mobile:$('#number').val()
          };
          data = JSON.stringify(data)
          $.ajax({
          type: 'POST',
          url: $scope.url+'/dp-pro/lampo/activity1/getByMobile',
          data: data,
          contentType:'application/json',
          success: function(res){
                if(res){
                	$scope.mark = 1;
                 var dialog1 = $(document).dialog({
				content: '该手机号已报名活动',
				overlayClose: true
	    	});
                  }else{
                  	if($.cookie('myTimes')&&$.cookie('myTimes')-1+1>2){
                  		var dialog2 = $(document).dialog({
	                            content: '短信发送过于频繁，请稍后再试',
	                            overlayClose: true
	                        });
                  		return;
                  	}

                              $.ajax({
						          type: 'POST',
						          url: $scope.url+'/dp-pro/lampo/activity1/yzm',
						          data: data,
						          contentType:'application/json',
						          success: function(res){
						            if(res){
						            	var dialog1 = $(document).dialog({
								        type : 'notice',
								        infoText: '验证码已发送'
									    	});
								      setTimeout(()=>{
								              dialog1.close()
								            },1000)
				                        var code = res.replace(/\"/g, "");;
                						var date = new Date(); 
										var minutes = 10; 
										date.setTime(date.getTime()+(minutes * 60 * 1000))
				                        $.cookie('myCode', code, {expires: date});
				                        if($.cookie('myTimes')){
											var myTimes = $.cookie('myTimes')-1+2
					                		$.cookie('myTimes', myTimes, {expires: date});
						                }else{
						                    $.cookie('myTimes', 1, {expires: date});
						                }
				                        $('.mRight').addClass('sendState')
										$scope.time = 60;
										var temp = setInterval(function(){
											if($scope.time!=1){
												$scope.time--;
												$('.mRight').html('重新发送('+$scope.time+')')
											}else{
												$('.mRight').removeClass('sendState').html('重新发送');
												clearInterval(temp);
												$scope.mark=1
											}
										},1000)
				                    }else{
				                    	var dialog1 = $(document).dialog({
									        type : 'notice',
									        infoText: '系统错误，请稍后再试'
										    	});
									    setTimeout(()=>{
							              dialog1.close()
							            },1000)
				                    }
						          },
						          error:function(res){
						            var dialog2 = $(document).dialog({
			                            content: '系统错误，请稍后再试',
			                            overlayClose: true
			                        });
			                        $scope.mark = 1;
						          }
						        });
                  }
          },
          error:function(res){
            var dialog2 = $(document).dialog({
                            content: '系统错误，请稍后再试',
                            overlayClose: true
                        });
            $scope.mark = 1;
          }
        });



			}
		}
	}
	$scope.login = function(){
		if($scope.ifbottom==1){
			var ifPhone = /^1[3456789]\d{9}$/.test($('#number').val())
			if(!ifPhone){
				var dialog1 = $(document).dialog({
					content: '请输入正确的手机号',
					overlayClose: true
		    	});
			}else if($('#code').val().length!=6){
				var dialog1 = $(document).dialog({
					content: '请输入验证码',
					overlayClose: true
		    	});
			}else if($('#name').val().length==0){
				var dialog1 = $(document).dialog({
					content: '请输入您的姓名，如:张女士',
					overlayClose: true
		    	});
			}else if($('#code').val()!=$.cookie('myCode')){
				var dialog1 = $(document).dialog({
					content: '验证码错误',
					overlayClose: true
		    	});
			}
			else{
				var dialog1 = $(document).dialog({
			        type : 'notice',
			        infoIcon: 'images/loading.gif',
			        infoText: '正在报名中',
			        overlayClose: true
		    	});
		    	setTimeout(()=>{
	              dialog1.close()
	            },1000)
				// $http.get($scope.url+'/dp-pro/lampo/activity1/save?mobile='+$('#number').val()+'&name='+$('#name').val()).success(function(res){
	   //              // console.log(JSON.stringify(res))
	   //              // var data = JSON.stringify(res)
	   //              console.log(res.code)
	   //              dialog1.close()
	   //          }).error(function(res){
	   //              dialog1.close()
	   //              var dialog2 = $(document).dialog({
    //                     content: '系统错误，请稍后再试',
    //                     overlayClose: true
    //                 });
	   //      	})
	        var data = {
	        	mobile:$('#number').val(),
	        	name:$('#name').val()
	        };
	        data = JSON.stringify(data)
	        $.ajax({
				  type: 'POST',
				  url: $scope.url+'/dp-pro/lampo/activity1/save',
				  data: data,
				  contentType:'application/json',
				  success: function(res){
				  		let info = JSON.parse(res)
				  		if(info.code==500){
                        var dialog1 = $(document).dialog({
                            content: info.msg,
                        });
	                    }else if(info.code==0){
	                    	$.cookie('ifLampoReport', 1, {expires: 30});
	                        location.replace("success.html")
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
		}
		
	}
}])
