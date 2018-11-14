var viewModel = function() {
	var self = this;
	$(function() {
		self.InitialPage();
		self.GetGrid();
	});

	this.show_hs = function() {
		if($(".hs-block ").css('display') != "block") {
			$(".hs-block").show();
			$(".file-block").hide();
		} else {
			$(".hs-block").hide();
			$(".file-block").hide();
		}
	}
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
			height: $(window).height() - 136.5,
			url: "/AfterSaleManage/dm_alarm/GetPageNewRequireTopSearchAlarmList",
			datatype: "json",
			colModel: [{
					label: '主键id',
					name: 'alarmItemID',
					index: 'alarmItemID',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '相关工单id',
					name: 'workInfoId',
					index: 'workInfoId',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '等级',
					name: 'alarmGrade',
					index: 'alarmGrade',
					width: 140,
					align: 'center',
					sortable: true
				},
				{
					label: '类型',
					name: 'alarmType',
					index: 'alarmType',
					width: 70,
					align: 'center',
					sortable: true
				},
				{
					label: '产品id',
					name: 'orderProductId',
					index: 'orderProductId',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '产品大类',
					name: 'productType',
					index: 'productType',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '产品名称',
					name: 'productName',
					index: 'productName',
					width: 75,
					align: 'center',
					sortable: true
				},
				{
					label: '产品编码',
					name: 'productCode',
					index: 'productCode',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '客户名称',
					name: 'client',
					index: 'client',
					width: 110,
					align: 'center',
					sortable: true
				},
				{
					label: '来源',
					name: 'resource_Info',
					index: 'resource_Info',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '时间',
					name: 'occuredTime',
					index: 'occuredTime',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '报警内容',
					name: 'alarm_content',
					index: 'alarm_content',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '处理状态',
					name: 'handle_status',
					index: 'handle_status',
					width: 100,
					align: 'center',
					sortable: true
				}
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'createDate',
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
	
		//查询事件
		$("#btn_Search").click(function() {
			var withinWeek = $("#withinWeek").is(":checked");
			var TreatmentState = $("#TreatmentState input[name='optionsRadiosinline']:checked").val();//状态

			var queryJson = {
				"keyword": $("#txt_Keyword").val(),
				"keyWordSearch": "keywordSearch",
				"withinWeek": withinWeek,
				"TreatmentState": TreatmentState
			}
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/dm_alarm/GetPageNewRequireTopSearchAlarmList",
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

	//高级查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		var withinWeek = $("#withinWeek").is(":checked");
		var TreatmentState = $("#TreatmentState input[name='optionsRadiosinline']:checked").val();//状态
		var queryJson = {
			"alarmType": $("#alarmType").val(),
			"productType": $("#productType").val(),
			"productName": $("#productName").val(),
			"client": $("#client").val(),
			"productCode": $("#productCode").val(),
			"StartDate": $("#begindata").val(),
			"EndDate": $("#enddata").val(),
			"withinWeek": withinWeek,
			"TreatmentState": TreatmentState
		}
		$gridTable.jqGrid('setGridParam', {
			url: "/AfterSaleManage/dm_alarm/GetPageNewRequireTopSearchAlarmList",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};

	dialogOpenCommitForward = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['一键派单', '关闭'],
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
	this.btn_details = function() {
		var alarmItemID = $('#gridTable').jqGridRowValue('alarmItemID');
		if(checkedRow(alarmItemID)) {
		dialogOpenContent({
			id: 'Formsss',
			url: '/hongtupage/view/alarmInformation/alarm_details.html?alarmItemID=' + alarmItemID,
			width: 'px',
			height: 'px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}
}
	//编辑
	this.btn_edit = function() {
		var alarmItemID = $('#gridTable').jqGridRowValue('alarmItemID');
		if(checkedRow(alarmItemID)) {
				dialogOpenCommitForward({
					id: 'Form',
					url: '/hongtupage/view/alarmInformation/handle.html?alarmItemID=' + alarmItemID,
					width: 'px',
					height: 'px',
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClicks();
					}
				})
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		if(keyValue) {
			$.RemoveForm({
				url: '/AfterSaleManage/aw_CustomerAssignedToNeed/RemoveForm',
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$('#gridTable').trigger('reloadGrid');
				}
			})
		} else {
			dialogMsg('请选择需要删除的工作任务表！', 0);
		}
	}
};

var model = new viewModel();