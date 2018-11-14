var viewModel = function() {
	var self = this;
	$(function() {
		$('#map_id').css({
			"width": $('.center-Panel').width() - 190,
			"height": $(window).height() - 90,
			"overflow": "hidden",
			"position": "absolute",
			"margin": "0",
			"font-family": "微软雅黑",
		});
		self.InitialPage();
		self.GetTree();
		self.InitMap();
		self.datamap();

	});
	//初始化页面
	this.InitialPage = function() {
		//layout布局
		$('#layout').layout({
			applyDemoStyles: true,
			onresize: function() {
				$(window).resize()
			}
		});
		//resize重设(表格、树形)宽高
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#map_id').css({
					"width": $('.center-Panel').width(),
					"height": $(window).height() - 90,
					"overflow": "hidden",
					"position": "absolute",
					"margin": "0",
					"font-family": "微软雅黑",
				});
				$("#itemTree").setTreeHeight($(window).height() - 52);
			}, 200);
			e.stopPropagation();
		});
	};

	//加载树	
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 52,
			url: "/SystemManage/DataItemDetail/GetMonitorDeviceTreeJson",
			method: "POST",
			param:{
				queryJson: $("#txt_Keyword").val()||""
			},
			onnodeclick: function(item) {
				console.log(item);
				var _parentId = item.id;
				self.datamap(_parentId);
			}
		};
		//初始化
		$("#itemTree").treeview(item);
	}
	this.query_a = function(){//点击查询树
		var text_val =  $("#txt_Keyword").val();
		if(text_val == ""){
			alert("请输入要有效关键字！")
		}
		cm.ajax({
			type: 'post',
			url: '/SystemManage/DataItemDetail/GetMonitorDeviceTreeJson_query',
			data: {
				queryJson: $("#txt_Keyword").val()
			},
			success: function(data) {
				console.log(data);
				if(data&&data.keyId !=""){
					var keyId = data.keyId;
					self.GetTree();
					var nid = keyId.replace(/[^\w]/gi, "_");//中括号替换成下划线
					console.log(nid);
					$("#itemTree").setCheckedNodeOne(nid);//选中单个节点
				}
				
			}
		});
	}

	this.datamap = function(_parentId) {
		if(!_parentId) {
			_parentId = '0';
		}
		cm.ajax({
			type: 'post',
			url: '/AfterSaleManage/orderproduct/GetMonitorDevicePOSList',
			data: {
				keyword: _parentId
			},
			async: false,
			success: function(data) {

				var data_list = [];
				for(var i = 0; i < data.length; i++) {
					var arr = data[i].pointStr.split(','); //经纬度		
					arr.push(data[i].deviceStatus); //状态正常1，异常3，停机5
					arr.push(data[i].orderProductId); //流水号			    	   				    	    
					data_list.push(arr);
				}

				self.InitMap(data_list);
			}
		});
	};

	this.InitMap = function(data_info) {
		// 百度地图API功能
		var map = new BMap.Map("map_id"); // 创建Map实例
		// 创建点坐标
		var point = new BMap.Point(103.423557, 33.987462);
		// 初始化地图,设置中心点坐标和地图级别
		map.centerAndZoom(point, 5);
		//添加地图类型控件
		map.addControl(new BMap.MapTypeControl({
			mapTypes: [
				BMAP_NORMAL_MAP,
				BMAP_HYBRID_MAP
			]
		}));
		//在地图上添加缩放控件
		map.addControl(new BMap.NavigationControl());
		map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

		var opts = {
			width: 500, // 信息窗口宽度
			height: 0, // 信息窗口高度
			
			title: '<span style="font-size:15px;color:#0A8021">产品详细资料</span>', // 信息窗口标题
			enableMessage: true //设置允许信息窗发送短息
		};

		if(data_info && data_info.length > 0) {
			for(var i = 0; i < data_info.length; i++) {
				var img_url = '';
				switch(data_info[i][2]) {
					case '1':
						img_url = '../../../static/img/map/2.png';
						break;
					case '3':
						img_url = '../../../static/img/map/3.png';
						break;
					case '5':
						img_url = '../../../static/img/map/1.png';
						break;
					default:
						img_url = '';
				}

				var point = new BMap.Point(data_info[i][0], data_info[i][1]);
				var marker = new BMap.Marker(point, {
					icon: new BMap.Icon(img_url, new BMap.Size(24, 24))
				}); // 创建标注
				map.addOverlay(marker); // 将标注添加到地图中					
				//var content = getContent(data_info[i][3]);				
				addClickHandler(data_info[i][3], marker, point);
			}
		} else {
			console.log('data_info无数据');
		}
		//让所有点在视野范围内
		//map.setViewport(pointArray);              
		function addClickHandler(productID, marker, point) {
			marker.addEventListener("click", function(e) {
				var content = self.getContent(productID);
				openInfo(content, e);
				map.centerAndZoom(point, 8);
			});
		}

		function openInfo(content, e) {
			var p = e.target;
			var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
			var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
			map.openInfoWindow(infoWindow, point); //开启信息窗口
		}
	};

	//获取内容
	this.getContent = function(statusID) {
		var getdata = '';
		cm.ajax({
			type: 'post',
			url: '/AfterSaleManage/orderproduct/GetMonitorDeviceInfo',
			data: {
				productInfoId: statusID
			},
			async: false,
			success: function(data) {

				getdata = '';
				var status_name = '',
					img_url = '';
				switch(data.deviceStatus) {
					case '1':
						status_name = '正常';
						img_url = '../../../static/img/map/2.png';
						break;
					case '3':
						status_name = '异常';
						img_url = '../../../static/img/map/3.png';
						break;
					case '5':
						status_name = '掉线';
						img_url = '../../../static/img/map/1.png';
						break;
					default:
						status_name = '';
						img_url = '';
				}
				getdata += '<div style="width: 500px;height: 210px;overflow: hidden; overflow-y: scroll;">';
				getdata += '<div style="line-height:20px;">';
				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">产品代号: &nbsp;&nbsp;</label>';
				getdata += data.productToken;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">产品名字: &nbsp;&nbsp;</label>';
				getdata += data.productName;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">产品类型: &nbsp;&nbsp;</label>';
				getdata += data.productType;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">客户名称: &nbsp;&nbsp;</label>';
				getdata += data.productType;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">详细地址: &nbsp;&nbsp;</label>';
				getdata += data.location;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">工况信息: &nbsp;&nbsp;</label>';
				getdata += data.monitorStatusInfo;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">设备状态: &nbsp;&nbsp;</label>';
				getdata += status_name;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">报警信息: &nbsp;&nbsp;</label>';
				getdata += data.alarmInfo;
				getdata += '</p>';

				getdata += '<p>';
				getdata += '<label style="font-weight:bold;">状态监控: &nbsp;&nbsp;</label>';
				getdata += '<img src= "' + img_url + '"  />';
				getdata += '</p>';

				getdata += '<p style="margin-bottom:10px;">';
				getdata += '<label style="font-weight:bold;">最后更新时间: &nbsp;&nbsp;</label>';
				getdata += data.lastUpdateDate;
				getdata += '</p>';

				getdata += '<button type="button"  onclick="model.historyWarnBtn(\'' + data.orderProductId + '\',\'' + data.productToken + '\',\'' + data.productName + '\')" class="btn btn-danger btn-xs" style="width:80px;margin-right:20px;">';
				getdata += '工艺流程图';
				getdata += '</button>';

				getdata += '<button type="button"  onclick="model.statusBtn(\'' + data.orderProductId + '\',\'' + data.productToken + '\',\'' + data.productName + '\')" class="btn btn-primary btn-xs" style="width:90px;">';
				getdata += '列表数据展示';
				getdata += '</button>';

				getdata += '<div style="margin-top:5px;">';

				getdata += '<button type="button"  onclick="model.graphBtn(\'' + data.orderProductId + '\',\'' + data.productToken + '\');" class="btn btn-default btn-xs" style="width:80px;margin-right:20px;">';
				getdata += '含曲线监控';
				getdata += '</button>';

				getdata += '<button type="button"  onclick="model.warnBtn(\'' + data.orderProductId + '\',\'' + data.productToken + '\')" class="btn btn-warning btn-xs" style="width:90px;">';
				getdata += '常规监控页面';
				getdata += '</button>';

				getdata += '</div>';
				getdata += '</div>';
				getdata += '</div>';

			}
		});
		return getdata;
	}

	//列表数据展示
	this.statusBtn = function(val, code, name) {

		if(!val) {
			dialogMsg('无效流水号', 2);
			return false;
		}

		dialogOpen({
			id: 'StatusForms',
			title: '列表数据展示',
			url: '/hongtupage/view/equipment/device_status.html?keyValue=' + val + '&procode=' + code + '&proname=' + name,
			width: '950px',
			height: '700px',
			btn: null,
		});

	};

	//含曲线的监控界面
	this.graphBtn = function(val, proToken) {

		if(!val) {
			dialogMsg('无效流水号', 2);
			return false;
		}
		if(!proToken) {
			dialogMsg('无效产品编码', 2);
			return false;
		}

		dialogOpen({
			id: 'GraphForms',
			title: '含曲线的监控界面',
			url: '/hongtupage/view/equipment/device_graph.html?keyValue=' + val + '&protoken=' + proToken,
			width: '',
			height: '',
			btn: null,
		});

	};

	//常规监控页面
	this.warnBtn = function(value, proToken) {

		if(!!value) {
			dialogOpen({
				id: 'WarnForms',
				title: '常规监控页面',
				url: '/hongtupage/view/equipment/device_warn.html?keyValue=' + value + '&protoken=' + proToken,
				width: '',
				height: '',
				btn: null,
			});
		} else {
			dialogMsg('无效流水号', 2);
		}
	};

	//工艺流程图
	this.historyWarnBtn = function(val, code, name) {
		if(!!val) {
			dialogOpen({
				id: 'HistoryWarnForms',
				title: '工艺流程图',
				url: '/hongtupage/view/equipment/device_history_warn.html?keyValue=' + val + '&procode=' + code + '&proname=' + name,
				width: '950px',
				height: '700px',
				btn: null,
			});
		} else {
			dialogMsg('无效流水号', 2);
		}
	}
};

var URL = "/hongtupage/view/equipment/device_monitor";
var MID = window.top.page_parameters.GetMID(URL);
//工具按钮
$('.toolbar').authorizeButton();
var model = new viewModel();