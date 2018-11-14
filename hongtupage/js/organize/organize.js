var viewModel = function() {
	var self = this;
	$(document).ready(function() {
		self.initialPage();
		self.GetGrid();
		self.GetTree();
	});
	//重设(表格)宽高
	this.initialPage = function() {
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
			url: "/BaseManage/Organize/GetPageListJsonToArea",
			datatype: "json",
			postData: {
				queryJson: JSON.stringify({
					//					ProvinceId: _itemId,
					Category: 1
				})
			},
			height: $(window).height() - 108.5,
			autowidth: true,
			colModel: [{
					label: '主键',
					name: 'OrganizeId',
					hidden: true
				},
				{
					label: "公司名称",
					name: "FullName",
					width: 300,
					align: "left",
					sortable: false
				},
				{
					label: "外文名称",
					name: "EnCode",
					width: 150,
					align: "left",
					sortable: false
				},
				{
					label: "中文名称",
					name: "ShortName",
					width: 150,
					align: "left",
					sortable: false
				},
				{
					label: "公司性质",
					name: "Nature",
					width: 100,
					align: "left",
					sortable: false
				},
				{
					label: "成立时间",
					name: "FoundedTime",
					width: 100,
					align: "left",
					sortable: false,
					formatter: function(cellvalue, options, rowObject) {
						return formatDate(cellvalue, 'yyyy-MM-dd');
					}
				},
				{
					label: "负责人",
					name: "Manager",
					width: 100,
					align: "left",
					sortable: false
				},
				{
					label: "经营范围",
					name: "Fax",
					width: 200,
					align: "left",
					sortable: false
				},
				{
					label: "备注",
					name: "Description",
					width: 200,
					align: "left",
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
						Category: 1,
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
		var ParentId = $("#gridTable").jqGridRowValue("OrganizeId");
		dialogOpen({
			id: "Form",
			title: '添加机构',
			url: '/hongtupage/view/organize/organize_form.html?ParentId=' + ParentId + '&keyValue=' + '',
			width: "750px",
			height: "500px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	};
	//编辑
	this.btn_edit = function() {
		var keyValue = $("#gridTable").jqGridRowValue("OrganizeId");
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "Form",
				title: '修改机构',
				url: '/hongtupage/view/organize/organize_form.html?keyValue=' + keyValue,
				width: "750px",
				height: "500px",
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $("#gridTable").jqGridRowValue("OrganizeId");
		if(keyValue) {
			$.RemoveForm({
				url: "/BaseManage/Organize/RemoveForm",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#gridTable").resetSelection();
					$("#gridTable").trigger("reloadGrid");
				}
			})
		} else {
			dialogMsg('请选择需要删除的数据项！', 0);
		}
	}
};
$('.toolbar').authorizeButton()
var model = new viewModel();