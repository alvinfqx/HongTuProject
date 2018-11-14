 var keyValue = request('keyValue');

 /** 关闭本工单信息 **/
 function CloseTaskClick() {

 	//dialogClose();
 	var postData = $("#form").GetWebControls();
 	Loading(true, "正在拼了命为您处理。。。");
 	top.$("#loading_manage").attr('isTableLoading', 'true');
 	cm.ajax({
 		//受理客户需求
 		url: "/AfterSaleManage/aw_CustomerAddNewRequire/SaveFormDataWithClose?keyValue=" + keyValue, //回访
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

 //保存表单;
 function AcceptClick() {

 	var postData = $("#form").GetWebControls();

 	Loading(true, "正在拼了命为您处理。。。");
 	top.$("#loading_manage").attr('isTableLoading', 'true');
 	cm.ajax({
 		//受理客户需求
 		url: "/AfterSaleManage/aw_CustomerAddNewRequire/SaveFormData?keyValue=" + keyValue, //回访
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