var viewModel = function(){
	var self = this;
	$(function() {
		//页面加载完成之后执行
		self.InitialPage();
		self.pageInit();
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$('#gridTable').setGridHeight($(window).height() - 143);
			}, 200);
			e.stopPropagation();
		});
	};
	this.pageInit = function() {
		//创建jqGrid组件
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/aw_servicecenter/GetServiceCenterList", //组件创建完成之后请求数据的url
			datatype: "json", //请求数据返回的类型。可选json,xml,txt
			height: $(window).height() - 143,
			autowidth: true,
			colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
			{
					label: "主键id",
					name: "aw_servicecenterid",
					index: "aw_servicecenterid",
					hidden: true
				},
				{
					label: "组织id",
					name: "organizationid",
					index: "organizationid",
					hidden: true
				},
				{
					label: "创建人id",
					name: "CreateUserId",
					index: "CreateUserId",
					hidden: true
				},
				{
					label: "经纬度",
					name: "longlatitude",
					index: "longlatitude",
					hidden: true
				},
				{
					label: "图片地址",
					name: "image",
					index: "image",
					hidden: true
				},
				{
					label: "创建时间",
					name: "CreateDate",
					index: "CreateDate",
					hidden: true
				},
				{
					label: "创建人",
					name: "CreateUserName",
					index: "CreateUserName",
					hidden: true
				},
				{
					label: "修改时间",
					name: "ModifyDate",
					index: "ModifyDate",
					hidden: true
				},
				{
					label: "修改人id",
					name: "ModifyUserId",
					index: "ModifyUserId",
					hidden: true
				},
				{
					label: "修改人",
					name: "ModifyUserName",
					index: "ModifyUserName",
					hidden: true
				},
				{
					label: "服务中心名称",
					name: 'name',
					width: 100,
					align: "center",					
					sortable: true
				},
				{
					label: "地址",
					name: 'address',
					width: 100,
					align: "center",		
					sortable: true
				},
				{
					label: "电话",
					name: 'phone',
					width: 100,
					align: "center",		
					sortable: true
				},
				{
					label: "描述",
					name: 'description',
					width: 100,
					align: "center",					
					sortable: true
				}

			],
			rownumbers: true,
			shrinkToFit: false,
			gridview: true,
			viewrecords: true,
			subGrid: false, //是否使用子表格，默认false		
			rowNum: 20, //一页显示多少条
			rowList: [10, 20, 30], //可供用户选择一页显示多少条
			pager: '#gridPager', //表格页脚的占位符(一般是div)的id
			sortname: 'address', //初始化的时候排序的字段
			sortorder: "desc", //排序方式,可选desc,asc
			//mtype : "post",//向后台请求数据的ajax的类型。可选post,get
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
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/aw_servicecenter/GetServiceCenterList",
			}).trigger('reloadGrid');
		});
		//查询回车
		$('#txt_Keyword').bind('keypress', function(event) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		});
	}
	dialogOpenATECustomer = function(options) {
		Loading(true);
		var defaults = {
			id: null,
			width: "100px",
			height: "100px",
			url: '',
			shade: 0.3,
			btn: ['提交', '取消'],
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
			content: top.mainPath +_url,
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
	//新增
	this.btn_add = function(){
		dialogOpenATECustomer({
			id: "ProductEditor",
			title: '新增',
			url: '/hongtupage/view/service_centre/service_center_preservation.html',
			width: 'px',
			height: 'px',
			btn: null,
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}
	//编辑
	this.productEditor = function(){
		var keyValue = $('#gridTable').jqGridRowValue('aw_servicecenterid');
		if(!keyValue&&keyValue.length<=0){
			dialogMsg('您没有选中任何数据项,请选中后再操作！',0);
			return false;
		}
		dialogOpenATECustomer({
			id: "Edit",
			title: '编辑',
			url: '/hongtupage/view/service_centre/service_center_edit.html?keyValue='+keyValue,
			width: 'px',
			height: 'px',
			btn: null,
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick();
			}
		});
	}
	//删除
	this.btn_delete = function(){
		var keyValue = $('#gridTable').jqGridRowValue('aw_servicecenterid');
		if(keyValue) {
			$.RemoveForm({
				url: '/AfterSaleManage/aw_servicecenter/Remove',
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