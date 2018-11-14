var viewModel = function() {
	var self = this;
	
	//清空按钮
	$(".clear_val").click(function(){
		$('#File').val('');
		$(".showFileName").html('');
		$('.clear_val').css({'display':'none'});
	});

    //显示上传的文件名称
	$(".a-upload").on("change", "input[type='file']", function() {
		$(".showFileName").html('');
		var filePath = $(this).val();	
		if(filePath && filePath.length > 0) {
			$('.clear_val').css({'display':'block'});
			var arr = filePath.split('\\');
			var fileName = arr[arr.length - 1];			
			$(".showFileName").html(fileName);
		} else {
			$(".showFileName").html("您未上传文件，或者您上传文件类型有误！");
			return false
		}
	});
	
	
	//导入数据
	this.AcceptClick = function() {
		var file_val = document.getElementById('File').files[0];
		if(!file_val){
			dialogMsg('请选择需要导入的excel文档!',0);
			return false;
		}
		var formdata = new FormData();
		formdata.append("file", document.getElementById('File').files[0]);
		formdata.append("Token", window.top.cm.token);
		$.ajax({
			type: 'POST',
			url: window.top.cm.domain + '/SyncData/importDataList',
			data: formdata,
			contentType: false,
			processData: false,
			enctype: 'multipart/form-data',
			beforeSend: function(request) {
				Loading(true, '正在导入数据...');
			},
			success: function(d) {
				var d = JSON.parse(d);
				if(d.type == 1) {
					dialogMsg(d.message, 1);
					Loading(false);
					window.location.reload();
				} else {
                   //top.$("#loading_manage").removeAttr('isTableLoading');
					Loading(false);				
					dialogAlert(d.message, 2);
				}
			}
		});
	};

};

var model = new viewModel();