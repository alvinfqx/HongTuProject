var viewModel = function(){
	var self = this;
	$(function() {
		self.InitialPage();
		self.pageInit();
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function() {
			window.setTimeout(function() {
				$('#gridTable').setGridWidth(($('.gridPanel').width()));
				$('#gridTable').setGridHeight($(window).height() - 143);
			}, 200);
		});
	};
	this.pageInit = function() {
		//创建jqGrid组件
		var selectedRowIndex = 0;
		var $gridTable = $("#gridTable");
		$gridTable.jqGrid({
			url: "/AfterSaleManage/aw_CustomerAddNewRequire/GetClientAppointMentList", //组件创建完成之后请求数据的url
			postData: {
				productCatId:'',
			},
			datatype: "json", //请求数据返回的类型。可选json,xml,txt
			height: $(window).height() - 143,
			autowidth: true,
			colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
			{
					label: "预约服务记录id",
					name: "appointmentid",
					index: "appointmentid",
					hidden: true
				},
			{
					label: "预约时间",
					name: "ordertime",
					width: 100,
					align: "center",					
					sortable: true
				},
				{
					label: "工单号",
					name: "workinfoid",
					width: 100,
					align: "center",					
					sortable: true
				},
				{
					label: "客户名称",
					name: 'client',
					width: 100,
					align: "center",					
					sortable: true
				},
//				{
//					label: "联系人",
//					name: 'client',
//					width: 100,
//					align: "left",		
//					sortable: true
//				},
				{
					label: "联系电话",
					name: 'cellphone',
					width: 100,
					align: "center",		
					sortable: true
				},
				{
					label: "产品型号",
					name: 'producttype',
					width: 100,
					align: "center",					
					sortable: true
				},
				{
					label: "产品名称",
					name: 'productname',
					width: 100,
					align: "center",		
					sortable: true
				},
				{
					label: "产品序列号",
					name: 'productcode',
					width: 100,
					align: "center",		
					sortable: true
				},
				{
					label: "受理状态",
					name: 'workstatus',
					width: 100,
					align: "center",		
					sortable: true
				},
				{
					label: "客户需求",
					name: 'requirementinfo',
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
			sortname: 'workinfoid', //初始化的时候排序的字段
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
			},
			ondblClickRow: function(rowid, iCol, cellcontent, e) {
				self.btn_edit(); //双击查看
			}
		});
//		);
		//查询事件
		$("#btn_Search").click(function() {
			var queryJson = {
				"keyword": $("#txt_Keyword").val()
		}
			$gridTable.jqGrid('setGridParam', {
				url: "/AfterSaleManage/aw_CustomerAddNewRequire/GetClientAppointMentList",
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
	//高级查询隐藏/显示
	this.show_hs = function() {
		if($(".hs-block ").css('display') != "block") {		
			$(".hs-block").slideDown('normal', function() {
				$(this).show();
			})
		} else {
			
			$(".hs-block").slideUp('normal', function() {
				$(this).hide();
			})
		}
	};
	
	//高级查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		var queryJson = {
			"client":$("#client").val(),//客户
			"linkman":$("#linkman").val(),//联系人
			"producttype":$("#producttype").val(),//产品类型
			"productName":$("#productName").val(),//产品名称
			"cellphone":$("#cellphone").val(),//电话
			"workstatus":$("#workstatus input[name='optionsRadiosinline']:checked").val(),//状态
			"begindate":$("#begindata").val(),//开始时间
			"endDate":$("#enddata").val()//结束时间
		}
		$gridTable.jqGrid('setGridParam', {
			url: "/AfterSaleManage/aw_CustomerAddNewRequire/GetClientAppointMentList",
			postData: {
				queryJson: JSON.stringify(queryJson) 
			},
			page: 1
		}).trigger('reloadGrid');
	};
	
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
	//编辑
	this.btn_edit = function(){		
		var keyValue = $('#gridTable').jqGridRowValue('workinfoid');
		var workstatus = $('#gridTable').jqGridRowValue('workstatus');
	
	   if(workstatus !="受理客户需求"){
//	   	dialogMsg('亲 这是已受理状态！',0);
//	   	return;
			dialogOpenATECustomer({
			id: "EditAttrFormgs",
			url: '/hongtupage/view/customerServiceInfo/distribute_leaflets.html?keyValue='+ keyValue+'&workstatus='+workstatus,
			width: 'px',
			height: 'px',
			btn: null,
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClicks();
			}
		});
		dialogMsg('亲 这是已受理状态！',0);
	   }else{
	   	dialogOpenATECustomer({
			id: "EditAttrFormg",
			url: '/hongtupage/view/customerServiceInfo/distribute_leaflets.html?keyValue='+ keyValue+'&workstatus='+workstatus,
			width: 'px',
			height: 'px',
			btn: ['提交', '取消'],
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClicks();
			}
		});
	   }
		if(!keyValue&&keyValue.length<=0){
			dialogMsg('您没有选中任何数据项,请选中后再操作！',0);
			return false;
		}
      
		
	}
};

var model = new viewModel();