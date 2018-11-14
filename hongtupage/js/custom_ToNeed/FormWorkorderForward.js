var viewModel = function() {
	var self = this;
	var forwarded_id_list = []; //人员id
	var forwarded_name_list = []; //人员名称
	window.onunload = function() {
		sessionStorage.removeItem("tranfer_key")
	};
	$(function() {
		//self.Gettotaldata()
	});

	//工单状态
	$("#forwardStatus").ComboBox({
		url: "/SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "forward_work_status"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	this.Gettotaldata = function() {
		var keyValue = "";
		cm.ajax({
			url: "/AfterSaleManage/aw_workinfo/GetImplementUsers",
			type: "POST",
			dataType: "json",
			data: {
				"keyValue": keyValue
			},
			success: function(data2) {

				var html = ''
				$.each(data2, function(i, n) {
					html += '<option value="' + n.id + '">' + n.name + '</option>'
				})

				$('#dispatchingPerson').append(html);
				var initvalue = "";
				$("#dispatchingPerson").select2();

			},
			error: function(data2) {
				console.log(data2)
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
	
		this.dianji = function(input_id) { //点击选择
		console.log(input_id)
		dialogOpenATECustomer({
			id: 'Selection_staff',
			title: '选择人员',
			url: '/hongtupage/view/reelection/reelection.html?keyValue='+input_id,
			width: "880px",
			height: "550px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.updateClick(function(id_list, text_array) {
					console.log(id_list)

					var text_list = "";

					$.each(text_array, function(i, n) {
						text_list += text_array[i] + " ";						
					})

					if(input_id == "forwarded") {
						$("#forwarded").text(text_list)
						forwarded_id_list = id_list
						forwarded_name_list = text_list
						console.log(forwarded_name_list);
					}

				});
			}
		})

	}

	var keyValue = request('keyValue');

	/** 关闭本工单信息 **/
	this.CloseTaskClick = function() {
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		var postData = $("#form").GetWebControls();
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_customerServiceInfo/SaveFormDataWithClose?keyValue=" + keyValue, //回访
			//填写最终实施结果
			//  url: "http://localhost:4066/AfterSaleManage/aw_ServiceManageAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

			//  url: "http://localhost:4066/AfterSaleManage/aw_AftersalesAssignedToNeed/SaveFormData?keyValue=SL_20170908001", //提出解决方案
			// url: "http://localhost:4066/AfterSaleManage/aw_CustomerAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

			type: "POST",
			dataType: "json",
			data: postData,
			success: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			},
			error: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			}
		})
	}
	

	/** 保存本工单信息 **/
	this.saveTaskClick = function() {

		//dialogClose();
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		var postData = $("#form").GetWebControls();
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/aw_customerServiceInfo/SaveFormData?keyValue=" + keyValue, //回访
			//填写最终实施结果
			//  url: "http://localhost:4066/AfterSaleManage/aw_ServiceManageAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

			//  url: "http://localhost:4066/AfterSaleManage/aw_AftersalesAssignedToNeed/SaveFormData?keyValue=SL_20170908001", //提出解决方案
			// url: "http://localhost:4066/AfterSaleManage/aw_CustomerAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

			type: "POST",
			dataType: "json",
			data: postData,
			success: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			},
			error: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false)
				console.log(data);
				dialogClose();
			}
		})
	}
	this.doSubmit = function(index1) {

		alert("do submit");
	}
	//转发工单;
	this.AcceptClick = function() {
		var slseq = request('slSeq');
		var forwardStatus = $("#forwardStatus").attr('data-value');
		if(forwardStatus == undefined || forwardStatus == "") {
			alert("请选择状态。");
			return;
		}
		var dispatchingPerson = $('#forwarded').text();
//		var test = escape(dispatchingPerson);
		dispatchingPerson = forwarded_id_list.join(";");
		if(dispatchingPerson == undefined || dispatchingPerson == "") {
			alert("请选择接收人。");
			return;
		}
		
		var pageJson = {
			slseq: slseq,
			destState: forwardStatus,
			destPersonList: dispatchingPerson,
			comments: $('#memo').val(),
			userid: ""
		};
		cm.ajax({
			url: "/AfterSaleManage/aw_workinfo/WorkstatusForwardRunning",
			type: "POST",
			data: pageJson,
			success: function(data) {

				dialogClose();
				dialogClose();
			},
			error: function(data) {
				dialogClose();
				dialogClose();
			}
		})
	}

};

var model = new viewModel();