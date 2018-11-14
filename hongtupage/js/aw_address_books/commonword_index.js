var viewModel = function() {
	var self = this;
	$(function() {
		self.InitialPage();
		self.GetGrid();
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$('#gridTable').setGridHeight($(window).height() - 136.5);
			}, 200);
			e.stopPropagation();
		});
	}
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 121.5,
			url: "/AfterSaleManage/aw_commonwordset/GetPageListJson",
			datatype: "json",
			colModel: [{
					label: 'ID',
					name: 'aw_commonwordid',
					index: 'aw_commonwordid',
					width: 100,
					align: 'center',
					hidden: true,
					sortable: true
				},
				{
					label: '类型',
					name: 'wordtype',
					index: 'wordtype',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '常用语',
					name: 'commonword',
					index: 'commonword',
					width: 250,
					align: 'center',
					sortable: true
				},
				{
					label: '组织ID',
					name: 'organizationid',
					index: 'organizationid',
					width: 100,
					align: 'center',
					hidden: true,
					sortable: true
				},
				{
					label: '创建时间',
					name: 'CreateDate',
					index: 'CreateDate',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '创建人姓名',
					name: 'CreateUserName',
					index: 'CreateUserName',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '修改时间',
					name: 'ModifyDate',
					index: 'ModifyDate',
					width: 100,
					align: 'center',
					hidden: true,
					sortable: true
				},
				{
					label: '修改人姓名',
					name: 'ModifyUserName',
					index: 'ModifyUserName',
					width: 100,
					align: 'center',
					hidden: true,
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'aw_commonwordid',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			onSelectRow: function() {
				selectedRowIndex = $('#' + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$('#' + this.id).setSelection(selectedRowIndex, false);
			}
		});

		//关键字查询事件
		$("#btn_Search").click(function() {
			var queryJson = {
				condition: "keyword",
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
			id: 'Form',
			title: '添加常用语',
			url: '/hongtupage/view/aw_address_books/commonword_form.html',
			width: '600px',
			height: '450px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}
	//编辑
	this.btn_edit = function() {
		var keyValue = $('#gridTable').jqGridRowValue('aw_commonwordid');
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'Form',
				title: '编辑常用语',
				url: '/hongtupage/view/aw_address_books/commonword_form.html?keyValue=' + keyValue,
				width: '600px',
				height: '450px',
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			})
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $('#gridTable').jqGridRowValue('aw_commonwordid');
		if(keyValue) {
			$.RemoveForm({
				url: '/AfterSaleManage/aw_commonwordset/RemoveForm',
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$('#gridTable').trigger('reloadGrid');
				}
			})
		} else {
			dialogMsg('请选择需要删除的aw_commonwordset！', 0);
		}
	}
};

var model = new viewModel();