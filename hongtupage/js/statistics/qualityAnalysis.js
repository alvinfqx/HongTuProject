var viewModel = function(){
	var self = this;
	$(function() {
		//故障类型
		$("#serviceType").ComboBox({
			url: "/Monitor/GetServiceModeList",
//			param: {
//				EnCode: "service_type_as"
//			},
			id: "servicenature",
			text: "servicenature",
			description: "==请选择==",
			height: "200px"
		});
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
			url: "/Monitor/GetQualityAnalysisList",
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
					label: '客户服务需求',
					name: 'requirementshow',
					index: 'requirementshow',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '故障分析',
					name: 'servicedesc',
					index: 'servicedesc',
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
					label: '接单时间',
					name: 'receivertime',
					index: 'receivertime',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '完成时间',
					name: 'modifydate',
					index: 'modifydate',
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
		var $gridTable = $('#gridTable');
		var serviceTypes = $("#serviceType").attr('data-text');

		if(serviceTypes == null || serviceTypes == undefined || serviceTypes == "") {
			serviceTypes = "";
		} else {
			serviceTypes = $("#serviceType").attr('data-text');
		}

		console.log("cejo1");
		var queryJson = {
			"startTime": $("#begindata").val(), //开始时间
			"endTime": $("#enddata").val(), //结束时间
			"client": $("#client").val(), //客户名称
			"productCode": $("#productCode").val(), //产品号
			"address": $("#address").val(), //地址
			"serviceStaffNames": $("#serviceStaffNames").val(), //服务人员
			"serviceMode": serviceTypes, //故障类型
			"keyValue":"导出"
		}
		var query = JSON.stringify(queryJson);
		window.location= cm.domain +"/Monitor/GetQualityAnalysisList?queryJson="+query+"&token="+cm.token;
		}
	
	//查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		var serviceTypes = $("#serviceType").attr('data-text');

		if(serviceTypes == null || serviceTypes == undefined || serviceTypes == "") {
			serviceTypes = "";
		} else {
			serviceTypes = $("#serviceType").attr('data-text');
		}

		console.log("cejo1");
		var queryJson = {
			"startTime": $("#begindata").val(), //开始时间
			"endTime": $("#enddata").val(), //结束时间
			"client": $("#client").val(), //客户名称
			"productCode": $("#productCode").val(), //产品号
			"address": $("#address").val(), //地址
			"serviceStaffNames": $("#serviceStaffNames").val(), //服务人员
			"serviceMode": serviceTypes, //故障类型
			"keyValue":""
		}
		$gridTable.jqGrid('setGridParam', {
			url: "/Monitor/GetQualityAnalysisList",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};
	
	
};



var model = new viewModel();