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
			url: "/AfterSaleManage/aw_sendmessagehistory/GetPageListHistoryJson",
			datatype: "json",
			colModel: [{
					label: 'ID',
					name: 'aw_SendHistoryId',
					index: 'aw_SendHistoryId',
					width: 100,
					align: 'center',
					hidden: true,
					sortable: true
				},
				{
					label: '发送类型',
					name: 'SendType',
					index: 'SendType',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '发送状态',
					name: 'SendStatus',
					index: 'SendStatus',
					width: 200,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '内容',
					name: 'Content',
					index: 'Content',
					width: 300,
					align: 'center',
					sortable: true
				},
				{
					label: '发送时间',
					name: 'SendTime',
					index: 'SendTime',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '接收人单位',
					name: 'RecManCompany',
					index: 'RecManCompany',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '接收人',
					name: 'RecMan',
					index: 'RecMan',
					width: 80,
					align: 'center',
					sortable: true
				},
				{
					label: '接收人电话',
					name: 'RecManPhone',
					index: 'RecManPhone',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '发送单位',
					name: 'SendCompany',
					index: 'SendCompany',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '发送人',
					name: 'SendMan',
					index: 'SendMan',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '发送人电话',
					name: 'SendPhone',
					index: 'SendPhone',
					width: 150,
					align: 'center',
					sortable: true,
					hidden: true
				},

				{
					label: '接收时间',
					name: 'RecDate',
					index: 'RecDate',
					width: 150,
					align: 'center',
					sortable: true,
					hidden: true
				},

			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'SendTime',
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
				condition: "common",
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
	//查看
	this.btn_view = function() {
		var keyValue = $('#gridTable').jqGridRowValue('aw_SendHistoryId');
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'Form',
				title: '查看',
				url: '/hongtupage/view/aw_address_books/msghistory_form.html?keyValue=' + keyValue,
				width: '700px',
				height: '450px',
				btn: null,
			})
		}
	}
	
	//删除
	this.btn_delete = function() {
		var keyValue = $('#gridTable').jqGridRowValue('aw_SendHistoryId');
		if(keyValue) {
			$.RemoveForm({
				url: '/AfterSaleManage/aw_sendmessagehistory/RemoveForm',
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$('#gridTable').trigger('reloadGrid');
				}
			})
		} else {
			dialogMsg('请选择需要删除的aw_SendMessageHistory！', 0);
		}
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
	

	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		console.log("cejo1");
		var queryJson = {
			condition: "topkeyword",
			"SendType": $("#SendType").val(), //发送类型
			"SendStatus": $("#SendStatus").val(), //发送状态
			"SendMan": $("#SendMan").val(), //发送人
			"RecMan": $("#RecMan").val(), //接收人姓名
			"RecManPhone": $("#RecManPhone").val(), //接收人电话
			//"SendTime": $("#SendTime").val(),//发送时间
			"logmin": $("#logmin").val(),
			"logmax": $("#logmax").val()
		}
		$gridTable.jqGrid('setGridParam', {
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};
};

var model = new viewModel();