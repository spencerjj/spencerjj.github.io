var app = angular.module('myApp', []);


app.controller('indexController', ['$scope', '$http', function($scope, $http) {
	
	var signPath=''
	$scope.myCity =''
	$scope.myRegister = ''
	$scope.nowId = ''
		$(document).on('ready', function() {
			if ($('.js-signature').length) {
				$('.js-signature').jqSignature();
			}
		});
		if(getQueryString('flag')==2){
			$scope.title = '入职登记表'
			$scope.welcome = '欢迎入职本公司'
		}else{
			$scope.title = '应聘登记表'
			$scope.welcome = '欢迎来到本公司应聘'
		}
		if(getQueryString('isSchool')=='Y'){
			$scope.experience = '在校经历'
		}else{
			$scope.experience = '工作经历'
		}
		clearCanvas = function(e) {
			window.event.stopPropagation();  
			$('#signature').html('<p><em>Your signature will appear here when you click "Save Signature"</em></p>');
			$('.js-signature').eq(0).jqSignature('clearCanvas');
			$('#saveBtn').attr('disabled', true);
			return false;
		}

		saveSignature = function() {
			window.event.stopPropagation();  	
			$('#signature').empty();
			var dataUrl = $('.js-signature').eq(0).jqSignature('getDataURL');
			$('#showSign').attr('src', dataUrl);
			signPath = dataUrl
			signHide()
		}

		$('.js-signature').eq(0).on('jq.signature.changed', function() {
			$('#saveBtn').attr('disabled', false);
		});
		signShow = function(){
			$('html,body').addClass('ovfHiden')
			$('.sign').css	('left','0')
		}
		signHide = function(){
			$('html,body').removeClass('ovfHiden')
			$('.sign').css	('left','100%')
			setTimeout(()=>{$("html, body").scrollTop( document.body.scrollHeight)},1)
			console.log(321)
		}
		addressShow = function(id){
			$('html,body').addClass('ovfHiden')
			$('.cityPick').css	('left','0')
			$scope.nowId = id
		}
		addressHide = function(){
			setTimeout(()=>{$("html, body").scrollTop('500')},1)
			$('html,body').removeClass('ovfHiden')
			$('.cityPick').css	('left','100%')
		}
		getCity = function(id){
			window.event.stopPropagation();  	
			console.log($('#province1').val()+$('#city1').val()+$('#district1').val())
			if($scope.nowId==1){
				$scope.myCity = ''
				$scope.myCity = $('#province1').val()+$('#city1').val()+$('#district1').val()
				window.localStorage.setItem('lbmyCity', $scope.myCity);
			}else{
				$scope.myRegister = ''
				$scope.myRegister = $('#province1').val()+$('#city1').val()+$('#district1').val()
				console.log($scope.myRegister)
				window.localStorage.setItem('lbmyRegister', $scope.myRegister);
			}
			$scope.$apply()
			addressHide()
		}
		ifAdd = function(e){
			if(e==1){
				if($scope.myCity.length==0){
					addressShow(1)
				}
			}else if(e==2){
				if($scope.myRegister.length==0){
					addressShow(2)
				}
			}
			
		}
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
	$(window).scroll(function() {
		var sTop = $(this).scrollTop();
		if (sTop > 100) {
			$('.totop').show().css('opacity', (sTop - 100) / 100);
		} else {
			$('.totop').hide();
		}
	});
	$('.totop').click(function() {
		$("html, body").animate({
			scrollTop: 0
		}, 1000);
		return false;
	});
	var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	var totalFormData = '';
	var data = [];
	data.emCode = '';
	data.empName = '';
	data.officeCode = '';
	data.officeName = '';
	data.avatar = '';
	data.sex = 1;
	data.hasFriend = 0;
	data.marry = 0;
	data.hasRegulations = 0;
	// var url = 'http://192.168.2.50:8083'
	var url = 'https://hr.princesky.com'

	// window.localStorage.setItem('lbsex', 1);
	// window.localStorage.setItem('lbhasFriend', 0);
	// window.localStorage.setItem('lbmarry', 0);
	// window.localStorage.setItem('lbhasRegulations', 0);

	data.candidateEducationList = [];
	data.candidateJobList = [];
	data.candidateFamilyList = [];
	var ifChange1 = false;
	var ifChange2 = false;

	// window.localStorage.setItem('lbifChange1', false);
	// window.localStorage.setItem('lbifChange2', false);

	var ifAll = false;
	var educationMark = 1;
	var jobListMark = 1;
	var familyListMark = 1;

	// window.localStorage.setItem('lbeducationMark', 1);
	// window.localStorage.setItem('lbjobListMark', 1);
	// window.localStorage.setItem('lbfamilyListMark', 1);

	var postList = []
	var postOriList = []
	
	var keys = ['name', 'sex', 'sign', 'birthday', 'acceptPost', 'mobile', 'email', 'height', 'weight', 'birthAddress',
		'address', 'marry', 'education', 'political', 'nation','characteristics','interests','achievement','expertise',
		'register', 'linkMan', 'relation', 'linkMobile', 'monMoney', 'monBaseMoney', 'reward', 'yearMoney', 'acceptMoney','startMoney',
		'endMoney','englishLevel','myCity','myRegister',
		'languages', 'writing', 'listen', 'hasFriend', 'friendName', 'hasRegulations', 'regulationsReason', 'avatar',
		'school', 'startDate', 'endDate', 'specialty', 'cert',
		'school2', 'startDate2', 'endDate2', 'specialty2', 'cert2',
		'school3', 'startDate3', 'endDate3', 'specialty3', 'cert3',
		'jobStartDate', 'jobEndDate', 'company', 'post', 'monthMoney', 'certifier', 'certifierJob', 'certifierMobile',
		'jobStartDate2', 'jobEndDate2', 'company2', 'post2', 'monthMoney2', 'certifier2', 'certifierJob2',
		'certifierMobile2',
		'jobStartDate3', 'jobEndDate3', 'company3', 'post3', 'monthMoney3', 'certifier3', 'certifierJob3',
		'certifierMobile3',
		'familyName', 'familyRelation', 'companySame', 'mobileSame', 'dutySame',
		'familyName2', 'familyRelation2', 'companySame2', 'mobileSame2', 'dutySame2',
		'familyName3', 'familyRelation3', 'companySame3', 'mobileSame3', 'dutySame3',
		'educationMark', 'jobListMark', 'familyListMark','imgPath'
	]
	for(let x in keys){
		if(window.localStorage.getItem('lb'+keys[x])&&window.localStorage.getItem('lb'+keys[x]).length!=0){
			console.log(keys[x]+','+window.localStorage.getItem('lb'+keys[x]))
			if(keys[x]=='hasFriend'&&window.localStorage.getItem('lbhasFriend')==1){
				console.log('有朋友')
				$('#hasFriend').prop('checked','true')
				$('#ifFriend').removeClass('hide')
				ifChange1 = true
				data.hasFriend = 1
			}else if(keys[x]=='hasRegulations'&&window.localStorage.getItem('lbhasRegulations')==1){
				console.log('犯罪而')
				$('#hasRegulations').prop('checked','true')
				$('#ifRegulations').removeClass('hide')
				ifChange2 = true
				data.hasRegulations = 1
			}else if(keys[x]=='educationMark'&&window.localStorage.getItem('lbeducationMark')==2){
				$('.edu2').removeClass('hide')
				$('#deleteEdu').removeClass('light')
				$('#addEdu').removeClass('light')
				educationMark = 2
			}else if(keys[x]=='educationMark'&&window.localStorage.getItem('lbeducationMark')==3){
				$('.edu2').removeClass('hide')
				$('.edu3').removeClass('hide')
				$('#deleteEdu').removeClass('light')
				$('#addEdu').addClass('light')
				educationMark = 3
			}else if(keys[x]=='jobListMark'&&window.localStorage.getItem('lbjobListMark')==2){
				$('.job2').removeClass('hide')
				$('#deleteJob').removeClass('light')
				$('#addJob').removeClass('light')
				jobListMark = 2
			}else if(keys[x]=='jobListMark'&&window.localStorage.getItem('lbjobListMark')==3){
				$('.job2').removeClass('hide')
				$('.job3').removeClass('hide')
				$('#deleteJob').removeClass('light')
				$('#addJob').addClass('light')
				jobListMark = 3
			}else if(keys[x]=='familyListMark'&&window.localStorage.getItem('lbfamilyListMark')==2){
				$('.family2').removeClass('hide')
				$('#deleteFamily').removeClass('light')
				$('#addFamily').removeClass('light')
				familyListMark = 2
			}else if(keys[x]=='familyListMark'&&window.localStorage.getItem('lbfamilyListMark')==3){
				$('.family2').removeClass('hide')
				$('.family3').removeClass('hide')
				$('#deleteFamily').removeClass('light')
				$('#addFamily').addClass('light')
				familyListMark = 3
			}
			else{
				if(window.localStorage.getItem('lbstartDate')&&window.localStorage.getItem('lbstartDate').length!=0){
					$('#startDate').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbmyCity')&&window.localStorage.getItem('lbmyCity').length!=0){
					$scope.myCity = window.localStorage.getItem('lbmyCity')
				}
				if(window.localStorage.getItem('lbmyRegister')&&window.localStorage.getItem('lbmyRegister').length!=0){
					$scope.myRegister = window.localStorage.getItem('lbmyRegister')
				}
				if(window.localStorage.getItem('lbendDate')&&window.localStorage.getItem('lbendDate').length!=0){
					$('#endDate').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbstartDate2')&&window.localStorage.getItem('lbstartDate2').length!=0){
					$('#startDate2').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbendDate2')&&window.localStorage.getItem('lbendDate2').length!=0){
					$('#endDate2').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbstartDate3')&&window.localStorage.getItem('lbstartDate3').length!=0){
					$('#startDate3').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbendDate3')&&window.localStorage.getItem('lbendDate3').length!=0){
					$('#endDate3').removeClass('show_placeholder');
				}
				
				if(window.localStorage.getItem('lbjobStartDate')&&window.localStorage.getItem('lbjobStartDate').length!=0){
					$('#jobStartDate').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbjobEndDate')&&window.localStorage.getItem('lbjobEndDate').length!=0){
					$('#jobEndDate').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbjobStartDate2')&&window.localStorage.getItem('lbjobStartDate2').length!=0){
					$('#jobStartDate2').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbjobEndDate2')&&window.localStorage.getItem('lbjobEndDate2').length!=0){
					$('#jobEndDate2').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbjobStartDate3')&&window.localStorage.getItem('lbjobStartDate3').length!=0){
					$('#jobStartDate3').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbjobEndDate3')&&window.localStorage.getItem('lbjobEndDate3').length!=0){
					$('#jobEndDate3').removeClass('show_placeholder');
				}
				if(window.localStorage.getItem('lbimgPath')&&window.localStorage.getItem('lbimgPath').length!=0){
					$("#showIMG").attr("src", window.localStorage.getItem('lbimgPath'));
					$("#showIMG").removeClass('hide')
				}
				$('#'+keys[x]).val(window.localStorage.getItem('lb'+keys[x]))
				data[keys[x]] = window.localStorage.getItem('lb'+keys[x])	
			}
		}
	}

	
	var moneyLists = ['1500以下','1500-1999','2000-2999','3000-4499','4500-5999','6000-7999','8000-9999','10000-14999',
					  '15000-19999','20000-24999','25000-29999','30000-34999','35000-39999','40000-44999','45000-49999',
					  '50000-69999','70000-99999','100000以上']
	var familyLists = ['夫妻','父母','母子','父子','兄弟','姐妹','其他']
	$("#sex").picker({
		title: "请选择性别",
		cols: [{
			textAlign: 'center',
			values: ['男', '女']
		}]
	});
	$("#marry").picker({
		title: "请选择婚姻状况",
		cols: [{
			textAlign: 'center',
			values: ['未婚', '已婚']
		}]
	});
	$("#acceptMoney").picker({
		title: "请选择期望薪资",
		cols: [{
			textAlign: 'center',
			values: moneyLists
		}]
	});
	$("#education").picker({
		title: "请选择文化程度",
		cols: [{
			textAlign: 'center',
			values: ['初中及以下','中专/高中','大专','本科','硕士','博士']
		}]
	});
	$("#political").picker({
		title: "请选择政治面貌",
		cols: [{
			textAlign: 'center',
			values: ['普通公民','无党派民主人士','民主党派人士','共青团员','中国预备党员','中国党员']
		}]
	});
	$("#familyRelation").picker({
		title: "请选择关系",
		cols: [{
			textAlign: 'center',
			values: familyLists
		}]
	});
	$("#familyRelation2").picker({
		title: "请选择关系",
		cols: [{
			textAlign: 'center',
			values: familyLists
		}]
	});
	$("#familyRelation3").picker({
		title: "请选择关系",
		cols: [{
			textAlign: 'center',
			values: familyLists
		}]
	});
	$.ajax({
		url: url+'/hr/v1/lampo/postRecruitment/listAll',
		type: 'POST',
		data: '',
		// async: false,
		success: function(data) {
			// console.log(data)
			for (let x in data) {
				postOriList = data;
				postList.push(data[x].post.postName)
			}
			// console.log(postList)
		},
		error: function(err) {
			$.toptip('系统错误，无法获取岗位列表', 'warning')
			setTimeout(() => {
				$.hideLoading()
			}, 1000)
		}
	})
	$("#acceptPost").picker({
		title: "请选择应聘岗位",
		cols: [{
			textAlign: 'center',
			values: postList
		}]
	});


	$('#birthday').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#birthday').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#startDate').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#startDate').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#startDate2').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#startDate2').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#startDate3').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#startDate3').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#endDate').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#endDate').focus(function() {
		$(this).removeClass('show_placeholder');
	})
	$('#endDate2').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#endDate2').focus(function() {
		$(this).removeClass('show_placeholder');
	})
	$('#endDate3').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#endDate3').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#jobStartDate').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#jobStartDate').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#jobStartDate2').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#jobStartDate2').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#jobStartDate3').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#jobStartDate3').focus(function() {
		$(this).removeClass('show_placeholder');
	})

	$('#jobEndDate').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#jobEndDate').focus(function() {
		$(this).removeClass('show_placeholder');
	})
	$('#jobEndDate2').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#jobEndDate2').focus(function() {
		$(this).removeClass('show_placeholder');
	})
	$('#jobEndDate3').blur(function() {
		var obj = $(this);
		if (!obj.val()) {
			$(this).addClass('show_placeholder');
		} else {
			$(this).removeClass('show_placeholder');
		}
	});
	$('#jobEndDate3').focus(function() {
		$(this).removeClass('show_placeholder');
	})
	// $("#hasFriend").picker({
	//   title: "请选择是否有熟人",
	//   cols: [
	//  {
	//    textAlign: 'center',
	//    values: ['是','否']
	//  }
	//   ]
	// });
	// $("#hasRegulations").picker({
	//   title: "请选择是否违纪",
	//   cols: [
	//  {
	//    textAlign: 'center',
	//    values: ['是','否']
	//  }
	//   ]
	// });

	// 上传图片
	upload = function(e) {
		var imgFile = e.target.files[0];
		if (window.FileReader) {
			var reader = new FileReader();
			reader.readAsDataURL(imgFile);
			reader.onloadend = function(e) {
				$("#showIMG").attr("src", e.target.result);
				$("#showIMG").removeClass('hide')
				window.localStorage.setItem('lbimgPath', e.target.result);
				// $('#deleteIMG').removeClass('hide')
			};
		}
		console.log(imgFile)
		var formData = new FormData();
		formData.append('file', imgFile);
		console.log(formData)
		// data.avatar = formData
		// var temp={
		//  'filePath':formData,
		//  'name':'file'
		// }
		$.ajax({
			url: url+'/hr/v1/lampo/candidateInfo/uploadCandidateImg',
			dataType: 'json',
			type: 'POST',
			// async: false,
			data: formData,
			processData: false, // 使数据不做处理
			contentType: false,
			success: function(res) {
				console.log(res.data)
				data.avatar = res.data
				window.localStorage.setItem('lbavatar', res.data);
			},
			error: function(err) {
				$.toptip('系统错误，请稍后再试', 'warning')
			}
		})
	}
	// deleteImg = function(){
	//  $("#showIMG").attr("src",'');
	//  $('#deleteIMG').addClass('hide');
	//  totalFormData = ''
	// }

	inputChange = function(id) {
		console.log($("#" + id).val())
		window.localStorage.setItem('lb' + id, $("#" + id).val());
		$('.'+id+'Title').removeClass('error')
		$('.'+id+'Title').parent().parent().find('i').addClass('hide')
		if (id == 'name' || id == 'birthday' || id == 'sign' || id == 'mobile' || id == 'email' || id == 'acceptPost') {
			if ($("#" + id).val().length == 0) {
				$('.' + id + 'Title').addClass('error')
				$('.' + id + 'Title').parent().parent().find('i').removeClass('hide')
			} else {
				$('.' + id + 'Title').removeClass('error')
				$('.' + id + 'Title').parent().parent().find('i').addClass('hide')
			}
		}

		if (id == 'name') {
			data.name = $("#name").val()
		}
		if (id == 'sex') {
			if ($("#sex").val() == '男') {
				data.sex = 1
			} else {
				data.sex = 2
			}
		}
		if (id == 'marry') {
			if ($("#marry").val() == '已婚' || $("#marry").val() == 1) {
				data.marry = 1
			} else {
				data.marry = 2
			}
		}
		if (id == 'acceptPost') {
			data.acceptPost = $("#acceptPost").val()
		}
		if (id == 'height') {
			data.height = $("#height").val()
		}
		if (id == 'weight') {
			data.weight = $("#weight").val()
		}
		if (id == 'birthday') {
			data.birthday = $("#birthday").val()
		}

		if (id == 'birthAddress') {
			data.birthAddress = $("#birthAddress").val()
		}
		if (id == 'sign') {
			data.sign = $("#sign").val()
			if ($('#sign').val().length == 18) {
				let birthday = ($('#sign').val()).slice(6, 14);
				birthday = birthday.replace(/(.{4})(.{2})(.{2})/, "$1年$2月$3日")
				$('#birthday').val(birthday);
				data.birthday = $("#birthday").val()
				window.localStorage.setItem('lbbirthday', $("#birthday").val());
			}
		}

		if (id == 'address') {
			data.address = $("#address").val()
		}
		if (id == 'mobile') {
			data.mobile = $("#mobile").val()
		}
		if (id == 'register') {
			data.register = $("#register").val()
		}
		if (id == 'email') {
			data.email = $("#email").val()
		}
		if (id == 'linkMan') {
			data.linkMan = $("#linkMan").val()
		}
		if (id == 'relation') {
			data.relation = $("#relation").val()
		}
		if (id == 'linkMobile') {
			data.linkMobile = $("#linkMobile").val()
		}
		if (id == 'monMoney') {
			data.monMoney = $("#monMoney").val()
		}
		if (id == 'monBaseMoney') {
			data.monBaseMoney = $("#monBaseMoney").val()
		}
		if (id == 'reward') {
			data.reward = $("#reward").val()
		}
		if (id == 'yearMoney') {
			data.yearMoney = $("#yearMoney").val()
		}
		if (id == 'education') {
			data.education = $("#education").val()
		} 
		if (id == 'political') {
			data.political = $("#political").val()
		} 
		if (id == 'nation') {
			data.nation = $("#nation").val()
		} 
		
		if (id == 'characteristics') {
			data.characteristics = $("#characteristics").val()
		} 
		if (id == 'interests') {
			data.interests = $("#interests").val()
		} 
		if (id == 'achievement') {
			data.achievement = $("#achievement").val()
		} 
		if (id == 'expertise') {
			data.expertise = $("#expertise").val()
		} 
		if (id == 'acceptMoney') {
			data.acceptMoney = $("#acceptMoney").val()
		}
		if (id == 'startMoney') {
			data.startMoney = $("#startMoney").val()
			data.acceptMoney = $("#startMoney").val()+'-'+$("#endMoney").val()
			$('.acceptMoneyTitle').removeClass('error')
			$('.acceptMoneyTitle').parent().parent().find('i').addClass('hide')
		}
		if (id == 'endMoney') {
			data.endMoney = $("#endMoney").val()
			data.acceptMoney =$("#startMoney").val()+'-'+$("#endMoney").val()
			$('.acceptMoneyTitle').removeClass('error')
			$('.acceptMoneyTitle').parent().parent().find('i').addClass('hide')
		}
		if (id == 'englishLevel') {
			data.englishLevel = $("#englishLevel").val()
		}
		if (id == 'languages') {
			data.languages = $("#languages").val()
		}
		if (id == 'writing') {
			data.writing = $("#writing").val()
		}
		if (id == 'listen') {
			data.listen = $("#listen").val()
		}
		if (id == 'hasFriend') {
			ifChange1 = !ifChange1;
			if (ifChange1) {
				data.hasFriend = 1
				window.localStorage.setItem('lbhasFriend', 1);
			} else {
				data.hasFriend = 0
				window.localStorage.removeItem('lbhasFriend');
				window.localStorage.removeItem('lbfriendName');
			}
		}
		if (id == 'friendName') {
			data.friendName = $("#friendName").val()
			window.localStorage.setItem('lbfriendName', $("#friendName").val());
		}
		if (id == 'hasRegulations') {
			ifChange2 = !ifChange2;
			if (ifChange2) {
				data.hasRegulations = 1
				window.localStorage.setItem('lbhasRegulations', 1);
			} else {
				data.hasRegulations = 0
				window.localStorage.setItem('lbhasRegulations', 0);
				window.localStorage.removeItem('lbhasRegulations');
				window.localStorage.removeItem('lbregulationsReason');
			}
		}
		if (id == 'regulationsReason') {
			data.regulationsReason = $("#regulationsReason").val()
			window.localStorage.setItem('lbregulationsReason', $("#regulationsReason").val());
		}


		//熟人表单判断
		if (ifChange1) {
			$('#ifFriend').removeClass('hide')
		} else {
			$('#ifFriend').addClass('hide')
			$('#friendName').val('')
		}
		// 违纪表单判断
		if (ifChange2) {
			$('#ifRegulations').removeClass('hide')
		} else {
			$('#ifRegulations').addClass('hide')
			$('#regulationsReason').val('')
		}
	}
	addEducation = function() {
		if (educationMark < 2) {
			educationMark++
			window.localStorage.setItem('lbeducationMark', educationMark);
		} else {
			$.toptip('最多添加两条教育经历', 'warning')
		}
		if (educationMark == 1) {
			$('#deleteEdu').addClass('light')
		}
		if (educationMark == 2) {
			// $('.edu2').removeClass('hide')
			$('.edu2').show({
				duration: 300,
			})
			$('#deleteEdu').removeClass('light')
			$('#addEdu').addClass('light')
		}
	}
	deleteEducation = function() {
		if (educationMark == 1) {}
		if (educationMark == 2) {
			// $('.edu2').addClass('hide')
			$('.edu2').hide({
				duration: 300,
			})
			$('#deleteEdu').addClass('light')
			$('#addEdu').removeClass('light')
			$('#school2').val('')
			$('#startDate2').val('')
			$('#endDate2').val('')
			$('#specialty2').val('')
			$('#cert2').val('')
			window.localStorage.removeItem('lbschool2')
			window.localStorage.removeItem('lbstartDate2')
			window.localStorage.removeItem('lbendDate2')
			window.localStorage.removeItem('lbspecialty2')
			window.localStorage.removeItem('lbcert2')
			$('#startDate2').addClass('show_placeholder');
			$('#endDate2').addClass('show_placeholder');
		}
		if (educationMark > 1) {
			educationMark--
			window.localStorage.setItem('lbeducationMark', educationMark);
		}

	}

	addJobList = function() {
		if (jobListMark < 3) {
			jobListMark++
			window.localStorage.setItem('lbjobListMark', jobListMark);
		} else {
			$.toptip('最多添加三条工作经历', 'warning')
		}
		if (jobListMark == 1) {
			$('#deleteJob').addClass('light')
		}
		if (jobListMark == 2) {
			// $('.job2').removeClass('hide')
			$('.job2').show({
				duration: 300,
			})
			$('#deleteJob').removeClass('light')
			$('#addJob').removeClass('light')
		}
		if (jobListMark == 3) {
			// $('.job3').removeClass('hide')
			$('.job3').show({
				duration: 300,
			})
			$('#addJob').addClass('light')
		}
	}
	deleteJobList = function() {
		if (jobListMark == 1) {}
		if (jobListMark == 3) {
			// $('.job3').addClass('hide')
			$('.job3').hide({
				duration: 300,
			})
			$('#addJob').removeClass('light')
			$('#jobStartDate3').val('')
			$('#jobEndDate3').val('')
			$('#company3').val('')
			$('#post3').val('')
			$('#monthMoney3').val('')
			$('#certifier3').val('')
			$('#certifierJob3').val('')
			$('#certifierMobile3').val('')
			window.localStorage.removeItem('lbjobStartDate3')
			window.localStorage.removeItem('lbjobEndDate3')
			window.localStorage.removeItem('lbcompany3')
			window.localStorage.removeItem('lbpost3')
			window.localStorage.removeItem('lbmonthMoney3')
			window.localStorage.removeItem('lbcertifier3')
			window.localStorage.removeItem('lbcertifierJob3')
			window.localStorage.removeItem('lbcertifierMobile3')
			$('#jobStartDate3').addClass('show_placeholder');
			$('#jobEndDate3').addClass('show_placeholder');
		}
		if (jobListMark == 2) {
			// $('.job2').addClass('hide')
			$('.job2').hide({
				duration: 300,
			})
			$('#deleteJob').addClass('light')
			$('#addJob').removeClass('light')
			$('#jobStartDate2').val('')
			$('#jobEndDate2').val('')
			$('#company2').val('')
			$('#post2').val('')
			$('#monthMoney2').val('')
			$('#certifier2').val('')
			$('#certifierJob2').val('')
			$('#certifierMobile2').val('')
			window.localStorage.removeItem('lbjobStartDate2')
			window.localStorage.removeItem('lbjobEndDate2')
			window.localStorage.removeItem('lbcompany2')
			window.localStorage.removeItem('lbpost2')
			window.localStorage.removeItem('lbmonthMoney2')
			window.localStorage.removeItem('lbcertifier2')
			window.localStorage.removeItem('lbcertifierJob2')
			window.localStorage.removeItem('lbcertifierMobile2')
			$('#jobStartDate2').addClass('show_placeholder');
			$('#jobEndDate2').addClass('show_placeholder');
		}
		if (jobListMark > 1) {
			jobListMark--
			window.localStorage.setItem('lbjobListMark', jobListMark);
		}

	}

	addFamilyList = function() {
		if (familyListMark < 3) {
			familyListMark++
			window.localStorage.setItem('lbfamilyListMark', familyListMark);
		} else {
			$.toptip('最多添加三条家庭信息', 'warning')
		}
		if (familyListMark == 1) {
			$('#deleteFamily').addClass('light')
		}
		if (familyListMark == 2) {
			// $('.family2').removeClass('hide')
			$('.family2').show({
				duration: 300,
			})
			$('#deleteFamily').removeClass('light')
			$('#addFamily').removeClass('light')
		}
		if (familyListMark == 3) {
			// $('.family3').removeClass('hide')
			$('.family3').show({
				duration: 300,
			})
			$('#addFamily').addClass('light')
		}
	}
	deleteFamilyList = function() {
		//  if(familyListMark==1){
		//  }
		if (familyListMark == 3) {
			// $('.family3').addClass('hide')
			$('.family3').hide({
				duration: 300,
			})
			$('#addFamily').removeClass('light')
			$('#familyName3').val('')
			$('#familyRelation3').val('')
			$('#companySame3').val('')
			$('#mobileSame3').val('')
			$('#dutySame3').val('')
			window.localStorage.removeItem('lbfamilyName3')
			window.localStorage.removeItem('lbfamilyRelation3')
			window.localStorage.removeItem('lbcompanySame3')
			window.localStorage.removeItem('lbmobileSame3')
			window.localStorage.removeItem('lbdutySame3')
		}
		if (familyListMark == 2) {
			// $('.family2').addClass('hide')
			$('.family2').hide({
				duration: 300,
			})
			$('#deleteFamily').addClass('light')
			$('#addFamily').removeClass('light')
			$('#familyName2').val('')
			$('#familyRelation2').val('')
			$('#companySame2').val('')
			$('#mobileSame2').val('')
			$('#dutySame2').val('')
			window.localStorage.removeItem('lbfamilyName2')
			window.localStorage.removeItem('lbfamilyRelation2')
			window.localStorage.removeItem('lbcompanySame2')
			window.localStorage.removeItem('lbmobileSame2')
			window.localStorage.removeItem('lbdutySame2')
		}
		if (familyListMark > 1) {
			familyListMark--
			window.localStorage.setItem('lbfamilyListMark', familyListMark);
		}

	}

	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return decodeURI(r[2]);
		}
		return null;
	}
	confirm = function() {	
		// signShow()
		// if(data.name.length!=0&&data.sex.length!=0&&data.height.length!=0&&data.birthday.length!=0&&data.birthAddress.length!=0&&data.sign.length!=0&&data.address.length!=0&&data.mobile.length!=0&&data.email.length!=0&&data.linkMan.length!=0&&data.relation.length!=0&&data.linkMobile.length!=0&&data.monMoney.length&&data.monBaseMoney.length!=0&&data.reward.length!=0&&data.yearMoney.length!=0&&data.acceptPost.length!=0&&data.acceptMoney.length!=0&&data.englishLevel.length!=0&&data.languages.length!=0&&data.writing.length!=0&&data.listen.length!=0&&data.hasFriend.length!=0&&data.hasRegulations.length!=0)
		data.candidateEducationList = [];
		data.candidateJobList = [];
		data.candidateFamilyList = [];
		var eduDate = [];
		var eduDate2 = [];
		var eduDate3 = [];
		var jobDate = [];
		var jobDate2 = [];
		var jobDate3 = [];
		var familyDate = [];
		var familyDate2 = [];
		var familyDate3 = [];
		$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');

		if (data.name && data.name.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的姓名', 'warning')
			$body.animate({
				scrollTop: $('#name').offset().top - 50
			}, 1000);
			$('.nameTitle').addClass('error')
			$('.nameTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		console.log(p.test(data.sign))
		if (data.sign && p.test(data.sign)) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的身份证号', 'warning')
			$body.animate({
				scrollTop: $('#sign').offset().top - 50
			}, 1000);
			$('.signTitle').addClass('error')
			$('.signTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		// if (data.birthday && data.birthday.length != 0) {
		// 	ifAll = true
		// } else {
		// 	$.toptip('请正确填写您的出生日期', 'warning')
		// 	$body.animate({
		// 		scrollTop: $('#birthday').offset().top - 50
		// 	}, 1000);
		// 	$('.birthdayTitle').addClass('error')
		// 	$('.birthdayTitle').parent().parent().find('i').removeClass('hide')
		// 	ifAll = false
		// 	return;
		// }

		if (data.mobile && (/^1[3456789]\d{9}$/.test(data.mobile))) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的手机号码', 'warning')
			$body.animate({
				scrollTop: $('#mobile').offset().top - 50
			}, 1000);
			$('.mobileTitle').addClass('error')
			$('.mobileTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		// if (data.email && (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(data.email))) {
		// 	ifAll = true
		// } else {
		// 	$.toptip('请正确填写您的邮箱', 'warning')
		// 	$body.animate({
		// 		scrollTop: $('#email').offset().top - 50
		// 	}, 1000);
		// 	$('.emailTitle').addClass('error')
		// 	$('.emailTitle').parent().parent().find('i').removeClass('hide')
		// 	ifAll = false
		// 	return;
		// }
		if (data.acceptPost && data.acceptPost.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的应聘岗位', 'warning')
			$body.animate({
				scrollTop: $('#acceptPost').offset().top - 50
			}, 1000);
			$('.acceptPostTitle').addClass('error')
			$('.acceptPostTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		if (data.acceptMoney && data.acceptMoney.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的期望薪资', 'warning')
			$body.animate({
				scrollTop: $('.acceptMoneyTitle').offset().top - 50
			}, 1000);
			$('.acceptMoneyTitle').addClass('error')
			$('.acceptMoneyTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		if (data.height && data.height.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的身高', 'warning')
			$body.animate({
				scrollTop: $('#height').offset().top - 50
			}, 1000);
			$('.heightTitle').addClass('error')
			$('.heightTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}

		if (data.weight && data.weight.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的体重', 'warning')
			$body.animate({
				scrollTop: $('#weight').offset().top - 50
			}, 1000);
			$('.weightTitle').addClass('error')
			$('.weightTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}

		if (data.education && data.education.length != 0) {
			ifAll = true
		} else {
			$.toptip('请选择填写您的文化程度', 'warning')
			$body.animate({
				scrollTop: $('#education').offset().top - 50
			}, 1000);
			$('.educationTitle').addClass('error')
			$('.educationTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		if (data.political && data.political.length != 0) {
			ifAll = true
		} else {
			$.toptip('请选择您的整治面貌', 'warning')
			$body.animate({
				scrollTop: $('#political').offset().top - 50
			}, 1000);
			$('.politicalTitle').addClass('error')
			$('.politicalTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		if (data.nation && data.nation.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的民族', 'warning')
			$body.animate({
				scrollTop: $('#nation').offset().top - 50
			}, 1000);
			$('.nationTitle').addClass('error')
			$('.nationTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		if (data.address && data.address.length != 0 &&$scope.myCity.length!=0) {
			ifAll = true
			if(data.address.indexOf($scope.myCity)==-1){
				data.address = $scope.myCity+data.address
			}
		} else {
			$.toptip('请完整填写您的家庭地址', 'warning')
			$body.animate({
				scrollTop: $('#address').offset().top - 50
			}, 1000);
			$('.addressTitle').addClass('error')
			$('.addressTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}

		if (data.birthAddress && data.birthAddress.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的籍贯', 'warning')
			$body.animate({
				scrollTop: $('#birthAddress').offset().top - 50
			}, 1000);
			$('.birthAddressTitle').addClass('error')
			$('.birthAddressTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}

		if (data.register && data.register != 0) {
			ifAll = true
			if(data.register.indexOf($scope.myRegister)==-1){
				data.register = $scope.myRegister+data.register
			}
		} else {
			$.toptip('请正确填写您的户籍地', 'warning')
			$body.animate({
				scrollTop: $('#register').offset().top - 50
			}, 1000);
			$('.registerTitle').addClass('error')
			$('.registerTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}

		if (data.linkMan && data.linkMan.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的紧急联系人姓名', 'warning')
			$body.animate({
				scrollTop: $('#linkMan').offset().top - 50
			}, 1000);
			$('.linkManTitle').addClass('error')
			$('.linkManTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		if (data.relation && data.relation.length != 0) {
			ifAll = true
		} else {
			$.toptip('请正确填写您的紧急联系人关系', 'warning')
			$body.animate({
				scrollTop: $('#relation').offset().top - 50
			}, 1000);
			$('.relationTitle').addClass('error')
			$('.relationTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}
		if (data.linkMobile && (/^1[3456789]\d{9}$/.test(data.linkMobile))){
			ifAll = true
		} else {
			$.toptip('请正确填写您的紧急联系人电话', 'warning')
			$body.animate({
				scrollTop: $('#linkMobile').offset().top - 50
			}, 1000);
			$('.linkMobileTitle').addClass('error')
			$('.linkMobileTitle').parent().parent().find('i').removeClass('hide')
			ifAll = false
			return;
		}




		// 学历内容获取
		if ($('#school').val().length != 0 && $('#specialty').val().length != 0 && $('#startDate').val().length != 0 && $(
				'#endDate').val().length != 0) {
			eduDate.school = $('#school').val()
			eduDate.startDate = $('#startDate').val()
			eduDate.endDate = $('#endDate').val()
			eduDate.specialty = $('#specialty').val()
			eduDate.cert = $('#cert').val()
			data.candidateEducationList.push(eduDate)
			ifAll = true
		} else {
			$.toptip('至少完整填写一条学历', 'warning')
			$body.animate({
				scrollTop: $('#school').offset().top - 200
			}, 1000);
			ifAll = false
			return;
		}
		if (educationMark >= 2) {
			if ($('#school2').val().length != 0 && $('#specialty2').val().length != 0 && $('#startDate2').val().length != 0 &&
				$('#endDate2').val().length != 0) {
				eduDate2.school = $('#school2').val()
				eduDate2.startDate = $('#startDate2').val()
				eduDate2.endDate = $('#endDate2').val()
				eduDate2.specialty = $('#specialty2').val()
				eduDate2.cert = $('#cert2').val()
				data.candidateEducationList.push(eduDate2)
				ifAll = true
			} else {
				$.toptip('请完整填写第二条学历', 'warning')
				$body.animate({
					scrollTop: $('#school2').offset().top - 200
				}, 1000);
				ifAll = false
				return;
			}
		}
		if (educationMark == 3) {
			if ($('#school3').val().length != 0 && $('#specialty3').val().length != 0 && $('#startDate3').val().length != 0 &&
				$('#endDate3').val().length != 0) {
				eduDate3.school = $('#school3').val()
				eduDate3.startDate = $('#startDate3').val()
				eduDate3.endDate = $('#endDate3').val()
				eduDate3.specialty = $('#specialty3').val()
				eduDate3.cert = $('#cert3').val()
				data.candidateEducationList.push(eduDate3)
				ifAll = true
			} else {
				$.toptip('请完整填写第三条学历', 'warning')
				$body.animate({
					scrollTop: $('#school3').offset().top - 200
				}, 1000);
				ifAll = false
				return;
			}
		}


		// 工作经历内容获取
		if ($('#company').val().length != 0 && $('#post').val().length != 0 && $('#jobStartDate').val().length != 0 && $(
				'#jobEndDate').val().length != 0) {
			jobDate.jobStartDate = $('#jobStartDate').val()
			jobDate.jobEndDate = $('#jobEndDate').val()
			jobDate.company = $('#company').val()
			jobDate.post = $('#post').val()
			jobDate.monthMoney = $('#monthMoney').val()
			jobDate.certifier = $('#certifier').val()
			jobDate.certifierJob = $('#certifierJob').val()
			jobDate.certifierMobile = $('#certifierMobile').val()
			data.candidateJobList.push(jobDate)
			ifAll = true
		} else {
			$.toptip('至少完整填写一条工作经历', 'warning')
			$body.animate({
				scrollTop: $('#jobStartDate').offset().top - 200
			}, 1000);
			ifAll = false
			return;
		}
		if (jobListMark >= 2) {
			if ($('#company2').val().length != 0 && $('#post2').val().length != 0 && $('#jobStartDate2').val().length != 0 &&
				$('#jobEndDate2').val().length != 0) {
				jobDate2.jobStartDate = $('#jobStartDate2').val()
				jobDate2.jobEndDate = $('#jobEndDate2').val()
				jobDate2.company = $('#company2').val()
				jobDate2.post = $('#post2').val()
				jobDate2.monthMoney = $('#monthMoney2').val()
				jobDate2.certifier = $('#certifier2').val()
				jobDate2.certifierJob = $('#certifierJob2').val()
				jobDate2.certifierMobile = $('#certifierMobile2').val()
				data.candidateJobList.push(jobDate2)
				ifAll = true
			} else {
				$.toptip('请完整填写第二条工作经历', 'warning')
				$body.animate({
					scrollTop: $('#jobStartDate2').offset().top - 200
				}, 1000);
				ifAll = false
				return;
			}
		}

		if (jobListMark == 3) {
			if ($('#company3').val().length != 0 && $('#post3').val().length != 0 && $('#jobStartDate3').val().length != 0 &&
				$('#jobEndDate3').val().length != 0) {
				jobDate3.jobStartDate = $('#jobStartDate3').val()
				jobDate3.jobEndDate = $('#jobEndDate3').val()
				jobDate3.company = $('#company3').val()
				jobDate3.post = $('#post3').val()
				jobDate3.monthMoney = $('#monthMoney3').val()
				jobDate3.certifier = $('#certifier3').val()
				jobDate3.certifierJob = $('#certifierJob3').val()
				jobDate3.certifierMobile = $('#certifierMobile3').val()
				data.candidateJobList.push(jobDate3)
				ifAll = true
			} else {
				$.toptip('请完整填写第三条工作经历', 'warning')
				$body.animate({
					scrollTop: $('#jobStartDate3').offset().top - 200
				}, 1000);
				ifAll = false
				return;
			}
		}
		if (data.avatar && data.avatar.length != 0) {
			ifAll = true
		} else {
			$.toptip('请上传您的照片', 'warning')
			$body.animate({
				scrollTop: $('#uploaderInput').offset().top - 100
			}, 1000);
			ifAll = false
			return;
		}

		// 家庭成员内容获取
		if ($('#familyName').val().length != 0 && $('#familyRelation').val().length != 0) {
			familyDate.familyName = $('#familyName').val()
			familyDate.familyRelation = $('#familyRelation').val()
			familyDate.company = $('#companySame').val()
			familyDate.mobile = $('#mobileSame').val()
			familyDate.duty = $('#dutySame').val()
			data.candidateFamilyList.push(familyDate)
			ifAll = true
		} else {
			$.toptip('至少完整填写一条家庭成员信息', 'warning')
			$body.animate({
				scrollTop: $('#familyName').offset().top - 50
			}, 1000);
			ifAll = false
			return;
		}
		if (familyListMark >= 2) {
			if ($('#familyName2').val().length != 0 && $('#familyRelation2').val().length != 0) {
				familyDate2.familyName = $('#familyName2').val()
				familyDate2.familyRelation = $('#familyRelation2').val()
				familyDate2.company = $('#companySame2').val()
				familyDate2.mobile = $('#mobileSame2').val()
				familyDate2.duty = $('#dutySame2').val()
				data.candidateFamilyList.push(familyDate2)
				ifAll = true
			} else {
				$.toptip('请完整填写第二条家庭成员信息', 'warning')
				// $body.animate({scrollTop: $('#familyName2').offset().top-50}, 1000);
				ifAll = false
				return;
			}
		}
		if (familyListMark == 3) {
			if ($('#familyName3').val().length != 0 && $('#familyRelation3').val().length != 0 && familyListMark == 3) {
				familyDate3.familyName = $('#familyName3').val()
				familyDate3.familyRelation = $('#familyRelation3').val()
				familyDate3.company = $('#companySame3').val()
				familyDate3.mobile = $('#mobileSame3').val()
				familyDate3.duty = $('#dutySame3').val()
				data.candidateFamilyList.push(familyDate3)
				ifAll = true
			} else {
				$.toptip('请完整填写第三条家庭成员信息', 'warning')
				// $body.animate({scrollTop: $('#familyName2').offset().top-50}, 1000);
				ifAll = false
				return;
			}
		}

		if (data.candidateEducationList && data.candidateEducationList.length != 0) {
			ifAll = true
		} else {
			$.toptip('至少填写一条学历', 'warning')
			ifAll = false
			return;
		}
		if (data.candidateJobList && data.candidateJobList.length != 0) {
			ifAll = true
		} else {
			$.toptip('至少填写一条工作经历', 'warning')
			ifAll = false
			return;
		}
		if (data.candidateFamilyList && data.candidateFamilyList.length != 0) {
			ifAll = true
		} else {
			$.toptip('至少填写一条工作经历', 'warning')
			ifAll = false
			return;
		}
		if (ifAll) {
			console.log(data)
			var familyListTemp = [{
					'familyName': $('#familyName').val(),
					'familyRelation': $('#familyRelation').val(),
					'company': $('#companySame').val(),
					'mobile': $('#mobileSame').val(),
					'duty': $('#dutySame').val(),
				},
				{
					'familyName': $('#familyName2').val(),
					'familyRelation': $('#familyRelation2').val(),
					'company': $('#companySame2').val(),
					'mobile': $('#mobileSame2').val(),
					'duty': $('#dutySame2').val(),
				}
				// ,
				//                {
				//                    'familyName' : $('#familyName3').val(),
				//                    'familyRelation' : $('#familyRelation3').val(),
				//                    'company' : $('#companySame3').val(),
				//                    'mobile' : $('#mobileSame3').val(),
				//                    'duty' : $('#dutySame3').val(),
				//                }
			]

			var eduListTemp = [{
				'school': $('#school').val(),
				'startDate': $('#startDate').val(),
				'endDate': $('#endDate').val(),
				'specialty': $('#specialty').val(),
				'cert': $('#cert').val()
			}]

			var jobListTemp = [{
				'jobStartDate': $('#jobStartDate').val(),
				'jobEndDate': $('#jobEndDate').val(),
				'company': $('#company').val(),
				'post': $('#post').val(),
				'monthMoney': $('#monthMoney').val(),
				'certifier': $('#certifier').val(),
				'certifierJob': $('#certifierJob').val(),
				'certifierMobile': $('#certifierMobile').val()
			}]


			data.candidateEducationList = eduListTemp
			data.candidateFamilyList = familyListTemp
			data.candidateJobList = jobListTemp

			data.empCode = getQueryString('empCode')
			data.empName = getQueryString('empName')
			data.officeCode = getQueryString('officeCode')
			data.officeName = getQueryString('officeName')
			
				if (data.sex == '男'||data.sex==1) {
					data.sex = 1
				} else {
					data.sex = 2
				}
				if (data.marry == '已婚') {
					data.marry = 1
				} else {
					data.marry = 2
				}
			var temp = {
				'name': data.name,
				'sex': data.sex,
				'birthday': data.birthday,
				'mobile': data.mobile,
				'acceptPost': data.acceptPost,
				'height': data.height,
				'weight': data.weight,
				'education': data.education,
				'political': data.political,
				'nation': data.nation,
				'characteristics': data.characteristics,
				'interests': data.interests,
				'achievement': data.achievement,
				'expertise': data.expertise,
				'birhtAddress': data.birthAddress,
				'sign': data.sign,
				'address': data.address,
				'marry': data.marry,
				'register': data.register,
				'email': data.email,
				'linkMan': data.linkMan,
				'relation': data.relation,
				'linkMobile': data.linkMobile,
				'monMoney': data.monMoney,
				'monBaseMoney': data.monBaseMoney,
				'reward': data.reward,
				'yearMoney': data.yearMoney,
				'acceptPost': data.acceptPost,
				'acceptMoney': data.acceptMoney,
				'englishLevel': data.englishLevel,
				'languages': data.languages,
				'writing': data.writing,
				'listen': data.listen,
				'hasFriend': data.hasFriend,
				'friednName': data.friendName,
				'hasRegulations': data.hasRegulations,
				'regulationsReason': data.regulationsReason,
				'avatar': data.avatar,
				'empCode': data.empCode,
				'empName': data.empName,
				'officeCode': data.officeCode,
				'officeName': data.officeName
				// 'candidateEducationList':data.candidateEducationList,
				// 'candidateJobList':data.candidateJobList
				// 'candidateFamilyList':data.candidateFamilyList
			}
			temp['candidateFamilyList[0].familyName'] = $('#familyName').val()
			temp['candidateFamilyList[0].familyRelation'] = $('#familyRelation').val()
			temp['candidateFamilyList[0].company'] = $('#companySame').val()
			temp['candidateFamilyList[0].mobile'] = $('#mobileSame').val()
			temp['candidateFamilyList[0].duty'] = $('#dutySame').val()
			if (familyListMark >= 2) {
				temp['candidateFamilyList[1].familyName'] = $('#familyName2').val()
				temp['candidateFamilyList[1].familyRelation'] = $('#familyRelation2').val()
				temp['candidateFamilyList[1].company'] = $('#companySame2').val()
				temp['candidateFamilyList[1].mobile'] = $('#mobileSame2').val()
				temp['candidateFamilyList[1].duty'] = $('#dutySame2').val()
			}
			if (familyListMark == 3) {
				temp['candidateFamilyList[2].familyName'] = $('#familyName3').val()
				temp['candidateFamilyList[2].familyRelation'] = $('#familyRelation3').val()
				temp['candidateFamilyList[2].company'] = $('#companySame3').val()
				temp['candidateFamilyList[2].mobile'] = $('#mobileSame3').val()
				temp['candidateFamilyList[2].duty'] = $('#dutySame3').val()
			}

			temp['candidateJobList[0].jobStartDate'] = $('#jobStartDate').val()
			temp['candidateJobList[0].jobEndDate'] = $('#jobEndDate').val()
			temp['candidateJobList[0].company'] = $('#company').val()
			temp['candidateJobList[0].post'] = $('#post').val()
			temp['candidateJobList[0].monthMoney'] = $('#monthMoney').val()
			temp['candidateJobList[0].certifier'] = $('#certifier').val()
			temp['candidateJobList[0].certifierJob'] = $('#certifierJob').val()
			temp['candidateJobList[0].certifierMobile'] = $('#certifierMobile').val()
			if (jobListMark >= 2) {
				temp['candidateJobList[1].jobStartDate'] = $('#jobStartDate2').val()
				temp['candidateJobList[1].jobEndDate'] = $('#jobEndDate2').val()
				temp['candidateJobList[1].company'] = $('#company2').val()
				temp['candidateJobList[1].post'] = $('#post2').val()
				temp['candidateJobList[1].monthMoney'] = $('#monthMoney2').val()
				temp['candidateJobList[1].certifier'] = $('#certifier2').val()
				temp['candidateJobList[1].certifierJob'] = $('#certifierJob2').val()
				temp['candidateJobList[1].certifierMobile'] = $('#certifierMobile2').val()
			}

			if (jobListMark == 3) {
				temp['candidateJobList[2].jobStartDate'] = $('#jobStartDate3').val()
				temp['candidateJobList[2].jobEndDate'] = $('#jobEndDate3').val()
				temp['candidateJobList[2].company'] = $('#company3').val()
				temp['candidateJobList[2].post'] = $('#post3').val()
				temp['candidateJobList[2].monthMoney'] = $('#monthMoney3').val()
				temp['candidateJobList[2].certifier'] = $('#certifier3').val()
				temp['candidateJobList[2].certifierJob'] = $('#certifierJob3').val()
				temp['candidateJobList[2].certifierMobile'] = $('#certifierMobile3').val()
			}


			temp['candidateEducationList[0].school'] = $('#school').val()
			temp['candidateEducationList[0].startDate'] = $('#startDate').val()
			temp['candidateEducationList[0].endDate'] = $('#endDate').val()
			temp['candidateEducationList[0].specialty'] = $('#specialty').val()
			temp['candidateEducationList[0].cert'] = $('#cert').val()

			if (educationMark >= 2) {
				temp['candidateEducationList[1].school'] = $('#school2').val()
				temp['candidateEducationList[1].startDate'] = $('#startDate2').val()
				temp['candidateEducationList[1].endDate'] = $('#endDate2').val()
				temp['candidateEducationList[1].specialty'] = $('#specialty2').val()
				temp['candidateEducationList[1].cert'] = $('#cert2').val()
			}

			if (educationMark == 3) {
				temp['candidateEducationList[2].school'] = $('#school3').val()
				temp['candidateEducationList[2].startDate'] = $('#startDate3').val()
				temp['candidateEducationList[2].endDate'] = $('#endDate3').val()
				temp['candidateEducationList[2].specialty'] = $('#specialty3').val()
				temp['candidateEducationList[2].cert'] = $('#cert3').val()
			}
			
			// temp['signPath'] = signPath
			// $.showLoading("数据提交中");
			if(getQueryString('flag')){
				if(signPath.length!=0){
				temp['signPath'] = signPath
				temp['flag'] = getQueryString('flag')
			}else{
				signShow();
				return;
			}
			}
			if(getQueryString('isSchool')=='Y'){
				temp['isSchool'] = 'Y'
			}else{
				temp['isSchool'] = 'N'
			}
			console.log(temp)
			$.confirm("确认提交应聘登记表吗", function() {

				$('#waiting').removeClass('hide')
			  $.ajax({
			  	url: url+'/hr/v1/lampo/candidateInfo/save',
			  	type: 'POST',
			  	data: temp,
			  	async: false,
			  	success: function(data) {
			  		console.log(data.data)
			  		setTimeout(() => {
			  			// $.hideLoading();
			  			location.replace('success.html');
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
