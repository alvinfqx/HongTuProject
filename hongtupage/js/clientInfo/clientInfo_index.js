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
				$('#gridTable').setGridHeight($(window).height() - 142.5);
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
			height: $(window).height() - 142.5,
			url: "/AfterSaleManage/aw_address_books/GetPageListJson4SendMsg",
			datatype: "json",
			colModel: [{
					label: '序号',
					name: 'id',
					index: 'id',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true,
					key: true
				},
				
				{
					label: '产品型号',
					name: 'producttype',
					index: 'producttype',
					width: 150,
					align: "center",
					sortable: true
				},
				{
					label: '产品名称',
					name: 'productname',
					index: 'productname',
					width: 100,
					align: "center",
					sortable: true
				},

				{
					label: '产品编码',
					name: 'productcode',
					index: 'productcode',
					width: 160,
					align: "center",
					sortable: true
				},
				{
					label: '产品描述',
					name: 'productdesc',
					index: 'productdesc',
					width: 160,
					align: "center",
					sortable: true
				},
				{
					label: '合同号',
					name: 'contract',
					index: 'contract',
					width: 160,
					align: "center",
					sortable: true
				},
				{
					label: '合同签署日期',
					name: 'contract_sign_date',
					index: 'contract_sign_date',
					width: 120,
					align: "center",
					sortable: true
				},

				{
					label: '客户单位',
					name: 'client',
					index: 'client',
					width: 200,
					align: "center",
					sortable: true
				},
				{
					label: '客户地址',
					name: 'address',
					index: 'address',
					width: 180,
					align: "center",
					sortable: true
				},
				{
					label: '联系人',
					name: 'linkman',
					index: 'linkman',
					width: 100,
					align: "center",
					sortable: true
				},
				{
					label: '联系方式',
					name: 'cellphone',
					index: 'cellphone',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: '销售经理',
					name: 'bussinessman',
					index: 'bussinessman',
					width: 100,
					align: "center",
					sortable: true
				},
				{
					label: '质保期',
					name: 'warrenty_date',
					index: 'warrenty_date',
					width: 120,
					align: "center",
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'warrenty_date',
			sortorder: 'desc',
			rownumbers: true,
			//复选框
			multiselect: false,
			shrinkToFit: false,
			gridview: true,
			onSelectRow: function() {
				selectedRowIndex = $('#' + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$('#' + this.id).setSelection(selectedRowIndex, false);
			},
			ondblClickRow: function(rowid, iCol, cellcontent, e) {
				self.btn_view(); //双击查看
			}
		});

		//查询条件
		$("#queryCondition .dropdown-menu li").click(function() {
			var text = $(this).find('a').html();
			var value = $(this).find('a').attr('data-value');
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value)
		});
		//查询事件
		$("#btn_Search").click(function() {
			var queryJson = {
				//queryway: "common_query",
				//condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
				condition: "KEYWORD QUERY",
				keyword: $("#txt_Keyword").val()
			}
			$gridTable.jqGrid('setGridParam', {
				postData: {
					queryJson: JSON.stringify(queryJson)
				},
				page: 1
			}).trigger('reloadGrid');
		});

		//查询事件
		$("#btn_Search_advance").click(function() {
			var queryJson = {
				queryway: "advance_query",
				servicedesc: "dfe",
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

	//高级查询
	this.show_hs = function() {
		if($(".hs-block ").css('display') != "block") {
			$(".hs-block").show();
			$(".file-block").hide();
		} else {
			$(".hs-block").hide();
			$(".file-block").hide();
		}
	};

	//高级查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		var queryJson = {
			"client": $("#client").val(),
			"linkman": $("#linkman").val(),
			"contract": $("#contract").val(),
			"productName": $("#productName").val(),
			"productType": $("#productType").val(),
			"productcode": $("#productcode").val(),
			"Contract_begin_Time": $("#Contract_begin_Time").val(),
			"Contract_end_Time": $("#Contract_end_Time").val(),
			"warranty_begin_Time": $("#warranty_begin_Time").val(),
			"warranty_end_Time": $("#warranty_end_Time").val()
		}
		$gridTable.jqGrid('setGridParam', {
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};

	//查看
	this.btn_view = function() {
		var keyValue = $('#gridTable').jqGridRowValue('id');
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'Form',
				title: '查看',
				url: '/hongtupage/view/clientInfo/clientInfo_form.html?keyValue=' + keyValue,
				width: '700px',
				height: '450px',
				btn: null,
			})
		}
	}
};
$('.toolbar').authorizeButton();
var model = new viewModel();