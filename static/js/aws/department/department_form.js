var viewModel = function() {
	var self = this;
	var keyValue = newrequest('keyValue');
	var organizeId = newrequest('organizeId');
	var departmentId = newrequest('departmentId');
	var parentId = newrequest('parentId');
	var sort = newrequest('sort');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//上级部门
		$("#OrganizeTree").ComboBoxTree({
			url: "/BaseManage/Department/GetOrganizeTreeJson",
			description: "==请选择==",
			height: "250px",
			cbiconpath: "../../monitorpage/util/tree/images/icons/",
			click: function(item) {
				sort = item.Sort;
				if(item.Sort == 'Organize') {
					organizeId = item.id;
					parentId = 0;
					//加载负责人
					$("#ManagerId").ComboBoxTree({
						url: "/BaseManage/User/GetTreeJson?OrganizeId=" + item.id,
//						param: {
//							OrganizeId: sessionStorage.getItem("companyId")
//						},
						description: "==请选择==",
						height: "220px",
						allowSearch: true,
						cbiconpath: "../../monitorpage/util/tree/images/icons/"
					});
				} else if(item.Sort == 'Department') {
					organizeId = item.organizeId;
					parentId = item.id;
					//加载负责人
					$("#ManagerId").ComboBoxTree({
						url: "/BaseManage/Department/GetUserTreeJson?DepartmentId=" + item.id,
						description: "==请选择==",
						height: "220px",
						allowSearch: true,
						cbiconpath: "../../monitorpage/util/tree/images/icons/"
					});
				} else {
					parentId = item.id;
				}
			}
		});

		//负责人
		$("#ManagerId").ComboBoxTree({
			description: "==请选择==",
			height: "220px",
			allowSearch: true,
			cbiconpath: "../../monitorpage/util/tree/images/icons/"
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
							param: {
								OrganizeId: sessionStorage.getItem("companyId")
							},
							description: "==请选择==",
							height: "220px",
							allowSearch: true,
							cbiconpath: "../../monitorpage/util/tree/images/icons/"
						});
					} else {
						$("#OrganizeTree").ComboBoxTreeSetValue(data.ParentId);
						//加载负责人
						$("#ManagerId").ComboBoxTree({
							url: "/BaseManage/Department/GetUserTreeJson?DepartmentId=" + data.ParentId,
							description: "==请选择==",
							height: "220px",
							allowSearch: true,
							cbiconpath: "../../monitorpage/util/tree/images/icons/"
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