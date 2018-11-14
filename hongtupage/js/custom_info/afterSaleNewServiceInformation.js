var viewModel = function() {
	var self = this;
	$(function() {
		//故障类型
		$("#serviceType").ComboBox({
			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
			param: {
				EnCode: "service_type_as"
			},
			id: "ItemValue",
			text: "ItemName",
			description: "==请选择==",
			height: "200px"
		});
		self.InitialPage();
		self.GetGrid();

	});
	//服务类型参数
	var seviceData = cm.format.getParam('sevice_nature_as');
	var new_seviceData = cm.format.split_array(seviceData, 5);
	//工单状态参数
	var workstaus = cm.format.getParam('workstaus_as');
	var new_workstaus = cm.format.split_array(workstaus, 5);
	//工单状态参数html
	if(new_workstaus && new_workstaus.length > 0) {
		var html = '';
		for(var j = 0; j < new_workstaus.length; j++) {
			html += '<tr class="regular-radio">';
			if(j == 0) {
				html += '<td>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工单状态:</td>';
				html += '<td><input type="radio" id="radio-4-' + new_workstaus.length + '" name="r4" checked="checked" value="全部"><label for="radio-4-' + new_workstaus.length + '">全部</label></td>'
			} else {
				html += '<td>&nbsp;</td>';
			}
			for(var i = 0; i < new_workstaus[j].length; i++) {
				html += '<td><input type="radio" id="radio-4-' + j + '-' + i + '" name="r4" value="' + new_workstaus[j][i].ItemValue + '">';
				html += '<label for="radio-4-' + j + '-' + i + '">' + new_workstaus[j][i].ItemName + '</label>';
				html += '</td>';
			}
			html += '</tr>';
		};
		$('#workstaus_id').html(html);
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
		});
	}

	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 136.5,
			url: "/AfterSaleManage/aw_workinfo/GetPageNewRequireTopSearchList4monitor",
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
					width: 70,
					align: 'center',
					sortable: true
				},
				{
					label: '客户单位',
					name: 'client',
					index: 'client',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '联系人',
					name: 'linkman',
					index: 'linkman',
					width: 75,
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
					label: '客户服务需求信息摘要',
					name: 'requirementShow',
					index: 'requirementShow',
					width: 200,
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
					label: '信息分类',
					name: 'infoType',
					index: 'infoType',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '故障类型',
					name: 'serviceType',
					index: 'serviceType',
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
		//查询条件
		$("#queryCondition .dropdown-menu li").click(function() {
			var text = $(this).find('a').html();
			var value = $(this).find('a').attr('data-value');
			$("#queryCondition .dropdown-text").html(text).attr('data-value', value)
		});
		//查询事件
		$("#btn_Search").click(function() {
			var isNotDone = $("#isNotDone").is(":checked");
			var withinMonth = $("#withinMonth").is(":checked");
			var queryJson = {
				"keyword": $("#txt_Keyword").val(),
				"keyWordSearch": "keywordSearch",
				"isNotDone": isNotDone,
				"withinMonth": withinMonth
			}
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/aw_workinfo/GetPageNewRequireTopSearchList4monitor",
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
	//查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		var serviceTypes = $("#serviceType").attr('data-text');

		if(serviceTypes == null || serviceTypes == undefine || serviceTypes == "") {
			serviceTypes = "";
		} else {
			serviceTypes = $("#serviceType").attr('data-text');
		}

		console.log("cejo1");
		var queryJson = {
			"slSeq": $("#slSeq").val(), //服务单号
			"client": $("#client").val(), //客户单位
			"linkman": $("#linkman").val(), //联系人
			"serviceType": serviceTypes, //故障类型
			"productCode": $("#productCode").val(), //产品编码
			"productType": $("#productType").val(), //产品类型
			"Recipients": $("#Recipients").val(), //接收人
			"workStatus": $("input[name='r4']:checked").val(), //工单状态
			"finishStatus": $("input[name='r3']:checked").val(), //工单完成状态
			"visitMin": $("#visitMin").val(),
			"visitMax": $("#visitMax").val(),
			"logmin": $("#logmin").val(),
			"logmax": $("#logmax").val()
		}
		$gridTable.jqGrid('setGridParam', {
			url: "/AfterSaleManage/aw_workinfo/GetPageNewRequireTopSearchList4monitor",
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};
	//新增
	this.btn_add = function() {
		dialogOpenContent({
			id: 'Form',
			url: '/hongtupage/view/customerWorkinfo/Form.html?keyValue=" "',
			width: 'px',
			height: 'px',
			callBack: function(iframeId) {
				top.frames[iframeId].AcceptClick();
			}
		});
	}
	dialogOpenCommitATEWithSave = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['更新数据', '关闭'],
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

	//修正工单
	this.modify = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		var slSeq = $('#gridTable').jqGridRowValue('slSeq');
		var workstatus = $('#gridTable').jqGridRowValue('workStatus');
		if(checkedRow(keyValue)) {
			dialogOpenCommitATEWithSave({
				id: 'Form',
				url: '/hongtupage/view/aw_AftersalesUpdateInfo/revisedWorkList.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
				width: 'px',
				height: 'px',
				cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
				callBack: function(iframeId) {
					top.frames[iframeId].model.updateClick();
				}
			})
		}
	}

	//更新数据
	this.btn_update = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		var slSeq = $('#gridTable').jqGridRowValue('slSeq');
		var workstatus = $('#gridTable').jqGridRowValue('workStatus');

		if(checkedRow(keyValue)) {

			if(workstatus == "现场实施") {

				dialogOpenCommitATEWithSave({
					id: 'Form',
					url: '/hongtupage/view/aw_AftersalesUpdateInfo/Form.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
					width: 'px',
					height: 'px',
					cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClick();
					}
				})
			} else {
				dialogOpenCommitATEWithSave({
					id: 'Form',
					url: '/hongtupage/view/customerWorkinfo/Form.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
					width: 'px',
					height: 'px',
					cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
					callBack: function(iframeId) {
						top.frames[iframeId].model.updateClick();
					}
				})
			}

		}
	}

	//查看
	this.btn_edit = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		var slSeq = $('#gridTable').jqGridRowValue('slSeq');
		if(checkedRow(keyValue)) {
			dialogOpenContent({
				id: 'Form',
				url: '/hongtupage/view/customerWorkinfo/Form.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
				width: 'px',
				height: 'px',
				cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
				callBack: function(iframeId) {

					top.frames[iframeId].model.AcceptClick();
				}
			})
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
		if(keyValue) {
			$.RemoveForm({
				url: '/AfterSaleManage/aw_Workinfo/delWorkOrder',
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