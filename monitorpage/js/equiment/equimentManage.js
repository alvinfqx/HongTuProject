var viewModel = function() {
	var self = this;
	var companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : '';
	var timeStr = $("#getTime").val();
	var now_day = cm.format.Date(cm.format.getData('day', 0), 'yyyy-MM-dd');
	var _parentId = "";
	//存储树的设备编码
	var eq_tree_code = '';
	//websocket 配置字段
	var ws;
	//配置线程时间
	var time_interval = null;
	//区分websocket请求获取哪个接口数据的索引
	var websocket_index = 0;
	//获取实时数据长度
	var real_time_len = 0;

	$(function() {
		//初始化样式高度
		self.InitialPage();
		//初始化树
		self.initTree();
		//获取基本信息
		self.getTitle(eq_tree_code);
		//websocket连接
		connectSocketServer();
		//调用ajax获取数据插入html
		self.getGrapData(_parentId, timeStr, '', '');
		//self.initLineGraph(producttoken, timeStr,'','');	
	});

	//初始化页面
	this.InitialPage = function() {
		$('.profile-nav').height($(window).height() - 60);
		window.setTimeout(function() {
			var profileH = $('.profile-nav').height();
			var searchHeight = $('.search_div').height();
			var imgh = $('.div_left_one').height();
			$(".center-Panel").css({
				"height": profileH
			});
			$(".content_2").css({
				"height": profileH - searchHeight - 20
			});
			$("#tableId").setTreeHeight(profileH - imgh - searchHeight - 50);
		}, 200);
		$('#layout').layout({
			applyDemoStyles: true,
			onresize: function() {
				$(window).resize()
			}
		});
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('.profile-nav').height($(window).height() - 100);
				var baikuang = $('.profile-nav').height();
				var searchHeight = $('.search_div').height();
				var imgh = $('.div_left_one').height();
				$(".center-Panel").css({
					"height": baikuang
				});
				$(".content_2").css({
					"height": baikuang - searchHeight - 20
				});

				$("#tableId").setTreeHeight(baikuang - imgh - searchHeight - 40);

			}, 200)
			e.stopPropagation();
		});
	};
	//左侧树的设备展示
	this.initTree = function() {
		cm.ajax({
			url: '/Monitor/GetEqiupmentTreeList',
			data: {
				keyValue: companyId
			},
			type: 'Get',
			async: false,
			success: function(data) {
				if(data && data.length > 0) {
					_parentId = data[0].eq_type;
					eq_tree_code = data[0].eq_type;
					var html = '';
					html += '<li class="active" data-id="' + data[0].eq_id + '" data-type="' + data[0].eq_type + '" onclick="model.profileSwitch(this)">' + data[0].eq_type + '</li>'
					for(var i = 1; i < data.length; i++) {
						html += '<li data-id="' + data[i].eq_id + '" data-type="' + data[i].eq_type + '" onclick="model.profileSwitch(this)">' + data[i].eq_type + '</li>'
					}
					$("#muneID").html('');
					$("#muneID").html(html);
				} else {
					dialogMsg('无设备数据!', 0);
					return false;
				}
			}
		});
	};
	//左侧树的点击事件
	this.profileSwitch = function(obj) {
		var $dom = $(obj);
		var id = $dom.data('id');
		var type = $dom.data('type');
		//清除样式
		$("#muneID").find('li').removeClass('active');
		$dom.addClass('active');
		//全局变量获取设备编号
		_parentId = type;
		//清空时间段控件
		$("#historyStarTim").val("");
		$("#historyEndTim").val("");
		//点击刷新设备基础信息
		self.getTitle(type);
		//点击树初始化table
		self.getGrapData(type, $("#getTime").val(), '', '');
		//点击获取新的设备编号重新连接websocket刷新表格
		sendData(type);
		//格式化查询的事件时间控件
		$("#historyStarTim").val("");
		$("#historyEndTim").val("");
	};

	time_interval = setInterval(function() {
		console.log(_parentId)
		sendData(_parentId);
	}, 5000);

	//连接websocket
	function connectSocketServer() {
		var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
		if(support == null) {
			return;
		}
		// create a new websocket and connect
		ws = new window[support](cm.ws);
		// when data is comming from the server, this metod is called
		ws.onmessage = function(evt) {
			if(evt.data) {
				var new_data = JSON.parse(evt.data);
				if(websocket_index == 0) {
					self.GetGrid(new_data);
					self.meterData(new_data);
				} else if(websocket_index == 1) {
					self.getStatus(new_data);
				}

			}
			websocket_index++;
			console.log('Connection Data');
		};
		// when the connection is established, this method is called
		ws.onopen = function() {
			console.log('Connection Success');
			//发送请求接口
			sendData(eq_tree_code);
		};
		// when the connection is closed, this method is called
		ws.onclose = function() {
			console.log('Connection Closed');
		}
	}

	//send data
	function sendData(param) {
		var jsonData = {};
		jsonData.keyValue = param;
		var str = JSON.stringify(jsonData)
		//		alert(str);
		if(ws) {
			//单设备监控
			ws.send('InQuire SingleDeviceMonitor ' + str);
			//状态接口
			ws.send('InQuire EqiupStatusMonitor ' + str);

			websocket_index = 0;
		} else {
			console.log('Send Data Fail!');
		}
	}

	//获取状态
	this.getStatus = function(arr) {
		if(arr && arr.length > 0) {
			var html = '';
			if(arr[0].eq_state == 0) {
				html += '<span class="status_class" style="background-color:green;">正常</span>';
			} else if(arr[0].eq_state == 1) {
				html += '<span class="status_class" style="background-color:red;">异常</span>';
			} else if(arr[0].eq_state == 2) {
				html += '<span class="status_class" style="background-color:#cb5314;">掉线</span>';
			}
			$("#status_id").html(html);
		} else {
			console.log('无状态数据');
		}

	};

	//获取设备基础信息
	this.getTitle = function(param) {
		cm.ajax({
			url: '/Monitor/GetEqiupmentInfo',
			data: {
				keyValue: param
			},
			async: false,
			success: function(data) {
				console.log(data);
				$("#eq_name").text("");
				$("#eq_code").text("");
				if(data && data.length > 0) {
					var new_img_url = cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=' + data[0].photourl + '&token=' + cm.token;
					$("#eq_name").text(data[0].eq_name);
					$("#eq_code").text(data[0].eq_type);
					$("#img_id").attr('src', new_img_url);
				}
			}
		});
	};

	//加载表格
	this.GetGrid = function(data_arr) {
		var rows = data_arr;
		$("#table_detail").html("");
		var html = "";
		html += "<thead><tr><th>节点名称</th><th>节点值</th><th>节点状态</th><th>采集时间</th></tr></thead>";
		html += "<tbody class='table_cotent_class'>";
		if(rows && rows.length > 0) {
			for(var i = 0; i < rows.length; i++) {
				html += "<tr>";
				html += "<td>" + (rows[i].NODE_NAME ? rows[i].NODE_NAME : "") + "</td>";
				html += "<td>" + (rows[i].COLL_VAL ? rows[i].COLL_VAL : "") + rows[i].NODE_UNIT + "</td>";
				if(rows[i].State == "3") {
					html += "<td style='color:red;'>异常</td>";
				} else {
					html += "<td style='color:#4dad49;'>正常</td>";
				}
				html += "<td>" + (rows[i].COLL_DATE ? rows[i].COLL_DATE : "") + "</td>";

				html += "</tr>";
			}
		} else {
			html += "<tr>";
			html += "<td colspan='4'>无数据</td>";
			html += "</tr>";
		}
		html += "</tbody>"

		$("#table_detail").html(html);
		$(".table_cotent_class").css({
			"height": $(window).height() - 435
		});
	};

	//查询按钮
	this.btn_search = function() {

		if(!_parentId) {
			console.log('设备编号为空');
		}
		var startTimeStr = $("#historyStarTim").val();
		var endTimeStr = $("#historyEndTim").val();
		if(!startTimeStr) {
			dialogMsg('请选择开始时间!', 0);
			return false;
		}
		if(!endTimeStr) {
			dialogMsg('请选择结束时间!', 0);
			return false;
		}
		Loading(true);	//请求时数据没加载出来的时候出现加载提示
		setTimeout(function() {
			self.getSearchGrapData(_parentId, "", startTimeStr, endTimeStr);
		}, 500)

	}

	//时间段选择事件
	this.changeSelect = function(val) {
		if(!_parentId) {
			console.log('设备编号为空');
		}
		var time_str = val;
		$("#historyStarTim").val("");
		$("#historyEndTim").val("");
		var startTime = $("#historyStarTim").val();
		var endTime = $("#historyEndTim").val();
		self.getSearchGrapData(_parentId, time_str, startTime, endTime);
	};

	//获取历史数据
	this.getGrapData = function(value, timeStr, startTime, endTime) {
		cm.ajax({
			url: "/Monitor/GetHistoryDataList",
			data: {
				keyvalue: value,
				TimeInterval: timeStr,
				StartTime: startTime,
				EndTime: endTime
			},
			type: "Get",
			async: false,
			success: function(data) {
				//插入HTML
				self.init_line_html(data);
				//初始化历史折线图
				self.initLineGraph(data);
			}
		});
	};

	//用于查询历史数据的函数
	this.getSearchGrapData = function(value, timeStr, startTime, endTime) {

		cm.ajax({
			url: "/Monitor/GetHistoryDataList",
			data: {
				keyvalue: value,
				TimeInterval: timeStr,
				StartTime: startTime,
				EndTime: endTime
			},
			type: "Get",
			async: false,
			success: function(data) {
				//初始化历史折线图
				self.initLineGraph(data);
			},
			error: function(data) {

			},
			complete: function() {//当请求完成之后调用这个函数，无论成功或失败。传入 XMLHttpRequest 对象，以及一个包含成功或错误代码的字符串。
				Loading(false);//数据加载成功的时候加载提示消失

			}
		});
	}

	//初始化折线图
	this.init_line = function(idDom, timeArr, valArr, title_name) {
		var colorAllArray = ["#83a0df", "#bdcbf0", "#63e990", "#fdfebd", "#63e990", "#a0f2ba", "#f14d50", "#f89493"];
		var class_one = colorAllArray[Math.floor(Math.random() * colorAllArray.length)];
		var class_two = colorAllArray[Math.floor(Math.random() * (colorAllArray.length - 1))];
		var chart = echarts.init(document.getElementById(idDom));
		var option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					animation: false
				},
				formatter: "{a} <br/><span style='color:#4db3d7;font-size:14px;'> 时间 : {b}</span> <br/><span style='color:red;font-size:14px;'> 值 : {c}</span>"
			},
			xAxis: {
				type: 'category',
				boundaryGap: false, //坐标的刻度是否在中间
				data: timeArr,
				axisLabel: { //坐标轴刻度标签
					textStyle: {
						color: '#fff', //刻度标签字体颜色						
					},
					show: true,
					rotate:-47 //调整x坐标
				},
				axisLine: { //坐标轴线条相关设置(颜色等)
					lineStyle: {
						color: '#fff',
					}
				},
				axisTick: { //坐标轴刻度相关设置

					lineStyle: {
						color: '#fff' //刻度线颜色
					}
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					textStyle: {
						color: '#fff', //刻度标签字体颜色
					}
				},
				axisLine: {
					lineStyle: {
						color: '#fff',
						width: 1, //这里是为了突出显示加上的  
					}
				},
				axisTick: {
					lineStyle: {
						color: '#fff' //刻度线颜色
					}
				}
			},
			series: [{
				name: title_name,
				data: valArr,
				type: 'line',
				areaStyle: { //区域填充样式
					normal: {
						//线性渐变
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: class_one // 0% 处的颜色
						}, {
							offset: 1,
							color: class_two // 100% 处的颜色
						}], false),
					}
				},
				lineStyle: {
					normal: {
						color: class_one
					}
				},
				itemStyle: {
					normal: {
						color: class_one
					}
				}
			}]
		};
		chart.setOption(option);
	}

	//仪表盘初始化
	this.initMeter = function(domId, nameTitle, indexVal, unit) {
		var meterChart = echarts.init(document.getElementById(domId));
		var option = {
			tooltip: {
				formatter: "<span style='color:#fff;'>{a}</span><br/><span style='color:red;font-weight:bold;'>值 : {c}{b}</span>"
			},
			series: [{
				name: nameTitle,
				type: 'gauge',
				splitNumber: 5,
				radius: '80%',
				axisLine: { // 坐标轴线
					lineStyle: { // 属性lineStyle控制线条样式
						color: [
							[0.09, 'lime'],
							[0.82, '#1e90ff'],
							[1, '#ff4500']
						],
						width: 3,
						shadowColor: '#fff', //默认透明
						shadowBlur: 10
					}
				},
				axisLabel: { // 坐标轴小标记
					textStyle: { // 属性lineStyle控制线条样式
						fontWeight: 'bolder',
						color: '#fff',
						shadowColor: '#fff', //默认透明
						shadowBlur: 10
					}
				},
				axisTick: { // 坐标轴小标记
					length: 12, // 属性length控制线长
					lineStyle: { // 属性lineStyle控制线条样式
						color: 'auto',
						shadowColor: '#fff', //默认透明
						shadowBlur: 10,

					}
				},
				splitLine: { // 分隔线
					length: 15, // 属性length控制线长
					lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
						width: 3,
						color: '#fff',
						shadowColor: '#fff', //默认透明
						shadowBlur: 10
					}
				},
				pointer: { // 分隔线
					shadowColor: '#fff', //默认透明
					shadowBlur: 5
				},
				title: {
					offsetCenter: [0, '-5%'], // x, y，单位px
					textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						fontSize: 11,
						fontStyle: 'italic',
						color: '#fff',
						shadowColor: '#fff', //默认透明
						shadowBlur: 10,
					}
				},
				detail: {
					offsetCenter: [0, '65%'], // x, y，单位px
					textStyle: {
						fontWeight: 'bolder',
						fontSize: 12,
					}
				},
				data: [{
					name: unit,
				}]
			}]
		};
		option.series[0].data[0].value = indexVal;
		meterChart.setOption(option);
	};

	//仪表盘数据获取
	this.meterData = function(data_arr) {
		if(data_arr && data_arr.length > 0) {
			for(var i = 0; i < data_arr.length; i++) {
				var meter_id = "graphMeter_" + i;
				self.initMeter(meter_id, data_arr[i].NODE_NAME, data_arr[i].COLL_VAL, data_arr[i].NODE_UNIT);
			}
		} else {
			console.log('无实时数据');
		}
	};

	//根据历史数据插入table html
	this.init_line_html = function(json_data) {
		var graph_html = "";
		var i_index = 0;
		if(JSON.stringify(json_data) != "{}") {
			$.each(json_data, function(i, val) {
				graph_html += '<tr>';
				graph_html += '<td style="font-size:15px;font-weight:bold;color:#eb912a; padding-left: 27px">';
				if(val && val.length > 0) {
					graph_html += val[0].NODE_NAME;
				} else { //无历史数据时显示标题
					graph_html += 'NOT NODE NAME';
				}
				graph_html += '</td>';
				graph_html += '<td>';
				graph_html += '<div id="graphLine_' + i + '"  style="width: 300px;height:200px;"></div>'
				graph_html += '</td>';
				graph_html += '<td>';
				graph_html += '<div id="graphMeter_' + i_index + '" style="width: 150px;height:150px;"></div>';
				graph_html += '</td>';
				graph_html += '</tr>';
				i_index++;
			});
		} else {
			console.log('无历史数据');
		}
		$('#graph_show').html("");
		$('#graph_show').html(graph_html);
	}

	//加载折线图数据
	this.initLineGraph = function(getDataJson, timeVal, startVal, endVal) {
		$.each(getDataJson, function(j, n) {
			var time_array = [];
			var data_array = [];
			var name_title = '';
			if(n && n.length > 0) {
				for(var i = 0; i < n.length; i++) {
					time_array[i] = (n[i].COLL_DATE).split(":")[0] + ':' + (n[i].COLL_DATE).split(":")[1];
					data_array[i] = n[i].COLL_VAL ? n[i].COLL_VAL : 0;
					name_title = n[0].NODE_NAME;
				}
			}
			var id_name = "graphLine_" + j;
			self.init_line(id_name, time_array, data_array, name_title);
		});
	}

	//工艺图
	this.btn_art = function() {
		if(!_parentId) {
			console.log('设备编号为空');
		}
		var keyValue = _parentId;
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "artForm",
				title: '工艺流程图',
				url: '/monitorpage/view/equiment/equitmentArt.html?procode=' + keyValue,
				width: '950px',
				height: '700px',
				btn: null
			});
		}
	};
	//列表数据
	this.btn_list = function() {
		if(!_parentId) {
			console.log('设备编号为空');
		}
		var keyValue = _parentId;
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "ListForm",
				title: '列表数据',
				url: '/monitorpage/view/equiment/equitmentList.html?procode=' + keyValue,
				width: "",
				height: "",
				btn: null
			});
		}
	};

	//历史数据
	this.btn_history = function() {
		if(!_parentId) {
			console.log('设备编号为空');
		}
		var keyValue = _parentId;
		if(checkedRow(keyValue)) {
			dialogOpen({
				id: "HistoryForm",
				title: '历史数据查询',
				url: '/monitorpage/view/equiment/equitmentHistory.html?procode=' + keyValue + '&proname=' + keyValue,
				width: "",
				height: "",
				btn: null
			});
		}
	};

};
var model = new viewModel();