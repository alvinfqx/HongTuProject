var viewModel = function(){
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
				$('#gridpanel').setGridWidth(($('.gridP').width()));
				$('#gridTable').setGridHeight($(window).height() - 136.5);
			}, 200);
			e.stopPropagation();
		});
	}
	this.show_hs = function() {
		if($(".hs-block ").css('display') != "block") {
			$(".hs-block").show();
			$(".file-block").hide();
		} else {
			$(".hs-block").hide();
			$(".file-block").hide();
		}
	}
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 136.5,
			url: "/Monitor/GetCustomerServicesArchivesList",
			datatype: "json",
			colModel: [{
					label: '序号',
					name: 'workinfoid',
					index: 'workinfoid',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
			},
			{
					label: '工单号',
					name: 'slseq',
					index: 'slseq',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
			},
				{
					label: '地址',
					name: 'address',
					index: 'address',
					width:150,
					align: 'center',
					sortable: true
				},
				{
					label: '客户名称',
					name: 'client',
					index: 'client',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '服务类型',
					name: 'servicemode',
					index: 'servicemode',
					width: 75,
					align: 'center',
					sortable: true
				},
				{
					label: '产品号',
					name: 'productcode',
					index: 'productcode',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '出厂日期',
					name: 'productiondate',
					index: 'productiondate',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '调试日期',
					name: 'receivertime',
					index: 'receivertime',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '客户服务需求',
					name: 'requirementshow',
					index: 'requirementshow',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '服务开始时间',
					name: 'servicedatefrom',
					index: 'servicedatefrom',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '服务结束时间',
					name: 'modifydate',
					index: 'modifydate',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '服务类型',
					name: 'servicemode',
					index: 'servicemode',
					width: 110,
					align: 'center',
					sortable: true
				},
				{
					label: '处置方案',
					name: 'serviceconclusion',
					index: 'serviceconclusion',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '最终处置方案',
					name: 'actionplanshow',
					index: 'actionplanshow',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '服务人员',
					name: 'servicestaffnames',
					index: 'servicestaffnames',
					width: 100,
					align: 'center',
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'createdate',
			sortorder: 'desc',
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			onSelectRow: function() {
				selectedRowIndex = $('#' + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				console.log(selectedRowIndex);
				$('#' + this.id).setSelection(selectedRowIndex, false);
			},
			loadComplete: function(data) {
				console.log(data);
			}
		});
	}
	
	this.export_a = function() { //导出
		var queryJson = {
			"client": $("#client").val(),
			"address": $("#address").val(), 
			"productCode": $("#productCode").val(), 
			"dg_startTime": $("#dg_startTime").val(),
			"dg_endTime": $("#dg_endTime").val(), 
			"se_startTime": $("#se_startTime").val(),
			"se_endTime": $("#se_endTime").val(), 
			"serviceStaffNames": $("#serviceStaffNames").val(),
			"keyValue":"导出"
		}
		var query = JSON.stringify(queryJson);
		window.location= cm.domain +"/Monitor/GetCustomerServicesArchivesList?queryJson="+query+"&token="+cm.token;
		}
	
	//查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');

		console.log("cejo1");
		var queryJson = {
			"client": $("#client").val(),
			"address": $("#address").val(), 
			"productCode": $("#productCode").val(), 
			"dg_startTime": $("#dg_startTime").val(),
			"dg_endTime": $("#dg_endTime").val(), 
			"se_startTime": $("#se_startTime").val(),
			"se_endTime": $("#se_endTime").val(), 
			"serviceStaffNames": $("#serviceStaffNames").val(),
			"keyValue":""
		}
		$gridTable.jqGrid('setGridParam', {
			url: "/Monitor/GetCustomerServicesArchivesList",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};
	
	
};



var model = new viewModel();