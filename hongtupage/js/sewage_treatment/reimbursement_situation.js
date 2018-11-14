var viewModel = function() {
	var self = this;
	$(function() {
		self.GetGrid();
		self.InitialPage();
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function() {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$('#gridTable').setGridHeight($(window).height() - 143);
			}, 200);
		});
	};
	dialogOpenDistribute = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			title: '系统窗口',
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['保存', '关闭'],
			callBack: null
		};
		var options = $.extend(defaults, options);
		var _url = options.url;
		var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
		var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
		top.layer.open({
			id: options.id,
			type: 2,
			shade: options.shade,
			title: options.title,
			fix: false,
			area: [_width, _height],
			content: top.mainPath + _url,
			btn: options.btn,
			yes: function() {
				//alert("yes");
				options.callBack(options.id)
			},
			cancel: function() {
				if(options.cancel != undefined) {
					options.cancel();
				}
				return true;

			},
			end: function() {
				$('#gridTable').trigger('reloadGrid');
			}
		});
	}
	
	dialogOpenDetails = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			title: '系统窗口',
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['确定', '关闭'],
			callBack: null
		};
		var options = $.extend(defaults, options);
		var _url = options.url;
		var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
		var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
		top.layer.open({
			id: options.id,
			type: 2,
			shade: options.shade,
			title: options.title,
			fix: false,
			area: [_width, _height],
			content: top.mainPath + _url,
			btn: options.btn,
			yes: function() {
				//alert("yes");
				options.callBack(options.id)
			},
			cancel: function() {
				if(options.cancel != undefined) {
					options.cancel();
				}
				return true;

			},
			end: function() {
				$('#gridTable').trigger('reloadGrid');
			}
		});
	}
	
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 143,
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetPageListWithSql",
			postData: {
				date: '',
				Name: '',
				IsArrears: 'false'
			},
			datatype: "json",
			colModel: [{
					label: '主键id',
					name: 'str_id',
					index: 'str_id',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '客户id',
					name: 'CUST_ID',
					index: 'CUST_ID',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '月份',
					name: 'month',
					index: 'month',
					width: 140,
					align: 'center',
					sortable: true
				},
				{
					label: '客户',
					name: 'fullname',
					index: 'fullname',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '单价',
					name: 'price',
					index: 'price',
					width: 75,
					align: 'center',
					sortable: true
				},
				{
					label: '污水处理量',
					name: 'st_capacity',
					index: 'st_capacity',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '费用',
					name: 'cost',
					index: 'cost',
					width: 75,
					align: 'center',
					sortable: true
				},
				{
					label: '本年往月欠交费用',
					name: 'lastmontharrears',
					index: 'lastmontharrears',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '滞纳金',
					name: 'latefee',
					index: 'latefee',
					width: 110,
					align: 'center',
					sortable: true
				},
				{
					label: '应交费用',
					name: 'thismonthshouldcost',
					index: 'thismonthshouldcost',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '已收费用',
					name: 'returnmoney',
					index: 'returnmoney',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '收费日期',
					name: 'modifydate',
					index: 'modifydate',
					width: 150,
					align: 'center',
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'str_id',
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
		//查询事件
		$("#btn_Search").click(function() {
			var withinMonth = $("#withinMonth").is(":checked");
			var Name = $("#txt_Keyword").val();
			var date = $("#enddata").val();
			var queryJson = {
				"date": date,
				"Name": Name,
				"IsArrears": withinMonth
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
	this.btn_details = function() { //详情
		var keyValue = $('#gridTable').jqGridRowValue('str_id');
		if(checkedRow(keyValue)) {
			dialogOpenDetails({ //
				id: 'Form',
				title: '污水治理回款详情',
				url: '/hongtupage/view/sewage_treatment/reimbursement_added.html?keyValue=' + keyValue,
				width: 'px',
				height: 'px',
				callBack: function(iframeId) {
					// alert("hifefe");
					top.frames[iframeId].model.AcceptClicks();
				}
			});
		}
	}
	
	this.btn_edit = function() { //编辑
		var keyValue = $('#gridTable').jqGridRowValue('str_id');
		if(checkedRow(keyValue)) {
			dialogOpenDistribute({ //
				id: 'Form_edit',
				title: '污水治理回款编辑',
				url: '/hongtupage/view/sewage_treatment/reimbursement_edit.html?keyValue=' + keyValue,
				width: 'px',
				height: 'px',
				callBack: function(iframeId) {
					// alert("hifefe");
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
};

var model = new viewModel();