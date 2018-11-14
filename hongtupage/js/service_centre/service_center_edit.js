var viewModel = function(){
	var self = this;
	var imgurl = '';
	
	var keyValue = request('keyValue');
	//页面初始化
	$(function() {
		self.ServiceCenterSettings();
		});
	//获取服务中心设置初始化页面
	this.ServiceCenterSettings = function(){
		cm.ajax({
			url: "/AfterSaleManage/aw_servicecenter/Get", //
			type: "POST",
			dataType: "json",
			data: {
				keyValue: keyValue
			},
			success: function(data) {
				var aw_servicecenterid = data.aw_servicecenterid;
				var organizationid = data.organizationid;
				var name = data.name;
				var phone = data.phone;
				var principal = data.principal;
				var address = data.address;
				var longlatitude = data.longlatitude;
				var image = data.image;
				var description = data.description;
				var CreateDate = data.CreateDate;
				var CreateUserId = data.CreateUserId;
				var CreateUserName = data.CreateUserName;
				var ModifyDate = data.ModifyDate;
				var ModifyUserId = data.ModifyUserId;
				var ModifyUserName = data.ModifyUserName;
				$("#name").val(name);
				$("#phone").val(phone);
				$("#address").val(address);
				$("#principal").val(principal);
				$("#description").val(description);
				$("#longlatitude").val(longlatitude);
				console.log(data.image);
				if(data.image == null || data.image == "") {
                     
				} else {
					var data_img_url = cm.domain+'/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist='+ data.image +'&token='+ cm.token;
					$(".fileinput-new").find('img').attr("src", data_img_url).css("visibility", "visible");
					$(".fileinput-preview").find('img').val(data_img_url);
					console.log(data_img_url);
				}
				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	
	//上传图片接口
	$('#uploadSubmit').click(function () {
				var selfx = this;
            var data = new FormData($('#uploadForm')[0]);
            console.log(data)
            console.log($('#uploadForm')[0])
            $.ajax({
                url: cm.domain + '/AfterSaleManage/aw_knowledge_dataitem/UploadFile?token='+ cm.token,
                type: 'POST',
                data: data,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                	if(data.Message && data.Message.length > 0){
                		imgurl = data.Message;
                		dialogMsg("上传成功!",1);
                	}else{
                		alert("上传图片失败,请重新上传!");
                	}
                	
                },
                error: function (data) {
                    console.log(data.status);
                    dialogMsg("上传图片失败,请重新上传!", 2);
                }
            });
        });
	//编辑保存
	this.newPreservation = function(data){
		var name = $('#name').val();
		var phone = $('#phone').val();
		var principal = $('#principal').val();
		var address = $('#address').val();
		var description = $('#description').val();
		var longlatitude = $('#longlatitude').val();
		cm.ajax({
			url: "/AfterSaleManage/aw_servicecenter/Update", //回访
			type: 'POST',
			dataType: 'json',
			data:{
				aw_servicecenterid:keyValue,
				name: name,
				phone:phone,
				principal:principal,
				address: address,
				image: imgurl,
				description:description,
				longlatitude:longlatitude,
			},
			success: function(data) {
				dialogMsg(data.message, 1);
				dialogClose();
			},
			error: function(data) {
				dialogMsg(data.message, 2);
			}
		})
	}
	
};

var model = new viewModel();