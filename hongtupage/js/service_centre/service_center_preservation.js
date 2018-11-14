var viewModel = function(){
	var self = this;
	var imgurl = '';
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
	//新增保存
	this.newPreservation = function(data){
		var name = $('#name').val();
		var phone = $('#phone').val();
		var principal = $('#principal').val();
		var address = $('#address').val();
		var description = $('#description').val();
		var longlatitude = $('#longlatitude').val();
		cm.ajax({
			url: "/AfterSaleManage/aw_servicecenter/Insert", //回访
			type: 'POST',
			dataType: 'json',
			data:{
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