var viewModel = function() {
	var self = this;
	var keyValue = parent.window.model.keyValue;
	var procode = parent.window.model.procode;
	var class_status = ['','drag_div_green','drag_div_red'];
	
	$(function() {
		self.init();
		self.GetData();
	});
	//初始化背景图
	this.init = function() {
		//获取背景图设置高	
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/orderproduct/GetProductInfo", //回访
			type: "POST",
			dataType: "json",
			data: {
				orderProductId: keyValue
			},
			success: function(res) {
				console.log("2222222222222222222222222222")
				var data = res[0];
				console.log(data);
				if(data == "") {
					$('#img').css("background-image", "url(../../../static/img/monitor_5-7.bmp)");
					$('#img').css("height", document.documentElement.clientHeight);
				} else {
					var photoUrl = data.monitorphotourl;

					$('#img').css("background-image", "url(" + cm.domain + "/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=" + photoUrl + "&token=" + cm.token + ")");
					$('#img').css("height", document.documentElement.clientHeight);
					//avatar_html +="<img  src=>";
				}

			},
			error: function(data) {
				console.log(data);
			}
		})
	};
	
	//初始化数据
	this.GetData = function(){
		cm.ajax({
			type: 'GET',
			url: '/Monitor/GetMonitorAlarmList',
			data: {
				keyvalue: procode
			},
			async: false,
			success: function(data){
			  if(data && data.length > 0){
			  	self.inintData(data);
			  }
			}
		})
	};

	//初始化
	this.inintData = function(arr) {
		$(".text_class tr").html("");
		for(var i = 0; i < arr.length; i++) {
			var html = '';
			html += '<td>';
			html += '<div id="draggable_' + i + '"  class="drag_div ' + class_status[Number(arr[i].State)] + '" style="left:' + arr[i].Position_left + '; top:' + arr[i].Position_top + ';">';
			html += arr[i].COLL_VAL;
			html += '</div>';
			html += '</td>';
			$(".text_class tr").append(html);
		}
	};
	

   this.reload = function(){
   	 location.reload();
   };
   
   setInterval(function() {
		self.GetData();
	}, 5000);
   
   
};

var model = new viewModel();