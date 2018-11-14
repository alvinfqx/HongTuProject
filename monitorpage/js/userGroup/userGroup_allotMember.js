var viewModel = function() {
	var self = this;
	var userGroupId = request('userGroupId');
	$(function() {
		self.InitialPage();
		self.GetMember();
		self.GetTree();
	});
	//初始化页面
	this.InitialPage = function() {
		//layout布局
		$('#layout').layout({
			applyDemoStyles: true,
			west__size: 160,
			spacing_open: 0,
			onresize: function() {
				$(window).resize()
			}
		});
		$(".center-Panel").height($(window).height() - 40)
	}
	//加载树
	var departmentid = "card-box";

	this.GetTree = function() {
		var item = {
			height: $(window).height() - 1,
			url: "/AuthorizeManage/PermissionUserGroup/GetDepartmentTreeJson",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			param: {
				userGroupId: userGroupId
			},
			onnodeclick: function(item) {
				Loading(true);
				window.setTimeout(function() {
					if(item.parentnodes == "0") {
						$(".card-box").show();
						departmentid = "card-box";
					} else {
						$(".card-box").hide();
						$('.' + item.id).show();
						departmentid = item.id;
					}
					Loading(false);
				}, 200);
			}
		};

		//初始化
		$("#itemTree").treeview(item);
	}
	//加载成员
	this.GetMember = function() {
		cm.ajax({
			url: "/AuthorizeManage/PermissionUserGroup/GetUserListJson",
			data: {
				userGroupId: userGroupId
			},
			type: "get",
			dataType: "json",
			async: false,
			success: function(data) {
				var _html = "";
				$.each(data, function(i) {
					var row = data[i];
					var imgName = "UserCard01.png";
					if(row.gender == 1) {
						imgName = "UserCard03.png";
					}
					var active = "";
					if(row.ischeck == 1) {
						active = "active";
					}
					_html += '<div class="card-box ' + row.departmentid + ' ' + active + '">';
					_html += '    <div class="card-box-img">';
					_html += '        <img src="../../../static/lib/Images/' + imgName + '" />';
					_html += '    </div>';
					_html += '    <div id="' + row.userid + '" class="card-box-content">';
					_html += '        <p>账户：' + row.account + '</p>';
					_html += '        <p>姓名：' + row.realname + '</p>';
					_html += '        <p>部门：' + row.departmentname + '</p>';
					_html += '    </div><i></i>';
					_html += '</div>';
				});
				$(".gridPanel").html(_html);
				$(".card-box").click(function() {
					if(!$(this).hasClass("active")) {
						$(this).addClass("active")
					} else {
						$(this).removeClass("active")
					}
				})
				Loading(false);
			},
			beforeSend: function() {
				Loading(true);
			}
		});
		//模糊查询用户（注：这个方法是理由jquery查询）
		$("#txt_TreeKeyword").keyup(function() {
			var value = $(this).val();
			if(value != "") {
				window.setTimeout(function() {
					$("." + departmentid)
						.hide()
						.filter(":contains('" + (value) + "')")
						.show();
				}, 200);
			} else {
				$("." + departmentid).show();
			}
		}).keyup();
	}
	//保存表单
	this.AcceptClick = function() {
		var userIds = [];
		$('.gridPanel .active .card-box-content').each(function() {
			userIds.push($(this).attr('id'));
		});
		var postData = $("#form1").GetWebControls();
		postData["userGroupId"] = userGroupId;
		postData["userIds"] = String(userIds)
		$.SaveForm({
			url: "/AuthorizeManage/PermissionUserGroup/SaveMember",
			param: postData,
			loading: "正在保存用户组成员...",
			success: function() {
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();