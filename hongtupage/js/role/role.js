var viewModel = function() {
	var self = this;
//	var companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : '';
//	alert(companyId);
	$(function() {
		self.InitialPage();
		self.GetTree('');
		self.GetGrid();
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$("#gridTable").setGridHeight($(window).height() - 136.5);
				$("#itemTree").setTreeHeight($(window).height() - 45);
			}, 200);
			e.stopPropagation();
		});
	}
	
	//加载树
	var _itemId = '';
	this.GetTree = function(paramStr) {
		var item = {
			height: $(window).height() - 52,
			url: "/SystemManage/Area/GetProvinceListToJson",
			cbiconpath:"../../../static/lib/scripts/plugins/tree/images/icons/",
			param: {
				keyword:paramStr,
			},
			onnodeclick: function(item) {
				_itemId = item.id;
				//				alert(_itemId)
				$('#btn_Search').trigger("click");
			},
			onLodeSuccess: function(item) {
				_itemId = item[0]["id"];
//			_itemId = item.id;
			}
		};
		$("#itemTree").treeview(item);
	};
	
	//查询事件
	$("#b_Search").click(function() {
		self.GetTree($("#t_Keyword").val());
//		cm.ajax({
//			url: "/BaseManage/Organize/GetTreeListJsonToArea", //
//			type: "GET",
//			dataType: "json",
//			data: {
//				keyword: $("#t_Keyword").val()
//			},
//			success: function(data) {
//				console.log(data)
//			},
//			error: function(data) {
//				console.log(data);
//			}
//		})
	});
	
	//树形点击键盘查询
	$('#t_Keyword').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#b_Search').trigger("click");
			}
		});
		
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			url: "/BaseManage/Role/GetPageListOrganize?isfilter=",
			datatype: "json",
			postData: {
				queryJson: JSON.stringify({
//					ProvinceId: _itemId,
					Category:1
				})
			},
			height: $(window).height() - 136.5,
			autowidth: true,
			colModel: [{
					label: '主键',
					name: 'RoleId',
					hidden: true
				},
				{
					label: '角色编号',
					name: 'EnCode',
					index: 'EnCode',
					width: 100,
					align: 'center'
				},
				{
					label: '角色名称',
					name: 'FullName',
					index: 'FullName',
					width: 200,
					align: 'center'
				},
				{
					label: '所在公司',
					name: 'OrganizeId',
					index: 'OrganizeId',
					width: 250,
					align: 'center',
					formatter: function(cellvalue, options, rowObject) {
						return top.clientorganizeData[cellvalue].FullName;
					}
				},
				{
					label: '创建时间',
					name: 'CreateDate',
					index: 'CreateDate',
					width: 130,
					align: 'center',
					formatter: "date",
					formatoptions: {
						srcformat: 'Y-m-d H:i',
						newformat: 'Y-m-d H:i'
					}
				},
				{
					label: "公共",
					name: "IsPublic",
					index: "IsPublic",
					width: 50,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "有效",
					name: "EnabledMark",
					index: "EnabledMark",
					width: 50,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return cellvalue == 1 ? "<i class=\"fa fa-toggle-on\"></i>" : "<i class=\"fa fa-toggle-off\"></i>";
					}
				},
				{
					label: "角色描述",
					name: "Description",
					index: "Description",
					width: 200,
					align: "center"
				}
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'CreateDate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			onSelectRow: function() {
				selectedRowIndex = $("#" + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$("#" + this.id).setSelection(selectedRowIndex, false);
			}
		});
//		$gridTable.authorizeColModel();
		//查询条件
		$("#queryCondition .dropdown-menu li").click(function() {
			var text = $(this).find('a').html();
			var value = $(this).find('a').attr('data-value');
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value)
		});
		//查询事件
		$("#btn_Search").click(function() {
			var queryJson = {
				ProvinceId: _itemId,
				Category:1,
				condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
				keyword: $("#txt_Keyword").val()
			}
			$gridTable.jqGrid('setGridParam', {
				postData: {
					queryJson: JSON.stringify(queryJson)
				},
				page: 1
			}).trigger('reloadGrid');
		});
		//查询回车
		$('#txt_Keyword').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	}
	//新增
	this.btn_add = function() {
		dialogOpen({
			id: "Form",
			title: '添加角色',
			url: '/hongtupage/view/role/role_form.html?_itemId='+_itemId+'&keyValue='+'',
			width: "500px",
			height: "360px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("RoleId");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "Form",
				title: '修改角色',
				url: '/hongtupage/view/role/role_form.html?keyValue=' + keyValue,
				width: "500px",
				height: "360px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("RoleId");
		if(keyValue) {
			$.RemoveForm({
				url: "/BaseManage/Role/RemoveForm",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的角色！', 0);
		}
	}
	//角色成员
	this.btn_member = function() {
		var keyValue = $("#gridTable").jqGridRowValue("RoleId");
		var RoleName = $("#gridTable").jqGridRowValue("FullName");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "AllotMember",
				title: '角色成员 - ' + RoleName,
				url: '/hongtupage/view/role/role_allotMember.html?roleId=' + keyValue,
				width: "800px",
				height: "520px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//角色授权
	this.btn_authorize = function() {
		var keyValue = $("#gridTable").jqGridRowValue("RoleId");
		var RoleName = $("#gridTable").jqGridRowValue("FullName");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "AllotAuthorize",
				title: '角色授权 - ' + RoleName,
				url: '/hongtupage/view/role/role_allotAuthorize.html?roleId=' + keyValue,
				width: "700px",
				height: "690px",
				btn: null
			});
		}
	}
	//IP过滤
	this.btn_ipfilter = function() {
		var keyValue = $("#gridTable").jqGridRowValue("RoleId");
		var FullName = $("#gridTable").jqGridRowValue("FullName");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "FilterIP",
				title: 'TCP/IP 地址访问限制 - ' + FullName,
				url: '/hongtupage/view/role/role_filterIP.html?objectId=' + keyValue + '&objectType=Role',
				width: "600px",
				height: "400px",
				btn: null
			});
		}
	}
	//时段过滤
	this.btn_timefilter = function() {
		var keyValue = $("#gridTable").jqGridRowValue("RoleId");
		var FullName = $("#gridTable").jqGridRowValue("FullName");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "FilterTime",
				title: '时段访问过滤 - ' + FullName,
				url: '/hongtupage/view/role/role_filterTime.html?objectId=' + keyValue + '&objectType=Role',
				width: "640px",
				height: "480px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
};
//$('.toolbar').authorizeButton()
var model = new viewModel();