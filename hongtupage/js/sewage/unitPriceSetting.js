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
			url: "/AfterSaleManage/aw_swagetreatunitprice/GetFormListJsonByCUST_ID",
			postData: {
				queryJson: JSON.stringify({
					keyword: $("#txt_Keyword").val(),
					isvalid: $("#cbx_valid").is(':checked')
				})

			},
			datatype: "json",
			colModel: [{
					label: '主键',
					name: 'ST_ID',
					index: 'ST_ID',
					hidden: true,
					key: true
				},
				{
					label: '客户ID，外键',
					name: 'CUST_ID',
					index: 'CUST_ID',
					hidden: true,
				},
				{
					label: '客户名称',
					name: 'CUST_Name',
					index: 'CUST_Name',
					width: 200,
					align: "center"

				},
				{
					label: '计费开始时间',
					name: 'StartDate',
					index: 'StartDate',
					width: 200,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return formatDate(cellvalue, 'yyyy-MM-dd');
					}
				},

				{
					label: '计费结束时间',
					name: 'EndDate',
					index: 'EndDate',
					width: 160,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return formatDate(cellvalue, 'yyyy-MM-dd');
					}
				},
				{
					label: '费用类型',
					name: 'DataType',
					index: 'DataType',
					width: 160,
					align: "center"
				},
				{
					label: '详情',
					name: 'sonEntity',
					index: 'sonEntity',
					width: 400,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						var Details = "";
						for(var i = 0; i < cellvalue.length; i++) {
							Details += ("价格名称：" + cellvalue[i].STD_Name + ",单价：" + cellvalue[i].Price + ",单位：" + cellvalue[i].Unit + ",范围：" +
								(cellvalue[i].Range == null ? "无" : cellvalue[i].Range) + ",备注：" + (cellvalue[i].Remark == null ? "无" : cellvalue[i].Remark));
						}
						return Details;
					}
				},
				{
					label: '备注',
					name: 'Remark',
					index: 'Remark',
					width: 50,
					align: "center"
				}
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
			}
		});

		//查询事件
		$("#btn_Search").click(function() {
			$gridTable.jqGrid('setGridParam', {
				postData: {
					queryJson: JSON.stringify({
						keyword: $("#txt_Keyword").val(),
						isvalid: $("#cbx_valid").is(':checked')
					})
				}
			}).trigger('reloadGrid');
		});
		//查询回车
		$('#txt_Keyword').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	}

	dialogOpenDistribute = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			title: '系统窗口',
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['保存', '关闭'],
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

	this.btn_add = function() { //新增
		dialogOpenDistribute({ //
			id: 'Form',
			title: '客户单价数据配置新增',
			url: '/hongtupage/view/sewage/newly_edit.html?keyValue=""',
			width: 'px',
			height: 'px',
			callBack: function(iframeId) {
				// alert("hifefe");
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}

	this.btn_edit = function() { //编辑
		var keyValue = $('#gridTable').jqGridRowValue('ST_ID');
		if(checkedRow(keyValue)) {
			dialogOpenDistribute({ //
				id: 'Form',
				title: '客户单价数据配置编辑',
				url: '/hongtupage/view/sewage/newly_edit.html?keyValue=' + keyValue,
				width: 'px',
				height: 'px',
				callBack: function(iframeId) {
					// alert("hifefe");
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}
	}

};

var model = new viewModel();