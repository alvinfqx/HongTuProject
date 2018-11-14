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
				$('#gridTable').setGridHeight($(window).height() - 142.5);
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
			height: $(window).height() - 142.5,
			url: "/AfterSaleManage/aw_address_books/GetPageListJson4SendMsg",
			datatype: "json",
			colModel: [{
					label: '序号',
					name: 'id',
					index: 'id',
					hidden: true,
					key: true
				},
				{
					label: '主键id',
					name: 'productinfoid',
					index: 'productinfoid',
					hidden: true,
				},
				{
					label: '产品型号',
					name: 'producttype',
					index: 'producttype',
					width: 140,
					align: "center",
					sortable: true
				},
				{
					label: '产品名称',
					name: 'productname',
					index: 'productname',
					width: 140,
					align: "center",
					sortable: true
				},

				{
					label: '产品编码',
					name: 'productcode',
					index: 'productcode',
					width: 160,
					align: "center",
					sortable: true
				},

				{
					label: '合同号',
					name: 'contract',
					index: 'contract',
					width: 160,
					align: "center",
					sortable: true
				},
				{
					label: '合同签署日期',
					name: 'contract_sign_date',
					index: 'contract_sign_date',
					width: 130,
					align: "center",
					sortable: true
				},

				{
					label: '客户单位',
					name: 'client',
					index: 'client',
					width: 200,
					align: "center",
					sortable: true
				},
				{
					label: '客户地址',
					name: 'address',
					index: 'address',
					width: 180,
					align: "center",
					sortable: true
				},
				{
					label: '联系人',
					name: 'linkman',
					index: 'linkman',
					width: 100,
					align: "center",
					sortable: true
				},
				{
					label: '联系方式',
					name: 'cellphone',
					index: 'cellphone',
					width: 120,
					align: "center",
					sortable: true
				},
				{
					label: '销售经理',
					name: 'bussinessman',
					index: 'bussinessman',
					width: 100,
					align: "center",
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'warrenty_date',
			sortorder: 'desc',
			rownumbers: true,
			//复选框
			multiselect: false,
			shrinkToFit: false,
			gridview: true,
			onSelectRow: function() {
				selectedRowIndex = $('#' + this.id).getGridParam('selrow');
			},
			gridComplete: function() {
				$('#' + this.id).setSelection(selectedRowIndex, false);
			},
			ondblClickRow: function(rowid, iCol, cellcontent, e) {
//				self.btn_view(); //双击查看
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
				//				queryway: "common_query",
				//				condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
				condition: "KEYWORD QUERY",
				keyword: $("#txt_Keyword").val()
			}
			$gridTable.jqGrid('setGridParam', {
				postData: {
					queryJson: JSON.stringify(queryJson)
				},
				page: 1
			}).trigger('reloadGrid');
		});

		//查询事件
		$("#btn_Search_advance").click(function() {
			var queryJson = {
				queryway: "advance_query",
				servicedesc: "dfe",
				condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
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

	//高级查询
	this.show_hs = function() {
		if($(".hs-block ").css('display') != "block") {
			$(".hs-block").show();
			$(".file-block").hide();
		} else {
			$(".hs-block").hide();
			$(".file-block").hide();
		}
	};

	//高级查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		var isInstall = $("#isInstall").is(":checked");
		if(isInstall == false){
			isInstall = ""
		}
		var queryJson = {
			client: $("#client").val(),
			linkman: $("#linkman").val(),
			contract: $("#contract").val(),
			isInstall: isInstall,
			productName: $("#productName").val(),
			productType: $("#productType").val(),
			productcode: $("#productcode").val(),
			Contract_begin_Time: $("#Contract_begin_Time").val(),
			Contract_end_Time: $("#Contract_end_Time").val(),
			warranty_begin_Time: $("#warranty_begin_Time").val(),
			warranty_end_Time: $("#warranty_end_Time").val()
		}
		$gridTable.jqGrid('setGridParam', {
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};

	//控制点设置
	this.btn_controller = function() {
		var keyValue = $('#gridTable').jqGridRowValue('id'),
			productinfoid = $('#gridTable').jqGridRowValue('productinfoid'),
			productname = $('#gridTable').jqGridRowValue('productname');

		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'ControllerForm',
				title: '控制点设置',
				url: '/hongtupage/view/equipment/pro_art_controller.html?keyValue=' + keyValue + '&productinfoid=' + productinfoid + '&productname=' + productname,
				width: '950px',
				height: '700px',
				btn: null,
			});
		}
	};

	//工艺图设置
	this.btn_artwork = function() {
		var keyValue = $('#gridTable').jqGridRowValue('id'),
			productinfoid = $('#gridTable').jqGridRowValue('productinfoid');
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: 'ProArtWorkForm',
				title: '工艺图设置',
				url: '/hongtupage/view/equipment/pro_art_artwork.html?keyValue=' + keyValue + '&productinfoid=' + productinfoid,
				width: '950px',
				height: '700px',
				btn: null,
			});
		}
	}

	dialogOpenATECustomer = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['确定', '取消'],
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

	//新增
	this.btn_adds = function() {
		dialogOpenATECustomer({
			id: 'BtnAdds',
			title: '新增',
			url: '/hongtupage/view/equipment/newInformation.html',
			width: '950px',
			height: '700px',
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClickAdd();
			}
		});
	}
	//编辑
	this.btn_edit = function() {
		var keyValue = $('#gridTable').jqGridRowValue('id'),
			productinfoid = $('#gridTable').jqGridRowValue('productinfoid');
		if(checkedRow(keyValue)) {
			dialogOpenATECustomer({
				id: 'BtnEdit',
				title: '编辑',
				url: '/hongtupage/view/equipment/newInformation_edit.html?keyValue=' + keyValue + '&productinfoid=' + productinfoid,
				width: '950px',
				height: '700px',
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClickAdd();
				}
			});
		}
	}

	//下发
	this.btn_lowerHair = function() {
		var keyValue = $('#gridTable').jqGridRowValue('id'),
			productinfoid = $('#gridTable').jqGridRowValue('productinfoid');
		if(checkedRow(keyValue)) {
			dialogOpenATECustomer({
				id: 'btn_lowerHair',
				title: '下发',
				url: '/hongtupage/view/equipment/lower_hair.html?keyValue=' + keyValue + '&productinfoid=' + productinfoid,
				width: '950px',
				height: '700px',
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClickAdd();
				}
			});
		}
	}

	//通讯设备
	this.btn_monitoring = function() {
		var keyValue = $('#gridTable').jqGridRowValue('id'),
			productinfoid = $('#gridTable').jqGridRowValue('productinfoid');
		productname = encodeURI(encodeURI($('#gridTable').jqGridRowValue('productname')));
		producttype = encodeURI(encodeURI($('#gridTable').jqGridRowValue('producttype')));
		productcode = encodeURI(encodeURI($('#gridTable').jqGridRowValue('productcode')));
		if(checkedRow(keyValue)) {
			dialogOpenATECustomer({
				id: 'ProArtWork',
				title: '通讯设备',
				url: '/hongtupage/view/equipment/communication.html?keyValue=' + keyValue + '&productinfoid=' + productinfoid + '&productname=' + productname + '&producttype=' + producttype + '&productcode=' + productcode,
				width: '950px',
				height: '700px',
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}
	//删除
	this.btn_delete = function() {
		var keyValue = $('#gridTable').jqGridRowValue('id');
		if(keyValue) {
			$.RemoveForm({
				url: '/AfterSaleManage/orderproduct/RemoveForm',
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
$('.toolbar').authorizeButton();
var model = new viewModel();