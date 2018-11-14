var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	$("#userId").val(keyValue);
	var now_day = cm.format.Date(cm.format.getData('day', 0), 'yyyy-MM-dd'),
		pre_month = cm.format.Date(cm.format.getData('month', -1), 'yyyy-MM-dd');
	$("#StartTime").val(pre_month);
	$("#EndTime").val(now_day);
	var startTime = $("#StartTime").val();
	var endTime = $("#EndTime").val();

	$(function() {
		self.initMap(startTime, endTime, keyValue);
	});

	$("#btn_Search").click(function() {
		var param = $("#filter-form").GetWebControls();
		var startime = param.StartTime;
		var endtime = param.EndTime;
		self.initMap(startime, endtime, keyValue);
	});

	//查询回车
	$('.enter_class').bind('keypress', function(event) {
		if(event.keyCode == "13") {
			$('#btn_Search').trigger("click");
		}
	});

	this.initMap = function(startime, endtime, userId) {
		if(!startime) {
			dialogMsg('起始时间不能为空！', 0);
			return;
		}
		if(!endtime) {
			dialogMsg('结束时间不能为空！', 0);
			return;
		}
		if(startime > endtime) {
			dialogMsg('起始时间不能大于结束时间！', 0);
			return;
		}
		if(!userId) {
			dialogMsg('服务人员流水号不能为空！', 0);
			return false;
		}
		/*运动轨迹数据参数*/
		var postData = {
			StartTime: startime,
			EndTime: endtime,
			UserId: userId
		};
		/*运动轨迹*/
		var json_arr = [],
			data_arr = [];
		cm.ajax({
			type: "post",
			url: "/AfterSaleManage/aw_mappositioned/GetStaffMapRoute",
			data: {
				queryJson: JSON.stringify(postData)
			},
			async: false,
			success: function(data) {
				if(data.length <= 0) {
					dialogMsg('该时间段无活动历史轨迹！', 0);
					return false;
				}
				
				for(var i = 0; i < data.length; i++) {
					//时间
					var create_arr = data[i].createdate;
					data_arr.push(create_arr);
					//坐标点
					var point_array = data[i].point.split(',');
					json_arr.push(point_array);
				}
			}
		});
        
		// 百度地图API功能
		var map = new BMap.Map("allmap"); // 创建Map实例
		// 初始化地图,设置中心点坐标和地图级别
		map.centerAndZoom(new BMap.Point(103.423557, 33.987462), 5);
		//添加地图类型控件
		map.addControl(new BMap.MapTypeControl({
			mapTypes: [
				BMAP_NORMAL_MAP,
				BMAP_HYBRID_MAP
			]
		}));
		map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        
        /*
         * 点击事件方法声名
         * 
         */
         var opts = {
//			width: 30, // 信息窗口宽度
//			height: 20, // 信息窗口高度
			title: '<span style="font-size:15px;color:#0A8021">轨迹点活动时间：</span>', // 信息窗口标题
			enableMessage: true //设置允许信息窗发送短息
		};		
		function addClickHandler(con,marker, point) {		    
			marker.addEventListener("click", function(e) {
				var content = con;
				openInfo(content, e);
				map.centerAndZoom(point, 12);
			});
		}

		function openInfo(content, e) {
			var p = e.target;
			var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
			var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
			map.openInfoWindow(infoWindow, point); //开启信息窗口
		}
		
        
		/*画轨迹*/
		if(json_arr.length <= 0) {
			dialogMsg('该时间段无活动历史轨迹！', 0);
			return false;
		}
		var arrs = [];
		var Point;
		for(var i = 0; i < json_arr.length; i++) {
			Point = new BMap.Point(json_arr[i][0], json_arr[i][1]);
			arrs.push(Point);
		}
		
       
		
		for(var j = 1; j < json_arr.length - 1; j++) {
			var point = new BMap.Point(json_arr[j][0], json_arr[j][1]);
			var content = data_arr[j] ;//时间
			var marker = new BMap.Marker(point); // 创建标注
			map.addOverlay(marker); // 将标注添加到地图中	
			addClickHandler(content, marker, point);		//点击事件方法调用	
		}
		
		var line = new BMap.Polyline(arrs, {
			strokeColor: "#df2d31",
			strokeWeight: 4,
			strokeOpacity: 0.7
		}); //创建弧线对象  
		map.addOverlay(new BMap.Marker(arrs));
		map.addOverlay(line); //添加到地图中
		//让所有点在视野范围内
		map.setViewport(arrs);
		/*记录的开始坐标和结束坐标*/
		var json_arr_length = json_arr.length - 1;
		var firstPoint = new BMap.Point(json_arr[0][0], json_arr[0][1]); //开始点  
		var lastPoint = new BMap.Point(json_arr[json_arr_length][0], json_arr[json_arr_length][1]); //结束点  

		if(json_arr.length > 1) {
			//起点标注  
			var marker1 = new BMap.Marker(firstPoint); //将起点转化成标注点  
			map.addOverlay(marker1); //将起点标注点添加到地图上  
			var label1 = new BMap.Label("起点", {
				offset: new BMap.Size(20, -10)
			});			
			marker1.setLabel(label1);
			var cont = data_arr[0];
			addClickHandler(cont, marker1, firstPoint);	
		}
		
		//终点标注  
		var marker2 = new BMap.Marker(lastPoint, {
			icon: new BMap.Icon('../../../static/img/map/6.png', new BMap.Size(24, 24))
		}); //将终点转化成标注点
		map.addOverlay(marker2); //将终点标注点添加到地图上  
		var label2 = new BMap.Label("终点", {
			offset: new BMap.Size(20, -10)
		});
		marker2.setLabel(label2);
		var content_last = data_arr[data_arr.length-1];
	    addClickHandler(content_last, marker2, lastPoint);	
	    
	}

};

var model = new viewModel();