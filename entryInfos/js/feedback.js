var app = angular.module('myApp', []);


app.controller('indexController', ['$scope', '$http', function($scope, $http) {



// window.localStorage.clear()
	// 特效
	$("#loading .gif").animate({
		opacity: 0
	}, 1500, function() {
		$("#loading").animate({
			height: 0
		}, function() {
			$(this).hide();
		})
	})


	var url = 'https://hr.princesky.com'
	// var url = 'http://192.168.2.50:8083'



	
	
	$("#image").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#expression").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#communication").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#analysis").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#organization").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#experience").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#motivation").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#personality").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#knowledge").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#other").picker({
		title: "请选择评分",
		cols: [{
			textAlign: 'center',
			values: ['1', '2','3','4','5']
		}]
	});
	$("#advise").picker({
		title: "请选择建议",
		cols: [{
			textAlign: 'center',
			values: ['录用', '进入下一轮面试','后备','不推荐']
		}]
	});
	
	inputChange = function(id) {
		console.log(id+'+'+$("#" + id).val())

	}

	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}
	var ifAll = false
	confirm = function() {	
		if ($('#evaluate').val() && $('#evaluate').val().length != 0) {
			ifAll = true
		} else {
			$.toptip('请填写综合评价', 'warning')
			ifAll = false
			return;
		}
		if ($('#evaluater').val() && $('#evaluater').val().length != 0) {
			ifAll = true
		} else {
			$.toptip('请填写面试官', 'warning')
			ifAll = false
			return;
		}
		var data  = {
			image:$('#image').val(),
			expression:$('#expression').val(),
			communication:$('#communication').val(),
			analysis:$('#analysis').val(),
			experience:$('#experience').val(),
			organization:$('#organization').val(),
			motivation:$('#motivation').val(),
			personality:$('#personality').val(),
			knowledge:$('#knowledge').val(),
			other:$('#other').val(),
			advise:$('#advise').val(),
			evaluate:$('#evaluate').val(),
			adviseOfficeName:$('#adviseOfficeName').val(),
			evaluater:$('#evaluater').val(),
			'candidateId.id':getQueryString('candidateId')
		}
		if (ifAll) {
			console.log(data)
			$.confirm("确认提交面试评价单吗", function() {
				$('#waiting').removeClass('hide')
			  $.ajax({
			  	url: url+'/hr/v1/lampo/candidateInfo/saveEvaluate',
			  	type: 'POST',
			  	data: data,
			  	async: false,
			  	success: function(data) {
			  		console.log(data.data)
			  		setTimeout(() => {
			  			location.replace('successhr.html');
			  		}, 1000)
			  	},
			  	error: function(err) {
			  		$.toptip('系统错误，请稍后再试', 'warning')
			  		setTimeout(() => {
			  			// $.hideLoading()
			  			$('#waiting').addClass('hide')
			  		}, 1000)
			  	}
			  })
			  }, function() {
			  });
			


		}
	}
}])
