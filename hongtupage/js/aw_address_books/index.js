var viewModel = function() {
	var self = this;
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

	//加载表格
	this.GetGrid = function() {
		var selectedRowIndex = 0;
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 136.5,
			url: "/AfterSaleManage/aw_address_books/GetPageListJson4SendMsg",
			datatype: "json",
			colModel: [{
					label: '序号',
					name: 'id',
					index: 'id',
					width: 100,
					align: 'center',
					sortable: true,
					hidden: true,
					key: true
				},
				{
					label: '客户单位',
					name: 'client',
					index: 'client',
					width: 140,
					align: 'center',
					sortable: true
				},
				{
					label: '客户地址',
					name: 'address',
					index: 'address',
					width: 180,
					align: 'center',
					sortable: true
				},
				{
					label: '联系人',
					name: 'linkman',
					index: 'linkman',
					width: 150,
					align: 'center',
					sortable: true
				},
				{
					label: '电话',
					name: 'cellphone',
					index: 'cellphone',
					width: 100,
					align: 'center',
					sortable: true
				},
				{
					label: '产品名称',
					name: 'productName',
					index: 'productName',
					width: 100,
					align: 'center',
					sortable: true
				},
				
				{
					label: '产品描述',
					name: 'productdesc',
					index: 'productdesc',
					width: 240,
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
					label: '产品型号',
					name: 'producttype',
					index: 'producttype',
					width: 100,
					align: 'center',
					sortable: true
				},

				{
					label: '产品台数',
					name: 'qty',
					index: 'qty',
					width: 80,
					align: 'center',
					sortable: true
				},
				{
					label: '合同号',
					name: 'contract',
					index: 'contract',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '发货时间',
					name: 'deliverytime',
					index: 'deliverytime',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '合同签署日期',
					name: 'contract_sign_date',
					index: 'contract_sign_date',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '质保期',
					name: 'warrenty_date',
					index: 'warrenty_date',
					width: 120,
					align: 'center',
					sortable: true
				},
				{
					label: '销售经理',
					name: 'bussinessman',
					index: 'bussinessman',
					width: 100,
					align: 'center',
					sortable: true
				},
			],
			viewrecords: true,
			rowNum: 30,
			rowList: [30, 50, 100],
			pager: "#gridPager",
			sortname: 'contract_sign_date',
			sortorder: 'desc',
			rownumbers: true,
			multiselect: true,
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
	}

	//常用语按钮
	this.show_language = function() {
		if($(".terms-block ").css('display') != "block") {
			$(".terms-block").show();
		} else {
			$(".terms-block").hide();
		}

	}

	/*		
	 //新增
		this.btn_add = function() {
			dialogOpen({
				id: 'Form',
				title: '添加',
				url: '/hongtupage/view/aw_address_books/form.html',
				width: '1000px',
				height: '756px',
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();
				}
			});
		}

		//编辑
		this.btn_edit = function() {
			var keyValue = $('#gridTable').jqGridRowValue('clientID');
			if(checkedRow(keyValue)) {
				dialogOpen({
					id: 'Form',
					title: '编辑',
					url: '/hongtupage/view/aw_address_books/form.html?keyValue=' + keyValue,
					width: '1000px',
					height: '756px',
					callBack: function(iframeId) {
						top.frames[iframeId].model.AcceptClick();
					}
				})
			}
		}

		//删除
		this.btn_delete = function() {
			var keyValue = $('#gridTable').jqGridRowValue('aw_address_booksid');
			if(keyValue) {
				$.RemoveForm({
					url: '/AfterSaleManage/aw_address_books/RemoveForm',
					param: {
						keyValue: keyValue
					},
					success: function(data) {
						$('#gridTable').trigger('reloadGrid');
					}
				})
			} else {
				dialogMsg('请选择需要删除的aw_addressbook！', 0);
			}
		}
	*/

	//高级查询事件
	this.submitdata = function() {
		var $gridTable = $('#gridTable');
		var queryJson = {
//			condition: "topkeyword",
			"client": $("#client").val(),
			"linkman": $("#linkman").val(),
			"contract": $("#contract").val(),
			"productName": $("#productName").val(),
			"productType": $("#productType").val(),
			"productcode": $("#productcode").val(),
			"productDesc": $("#productDesc").val(),
			"Contract_begin_Time": $("#Contract_begin_Time").val(),
			"Contract_end_Time": $("#Contract_end_Time").val(),
			"warranty_begin_Time": $("#warranty_begin_Time").val(),
			"warranty_end_Time": $("#warranty_end_Time").val(),
			"delivery_begin_Time": $("#delivery_begin_Time").val(),
			"delivery_end_Time": $("#delivery_end_Time").val()
		}
		$gridTable.jqGrid('setGridParam', {
			postData: {
				queryJson: JSON.stringify(queryJson)
			},
			page: 1
		}).trigger('reloadGrid');
	};

	//发送短信 
	this.send_data = function() {
		var userid = $('#gridTable').jqGridRowValue('id');	
		var phone = $('#gridTable').jqGridRowValue('cellphone');
		var conter = $("#contentdata").val();
		var sendtype = $("#sendtype").val();
		
		if(!sendtype){
			dialogMsg('请选择发送短信类型！', 0);
			return false;
		}
		if(userid.length <= 0){
			dialogMsg('请选择需要发送短信的客户！', 0);
			return false;
		}
		if(conter.length <= 0){
			dialogMsg('请填写短信内容！', 0);
			return false;
		}
		
		var queryJson = {
			"userid": userid,
			"sendtype": sendtype,
			"sendCommonword": $("#sendCommonword").val(),
			"conter": conter,
		}
		cm.ajax({
			type: "POST",
			url: "/AfterSaleManage/aw_address_books/SendMessage",
			datatype: "json",
			data: {
				queryJson: JSON.stringify(queryJson)
			},
			success: function(data) {
				dialogMsg('发送短信成功！', 1);
				console.log(data);
			},
			error: function(data) {
				dialogMsg(JSON.stringify(data), 2);
				console.log(data);
			}
		});
	}

};

var model = new viewModel();