var viewModel = function() {
	var self = this;
	//组织ID
	var companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : '';
	//公司名称   
	var key_value = "麻城市天然气发展有限公司";
	var monitor_type_code = "AV457N_1405007";
	var websocket_index = 0;
	var orderproductid = '';

	var ws;

	$(function() {
		self.InitialPage();
		self.initWebSocket();
		//		self.request_s();

	});

	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function(e) {
			window.setTimeout(function() {

				$(".grap_div").css({
					"height": $(".basic_class").height(),
					//"width": $(".grap_div").width() * 0.57
					"width": $(".basic_class").width()
				})

				/*		$("#status_graph").css({
			"height": $(".grap_div").height(),
			//"width": $(".grap_div").width() * 0.57
			"width": $(".grap_div").width()
		})*/

				//				$("#barBraph").css({
				//					"height": $(".bar_graph").height() * 0.95,
				//					"width": $(".bar_graph").width() * 0.98
				//				})

				/*$("#tableHID").css({
					'height': $(window).height() - 420
				});
				$("#tableWarnHID").css({
					'height': $(window).height() - 400
				});*/

			}, 200);
			e.stopPropagation();
		});
	}
	this.mians = function() { //初始化图表
		$(".grap_div").css({
			"height": $(".basic_class").height() + 5,
			//"width": $(".grap_div").width() * 0.57
			"width": $(".basic_class").width()
		})
		$("#status_graph").css({
			"height": $(".grap_div").height() * 0.5,
			//"width": $(".grap_div").width() * 0.57
			"width": $(".grap_div").width()
		})
		var myChart = echarts.init(document.getElementById('status_graph'));
		var option = {
			tooltip: {
				borderWidth: 0,
				borderColor: '#ddd',
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			color: ['#f2b863', '#f0715e', '#29baf0', '#94e385', '#53d9d0', '#8b82df', '#f089e0'],
			series: [{
					name: '访问来源',
					type: 'pie',
					selectedMode: 'single',
					radius: [0, '40%'],
					center: ['53%', '55%'],
					label: {
						normal: {
							position: 'inner'
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
//					data: [{
//							value: 335,
//							name: '主机',
//							selected: true
//						},
//						{
//							value: 679,
//							name: '冷切系统'
//						},
//						{
//							value: 548,
//							name: '润滑系统'
//						},
//						{
//							value: 888,
//							name: '电气控制系统',
//							selected: true
//						}
//					]
				},
				{
					name: '告警类型',
					type: 'pie',
					radius: [0, '70%'],
					center: ['45%', '48%'],
					data: [{
							value: 569,
							name: '油压低'
						},
						{
							value: 310,
							name: '排气温度高'
						},
						{
							value: 234,
							name: '压缩机不启动'
						},
						{
							value:456,
							name: '填料泄露'
						},
						{
							value: 1048,
							name: '气缸噪音'
						},
						{
							value: 251,
							name: '机身振动'
						}
					]
				}
			]
		};
		/*		$(window).resize(function(e) {
					myChart.resize();
				})*/
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}
	this.barBraph = function() { //初始化柱形图

		$("#barBraph").css({
			"height": $(".bar_graph").height(),
			"width": $(".bar_graph").width()
		})

		var myChart = echarts.init(document.getElementById('barBraph'));
		var option = {
			title: {
				//      text: '某地区蒸发量和降水量',
				//      subtext: '纯属虚构'
			},
			tooltip: {
				trigger: 'axis'
			},
			color: ['#1bceea', '#ab82e1', '#70b9ec', '#5f6ae6', '#28d9cd'],
			legend: {
				data: ['生产订单 1090单', '物流投入 600吨'],
				textStyle: {
					color: '#ccc', //刻度标签字体颜色						
				},
			},
			toolbox: {
				show: true,
			},
			calculable: true,
			xAxis: [{
				type: 'category',
				data: ['12/01', '12/02', '12/03', '12/04', '12/05', '12/06', '12/07', '12/08', '12/09', '12/10', '12/11', '12/12'],
				axisLabel: { //坐标轴刻度标签
					show: true,
					textStyle: {
						color: '#ccc' //刻度标签字体颜色						
					}
				}
			}, ],
			yAxis: [{
				type: 'value',
				splitLine: {
					show: false
				},
//				max:120,
				axisLabel: {
					//						formatter: '{value} ml',
					textStyle: {
						color: '#ccc', //刻度标签字体颜色						
					}
				}
			}],
			series: [{
					name: '生产订单 1090单',
					type: 'bar',
					data: [23.0, 69.9, 45.0, 79.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 90.4, 46.3],
				},
				{
					name: '物流投入 600吨',
					type: 'bar',
					data: [89.6, 56.9, 65.0, 89.4, 56.7, 70.7, 175.6, 182.2, 48.7, 65.8, 68.0, 46.3],
				}
			]
		};
		/*$(window).resize(function(e) {
			myChart.resize();
		})*/
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}
	//连接websocket
	this.initWebSocket = function() {
		var ws;

		function connectSocketServer() {
			var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
			if(support == null) {
				return;
			}
			// create a new websocket and connect
			ws = new window[support]('ws://10.33.140.95:2012/');
			// when data is comming from the server, this metod is called
			ws.onmessage = function(evt) {
				if(evt.data) {
					var new_data = JSON.parse(evt.data);
					if(websocket_index == 0) {
						self.GetGrid(new_data);
					} else if(websocket_index == 1) {
						self.GetWarnGrid(new_data);
					} else if(websocket_index == 2) {
						self.getAlarmNum(new_data);
					} else if(websocket_index == 3) {
						self.getInformation(new_data);
					} else if(websocket_index == 4) {
						self.getEquipStatus(new_data);
					}

				}
				websocket_index++;
				console.log('Connection Data');
			};
			// when the connection is established, this method is called
			ws.onopen = function() {
				console.log('Connection Success');
				sendData();
			};
			// when the connection is closed, this method is called
			ws.onclose = function() {
				console.log('Connection Closed');
			}
		}

		//send data
		function sendData() {
			if(ws) {
				//设备运行状态
				ws.send('InQuire EquipMonitor {\"keyValue\":\"' + companyId + '\"}');
				//设备告警信息
				ws.send('InQuire WarnMessage {\"keyValue\":\"' + companyId + '\"}');
				//设备告警统计（右一）
				ws.send('InQuire AlarmStatistics {\"keyValue\":\"' + companyId + '\"}');
				//用户基本信息
				ws.send('InQuire CustomerInfo {\"keyValue\":\"' + companyId + '\"}');
				//设备统计信息（左一）
				ws.send('InQuire EqiupStatistics {\"keyValue\":\"' + companyId + '\"}');

				websocket_index = 0;
			} else {
				console.log('Send Data Fail!');
			}
		}

		window.onload = function() {
			connectSocketServer();
		}
		sendData();
		//		setInterval(function() {
		//			sendData();
		//		}, 5000);
	};

	//获取基础信息
	this.getInformation = function(arr) {
		if(arr && arr.length > 0) {
			var new_img_url = cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=' + arr[0].photourl + '&token=' + cm.token;
			$("#company_name").text('');
			$("#compan_address").text('');
			$("#company_name").text(arr[0].cust_name);
			$("#compan_address").text(arr[0].custadress);
			$("#equiment_image").attr('src', new_img_url);
			$("#center_image_id").attr('src', new_img_url);
		} else {
			console.log('无基础信息数据');
		}
	};

	//告警统计
	this.getAlarmNum = function(arr) {
		if(arr && arr.length > 0) {
			$("#alarm_id").html("");
			var html = "";
			for(var p = 0; p < arr.length; p++) {
				html += "<div class='col-xs-3'>";
				html += "<div class='warn_num num_" + p + "'>";
				//				html += arr[p].num ? arr[p].num : "0";
				html += "<span>" + arr[p].num ? arr[p].num : "0" + "</span>"
				//				html += ;
				html += "</div>";
				html += "<div class='warn_text'>";
				html += arr[p].alarmgrade
				html += "</div>";
				html += "</div>";
				$("#alarm_id").html(html);
			}
		} else {
			console.log('无告警信息数据');
		}
	};

	//基本信息--设备故障统计
	this.getEquipStatus = function(json_arr) {
		if(JSON.stringify(json_arr) != "{}") {

			$(".number_1").text('');
			$(".number_2").text('');
			$(".number_3").text('');
			$(".number_1").text(json_arr.EqSum);
			$(".number_2").text(json_arr.EqAlarmSum);
			$(".number_3").text(json_arr.EqHandleSum);
		} else {
			$(".number_1").text('0');
			$(".number_2").text('0');
			$(".number_3").text('0');
			console.log('无基础信息数据');
		}
	};

	//加载表格--监控状态
	this.GetGrid = function(data_arr) {
		var rows = data_arr;
		$("#table_detail").html("");
		var html = "";
		html += "<thead style='color: #30badd;'><tr><th>设备名称</th><th>设备地址</th><th>设备编号</th><th>状态</th><th>最后采集时间</th></tr></thead>";
		html += "<tbody id='tableHID' >";
		if(rows && rows.length > 0) {
			for(var i = 0; i < rows.length; i++) {
				html += "<tr  onclick=\"model.btn_viewa('" + rows[i].eq_type + "')\" data-type='" + rows[i].eq_type + "'>";
				html += "<td>" + (rows[i].eq_name ? rows[i].eq_name : "") + "</td>";
				html += "<td>" + (rows[i].custadress ? rows[i].custadress : "") + "</td>";
				html += "<td>" + (rows[i].eq_type ? rows[i].eq_type : "") + "</td>";
				//				alert(rows[i].eq_type)
				//正常状态
				console.log(rows[i].eq_state);
				if(rows[i].eq_state == 0) {
					html += "<td style='color:#4ead49;'>";
				}
				//异常状态
				else if(rows[i].eq_state == 1) {
					html += "<td style='color:#ce3e3d;'>";
				}
				//掉线状态
				else if(rows[i].eq_state == 2) {
					html += "<td style='color:#eb9e3e;'>";
				} else {
					html += "<td>";
				}
				html += (rows[i].eq_sum_state ? rows[i].eq_sum_state : "");
				html += "</td>";
				html += "<td>" + (rows[i].coll_date ? rows[i].coll_date.replace("T", " ") : "") + "</td>";
				html += "</tr>";
			}
		} else {
			html += "<tr>";
			html += "<td colspan='5'>There is not data</td>";
			html += "</tr>";
		}
		html += "</tbody>"
		$("#table_detail").html(html);
		//		$("#tableHID").css({
		//			'height': $(window).height() - 260
		//		})

		self.mians();
		self.barBraph();

	};

	this.request_s = function(btn_arrs) {
		//		self.btn_viewa(btn_arr);
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/orderproduct/GetProductInfoByProductToken", //回访
			type: "POST",
			dataType: "json",
			data: {
				productToken: 'AD130D_1607006'
			},
			success: function(data) {
				var datas = data[0];
				orderproductid = datas.orderproductid;
				console.log(orderproductid)
				console.log(data);
				dialogOpen({
					id: 'Forms',
					title: '产品详情',
					url: '/hongtupage/view/order_product_detail/order_product_detail.html?keyValue=' + orderproductid,
					width: '900px',
					height: '700px',
					btn: null,
				})
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	this.btn_viewa = function(btn_arr) {
		self.request_s(btn_arr);
		//		alert(btn_arr)
		//		dialogOpen({
		//			id: 'Forms',
		//			title: '产品详情',
		//			url: '/hongtupage/view/order_product_detail/order_product_detail.html?keyValue=' + orderproductid,
		//			width: '900px',
		//			height: '700px',
		//			btn: null,
		//		})

	}
	//报警信息
	this.GetWarnGrid = function(warn_arr) {
		var rows = warn_arr;
		$("#table_warn_detail").html("");
		var html = "";
		html += "<thead><tr><th>设备名称</th><th>告警信息</th><th>等级</th><th>告警时间</th></tr></thead>";
		html += "<tbody id='tableWarnHID' >";
		if(rows && rows.length > 0) {
			for(var i = 0; i < rows.length; i++) {
				html += "<tr>";
				html += "<td>" + (rows[i].productname ? rows[i].productname : "") + "</td>";
				html += "<td style='color:red;'>" + (rows[i].alarm_content ? rows[i].alarm_content : "") + "</td>";
				html += "<td>" + (rows[i].alarmgrade ? rows[i].alarmgrade : "") + "</td>";
				html += "<td>" + (rows[i].occuredtime ? rows[i].occuredtime.replace("T", " ") : "") + "</td>";
				html += "</tr>";
			}
		} else {
			html += "<tr>";
			html += "<td colspan='4'>There is not data</td>";
			html += "</tr>";
		}
		html += "</tbody>"
		$("#table_warn_detail").html(html);
		//		$("#tableWarnHID").css({
		//			'height': $(window).height() - 245
		//		})
	}

};

var model = new viewModel();