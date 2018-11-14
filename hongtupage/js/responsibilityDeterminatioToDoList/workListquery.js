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
			url: "/AfterSaleManage/aw_qc_process/GetAllMyDutyJobListJson",
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
					label: '受理流水号',
					name: 'slseq',
					index: 'slseq',
					width: 140,
					align: 'center',
					sortable: true
				},
				{
					label: '工单状态',
					name: 'qa_status',
					index: 'qa_status',
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
					name: 'requirementshow',
					index: 'requirementshow',
					width: 280,
					align: 'center',
					sortable: true
				},
				{
					label: '产品大类',
					name: 'producttype',
					index: 'producttype',
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
					name: 'infotype',
					index: 'infotype',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '故障类型',
					name: 'servicetype',
					index: 'servicetype',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '创建人名字',
					name: 'createusername',
					index: 'createusername',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '接收人',
					name: 'recipients',
					index: 'recipients',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '创建时间',
					name: 'createdate',
					index: 'createdate',
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
			var queryJson = {
				"keyword": $("#txt_Keyword").val()
		}
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/aw_qc_process/GetAllMyDutyJobListJson",
				postData: {
					queryJson: JSON.stringify(queryJson)
				}, 
				
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
		var queryJson = {
			"slSeq":$("#slseq").val(),
			"client":$("#client").val(),
			"productName":$("#productName").val(),
			"linkman":$("#linkman").val(),
			"productCode":$("#productCode").val(),
			"productType":$("#productType").val(),
			"begindate":$("#begindate").val(),
			"endDate":$("#endDate").val(),
			"qa_status":$("#qa_status input[name='optionsRadiosinline']:checked").val()//状态
		}
		$gridTable.jqGrid('setGridParam', {
			url: "/AfterSaleManage/aw_qc_process/GetAllMyDutyJobListJson",
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
			btn: ['确定','关闭'],
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
	
	dialogOpenSubmission = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['提交','关闭'],
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
	
	//编辑a
	this.btn_edit = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workinfoid');
		var slseq = $('#gridTable').jqGridRowValue('slseq');
		if(checkedRow(keyValue)) {
			dialogOpenSubmission({
				id: 'FormEdit',
				url: '/hongtupage/view/responsibilityDeterminatioToDoList/editorsOfWarrantyPeriod.html?keyValue=' + keyValue + '&slSeq=' + slseq,
				width: 'px',
				height: 'px',
				cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
				callBack: function(iframeId) {
					 top.frames[iframeId].model.saveDataClick();
				}
			})
		}
	}
	
	//查看
	this.btn_see = function() {
		var keyValue = $('#gridTable').jqGridRowValue('workinfoid');
		var slseq = $('#gridTable').jqGridRowValue('slseq');
		if(checkedRow(keyValue)) {
			dialogOpenCommitForward({
				id: 'FormSee',
				url: '/hongtupage/view/responsibilityDeterminatioToDoList/workListquery_form.html?keyValue=' + keyValue + '&slSeq=' + slseq,
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
};

var model = new viewModel();