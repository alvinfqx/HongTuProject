var viewModel = function() {
	var self = this;
	var eq_name = newrequest('proname');
	var procode = newrequest('procode'); //设备编码
	//	alert(procode)
	var now_day = cm.format.TimeFmt(new Date());
	$("#time_id").val(now_day);
	$(function() {
		$('body').css({
			'height': document.documentElement.clientHeight - 20
		});
		$("#name_id").val(eq_name);
//		var timestrVal = $("#time_id").val();
		//		$("#iframe1").attr("src", self.newIframeUrl(timestrVal));
		self.GetGrid();
		self.InitialPage();
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

	this.GetGrid = function() { //加载表格
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 136.5,
			url: "/Monitor/GetHistoryListToDataTime",
			datatype: "json",
			postData: {
				keyvalue: procode,
				datatime: $("#time_id").val(),
				TimeInterval:'2'
			},
			colModel: [
				{
					label: '时间',
					name: 'coll_date',
					index: 'coll_date',
					width: 140,
					align: 'center',
					sortable: true
				},
				{
					label: '监控项目名称',
					name: 'node_name',
					index: 'node_name',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '相关地址',
					name: 'para_add',
					index: 'para_add',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '报警下限',
					name: 'alarm_val1',
					index: 'alarm_val1',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '报警下限',
					name: 'alarm_val2',
					index: 'alarm_val2',
					width: 75,
					align: 'center',
					sortable: true
				},
				{
					label: '停机下限',
					name: 'stop_val1',
					index: 'stop_val1',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '停机上限',
					name: 'stop_val2',
					index: 'stop_val2',
					width: 110,
					align: 'center',
					sortable: true
				},
				{
					label: '当前值',
					name: 'coll_val',
					index: 'coll_val',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '单位',
					name: 'node_unit',
					index: 'node_unit',
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
		
			var queryJson = {
				keyvalue: procode,
				datatime: $("#time_id").val(),
				TimeInterval:"2"
			}
			$gridTable.jqGrid('setGridParam', {
				url: "/Monitor/GetHistoryListToDataTime",
				postData: queryJson,
				page: 1
			}).trigger('reloadGrid');
//				debugger
		});

		//查询回车
		$('#time_id').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	}

	this.getEqiupmentInfo = function() {
		var eqID = '';
		cm.ajax({
			type: 'get',
			url: '/Monitor/GetEqiupmentInfo',
			data: {
				keyValue: procode
			},
			async: false,
			success: function(data) {
				if(data && data.length > 0) {
					eqID = data[0].eq_id;
				} else {
					dialogMsg('设备流水无效!', 0);
					return false;
				}
			}
		});
		return eqID;
	}

	//	this.newIframeUrl = function(time_val){		
	//		var iframe_url = "";
	//	    iframe_url += "http://10.99.27.11:7779/ReportServer/Pages/ReportViewer.aspx?/CIMCBY/monitorDataQuery";
	//	    iframe_url += "&rs:Command=Render";
	//	    iframe_url += "&rc:parameters=false";
	//	    iframe_url += "&ID=1";
	//	    iframe_url += "&COL_DATE1=" + time_val;
	//	    iframe_url += "&ID1=" + self.getEqiupmentInfo();
	//		return iframe_url;	
	//	}

	this.reload = function() {
		location.reload();
	}

//	this.searchBtn = function() {
//		var time_val = $("#time_id").val();
//		if(!time_val) {
//			dialogMsg('请选择查询时间!', 0);
//			return false;
//		}
//		//	    var new_url = self.newIframeUrl(time_val);
//		//		$("#iframe1").attr("src", new_url);
//	}

};

var model = new viewModel();