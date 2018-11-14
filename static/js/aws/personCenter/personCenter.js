/*
 * author:Alvin
 * 2018.3.9
 * 个人信息
 */
var viewModel = function() {
	var self = this;

	/*
	 * 时间函数
	 * 今天
	 * 近7天
	 * 近一个月
	 * 近三个月
	 */
	var now_day = cm.format.Date(cm.format.getData('day', 0), 'yyyy-MM-dd'),
		pre_week = cm.format.Date(cm.format.getData('day', -7), 'yyyy-MM-dd'),
		pre_month = cm.format.Date(cm.format.getData('month', -1), 'yyyy-MM-dd'),
		pre_three_month = cm.format.Date(cm.format.getData('month', -3), 'yyyy-MM-dd');
	console.log(now_day + '/' + pre_week + '/' + pre_month + '/' + pre_three_month);
	$("#SelectedStartTime").html(pre_week);
	$("#SelectedEndTime").html(now_day);
	$("#StartTime").val(pre_week);
	$("#EndTime").val(now_day);

	$(function() {
		self.InitialPage();
		self.InitControl();
		self.RevisePasswordPanel();
	});

	//初始化数据
	this.InitControl = function() {
		$.SetForm({
			url: "/BaseManage/User/GetFormJson4CurrentUser",

			success: function(data) {
				if(data != null) {
					$("#layout").SetWebControls(data);
					if(data.HeadIcon) {
						//						

//						document.getElementById('uploadPreview').src = top.contentPath + data.HeadIcon;

						document.getElementById('uploadPreview').src = cm.domain+"/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist="+data.HeadIcon+"&token="+cm.token;
					}
				}
			}
		});
	};
	//初始化页面
	this.InitialPage = function() {
		//layout布局
		$('#layout').layout({
			applyDemoStyles: true,
			onresize: function() {
				$(window).resize();
			}
		});
		$('.profile-nav').height($(window).height() - 20);
		$('.profile-content').height($(window).height() - 20);
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('.profile-nav').height($(window).height() - 20);
				$('.profile-content').height($(window).height() - 20);
			}, 200);
			e.stopPropagation();
		});
		$('#uploadFile').change(function() {
			//			debugger
			var f = document.getElementById('uploadFile').files[0];
			var src = window.URL.createObjectURL(f);
			document.getElementById('uploadPreview').src = src;
			//上传应用图标
			$.ajaxFileUpload({
				url: cm.domain + "/PersonCenter/UploadFile",
				data: {
					token: cm.token
				},
				type: 'post',
				secureuri: false,
				fileElementId: 'uploadFile',
				dataType: 'json',
				success: function(data, status) {
					alert(data);
					$("#uploadPreview").attr("src", data);
					dialogMsg(data.message, 1);
				},
				error: function(data, status, e) { //提交失败自动执行的处理函数。		
					dialogMsg('头像上传成功', 1);
					console.error(e);
				}
			});
		});
	}
	//侧面切换显示/隐藏
	this.profileSwitch = function(id) {
		$(".profile-content").find('.flag').hide()
		$(".profile-content").find("#" + id).show();
		if(id == 'SystemLog') {
			self.GetSystemLogGrid();
		}
	}
	//联系方式保存
	this.SaveContactPanel = function() {
		console.log('方法未是实现');
	}
	//修改密码
	this.RevisePasswordPanel = function() {
		var chePassword = false;
		//点击获取验证码
		$("#VerifyCodeImag").click(function() {
			$("#VerifyCode").val('');
			$("#VerifyCodeImag").attr("src", cm.domain + "/Login/VerifyCode?time=" + Math.random());
		})
		//验证原密码正确性
		$("#OldPassword").blur(function() {
			$("#OldPassword").parent().find('div').html("");
			if($(this).val() == "") {
				return false;
			}
			cm.ajax({
				url: "/PersonCenter/ValidationOldPassword",
				data: {
					OldPassword: $(this).val()
				},
				type: "post",
				dataType: "json",
				async: false,
				success: function(data) {
					if(data.type == 1) {
						chePassword = true;
						$("#OldPassword").parent().find('div').html("<div class=\"form-succeed-text\">" + data.message + "</div>")
					} else {
						$("#OldPassword").parent().find('div').html("<div class=\"form-error-text\">" + data.message + "</div>")
					}
				}
			});
		});
		$("#NewPassword").blur(function() {
			$("#NewPassword").parent().find('div').html("");
			if($(this).val() == "") {
				return false;
			}
			if($(this).val() == $("#OldPassword").val()) {
				$("#NewPassword").parent().find('div').html("<div class=\"form-error-text\">新密码不能与旧密码相同</div>")
			} else {
				$("#NewPassword").parent().find('div').html("<div class=\"form-succeed-text\"></div>")
			}
		});
		$("#RedoNewPassword").blur(function() {
			$("#RedoNewPassword").parent().find('div').html("")
			if($(this).val() == "") {
				return false;
			}
			if($(this).val() != $("#NewPassword").val()) {
				$("#RedoNewPassword").parent().find('div').html("<div class=\"form-error-text\">您两次输入的密码不一致！</div>")
			} else {
				$("#RedoNewPassword").parent().find('div').html("<div class=\"form-succeed-text\"></div>")
			}
		});
		$("#VerifyCode").blur(function() {
			$(".VerifyCodemsg").html("")
			if($(this).val() == "") {
				return false;
			}
		});

		//提交
		$("#btn_RevisePassword").click(function() {
			var OldPassword = $("#OldPassword").val();
			var NewPassword = $("#NewPassword").val();
			var RedoNewPassword = $("#RedoNewPassword").val();
			var VerifyCode = $("#VerifyCode").val();
			if(OldPassword == "") {
				$("#OldPassword").parent().find('div').html("<div class=\"form-error-text\">请输入登陆密码</div>");
				return false;
			}
			if(NewPassword == "") {
				$("#NewPassword").parent().find('div').html("<div class=\"form-error-text\">请输入新密码</div>");
				return false;
			}
			if(RedoNewPassword == "") {
				$("#RedoNewPassword").parent().find('div').html("<div class=\"form-error-text\">请输入重复新密码</div>");
				return false;
			}
			if(VerifyCode == "") {
				$(".VerifyCodemsg").html("<div class=\"form-error-text\">请输入验证码</div>");
				return false;
			}
			if(!chePassword) {
				$("#OldPassword").parent().find('div').html("<div class=\"form-error-text\">原密码错误，请重新输入</div>");
				return false;
			}

			dialogConfirm("注：请牢记当前设置密码，您确认要修改密码？", function(r) {
				if(r) {
					Loading(true, "正在提交数据...");
					window.setTimeout(function() {
						var postData = {
							password: $.md5($("#NewPassword").val()),
							oldPassword: $.md5($("#OldPassword").val()),
							verifyCode: $("#VerifyCode").val(),
							autologin: 0
						}
						cm.ajax({
							url: "/PersonCenter/SubmitResetPassword",
							data: postData,
							type: "post",
							dataType: "json",
							success: function(data) {
								if(data.type == 1) {
									dialogIsAlert(data.message, 1, function() {
										top.location.href = "../../webpage/login/login.html";
										sessionStorage.clear();
									});
								} else {
									dialogMsg(data.message, 2);
									$("#VerifyCodeImag").trigger("click");
									$(".VerifyCodemsg").val('');
									$(".VerifyCodemsg").html("<div class=\"form-error-text\">" + data.message + "</div>");
								}
								Loading(false);
							}
						});
					}, 200);
				} else {
					//window.location.reload();
				}
			});
			//			if(confirm('注：请牢记当前设置密码，您确认要修改密码？')) {
			//
			//			}
		})
	}

	//初始化加载系统日志
	this.GetSystemLogGrid = function() {
		var queryJson = $("#filter-form").GetWebControls();
		queryJson["CategoryId"] = 1;
		queryJson["OperateAccount"] = cm.account;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/SystemManage/Log/GetPageListJson", //请求数据的地址 
			postData: {
				queryJson: JSON.stringify(queryJson),
			},
			//data: data,
			datatype: "json",
			/*注意：使用ajax加载数据进jqGrid时需要配置datatype：'local' */
			height: $(window).height() - 195,
			autowidth: true,
			colModel: [{
					label: "主键",
					name: "LogId",
					hidden: true
				},
				{
					label: "操作时间",
					name: "OperateTime",
					index: "OperateTime",
					width: 160,
					align: "left",
					formatter: function(cellvalue, options, rowObject) {
						return formatDate(cellvalue, 'yyyy-MM-dd hh:mm:ss');
					}
				},
				{
					label: "IP地址",
					name: "IPAddress",
					index: "IPAddress",
					width: 150,
					align: "left"
				},
				{
					label: "系统功能",
					name: "Module",
					index: "Module",
					width: 150,
					align: "left"
				},
				{
					label: "操作类型",
					name: "OperateType",
					index: "OperateType",
					width: 70,
					align: "center"
				},
				{
					label: "执行结果",
					name: "ExecuteResult",
					index: "ExecuteResult",
					width: 70,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						if(cellvalue == '1') {
							return "<span class=\"label label-success\">成功</span>";
						} else {
							return "<span class=\"label label-danger\">失败</span>";
						}
					}
				},
				{
					label: "执行结果描述",
					name: "ExecuteResultJson",
					index: "ExecuteResultJson",
					width: 100,
					align: "left"
				}
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100, 500, 1000],
			pager: "#gridPager",
			sortname: 'OperateTime desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true
		});
		//点击时间范围（今天、近7天、近一个月、近三个月）
		$("#time_horizon a.btn-default").click(function() {
			$("#time_horizon a.btn-default").removeClass("active");
			$(this).addClass("active");
			var date_now = new Date();
			switch($(this).attr('data-value')) {
				case "1": //今天
					$("#StartTime").val(now_day);
					$("#EndTime").val(now_day);
					break;
				case "2": //近7天
					$("#StartTime").val(pre_week);
					$("#EndTime").val(now_day);
					break;
				case "3": //近一个月
					$("#StartTime").val(pre_month);
					$("#EndTime").val(now_day);
					break;
				case "4": //近三个月
					$("#StartTime").val(pre_three_month);
					$("#EndTime").val(now_day);
					break;
				default:
					break;
			}
			$("#SelectedStartTime").html($("#StartTime").val());
			$("#SelectedEndTime").html($("#EndTime").val());
			self.SearchEvent();
		});
		//日志分类点击事件（登录日志、访问日志、操作日志）
		$("#SystemLogType li").click(function() {
			$("#SystemLogType li").removeClass("active");
			$(this).addClass("active");
			self.SearchEvent();
		});
		//查询点击事件
		$("#btn_Search").click(function() {
			self.SearchEvent();
			$(".ui-filter-text").trigger("click");
			$("#SelectedStartTime").html($("#StartTime").val());
			$("#SelectedEndTime").html($("#EndTime").val());
		});
		//查询重置
		$("#btn_Reset").click(function() {
			$("#StartTime").val(pre_week);
			$("#EndTime").val(now_day);
			$("#IPAddress").val("");
			$("#OperateType").val("");
			$("#Module").val("");
			self.SearchEvent();
			$(".ui-filter-text").trigger("click");
			$("#SelectedStartTime").html($("#StartTime").val());
			$("#SelectedEndTime").html($("#EndTime").val());
		});
		//查询表格函数
		this.SearchEvent = function() {
			var queryJson = $("#filter-form").GetWebControls();
			queryJson["CategoryId"] = $("#SystemLogType").find('li.active').attr('data-value');
			if($("#SystemLogType").find('li.active').attr('data-value') == 1) {
				queryJson["OperateAccount"] = cm.account;
			} else {
				queryJson["OperateUserId"] = cm.userId;
			}
			$("#gridTable").jqGrid('setGridParam', {
				url: "/SystemManage/Log/GetPageListJson",
				postData: {
					queryJson: JSON.stringify(queryJson)
				},
				page: 1
			}).trigger('reloadGrid');
		}
	}

};
var model = new viewModel();