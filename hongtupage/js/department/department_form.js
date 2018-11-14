var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var organizeId = request('organizeId');
	var departmentId = request('departmentId');
	var parentId = request('parentId');
	var sort = request('sort');
//	var _itemId = request('_itemId');

	$(function() {
		self.initControl();
	})

	//初始化控件
	this.initControl = function() {
		//上级部门
		$("#OrganizeTree").ComboBoxTree({
			url: "/BaseManage/Department/GetOrganizeTreeJson",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			description: "==请选择==",
			height: "250px",
			allowSearch: true,
			click: function(item) {
				
				sort = item.Sort;
				if(item.Sort == 'Organize') {
					organizeId = item.id;
					parentId = 0;
					//加载负责人
					$("#ManagerId").ComboBoxTree({
						url: "/BaseManage/User/GetTreeJson?OrganizeId=" + item.id,
						cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
						description: "==请选择==",
						height: "220px",
						allowSearch: true
					});
				} else if(item.Sort == 'Department') {
					organizeId = item.organizeId;
					parentId = item.id;
					//加载负责人
					$("#ManagerId").ComboBoxTree({
						url: "/BaseManage/Department/GetUserTreeJson?DepartmentId=" + item.id,
						cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
						description: "==请选择==",
						height: "220px",
						allowSearch: true
					});
				} else {
					parentId = item.id;
				}
			}
		});

		//负责人
		$("#ManagerId").ComboBoxTree({
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			description: "==请选择==",
			height: "220px",
			allowSearch: true
		});
		//部门性质
		$("#Nature").ComboBox({
			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
			param: {
				EnCode: "DepartmentNature"
			},
			id: "ItemValue",
			text: "ItemName",
			description: "==请选择==",
			height: "200px"
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/BaseManage/Department/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data);
					if(data.ParentId == 0) {
						$("#OrganizeTree").ComboBoxTreeSetValue(data.OrganizeId);
						//加载负责人
						$("#ManagerId").ComboBoxTree({
							url: "/BaseManage/User/GetTreeJson?OrganizeId=" + data.OrganizeId,
							iconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
							description: "==请选择==",
							height: "220px",
							allowSearch: true
						});
					} else {
						$("#OrganizeTree").ComboBoxTreeSetValue(data.ParentId);
						//加载负责人
						$("#ManagerId").ComboBoxTree({
							url: "/BaseManage/Department/GetUserTreeJson?DepartmentId=" + data.ParentId,
							cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
							description: "==请选择==",
							height: "220px",
							allowSearch: true
						});
					}
					$("#ManagerId").ComboBoxTreeSetValue(data.ManagerId);
					parentId = data.ParentId;
					organizeId = data.OrganizeId;
				}
			});
		} 
	}
	//保存表单
	this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}
		var postData = $("#form1").GetWebControls(keyValue);
		postData["OrganizeId"] = organizeId;
		//		postData["ParentId"] = parentId;
		if(sort == "Department") {
			postData["ParentId"] = parentId;
		} else {
			postData["ParentId"] = 0;
		}
		postData["Manager"] = $("#ManagerId").attr('data-text');
		$.SaveForm({
			url: "/BaseManage/Department/SaveForm?keyValue=" + keyValue,
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				$.parentIframe().$("#gridTable").resetSelection();
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();