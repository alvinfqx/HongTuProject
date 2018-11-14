var viewModel = function() {
	var self = this;
	var objectId = request('objectId');
	var objectType = request('objectType');
	$(function() {
		self.initControl();
	})
	//初始化控件
	this.initControl = function() {
		$(".tab-content li").click(function() {
			if(!!$(this).hasClass("active")) {
				$(this).removeClass("active");
			} else {
				$(this).addClass("active").siblings("li");
			}
		});
		$.SetForm({
			url: "/AuthorizeManage/FilterTime/GetFormJson",
			param: {
				keyValue: objectId
			},
			success: function(data) {

				if(data == null) {
					return false;
				}
				$("#form1").SetWebControls(data);
				if(data.WeekDay1 != null) {
					var WeekDay1 = data.WeekDay1.indexOf(",") > 0 ? data.WeekDay1.split(',') : [data.WeekDay1];
					for(var i = 0; i < WeekDay1.length; i++) {
						var value = WeekDay1[i];
						$("#WeekDay1").find('li').find('[data-value="' + value + '"]').parent().addClass('active');
					}
				}
				if(data.WeekDay2 != null) {
					var WeekDay2 = data.WeekDay2.indexOf(",") > 0 ? data.WeekDay2.split(',') : [data.WeekDay2];
					for(var i = 0; i < WeekDay2.length; i++) {
						var value = WeekDay2[i];
						$("#WeekDay2").find('li').find('[data-value="' + value + '"]').parent().addClass('active');
					}
				}
				if(data.WeekDay3 != null) {
					var WeekDay3 = data.WeekDay3.indexOf(",") > 0 ? data.WeekDay3.split(',') : [data.WeekDay3];
					for(var i = 0; i < WeekDay3.length; i++) {
						var value = WeekDay3[i];
						$("#WeekDay3").find('li').find('[data-value="' + value + '"]').parent().addClass('active');
					}
				}

				if(data.WeekDay4 != null) {
					var WeekDay4 = data.WeekDay4.indexOf(",") > 0 ? data.WeekDay4.split(',') : [data.WeekDay4];
					for(var i = 0; i < WeekDay4.length; i++) {
						var value = WeekDay4[i];
						$("#WeekDay4").find('li').find('[data-value="' + value + '"]').parent().addClass('active');
					}
				}

				if(data.WeekDay5 != null) {
					var WeekDay5 = data.WeekDay5.indexOf(",") > 0 ? data.WeekDay5.split(',') : [data.WeekDay5];
					for(var i = 0; i < WeekDay5.length; i++) {
						var value = WeekDay5[i];
						$("#WeekDay5").find('li').find('[data-value="' + value + '"]').parent().addClass('active');
					}
				}
				if(data.WeekDay6 != null) {
					var WeekDay6 = data.WeekDay6.indexOf(",") > 0 ? data.WeekDay6.split(',') : [data.WeekDay6];
					for(var i = 0; i < WeekDay6.length; i++) {
						var value = WeekDay6[i];
						$("#WeekDay6").find('li').find('[data-value="' + value + '"]').parent().addClass('active');
					}
				}

				if(data.WeekDay7 != null) {
					var WeekDay7 = data.WeekDay7.indexOf(",") > 0 ? data.WeekDay7.split(',') : [data.WeekDay7];
					for(var i = 0; i < WeekDay7.length; i++) {
						var value = WeekDay7[i];
						$("#WeekDay7").find('li').find('[data-value="' + value + '"]').parent().addClass('active');
					}
				}

			}
		});
		$("#ObjectId").val(objectId);
		$("#ObjectType").val(objectType);
	}
	//保存表单
	this.AcceptClick = function() {
		var selectedTime = [];
		$('.tab-pane').each(function() {
			var time = [];
			$(this).find('ul li.active').each(function() {
				var value = $(this).find('a').html();
				time.push(value);
			});
			selectedTime.push(String(time))
		});
		var postData = $("#form1").GetWebControls();
		postData["WeekDay1"] = selectedTime[0];
		postData["WeekDay2"] = selectedTime[1];
		postData["WeekDay3"] = selectedTime[2];
		postData["WeekDay4"] = selectedTime[3];
		postData["WeekDay5"] = selectedTime[4];
		postData["WeekDay6"] = selectedTime[5];
		postData["WeekDay7"] = selectedTime[6];
		
		$.SaveForm({
			url: "/AuthorizeManage/FilterTime/SaveForm",
			param: postData,
			loading: "正在保存数据...",
			success: function() {
				
				$.parentIframe().$("#gridTable").trigger("reloadGrid");
			}
		})
	}
};

var model = new viewModel();