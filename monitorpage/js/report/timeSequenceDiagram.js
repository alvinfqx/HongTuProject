Loading(true, "正在拼了命为您处理.....");
var viewModel = function() {
	var self = this;
	var keyval = request("keyValue");
	//	var producttoken = request("protoken");
	var companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : '';
	var ws;
	//配置线程时间
	$(function() {

		$(".two").css({
			"height": $(window).height() - 345
		});
		$(".three").css({
			"height": $(window).height() - 20
		});

		//		self.grahInitHtml();
		connectSocketServer();
		self.select_c();
		//折线
		//		self.status_graph();
		self.Obtain();
	});

	this.reload = function() {
		location.reload();
	}

	this.select_c = function() {
		cm.ajax({ //获取设备编码
			url: "/Monitor/GetEqiupmentTreeList",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: companyId
			},
			async: false,
			success: function(data) {
				//				var res = data[0];
				console.log(data)
				var html = '';
				$.each(data, function(i, n) {
					html += '<option value="' + n.eq_type + '">' + n.eq_type + '</option>';

				});
				//				$("#select_c").html(html);
				$("#equipment").html(html);
				//				alert(vals)
				//				alert()
			},
			error: function(data) {

			}
		})
	}
	//设备表表切换设备号
	$("#equipment").change(function() {
		self.Obtain();
	});
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
		jsonData.keyValue = $("#equipment").val();
		var str = JSON.stringify(jsonData)
		//		alert(str);
		if(ws) {
			//			debugger
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

	//获取数据 
	this.Obtain = function(Keyword) {
		cm.ajax({ //历史告警统计（设备 近5个月）
			url: "/Monitor/GetHistoryDataReport",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: $("#equipment").val(),
				Keyword: Keyword || '',
				Start_time: $("#begindata").val() || '',
				End_time: $("#enddata").val() || ''
			},
			success: function(data) {

				if(data == '') {

				} else {
					self.getGrapData(data);
					
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
				}
				//				self.dateTime(data);

				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		})
	}

	//加载化折线图数据
	this.getGrapData = function(val_array) {
		console.log(val_array)
		//		var val_array = JSON.stringify(val_array)
		if(JSON.stringify(val_array) == "{}") {
			self.status_graph();
			$("#dropMachine").text('0');
			$("#standby").text('0');
			$("#function").text('0');
			$("#time").text('0');
			$("#operationRate").text('0%');
			$("#Rise_time").text('0');
			$("#End_time").text('0');
			var html = '<span class="status_class" style="background-color:red;">异常</span>';
			$("#status_id").html(html);
			dialogMsg('暂无数据！', 2);

		} else {
			var nam = [];
			var val = [];
			var data_array = JSON.parse(val_array.data);
			
		connectSocketServer();
			$.each(data_array, function(i, n) {
				nam.push(n.COLL_DATE);
				val.push(n.COLL_VAL);
			});

			self.status_graph(nam, val)
		}

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

					var val = params[0]["data"];
					//					console.log(val)
					//					debugger
					if(val === 0) {
						return '状态：掉线/停机<br />时间: ' + params[0].name; //时间从params里面取
					} else if(val === 1) {
						return '状态：待机<br />时间: ' + params[0].name;
					} else if(val === 2) {
						return '状态：运行<br />时间: ' + params[0].name;
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
				type: 'category',
				name: '运行时间图',

				axisLabel: {
					textStyle: {
						color: '#fff', //刻度标签字体颜色						
					},
					formatter: function(value, index) {
						if(value === 0) {
							return '掉线/停机';
						} else if(value === 1) {
							return '待机';
						} else if(value === 2) {
							return '运行';
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

};

var model = new viewModel();