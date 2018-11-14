var viewModel = function() {
	var self = this;
	$(function() {
		self.InitialPage();
		self.GetGrid();
	});

	//信息来源参数
	var info_Data = cm.format.getParam('info_resource_as');
	var new_infoData = cm.format.split_array(info_Data, 5);
	//信息分类参数
	var info_type = cm.format.getParam('info_type_as');
	var new_info_type = cm.format.split_array(info_type, 5);
	//信息来源参数html
	if(new_infoData && new_infoData.length > 0) {
		var html = '';
		for(var j = 0; j < new_infoData.length; j++) {
			html += '<tr class="regular-radio">';
			if(j == 0) {
				html += '<td>信息来源:</td>';
				html += '<td><input type="radio" id="radio-1-' + new_infoData.length + '" name="r1" checked="checked" value="全部"><label for="radio-1-' + new_infoData.length + '">全部</label></td>';
			} else {
				html += '<td>&nbsp;</td>';
			}
			for(var i = 0; i < new_infoData[j].length; i++) {
				html += '<td><input type="radio" id="radio-1-' + j + '-' + i + '" name="r1" value="' + new_infoData[j][i].ItemValue + '">';
				html += '<label for="radio-1-' + j + '-' + i + '">' + new_infoData[j][i].ItemName + '</label>';
				html += '</td>';
			}
			html += '</tr>';
		};
		$('#infor_source').html(html);
	};
	//信息分类参数html
	if(new_info_type && new_info_type.length > 0) {
		var html = '';
		for(var j = 0; j < new_info_type.length; j++) {
			html += '<tr class="regular-radio">';
			if(j == 0) {
				html += '<td>信息分类:</td>';
				html += '<td><input type="radio" id="radio-4-' + new_info_type.length + '" name="r4" checked="checked" value="全部"><label for="radio-4-' + new_info_type.length + '">全部</label></td>'
			} else {
				html += '<td>&nbsp;</td>';
			}
			for(var i = 0; i < new_info_type[j].length; i++) {
				html += '<td><input type="radio" id="radio-4-' + j + '-' + i + '" name="r4" value="' + new_info_type[j][i].ItemValue + '">';
				html += '<label for="radio-4-' + j + '-' + i + '">' + new_info_type[j][i].ItemName + '</label>';
				html += '</td>';
			}
			html += '</tr>';
		};
		$('#infor_type').html(html);
	};

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
//			console.log();
		});
	}

	//加载表格
	this.GetGrid = function() {
		/*alert(123);*/
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 136.5,
			url: "/AfterSaleManage/aw_customerServiceInfo/GetPageListJson",
			datatype: "json",
			colModel: [{
					label: '序号',
					name: 'workInfoId',
					index: 'workInfoId',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true
				},
				{
					label: '受理流水号',
					name: 'slSeq',
					index: 'slSeq',
					width: 140,
					align: 'center',
					sortable: true
				},
				{
					label: '工单状态',
					name: 'workStatus',
					index: 'workStatus',
					width: 80,
					align: 'center',
					sortable: true
				},
				{
					label: '信息来源',
					name: 'infoSource',
					index: 'infoSource',
					width: 80,
					align: 'center',
					sortable: true
				},
				{
					label: '客户单位',
					name: 'client',
					index: 'client',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '联系人',
					name: 'linkman',
					index: 'linkman',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '客户地址',
					name: 'address',
					index: 'address',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品大类',
					name: 'productType',
					index: 'productType',
					width: 110,
					align: 'center',
					sortable: true
				},
				{
					label: '产品名称',
					name: 'productName',
					index: 'productName',
					width: 110,
					align: 'center',
					sortable: true
				},
				{
					label: '客户服务需求信息摘要',
					name: 'requirementInfo',
					index: 'requirementInfo',
					width: 200,
					align: 'center',
					sortable: true
				},
				{
					label: '信息分类',
					name: 'infoType',
					index: 'infoType',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '创建人名字',
					name: 'CreateUserName',
					index: 'CreateUserName',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '接收人',
					name: 'Recipients',
					index: 'Recipients',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '创建时间',
					name: 'CreateDate',
					index: 'CreateDate',
					width: 100,
					align: 'center',
					sortable: true
				},
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
		//查询条件
		$("#queryCondition .dropdown-menu li").click(function() {
			var text = $(this).find('a').html();
			var value = $(this).find('a').attr('data-value');
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value)
		});
		//查询事件
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

	//一键派单
	dialogOpenDistribute = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			title: '系统窗口',
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['一键派单', '关闭', '转发制定方案'],
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
			btn3: function() {
				options.callBack2(options.id)
			},
			end: function() {
				$('#gridTable').trigger('reloadGrid');
			}
		});
	}
	//一键派单
	this.distribute = function() {
		//		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		//		var client = $('#gridTable').jqGridRowValue('client');
		//		var slSeq = $('#gridTable').jqGridRowValue('slSeq');
		//		if(checkedRow(keyValue)) {
		dialogOpenDistribute({ //
			id: 'Form',
			title: '',
			url: '/hongtupage/view/customerServiceInfo/distribute_leaflets.html?keyValue=""',
			width: 'px',
			height: 'px',
			cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
			callBack: function(iframeId) {
				// alert("hifefe");
				top.frames[iframeId].model.AcceptClicks();
			},
			callBack2: function(iframeId) {
				top.frames[iframeId].model.ForwardSolutionClicks();
			}
		});
		//		}
	}

	//派工
	this.dispatched_workers = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		var client = $('#gridTable').jqGridRowValue('client');
		//		var slSeq = $('#gridTable').jqGridRowValue('slSeq');
		if(checkedRow(keyValue)) {
			dialogOpenDistribute({ //
				id: 'Form',
				title: '',
				url: '/hongtupage/view/customerServiceInfo/distribute_leaflets.html?keyValue=' + keyValue + '&client=' + client,
				width: 'px',
				height: 'px',
				cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
				callBack: function(iframeId) {
					// alert("hifefe");
					top.frames[iframeId].model.AcceptClicks();
				},
				callBack2: function(iframeId) {
					top.frames[iframeId].model.ForwardSolutionClicks();
				}
			});
		}
	}
	dialogOpenATECustomer = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			title: '系统窗口',
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['形成售后工单', '关闭', '保存', '结束本流程'],
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
			btn3: function() {
				//alert("312223333"); 
				options.callBack2(options.id)
				//  dialogClose();
			},
			btn4: function() {
				//alert("312223333");
				options.callBack3(options.id)
				//  dialogClose();
			},
			end: function() {
				$('#gridTable').trigger('reloadGrid');
			}
		});
	}

	//查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		console.log("cejo1");
		var queryJson = {
			condition: "topkeyword",
			"slSeq": $("#slSeq").val(), //服务单号
			"client": $("#client").val(), //客户单位
			"linkman": $("#linkman").val(), //联系人
			//            "receiverTime": $("#receiverTime").val(),//创建时间
			"CreateUserName": $("#CreateUserName").val(), //创建人
			"Recipients": $("#Recipients").val(), //接收人
			//"address": $("#address").val(),//地址
			"serviceType": $("input[name='r1']:checked").val(), //信息服务类型
			//            "sal": $("input[name='r2']:checked").val(),//SAL类型
			"workStatus": $("input[name='r4']:checked").val(), //工单
			"createStatus": $("input[name='r3']:checked").val(), //创建状态
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
	//新增
	this.btn_add = function() {
		//  dialogOpenATE({
		dialogOpenATECustomer({ //
			id: 'Form',
			title: '添加工作任务表',
			url: '/hongtupage/view/customerServiceInfo/Form.html?keyValue=" "',
			width: 'px',
			height: 'px',
			cancel: function(){
				
				//删除穿梭框session
					sessionStorage.removeItem("tranfer_key")
			},
			callBack: function(iframeId) {
				// alert("hifefe");
				top.frames[iframeId].model.AcceptClick();
			},
			callBack2: function(iframeId) {

				
				console.log(iframeId);
				// alert('callBack2');
				console.log(top.frames[iframeId]);
				top.frames[iframeId].model.saveTaskClick();
			},
			callBack3: function(iframeId) {
				top.frames[iframeId].model.CloseTaskClick();
			}
		});
	}
	//编辑
	this.btn_edit = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		var slSeq = $('#gridTable').jqGridRowValue('slSeq');
		var workstatus = $('#gridTable').jqGridRowValue('workStatus');

		if(checkedRow(keyValue)) {

			if(workstatus == "关闭") {
				dialogOpenContent({
					id: 'Form',
					url: '/hongtupage/view/customerWorkinfo/Form.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
					width: 'px',
					height: 'px',
					cancel: function(){
				
				//删除穿梭框session
					sessionStorage.removeItem("tranfer_key")
					},
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClick();
					}
				})

			} else {
				dialogOpenATECustomer({
					id: 'Form',
					title: '编辑工作任务表',
					url: '/hongtupage/view/customerServiceInfo/Form.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
					width: 'px',
					height: 'px',
					cancel: function(){
				
				//删除穿梭框session
					sessionStorage.removeItem("tranfer_key")
				},
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClick();
					},
					callBack2: function(iframeId) {
						// alert('callBack2');
						top.frames[iframeId].model.saveTaskClick();
					},
					callBack3: function(iframeId) {
						top.frames[iframeId].model.CloseTaskClick();
					}
				})

			}

		}
	}

	//refresh windowss
	this.refresh_windows = function() {
		alert("refresh_windows222");
		// $('#gridTable').trigger('reloadGrid');
	}

	//删除
	this.btn_delete = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		if(keyValue) {
			$.RemoveForm({
				url: '/AfterSaleManage/aw_CustomerAddNewRequire/RemoveForm',
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
//工具按钮
//$('.toolbar').authorizeButton();
var model = new viewModel();