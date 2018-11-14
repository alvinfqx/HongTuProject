var viewModel = function() {
	var self = this;
	var keyValue = request("keyValue");
	var departmentId = request("departmentId");
	var ischeckbox = request("checkbox");
	var dataSource = [];//初始化备选人员
	var companyId = sessionStorage.getItem("companyId");
	$(document).ready(function() {
		self.initialPage();
		self.GetTree();
		self.initTransfer();
	});
	//重设(表格)宽高
	this.initialPage = function() {
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$("#itemTree").setTreeHeight($(window).height() - 45);
			}, 200);
			e.stopPropagation();
		});
		if(!!departmentId){
			self.searchChildNode(departmentId);
		}
	}
	//加载树
	var _itemId = '';
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 52,
			url: "/BaseManage/User/GetTreeOrganizeJson",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			//			showcheck: true,
			cascadecheck: false,
			param: {
				OrganizeId: companyId,
			},
			onnodeclick: function(item) {
				_itemId = item.id;

				self.searchChildNode(_itemId)

				$('#btn_Search').trigger("click");
			},
			onLodeSuccess: function(item) {
				_itemId = item[0]["id"];
				//			_itemId = item.id;
			}
		};
		$("#itemTree").treeview(item);
	};

	this.updateClick = function(callback) { //获取人员
		var id_list = $('#transferContainer').transfer('getData', 'selectData', 'UserId'); //获取树形菜单选择
		var text_list = $('#transferContainer').transfer('getData', 'selectData', 'RealName');
		var exit_list = []
//		console.log(ischeckbox);
		if(ischeckbox){
			if(id_list.length>1){
				alert("人员不支持多选！");
				return;
			}
		}
		$.each(id_list, function(i, n) {
			exit_list.push({
				"UserId": id_list[i],
				"RealName": text_list[i]
			})
		});
		tranfer.tranferSetSession(keyValue, exit_list)

		callback(id_list, text_list);
		dialogClose();

		console.log(id_list);

	}
	
	

	this.searchChildNode = function(treeid) {
		cm.ajax({
			//受理客户需求
			url: "/BaseManage/User/GetListJson", //回访
			type: "get",
			dataType: "json",
			data: {
				departmentId: treeid
			},
			success: function(data) {
				console.log(data);
				$('#transferContainer').transfer('refreshLeft', data)
			},
			error: function(data) {
				//				top.$("#loading_manage").removeAttr('isTableLoading');
				//				Loading(false)
				console.log(data);
				//				dialogClose();
			}
		})
	}

	
	this.initTransfer = function() {
		$('#transferContainer').transfer({
			titles: ['待选人员', '已选人员'],
			search: true,
			uniqueId: "UserId", //唯一id
			dataSource: dataSource,
			selectdataSource: [],
			unselectColumns: [{
				field: 'flag',
				checkbox: true
			}, {
				field: 'RealName',
				title: '人员名称'
			}]
		});

		var exit_list = tranfer.tranferGetSession(keyValue);
		console.log(exit_list)
		$('#transferContainer').transfer('refreshRight', exit_list);

	}

};

var model = new viewModel();