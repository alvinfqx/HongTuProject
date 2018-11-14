Loading(true, "正在拼了命为您处理.....");
var viewModel = function() {

	var self = this;
	var keyValue = request("keyValue");
	var producttoken = request("protoken");
	var timeStr = $("#getTime").val();
	var now_day = cm.format.Date(cm.format.getData('day', 0), 'yyyy-MM-dd');

	$(function() {

		$(".div_left_two").css({
			"height": $(window).height() - 370
		});
		$(".div_right_one").css({
			"height": $(window).height() - 20
		});
		self.GetGrid();
		self.initLineGraph(timeStr);
		self.getTitle();
	});

	//equitment title
	this.getTitle = function() {
		cm.ajax({
			url: '/Monitor/GetEqiupmentInfo',
			data: {
				keyValue: producttoken
			},
			async: false,
			success: function(data) {

				$("#eq_name").text("");
				$("#eq_code").text("");
				if(data.length > 0) {
					var new_img_url = cm.domain + '/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=' + data[0].photourl + '&token=' + cm.token;
					$("#eq_name").text(data[0].eq_name);
					$("#eq_code").text(data[0].eq_type);
					$("#img_id").attr('src', new_img_url);
				}
			}
		});
	}

	//加载表格
	this.GetGrid = function() {
		var data_arr = [];
		cm.ajax({
			url: '/Monitor/GetMonitorRealTimeList',
			data: {
				keyvalue: producttoken
			},
			async: false,
			success: function(data) {
				console.log(data)
				data_arr = data
			}
		});
		var rows = data_arr;
		$("#table_detail").html("");
		var html = "";
		html += "<thead><tr><th>采集点名称</th><th>时间</th><th>采集点值</th></tr></thead>";
		html += "<tbody style='height:" + ($(window).height() - 395) + "px'>";
		for(var i = 0; i < rows.length; i++) {
			html += "<tr>";
			html += "<td>" + (rows[i].node_name ? rows[i].node_name : "") + "</td>";
			//			html += "<td>" + (rows[i].eq_address ? rows[i].eq_address : "") + "</td>";
			//			html += "<td>" + (rows[i].node_address ? rows[i].node_address : "") + "</td>";
			html += "<td>" + (rows[i].coll_date ? rows[i].coll_date : "") + "</td>";
			var num1 = 0;
			if(rows[i].coll_val <= 0) {
				num1 = Number(rows[i].coll_val);
				html += "<td>" + (num1) + "</td>";
			} else {
				html += "<td>" + (rows[i].coll_val ? rows[i].coll_val.toFixed(2) : "") + "</td>";
			}

			html += "</tr>";
		}
		html += "</tbody>"
		$("#table_detail").html(html);
	}

	//刷新
	this.reload = function() {
		location.reload();
	}

	//查询
	this.searchBtn = function() {

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
		Loading(true); //请求时数据没加载出来的时候出现加载提示
		setTimeout(function() {
			self.initLineGraph("", startTimeStr, endTimeStr);
		}, 500)

	};

	this.changeSelect = function(val) {

		var time_str = val;
		$("#historyStarTim").val("");
		$("#historyEndTim").val("");
		var startTime = $("#historyStarTim").val();
		var endTime = $("#historyEndTim").val();

		self.initLineGraph(time_str, startTime, endTime);
	};

	//统计图 star

	//获取历史数据
	this.getGrapData = function(value, timeStr, startTime, endTime) {

		var data_array = "";
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
				data_array = data;
			},
			error: function(data) {

			},
			complete: function() { //当请求完成之后调用这个函数，无论成功或失败。传入 XMLHttpRequest 对象，以及一个包含成功或错误代码的字符串。
				Loading(false); //数据加载成功的时候加载提示消失

			}
		});

		return data_array;
	};
	//初始化折线图
	this.init_line = function(idDom, timeArr, valArr, title_name) {
		//		debugger
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
				formatter: "{a} <br/> 时间：{b} <br/> 值：{c}"
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
					rotate: 45
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
	this.initMeter = function(domId, nameTitle, indexVal) {
		var meterChart = echarts.init(document.getElementById(domId));
		var option = {
			tooltip: {
				formatter: "{a} <br/>{c} {b}"
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
					offsetCenter: [0, '-25%'], // x, y，单位px
					textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
						fontWeight: 'bolder',
						fontSize: 16,
						fontStyle: 'italic',
						color: '#ff4a08',
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
					name: ''
				}]
			}]
		};
		option.series[0].max = Math.ceil(indexVal)+1;
		option.series[0].data[0].value = indexVal.toFixed(2);
		meterChart.setOption(option);
	};

	//仪表盘数据获取
	this.meterData = function() {
		cm.ajax({
			url: '/Monitor/GetMonitorRealTimeList',
			data: {
				keyvalue: producttoken
			},
			async: false,
			success: function(data) {
				for(var i = 0; i < data.length; i++) {
					var meter_id = "graphMeter_" + i;
					self.initMeter(meter_id, data[i].node_name, data[i].coll_val);
				}
			}
		});
	}

	//加载折线图数据
	this.initLineGraph = function(timeVal, startVal, endVal) {
		var getDataJson = self.getGrapData(producttoken, timeVal, startVal, endVal);
		var graph_html = "";
		var i_index = 0;
		$.each(getDataJson, function(i, val) {
			graph_html += '<tr>';
			graph_html += '<td style="font-size:15px;">';
			if(val && val.length > 0) {
				graph_html += val[0].NODE_NAME;
			}
			graph_html += '</td>';
			graph_html += '<td>';
			graph_html += '<div id="graphLine_' + i + '"  style="width: 550px;height:280px;"></div>'
			graph_html += '</td>';
			graph_html += '<td>';
			graph_html += '<div id="graphMeter_' + i_index + '" style="width: 220px;height:220px;"></div>';
			graph_html += '</td>';
			graph_html += '</tr>';
			i_index++;
		});
		$('#graph_show').html("");
		$('#graph_show').html(graph_html);
		$.each(getDataJson, function(j, n) {
			var time_array = [];
			var data_array = [];
			var name_title = '';
			var numl = 0;
			if(n && n.length > 0) {
				for(var i = 0; i < n.length; i++) {
					time_array[i] = (n[i].COLL_DATE).split(":")[0] + ':' + (n[i].COLL_DATE).split(":")[1];
					if(n[i].COLL_VAL <= 0) {
						//						debugger
						numl = Number(n[i].COLL_VAL);
						data_array[i] = 0;
						//						alert(data_array[i])
					} else {
						data_array[i] = n[i].COLL_VAL ? n[i].COLL_VAL : 0;
					}

					name_title = n[0].NODE_NAME;
				}
			}

			var id_name = "graphLine_" + j;
			self.init_line(id_name, time_array, data_array, name_title);
			self.meterData();
		});
	}
	//统计图 end
	setInterval(function() {
		self.GetGrid();
		self.meterData();
	}, 5000);

};

var model = new viewModel();