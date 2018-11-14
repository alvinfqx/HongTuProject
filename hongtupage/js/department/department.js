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
				$("#gridTable").setGridHeight($(window).height() - 108.5);
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
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			param: {
				keyword: paramStr,
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

	//树形查询事件
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
			url: "/BaseManage/Department/GetPageListJson",
			datatype: "json",
			postData: {
				queryJson: JSON.stringify({
					ProvinceId: _itemId,
					Category:1
				})
			},
			height: $(window).height() - 108.5,
			autowidth: true,
			colModel: [{
					label: '主键',
					name: 'DepartmentId',
					hidden: true
				},
				{
					label: '公司Id',
					name: 'OrganizeId',
					hidden: true
				},
				{
					label: 'Sort',
					name: 'Sort',
					hidden: true
				},
				{
					label: "部门名称",
					name: "FullName",
					width: 200,
					align: "center",
					sortable: false
				},
				{
					label: "部门编号",
					name: "EnCode",
					width: 100,
					align: "center",
					sortable: false
				},
				{
					label: "部门简称",
					name: "ShortName",
					width: 100,
					align: "center",
					sortable: false
				},
				{
					label: "部门性质",
					name: "Nature",
					width: 100,
					align: "center",
					sortable: false
				},
				{
					label: "负责人",
					name: "Manager",
					width: 100,
					align: "center",
					sortable: false
				},
				{
					label: '公司',
					name: 'OrganizeId',
					index: 'OrganizeId',
					width: 200,
					align: 'center',
					formatter: function(cellvalue, options, rowObject) {
						return top.clientorganizeData[cellvalue] == null ? "" : top.clientorganizeData[cellvalue].FullName;
					}
				},
				{
					label: "电话号",
					name: "OuterPhone",
					width: 100,
					align: "center",
					sortable: false
				},
				{
					label: "分机号",
					name: "InnerPhone",
					width: 60,
					align: "center",
					sortable: false
				},
				{
					label: "备注",
					name: "Description",
					width: 200,
					align: "center",
					sortable: false
				}
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'OrganizeId asc,CreateDate desc',
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
		//查询条件设置
		$("#queryCondition .dropdown-menu li").click(function() {
			var text = $(this).find('a').html();
			var value = $(this).find('a').attr('data-value');
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value)
		});
		//查询事件
		$("#btn_Search").click(function() {
			$gridTable.jqGrid('setGridParam', {
				postData: {
					queryJson: JSON.stringify({
						ProvinceId: _itemId,
						condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
						keyword: $("#txt_Keyword").val()
					})
				}
			}).trigger('reloadGrid');
		});
		//查询回车事件
		$('#txt_Keyword').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	}
	//新增
	this.btn_add = function() {
		var organizeId = $("#gridTable").jqGridRowValue("OrganizeId");
		if(!checkedRow(organizeId)) {
			organizeId = _itemId;
		}
		var parentId = $("#gridTable").jqGridRowValue("DepartmentId");
		if(!checkedRow(parentId)) {
			parentId = _itemId;
		}
		var sort = $("#gridTable").jqGridRowValue("Sort");

		dialogOpen({
			id: "Form",
			title: '添加部门',
			url: '/hongtupage/view/department/department_form.html?organizeId=' + organizeId + '&parentId=' + parentId + '&sort=' + sort + '&keyValue=' + '',
			width: "700px",
			height: "500px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
		//		}
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("DepartmentId");
		if(checkedRow(keyValue)) {
			var sort = $("#gridTable").jqGridRowValue("Sort");
			if(sort == 'Organize') {
				return false;
			}
			dialogOpen({
				id: "Form",
				title: '编辑部门',
				url: '/hongtupage/view/department/department_form.html?keyValue=' + keyValue,
				width: "700px",
				height: "500px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("DepartmentId");
		if(keyValue) {
			var sort = $("#gridTable").jqGridRowValue("Sort");
			if(sort == 'Organize') {
				return false;
			}
			$.RemoveForm({
				url: "/BaseManage/Department/RemoveForm",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridTable").resetSelection();
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的部门！', 0);
		}
	}
};

//$('.toolbar').authorizeButton()
var model = new viewModel();