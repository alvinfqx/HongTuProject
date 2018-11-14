var viewModel = function() {
	var self = this;
	var objectId = request('objectId');
	var objectType = request('objectType');
	$(function() {
		self.GetGrid();
	});
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AuthorizeManage/FilterIP/GetListJson",
			postData: {
				objectId: objectId,
				visitType: 1
			},
			datatype: "json",
			height: $(window).height() - 115,
			autowidth: true,
			colModel: [{
					label: "主键",
					name: "FilterIPId",
					hidden: true
				},
				{
					label: "访问",
					name: "VisitType",
					width: 80,
					align: "center",
					sortable: false,
					formatter: function(cellvalue) {
						if(cellvalue == 0) {
							return '<span value=' + cellvalue + ' class=\"label label-danger\">拒绝</span>';
						} else {
							return '<span value=' + cellvalue + ' class=\"label label-success\">授权</span>';
						}
					}
				},
				{
					label: "IP地址(子网掩码)",
					name: "IPLimit",
					width: 200,
					align: "left",
					sortable: false
				}
			],
			rowNum: "10000",
			rownumbers: true,
			onSelectRow: function() {
				selectedRowIndex = $("#" + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$("#" + this.id).setSelection(selectedRowIndex, false);
			}
		});
		//授权、拒绝 访问事件
		$("#btn_visitType a.btn-default").click(function() {
			$("#btn_visitType a.btn-default").removeClass("active");
			$(this).addClass("active");
			$gridTable.jqGrid('setGridParam', {
				postData: {
					objectId: objectId,
					visitType: $(this).attr('data-value')
				},
			}).trigger('reloadGrid');
		});
	}
	//新增
	this.btn_add = function() {
		var visitType = $("#btn_visitType a.active").attr('data-value');
		dialogOpen({
			id: "Form",
			title: '添加IP地址',
			url: '/webpage/system/role_filterIP_form.html?objectId=' + objectId + '&objectType=' + objectType + "&visitType=" + visitType,
			width: "400px",
			height: "260px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("FilterIPId");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "Form",
				title: '编辑IP地址',
				url: '/webpage/system/role_filterIP_form.html?keyValue=' + keyValue,
				width: "400px",
				height: "260px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("FilterIPId");
		if(keyValue) {
			$.RemoveForm({
				url: "/AuthorizeManage/FilterIP/RemoveForm",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的库连接！', 0);
		}
	}
};

var model = new viewModel();