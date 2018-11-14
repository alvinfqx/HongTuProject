var viewModel = function() {
	var self = this;
	var client=request('client');
//	alert(client)
	$(function() {
		$('.titlePanel').css('width', ($('body').width()) - 17);
		$('.gridPanel').css('width', ($('body').width()) - 17);
		self.initControl();
		self.InitialPage();
		self.GetGrid();

		$("#sele_terms").on("click", 'li', function() {
			var ele = $("#contentdata")
			ele.val(ele.val() + $(this).text())
		});
	});

	//初始化控件
	this.initControl = function() {
		//产品型号
		$("#sendwordType").ComboBox({
			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
			param: {
				EnCode: "SendMessageType"
			},
			id: "ItemValue",
			text: "ItemName",
			description: "==请选择==",
			height: "200px"
		});
	}
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$('#gridTable').setGridHeight($(window).height() - 136.5);
				$('.titlePanel').css('width', ($('body').width()));
				$('.gridPanel').css('width', ($('body').width()));
			}, 200);
			e.stopPropagation();
		});
		cm.ajax({
			type: "POST",
			url: "/AfterSaleManage/aw_address_books/GetCurrentStateTreeJson",
			datatype: "json",
			success: function(data) {
				var li_html = ''
				$.each(data, function(i, n) {
					li_html = '<li>' + n.commonword + '</li>'
					$('#sele_terms').append(li_html)
				});

			},
			error: function(data) {
				console.log(data);
			}
		});
	}

	var queryJson = {
		client: client,
		keyValue :''
	}
	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 136.5,
			url: "/Monitor/GetEqiupmetInfoList",
			datatype: "json",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			colModel: [{
					label: '产品id',
					name: 'orderproductid',
					index: 'orderproductid',
					width: 100,
					align: 'center',
					sortable: true,
					key: true
					//					key: true
				}, {
					label: '客户id',
					name: 'organizeid',
					index: 'organizeid',
					width: 100,
					align: 'center',
					sortable: true
					//					key: true
				},
				{
					label: '客户单位',
					name: 'fullname',
					index: 'fullname',
					width: 140,
					align: 'center',
					sortable: true
				},
				{
					label: '客户地址',
					name: 'location',
					index: 'location',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '产品名称',
					name: 'producttype',
					index: 'producttype',
					width: 100,
					align: 'center',
					sortable: true
				}, {
					label: '产品型号',
					name: 'producttoken',
					index: 'producttoken',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '产品编码',
					name: 'productcode',
					index: 'productcode',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品描述',
					name: 'productdesc',
					index: 'productdesc',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '制造日期',
					name: 'deliverytime',
					index: 'deliverytime',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '测试日期',
					name: 'testdate',
					index: 'testdate',
					width: 180,
					align: 'center',
					sortable: true
				}
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'organizeid',
			sortorder: 'desc',
			rownumbers: true,
			//			multiselect: true,
			shrinkToFit: false,
			gridview: true,
			onSelectRow: function() {
				selectedRowIndex = $('#' + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$('#' + this.id).setSelection(selectedRowIndex, false);
			}
		});

		//查询条件
		//		$("#queryCondition .dropdown-menu li").click(function() {
		//			var text = $(this).find('a').html();
		//			var value = $(this).find('a').attr('data-value');
		//			$("#queryCondition .dropdown-text").html(text).attr('data-value', value)
		//		});

		//关键字查询事件
		$("#btn_Search").click(function() {
			var queryJson = {
				client: client,
				keyValue : $("#txt_Keyword").val()
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
	//	this.show_hs = function() {
	//		if($(".hs-block ").css('display') != "block") {
	//			$(".hs-block").show();
	//			$(".file-block").hide();
	//		} else {
	//			$(".hs-block").hide();
	//			$(".file-block").hide();
	//		}
	//	}

	//常用语按钮
	this.show_language = function() {
		if($(".terms-block ").css('display') != "block") {
			$(".terms-block").show();
		} else {
			$(".terms-block").hide();
		}

	}

	//高级查询事件
	//	this.submitdata = function() {
	//		var $gridTable = $('#gridTable');
	//		var queryJson = {
	//			//			condition: "topkeyword",
	//			"client": $("#client").val(),
	//			"linkman": $("#linkman").val(),
	//			"contract": $("#contract").val(),
	//			"productName": $("#productName").val(),
	//			"productType": $("#productType").val(),
	//			"productcode": $("#productcode").val(),
	//			"productDesc": $("#productDesc").val(),
	//			"Contract_begin_Time": $("#Contract_begin_Time").val(),
	//			"Contract_end_Time": $("#Contract_end_Time").val(),
	//			"warranty_begin_Time": $("#warranty_begin_Time").val(),
	//			"warranty_end_Time": $("#warranty_end_Time").val(),
	//			"delivery_begin_Time": $("#delivery_begin_Time").val(),
	//			"delivery_end_Time": $("#delivery_end_Time").val()
	//		}
	//		$gridTable.jqGrid('setGridParam', {
	//			postData: {
	//				queryJson: JSON.stringify(queryJson)
	//			},
	//			page: 1
	//		}).trigger('reloadGrid');
	//	};

	this.AcceptClickchoice_s = function(callback) {
		//		debugger
		var infoId = $('#gridTable').jqGridRowValue('orderproductid');
		//		alert(infoId)
		var valueObj = $("#gridTable").jqGrid('getRowData', infoId);
		//console.log(valueObj)
		if(checkedRow(infoId)) {
			callback(valueObj);
			dialogClose();

		} else {

		}

	}
};

var model = new viewModel();