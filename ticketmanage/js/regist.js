var nameOk=false;
var nameOnly=false;
var ICOk=false;
var ICOnly=false;
var pwdOk=false;
var rpwdOk=false;
var usernameOk=false;
var emailOk=false;
var regName=/^\w{4,12}$/;
var regPwd=/^\w{5,12}$/;
var regICard=/^[1-9]\d{14}(\d{2}[0-9X])?$/;
var regEmail=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;


$(function(){

	$("#loginName").blur(function(){
		 name=$("#loginName").val();
		if(regName.test(name)){
			$("#nameInfo").hide();
			nameOk=true;
			checkUname();
		}else{
			$("#nameInfo").show().html("请输入4-12位账号")

		}
	});
	$("#password").blur(function() {
	     password=$("#password").val();
	    if(regPwd.test(password)){
	    	pwdOk=true;
	        $("#pwdInfo").hide();
	    }else{
	        $("#pwdInfo").show().html("请输入5到12位密码")
	    }
	});
	$("#rpassword").blur(function() {
	     rpassword=$("#rpassword").val();
	    if(rpassword==$("#password").val()){
	        rpwdOk=true;
	        $("#rpwdInfo").hide();
	    }else{
	        $("#rpwdInfo").show().html("密码不一致");
	    }
	});
	$("#userName").blur(function() {
    uname=$("#userName").val();
   if(regName.test(uname)){
        $("#unameInfo").hide();
        usernameOk=true;
    }else{
        $("#unameInfo").show().html("请输入4到12位用户名");
    }
	});
	    
	$("#userICard").blur(function() {
	     userICard=$("#userICard").val();
	    if(regICard.test(userICard)){
	        ICOk=true;
	        $("#ICardInfo").hide();
	        checkICard();
	    }else{
	        $("#ICardInfo").show().html("身份证信息错误！")
	    }
	});

	$("#mail").blur(function() {
	    email=$("#mail").val();
	   if(regEmail.test(email)){
	   		emailOk=true;
	        $("#emailInfo").hide();
	    }else{
	        $("#emailInfo").show().html("请输入正确的邮箱");
	    }
	    }); 
});

// 提交注册
	function doRegist(){
		console.log(nameOk+','+pwdOk+','+rpwdOk+','+usernameOk+','+ICOk+','+emailOk+','+nameOnly+','+ICOnly)

		if(nameOk&&pwdOk&&rpwdOk&&usernameOk&&ICOk&&emailOk&&nameOnly&&ICOnly){
			$.post('http://192.168.21.60:8080/ticketSystem/user/register',
				{"loginName":name,"password":password,"userName":uname,"userICard":userICard,"mail":email}, 
				function(data,status,xhr){
					if(data.msg=="注册成功"&&xhr.status==200){
						console.log('nameOnly'+nameOnly);
						alert("注册成功");
						location.href="login.html";
					}else{
						return false;
					}
				});
		}
	}

// 检查用户名
	function checkUname(){
		var name=$("#loginName").val();
		$.post('http://192.168.21.60:8080/ticketSystem/user/checkLoginName',
				{"loginName":name},
				function(data,testStatus,xhr){
					if(data.msg!="用户名已存在"&&xhr.status==200){
						nameOnly=true;
					}else{
						$("#nameInfo").html("用户名已存在").show();
						nameOnly=false;
						
					}
				});
	}

	// 检查身份证
function checkICard(){
    var userICard=$("#userICard").val();
    $.post('http://192.168.21.60:8080/ticketSystem/user/checkIC', 
    	{"iCard": userICard}, 
        function(data, textStatus, xhr) {
        if(data.msg!="身份证已存在"&&xhr.status==200){
            ICOnly=true;
        }else{
            $("#ICardInfo").html("身份证已存在");
            $("#ICardInfo").show();
            return false;
        }
    });
}





















