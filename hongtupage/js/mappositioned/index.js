var viewModel = function() {
	var self = this;
	// 创建Map实例
	var map = new BMap.Map("allmap");
	// 创建点坐标
	var point = new BMap.Point(103.423557, 33.987462);
	// 初始化地图,设置中心点坐标和地图级别
	map.centerAndZoom(point, 5);

	//启用滚轮放大缩小
	map.enableScrollWheelZoom();

	//在地图上添加缩放控件
	map.addControl(new BMap.NavigationControl());

	// 创建标注
	// 将标注添加到地图中
	this.maker = function(position, img, Zoom, state, username, html) {
		//map.clearOverlays();
		var cc = position;
		var x = cc.split(",");
		var point = new BMap.Point(x[0], x[1]);
		var myIcon = new BMap.Icon(img, new BMap.Size(24, 24), {
			offset: new BMap.Size(0, -5),
			imageOffset: new BMap.Size(0, 0)
		});
		var marker = new BMap.Marker(point, {
			icon: myIcon
		}); // 创建标注

		var labelgps = new BMap.Label(username, {
			offset: new BMap.Size(20, -10)
		});
		labelgps.setStyle({
			position: "none",
			color: "#000",
			fontSize: "10px",
			fontWeight: "600",
			backgroundColor: "#fff"
		})
		marker.setLabel(labelgps);
		map.addOverlay(marker); // 将标注添加到地图中

		if(Zoom == 8) {
			map.centerAndZoom(point, 8) //设定地图的中心点和坐标并将地图显示在地图容器中
		} else if(Zoom == 10) {
			map.centerAndZoom(point, 10) //设定地图的中心点和坐标并将地图显示在地图容器中
		} else if(Zoom == 14) {
			map.centerAndZoom(point, 14) //设定地图的中心点和坐标并将地图显示在地图容器中
		}

		// 创建信息窗口对象
		var opts1 = {
			title: '<span style="font-size:15px;color:#0A8021">人员分布信息</span>'
		};

		var infoWindow = new BMap.InfoWindow(html, opts1);
		marker.addEventListener("click", function() {
			this.openInfoWindow(infoWindow);
			$(".history_btn").on('click', function() {
				var val = $(this).data('value');
				dialogOpen({
					id: "Form",
					title: username +'的历史轨迹',
					url: '/hongtupage/view/mappositioned/form.html?keyValue='+ val, //UserId
					width: "900px",
					height: "600px",
					btn: null
				});
			});
		}) //点击

	}

	//查询事件
	$("#btn_Search").click(function() {
		if(!$("#txt_Keyword").val()) {
			return false;
		}		
		cm.ajax({
			url: "/AfterSaleManage/aw_mappositioned/GetListJsonWithPost",
			type: "POST",
			dataType: "json",
			data: {
				"queryJson": $("#txt_Keyword").val()
			},
			success: function(data) {
				map.clearOverlays();
				$.each(data, function(i, n) {
					var ls_html = "";
					ls_html += "<div style='line-height:1.8em;font-size:12px;'><b>姓名:  </b>" + n.ModifyUserName + "</br>";
					ls_html += "<b>详细地址:  </b>" + n.address + "</br><b>最后更新时间:  </b>" + n.ModifyDate + "</br></br>";
					ls_html += "<button type='button' class='history_btn' style='padding:2px;' data-value='"+ n.UserId + "'>历史轨迹</button></br>";
					ls_html += "</div>";
					ls_img = cm.domain + "/Content/images/position/6.png";
					self.maker(n.point, ls_img, 14, "1", n.ModifyUserName, ls_html);
				});
				$(".history_btn").on('click', function() {
					var val = $(this).data('value');
					dialogOpen({
						id: "Form",
						title: username +'的历史轨迹',
						url: '/hongtupage/view/mappositioned/form.html?keyValue='+ val,
						width: "900px",
						height: "600px",
						btn: null
					});
				});

			},
			error: function(data) {

			}
		});

	});

	//查询回车
	$('#txt_Keyword').bind('keypress', function(event) {
		if($("#txt_Keyword").val() && $("#txt_Keyword").val().length > 0) {
			if(event.keyCode == "13") {
				$('#btn_Search').trigger("click");
			}
		}
	});

	cm.ajax({
		url: "/AfterSaleManage/aw_mappositioned/GetListJsonWithPost",
		type: "POST",
		dataType: "json",
		data: {
			"queryJson": $("#txt_Keyword").val()
		},
		success: function(data) {
			console.log(data);
			$.each(data, function(i, n) {
				var ls_html = "";
				ls_html += "<div style='line-height:1.8em;font-size:12px;'><b>姓名:  </b>" + n.ModifyUserName + "</br>";
				ls_html += "<b>详细地址:  </b>" + n.address + "</br><b>最后更新时间:  </b>" + n.ModifyDate + "</br></br>";
				ls_html += "<button type='button' class='history_btn'  style='padding:2px;' data-value='"+ n.UserId + "'>历史轨迹</button></br>";
				ls_html += "</div>";
				var ls_img = cm.domain + "/Content/images/position/6.png";
				self.maker(n.point, ls_img, 6, "1", n.ModifyUserName, ls_html);
			});

		},
		error: function(data) {
            
		}
	});

};
//工具按钮
$('.toolbar').authorizeButton();
var model = new viewModel();