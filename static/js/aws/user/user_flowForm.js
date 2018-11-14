var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var instanceId = "";
	var formId = "";
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		//公司
		$("#OrganizeId").ComboBoxTree({
			url: "/BaseManage/Organize/GetTreeJson",
			description: "==请选择==",
			height: "200px",
			allowSearch: true,
			cbiconpath:"../../monitorpage/util/tree/images/icons/",
		}).bind("change", function() {
			var value = $(this).attr('data-value');
			//加载部门
			$("#DepartmentId").ComboBoxTree({
				url: "/BaseManage/Department/GetTreeJson?organizeId=" + value,
				description: "==请选择==",
				allowSearch: true,
				cbiconpath:"../../monitorpage/util/tree/images/icons/"
			});
			//加载角色
			$("#RoleId").ComboBox({
				url: "/BaseManage/Role/GetListJson?organizeId=" + value,
				id: "RoleId",
				text: "FullName",
				description: "==请选择==",
				allowSearch: true
			});
			//加载岗位
			$("#DutyId").ComboBox({
				url: "/BaseManage/Post/GetListJson?organizeId=" + value,
				id: "RoleId",
				text: "FullName",
				description: "==请选择==",
				allowSearch: true
			});
		});
		//部门
		$("#DepartmentId").ComboBoxTree({
			description: "==请选择==",
			height: "200px",
			allowSearch: true
		}).bind("change", function() {
			var value = $(this).attr('data-value');
			//加载职位
			$("#PostId").ComboBox({
				url: "/BaseManage/Job/GetListJson?organizeId=" + value,
				id: "RoleId",
				text: "FullName",
				description: "==请选择==",
				allowSearch: true
			});
			//加载主管
			$("#ManagerId").ComboBox({
				url: "/BaseManage/User/GetListJson?departmentId=" + value,
				id: "UserId",
				text: "RealName",
				title: "Account",
				description: "==请选择==",
				allowSearch: true
			});
		});
		//岗位
		$("#DutyId").ComboBox({
			description: "==请选择==",
			height: "200px",
			allowSearch: true
		});
		//角色
		$("#RoleId").ComboBox({
			description: "==请选择==",
			height: "200px",
			allowSearch: true
		});
		//职位
		$("#PostId").ComboBox({
			description: "==请选择==",
			height: "200px",
			allowSearch: true
		});
		//主管
		$("#ManagerId").ComboBox({
			description: "==请选择==",
			height: "200px",
			allowSearch: true
		});
		//性别
		$("#Gender").ComboBox({
			description: "==请选择==",
		});
		
		//加载自定义表单
		var moduleId = top.$.cookie('currentmoduleId');
	
		$.SetForm({
			url: "/AuthorizeManage/ModuleForm/GetEntityJsonByModuleId",
			param: {
				"keyValue": moduleId,
				"objectId": keyValue
			},
			async: true,
			success: function(data) {
				if(data==null || data==""){
					
				}else{
					$('#frmpreview').frmPreview({
					tablecotent: data.form.FormJson,
					width: 700
				});
				formId = data.form.FormId;
				if(data.instance != null) {
					
					$('#frmpreview').frmSetData(JSON.parse(data.instance.FormInstanceJson));
					instanceId = data.instance.FormInstanceId;
				}
				}
				
			}
		});
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/BaseManage/User/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#form1").SetWebControls(data);
					$("#OrganizeId").trigger("change");
					$("#DepartmentId").ComboBoxTreeSetValue(data.DepartmentId).trigger("change");
					$("#DutyId").ComboBoxSetValue(data.DutyId)
					$("#RoleId").ComboBoxSetValue(data.RoleId)
					$("#PostId").ComboBoxSetValue(data.PostId)
					$("#ManagerId").ComboBoxSetValue(data.ManagerId);
					$("#Birthday").val(formatDate(data.Birthday, "yyyy-MM-dd"));
					$("#Password").val("******").attr('disabled', 'disabled');
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
		postData["DutyName"] = $("#DutyId").attr('data-text');
		postData["PostName"] = $("#PostId").attr('data-text');
		postData["Manager"] = $("#ManagerId").attr('data-text');
		var _instanceData = $("#frmpreview").frmGetData();
		var moduleFormInstanceEntity = {
			"FormId": formId,
			"FormInstanceJson": JSON.stringify(_instanceData)
		};
		
		$.SaveForm({
			url: "/BaseManage/User/SaveForm",
			param: {
				"keyValue": keyValue,
				"strUserEntity": JSON.stringify(postData),
				"FormInstanceId": instanceId,
				"strModuleFormInstanceEntity": JSON.stringify(moduleFormInstanceEntity)
			},			
			loading: "正在保存数据...",
			success: function(data) {
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();