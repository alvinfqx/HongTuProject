"use strict";
var viewModel = function() {
	
	var self = this;
	var isIE = !!window.ActiveXObject;
	var isIE6 = isIE && !window.XMLHttpRequest;
	if(isIE6) {
		window.location.href = "../webpage/Error/ErrorBrowser";
	}
	//回车键
	document.onkeydown = function(e) {
		if(!e) e = window.event;
		if((e.keyCode || e.which) == 13) {
			var btlogin = document.getElementById("btnlogin");
			btnlogin.click();
		}
	}
	//初始化
	$(function() {
		$(".wrap").css("margin-top", ($(window).height() - $(".wrap").height()) / 2 - 35);
		$(window).resize(function(e) {
			$(".wrap").css("margin-top", ($(window).height() - $(".wrap").height()) / 2 - 35);
			e.stopPropagation();
		});

		//错误提示
		if(top.$.cookie('learun_login_error_kh') != null) {
			switch(top.$.cookie('learun_login_error_kh')) {
				case "Overdue":
					self.formMessage('登录已超时,请重新登录');
					break;
				case "OnLine":
					self.formMessage('您的帐号已在其它地方登录,请重新登录');
					break;
				case "-1":
					self.formMessage('未知错误,请重新登录');
					break;
				default:
					break;
			}
			top.$.cookie('learun_login_error_kh', '', {
				path: "/",
				expires: -1
			});
		}
		//是否自动登录
		if(top.$.cookie('learn_autologin_kh') == 1) {
			$("#autologin").attr("checked", 'true');
			$("#username").val(top.$.cookie('learn_username_kh'));
			$("#password").val(top.$.cookie('learn_password_kh'));
//			self.CheckLogin(1);
		}
		//设置下次自动登录
		$("#autologin").click(function() {
			if(!$(this).attr('checked')) {
				$(this).attr("checked", 'true');
				top.$.cookie('learn_autologin_kh', 1, {
					path: "/",
					expires: 7
				});
			} else {
				$(this).removeAttr("checked");
				top.$.cookie('learn_autologin_kh', '', {
					path: "/",
					expires: -1
				});
				top.$.cookie('learn_username_kh', '', {
					path: "/",
					expires: -1
				});
				top.$.cookie('learn_password_kh', '', {
					path: "/",
					expires: -1
				});
			}
		});
		//登录按钮事件
		$("#btnlogin").click(function() {
			var $username = $("#username");
			var $password = $("#password");
			var $verifycode = $("#verifycode");
			if($username.val() == "") {
				$username.focus();
				$(".alert-danger").html('请输入账户或手机号或邮箱。').show();

				return false;
			} else if($password.val() == "") {
				$password.focus();
				$(".alert-danger").html('请输入密码。').show();

				return false;
			} else if($verifycode.val() == "") {
				$verifycode.focus();
				$(".alert-danger").html('请输入验证码。').show();

				return false;
			} else {
				self.CheckLogin(0);
			}
		})
		//点击切换验证码
		$("#login_verifycode").click(function() {
			$("#verifycode").val('');
			$("#login_verifycode").attr("src", contentPath + "/Login/VerifyCode?time=" + Math.random());
		});
		//切换注册表单
		$("#a_register").click(function() {
			$("#loginform").hide();
			$("#registerform").show();
			$("#register_verifycode").attr("src", contentPath + "/Login/VerifyCode?time=" + Math.random());
			$(".wrap").css("margin-top", ($(window).height() - $(".wrap").height()) / 2 - 35);
			$('.login_tips').parents('dt').remove();
		});
		//切换登录表单
		$("#a_login").click(function() {
			$("#loginform").show();
			$("#registerform").hide();
			$("#login_verifycode").attr("src", contentPath + "/Login/VerifyCode?time=" + Math.random());
			$(".wrap").css("margin-top", ($(window).height() - $(".wrap").height()) / 2 - 35);
			$('.login_tips').parents('dt').remove();
		});
	})

	//提示信息
	this.formMessage = function(msg, type) {
		$('.login_tips').parents('dt').html('');
		var _class = "login_tips";
		if(type == 1) {
			_class = "login_tips-succeed";
		}
		$('form').append('<dt><div class="' + _class + '">   <i class="fa fa-question-circle"></i>  ' + msg + '</div></dt>');
	}

	//登录验证
	this.CheckLogin = function() {
		var themeStr = 2;
		$("#btnlogin").addClass('active').attr('disabled', 'disabled');
		$("#btnlogin").find('span').hide();

		var username = $.trim($("#username").val());
		var password = $.trim($("#password").val());
		var verifycode = $.trim($("#verifycode").val());
		if(top.$.cookie('learn_password_kh') == "" || top.$.cookie('learn_password_kh') == null) {
			password = $.md5(password);
		}
		var postData = {
			username: $.trim(username),
			password: $.trim(password),
			verifycode: verifycode,
			autologin: 1,
			systemName: themeStr
		};
		console.log(postData);
		$.ajax({
			url: contentPath + "/TokenValid/checkLogin",
			data: postData,
			type: "post",
			dataType: "json",
			beforeSend: function(request) {
				// 禁用按钮防止重复提交
				var w = window.innerWidth;
				var h = window.innerHeight;
				var h2 = h / 2;
				var html = "";
				html += "<div id='ajax_tip' style='z-index: 10000; opacity: 0.5; background-color: #000; width:";
				html += w + "px;height:" + h + "px;position: absolute;top: 0; left: 0; text-align:center;'>";
				html += "<div style='margin-top:" + h2 + "px;'>";
				html += "<span style='font-size:22px;color:#FFF;'>加载中...</span>";
				//				html += "<div class='overlay'>";
				//				html += " <i class='fa fa-refresh fa-spin'></i>";
				//				html += "</div>";
				html += "</div></div>";
				$("body").append(html);
			},
			success: function(data) {
					console.log(data);
//					debugger
				$("#ajax_tip").remove();
				if(data.type == 1) {
					if(top.$.cookie('learn_autologin_kh') == 1) {
						top.$.cookie('learn_username_kh', $.trim(username), {
							path: "/",
							expires: 7
						});
						top.$.cookie('learn_password_kh', $.trim(password), {
							path: "/",
							expires: 7
						});
					}
					top.$.cookie('learn_UItheme_kh', $("#UItheme").val(), {
						path: "/",
						expires: 30
					});
//					var themeStr = Number($("#UItheme").val());
//					var theme = 2;
						sessionStorage.setItem("departmentId", data.resultdata.DepartmentId);
					if(themeStr == 1) {
						sessionStorage.setItem("token", data.resultdata.Token);
						sessionStorage.setItem("username", data.resultdata.UserName);
						sessionStorage.setItem("account", $("#username").val());
						sessionStorage.setItem("userId", data.resultdata.UserId);
						sessionStorage.setItem("companyId", data.resultdata.CompanyId);
						
						sessionStorage.setItem("comSystemName", data.resultdata.ComSystemName);
						sessionStorage.setItem("systemName", data.resultdata.SystemName);
						sessionStorage.setItem("smallSystemName", data.resultdata.SmallSystemName);
						window.location.href = '../../webpage/Home/AdminDefault.html';
					} else if(themeStr == 2) {
						sessionStorage.setItem("headIcon", data.resultdata.HeadIcon);
						sessionStorage.setItem("token", data.resultdata.Token);
						sessionStorage.setItem("username", data.resultdata.UserName);
						sessionStorage.setItem("account", $("#username").val());
						sessionStorage.setItem("userId", data.resultdata.UserId);
						sessionStorage.setItem("companyId", data.resultdata.CompanyId);
						sessionStorage.setItem("comSystemName", data.resultdata.ComSystemName);
						sessionStorage.setItem("systemName", data.resultdata.SystemName);
						sessionStorage.setItem("smallSystemName", data.resultdata.SmallSystemName);
						window.location.href = '../../webpage/Home/AdminLTE.html';

					} else if(themeStr == 3) {
						sessionStorage.setItem("headIcon", data.resultdata.HeadIcon);
						sessionStorage.setItem("token", data.resultdata.Token);
						sessionStorage.setItem("username", data.resultdata.UserName);
						sessionStorage.setItem("account", $("#username").val());
						sessionStorage.setItem("userId", data.resultdata.UserId);
						sessionStorage.setItem("companyId", data.resultdata.CompanyId);
						sessionStorage.setItem("comSystemName", data.resultdata.ComSystemName);
						sessionStorage.setItem("systemName", data.resultdata.SystemName);
						sessionStorage.setItem("smallSystemName", data.resultdata.SmallSystemName);
						window.location.href = '../../webpage/Home/AdminWindos.html';
						//						window.location.href = '../../webpage/Home/oldWindows.html';

					}
				} else {
					if(data.message.length >= 30) {
						dialogAlert(data.message, 0);
					} else {
						dialogAlert(data.message, 0);
						//self.formMessage(data.message);
					}

					$("#btnlogin").removeClass('active').removeAttr('disabled');
					$("#btnlogin").find('span').show();
					$("#login_verifycode").trigger("click");

				}
			}
		});
	}

	/*=========注册账户（begin）================================================================*/
	$(function() {
		//手机号离开事件
		$("#txt_register_account").blur(function() {
			if($(this).val() != "" && !isMobile($(this).val())) {
				$(this).focus();
				//dialogAlert('手机格式不正确,请输入正确格式的手机号码。',0);
				self.formMessage('手机格式不正确,请输入正确格式的手机号码。');
			}

			function isMobile(obj) {
				var reg = /^(\+\d{2,3}\-)?\d{11}$/;
				if(!reg.test(obj)) {
					return false;
				} else {
					return true;
				}
			}
		});
		//密码输入事件
		$("#txt_register_password").keyup(function() {
			$(".passlevel").find('em').removeClass('bar');
			var length = $(this).val().length;
			if(length <= 8) {
				$(".passlevel").find('em:eq(0)').addClass('bar');
			} else if(length > 8 && length <= 12) {
				$(".passlevel").find('em:eq(0)').addClass('bar');
				$(".passlevel").find('em:eq(1)').addClass('bar');
			} else if(length > 12) {
				$(".passlevel").find('em').addClass('bar');
			}
		})
		//注册按钮事件
		$("#btnregister").click(function() {
			var $account = $("#txt_register_account");
			var $code = $("#txt_register_code");
			var $name = $("#txt_register_name");
			var $password = $("#txt_register_password");
			var $verifycode = $("#txt_register_verifycode");
			if($account.val() == "") {
				$account.focus();
				self.formMessage('请输入手机号。');
				return false;
			} else if($code.val() == "") {
				$code.focus();
				self.formMessage('请输入短信验证码。');
				return false;
			} else if($name.val() == "") {
				$name.focus();
				self.formMessage('请输入姓名。');
				return false;
			} else if($password.val() == "") {
				$password.focus();
				self.formMessage('请输入密码。');
				return false;
			} else if($verifycode.val() == "") {
				$verifycode.focus();
				self.formMessage('请输入图片验证码。');
				return false;
			} else {
				$("#btnregister").addClass('active').attr('disabled', 'disabled');
				$("#btnregister").find('span').hide();

				$.ajax({
					url: contentPath + "/Login/Register",
					data: {
						mobileCode: $account.val(),
						securityCode: $code.val(),
						fullName: $name.val(),
						password: $.md5($password.val()),
						verifycode: $verifycode.val()
					},
					type: "post",
					dataType: "json",
					success: function(data) {

						if(data.type == 1) {
							//alert('注册成功');
							window.location.href = contentPath + '/Login/Index';
						} else {
							self.formMessage(data.message);
							$("#btnregister").removeClass('active').removeAttr('disabled');
							$("#btnregister").find('span').show();
							$("#register_verifycode").trigger("click");
						}
					}
				});
			}
		})
		//获取验证码
		$("#register_getcode").click(function() {
			var $this = $(this);
			$this.attr('disabled', 'disabled');
			$.ajax({
				url: contentPath + "/Login/GetSecurityCode",
				data: {
					mobileCode: $("#txt_register_account").val()
				},
				type: "get",
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.type == 1) {
						dialogAlert('已向您的手机' + $("#txt_register_account").val() + '发送了一条验证短信。', 0);
					} else {
						$this.removeAttr('disabled');
						dialogAlert(data.message, 0);
					}
				}
			});
		});
	})
}
var model = new viewModel();