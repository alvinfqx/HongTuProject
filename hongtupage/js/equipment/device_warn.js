Loading(true, "正在拼了命为您处理.....");
var viewModel = function() {
	var self = this;
	var keyval = request("keyValue");
	var producttoken = request("protoken");
	var ws;
	//配置线程时间
	$(function() {

		$(".two").css({
			"height": $(window).height() - 345
		});
		$(".three").css({
			"height": $(window).height() - 20
		});

		self.getTitle();
		self.GetGrid();
		self.grahInitHtml();
		connectSocketServer();

		//折线
		//		self.status_graph();
		self.Obtain();
	});

	this.reload = function() {
		location.reload();
	}

	//equitment title
	this.getTitle = function() {
		cm.ajax({
			url: '/Monitor/GetEqiupmentInfo',
			data: {
				keyValue: producttoken
			},
			async: false,
			success: function(data) {
				$("#name_id").text("");
				$("#code_id").text("");
				if(data.length > 0) {
					$("#name_id").text(data[0].eq_name);
					$("#code_id").text(data[0].eq_type);
				}
			}
		});
	}
	this.GetGrid = function() {
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 405,
			url: "/AfterSaleManage/dm_alarm/GetPageNewRequireTopSearchAlarmList",
			datatype: "json",

			colModel: [{
					label: '序号',
					name: 'alarmItemID',
					index: 'alarmItemID',
					hidden: true,
					key: true
				},
				{
					label: '类型',
					name: 'alarmType',
					index: 'alarmType',
					width: 90,
					align: "center",
					sortable: true
				},
				{
					label: '报警发生时间',
					name: 'occuredTime',
					index: 'occuredTime',
					width: 160,
					align: "center",
					sortable: true
				},

				{
					label: '报警内容',
					name: 'alarm_content',
					index: 'alarm_content',
					width: 120,
					align: "center",
					sortable: true
				},
			],
			viewrecords: false,
			rowNum: 10,
			rowList: [],
			pager: false,
			sortname: 'occuredTime',
			sortorder: 'desc',
			rownumbers: true,
			multiselect: false,
			shrinkToFit: false,
			gridview: true,
		});
	}

	//获取数据 
	this.Obtain = function(Keyword) {
		cm.ajax({ //历史告警统计（设备 近5个月）
			url: "/Monitor/GetHistoryDataReport",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: producttoken,
				Keyword: Keyword || '',
				Start_time: $("#begindata").val() || '',
				End_time: $("#enddata").val() || ''
			},
			success: function(data) {
				self.getGrapData(data);
				//				self.dateTime(data);
				var Standby_time = data.Standby_time; //待机时间
				var Run_time = data.Run_time; //运行时间
				var Stop_time = data.Stop_time; //停机时间
				var Total_time = data.Total_time; //总时间
				var OperationRate = data.OperationRate; //运行率
				var Rise_time = data.Rise_time; //图表开始时间
				var End_time = data.End_time; //图表结束时间
				$("#dropMachine").text(Stop_time);
				$("#standby").text(Standby_time);
				$("#function").text(Run_time);
				$("#time").text(Total_time);
				$("#operationRate").text(OperationRate);
				$("#Rise_time").text(Rise_time);
				$("#End_time").text(End_time);
				console.log(data)

			},
			error: function(data) {
				console.log(data)
			}
		})
	}
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
				self.getStatus(new_data);

			}
			console.log('Connection Data');
		};
		// when the connection is established, this method is called
		ws.onopen = function() {
			console.log('Connection Success');
			//发送请求接口
			sendData();
		};
		// when the connection is closed, this method is called
		ws.onclose = function() {
			console.log('Connection Closed');
		}
	}

	//send data
	function sendData(param) {
		var jsonData = {};
		jsonData.keyValue = producttoken;
		var str = JSON.stringify(jsonData)
		//		alert(str);
		if(ws) {
			//状态接口
			ws.send('InQuire EqiupStatusMonitor ' + str);
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

	//加载化折线图数据
	this.getGrapData = function(val_array) {
		var nam = [];
		var val = [];
		var data_array = JSON.parse(val_array.data);
		$.each(data_array, function(i, n) {
			nam.push(n.COLL_DATE);
			val.push(n.COLL_VAL);
		});

		self.status_graph(nam, val)
	}

	//点击日期
	this.dateTime = function(val_Time) {
		self.Obtain(val_Time);
	}
	//点击日期查询事件
	this.btn_Search = function(val_data) {
		self.Obtain(val_data);
	}

	//折线图
	this.status_graph = function(time_array, data_array) {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('status_graph'));
		// 指定图表的配置项和数据
		var option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					animation: false
				},
				formatter: function(params, ticket, callback) {
					var val = params[0]["data"]
					val = parseInt(val);
					//					debugger
					if(val === 2) {
						return '状态：运行<br />时间: ' + params[0].name;
					}
					if(val === 1) {
						return '状态：待机<br />时间: ' + params[0].name;
					}
					if(val === 0) {
						return '状态：掉线/停机<br />时间: ' + params[0].name; //时间从params里面取
					}
				}
			},
			grid: {
				left: '5%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},

			//			dataZoom: [{
			//					type: 'slider',
			//					xAxisIndex: 0,
			//					filterMode: 'empty'
			//				},
			//			
			//				{
			//					type: 'inside',
			//					xAxisIndex: 0,
			//					filterMode: 'empty'
			//				}
			//				
			//			],
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: time_array,
				axisLabel: { //坐标轴刻度标签
					textStyle: {
						color: '#fff', //刻度标签字体颜色						
					},
					show: true
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
				name: '运行时间图',
//				splitNumber: 3,
				interval: 1,
				axisLabel: {
					textStyle: {
						color: '#fff', //刻度标签字体颜色						
					},
					formatter: function(value, index) {
						value = parseInt(value);
						if(value === 2) {
							return '运行';
						}
						if(value === 1) {
							return '待机';
						}
						if(value === 0) {
							return '掉线/停机';
						} else {
							return '';
						}

					}
				},
				axisLine: { //坐标轴线条相关设置(颜色等)
					lineStyle: {
						color: '#fff',
					},
					onZero: false
				},
				axisTick: { //坐标轴刻度相关设置

					lineStyle: {
						color: '#fff' //刻度线颜色
					}
				}
			},
			series: [{
				name: '状态',
				type: 'line',
				step: 'middle',
				data: data_array
			}, ]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	};

	//获取实时报警数据
	this.getMeterData = function() {
		var data_array = [];
		cm.ajax({
			url: "/Monitor/GetRealStatusMonitorList",
			data: {
				keyValue: producttoken
			},
			type: "Get",
			async: false,
			success: function(data) {
				if(data && data.length > 0) {
					data_array = data.reverse();
				}
			}
		});
		return data_array;
	}

	//初始化统计图的html
	this.grahInitHtml = function() {
		var meter_array = self.getMeterData();
		if(meter_array && meter_array.length > 0) {
			var graph_html = '';
			for(var i = 0; i < meter_array.length - 1; i++) {
				graph_html += '<div class="gray_div">';
				graph_html += '<p class="title_type">' + meter_array[i].TypeName + '</p>';
				graph_html += '<table border="0">';
				var arr = meter_array[i].data;
				if(arr && arr.length > 0) {

					for(var k = 0; k < arr.length; k++) {
						if(k % 2 === 0) {
							graph_html += '<tr>';
						}
						graph_html += '<td>';
						graph_html += '<div id="grap_meter_' + i + '_' + k + '" style="width: 260px;height:220px;"></div>';
						graph_html += '</td>';
						if(k % 2 != 0) {
							graph_html += '</tr>';
						}
					}
					if(arr.length % 2 != 0) {
						graph_html += '</tr>';
					}
				}
				graph_html += '</table>';
				graph_html += '</div>';
			}

			graph_html += '<div class="gray_div">';
			graph_html += '<p class="title_type">' + meter_array[meter_array.length - 1].TypeName + '</p>';
			graph_html += '<div style="padding: 10px;">';
			graph_html += '<table border="0" style="width: 100%;">';
			var last_index = meter_array.length - 1;
			if(meter_array[last_index].data && meter_array[last_index].data.length > 0) {
				for(var j = 0; j < meter_array[last_index].data.length; j++) {
					if(j % 2 === 0) {
						graph_html += '<tr>';
					}
					graph_html += '<td class="other_td_class">';
					//					graph_html += '<img src="../../../static/img/dog.png" class="img_class"/>';
					graph_html += '<img src="' + cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=' + meter_array[last_index].data[j].PhotoUrl + '&token=' + cm.token + '" alt="..." class="img_class"/>';
					console.log(meter_array[last_index].data[j].PhotoUrl)
					graph_html += '</td>';
					graph_html += '<td class="other_td_name">';
					graph_html += meter_array[last_index].data[j].NODE_NAME + ' : ' + meter_array[last_index].data[j].COLL_VAL;
					graph_html += '</td>';
					if(j % 2 != 0) {
						graph_html += '</tr>';
					}
				}
				if(meter_array[last_index].data.length % 2 != 0) {
					graph_html += '</tr>';
				}

				graph_html += '</table>';
				graph_html += '</div>';
				graph_html += '</div>';
			}

			$("#dash_id").html("");
			$("#dash_id").html(graph_html);
			self.initMeterFun();
		} else {
			dialogMsg('无数据!', 0);
		}
	};

	//初始化各个类型仪表盘
	this.initMeterFun = function() {
		cm.ajax({
			url: "/Monitor/GetRealStatusMonitorList",
			data: {
				keyValue: producttoken
			},
			type: "Get",
			async: false,
			success: function(data) {
				console.log(data)
				//				debugger
				if(data && data.length > 0) {

					var data_array = data.reverse();
					for(var z = 0; z < data_array.length - 1; z++) {
						if(data_array[z].data && data_array[z].data.length > 0) {
							for(var p = 0; p < data_array[z].data.length; p++) {
								var $dom = 'grap_meter_' + z + '_' + p;
								var data_arr = data_array[z].data[p];
								self.inintMeterEntity($dom, data_arr.NODE_NAME, data_arr.COLL_VAL);
							}
						}
					}
				}
			}
		});
	};

	//仪表盘 star
	this.inintMeterEntity = function(dom, nameStr, val) {
		var chart = echarts.init(document.getElementById(dom));
		var option = {
			backgroundColor: '#1b1b1b',
			tooltip: {
				formatter: "{a} <br/>{c} {b}",
			},
			title: {
				text: nameStr,
				textStyle: {
					color: "#fff",
					fontSize: 13
				}
			},
			series: [{
				name: nameStr,
				type: 'gauge',
				radius: '100%',
				center: ['50%', '60%'], // 默认全局居中
				axisLine: { // 坐标轴线
					lineStyle: { // 属性lineStyle控制线条样式
						color: [
							[0.4, 'lime'],
							[0.6, '#1e90ff'],
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
					length: 15, // 属性length控制线长
					lineStyle: { // 属性lineStyle控制线条样式
						color: 'auto',
						shadowColor: '#fff', //默认透明
						shadowBlur: 10
					}
				},
				splitLine: { // 分隔线
					length: 25, // 属性length控制线长
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
					offsetCenter: ['-2%', '-30%'],
					textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						fontSize: 20,
						fontStyle: 'italic',
						color: '#fff',
						shadowColor: '#fff', //默认透明
						shadowBlur: 10,

					}
				},
				detail: {
					backgroundColor: 'rgba(30,144,255,0.8)',
					borderWidth: 1,
					borderColor: '#fff',
					shadowColor: '#fff', //默认透明
					shadowBlur: 5,
					offsetCenter: [0, '60%'], // x, y，单位px
					textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						color: '#fff',
						fontSize: 12
					}
				},
				data: [{
					//value: 10,
					//name: '℃'
				}]
			}, ]
		};
		option.series[0].max = Math.ceil(val) + 1;
		option.series[0].data[0].value = Number(val).toFixed(3);
		chart.setOption(option);
	};
	//仪表盘 end

	setInterval(function() {
		self.initMeterFun();
	}, 5000);

};

var model = new viewModel();