var viewModel = function() {
	var companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : '';
	//	alert(companyId)
	var self = this;
	var vals = '';
	$(function() {
		self.select_c();
		self.Gettotaldata();
		self.GetTemperature();
		self.getChartsData();
		self.getTemperatureData();
	});
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
				$("#select_c").html(html);
				$("#equipment").html(html);
				//				alert(vals)
				//				alert()
			},
			error: function(data) {

			}
		})
	}

	this.Gettotaldata = function() { //压力获取采集点
		cm.ajax({
			url: "/Monitor/GetNode_TypeList",
			type: "POST",
			dataType: "json",
			async: false,
			data: {
				keyValue: $("#select_c").val(),
				Node_type: '压力'
			},
			success: function(data2) {
				console.log(data2)
				var html = ''
				$.each(data2, function(i, n) {
					html += '<option value="' + n.node_name + '">' + n.node_name + '</option>'
				})
				$('#receiver').html('');
				$('#receiver').append(html);
				$("#receiver").select2();

			},
			error: function(data2) {
				console.log(data2)
			}
		});

	}
	//压力表切换设备号
	$("#select_c").change(function() {
		self.Gettotaldata();
		self.getChartsData();
	});

	this.GetTemperature = function() { //温度获取采集点
		cm.ajax({
			url: "/Monitor/GetNode_TypeList",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: $("#equipment").val(),
				Node_type: '温度'
			},
			success: function(data2) {
				console.log(data2)
				var html = ''
				$.each(data2, function(i, n) {
					html += '<option value="' + n.node_name + '">' + n.node_name + '</option>'
				})

				$('#receiver_a').html('');
				$('#receiver_a').append(html);
				$("#receiver_a").select2();

			},
			error: function(data2) {
				console.log(data2)
			}
		});

	}

	//温度获取数据 
	this.getTemperatureData = function(Keyword) {

		var receiver = $('#receiver_a').val();
		var receiver_array = '';
		if(!!receiver) {

			receiver_array = receiver.join(",")

		}

		console.log(receiver_array)

		cm.ajax({ //历史告警统计（设备 近5个月）
			url: "/Monitor/GetTemperatureReport",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: $("#equipment").val(),
				Type_name: '温度',
				Time_slot: Keyword || "",
				Start_time: $("#begindata_a").val() || '',
				End_time: $("#enddata_a").val() || '',
				Node_name: receiver_array
			},
			success: function(data) {

				self.analyticChart("pressure-temperature", data)
			},
			error: function(data) {
				console.log(data)
			}
		})
	}

	//温度表切换设备号
	$("#equipment").change(function() {
		self.GetTemperature();
		self.getTemperatureData();
	});

	//压力获取数据 
	this.getChartsData = function(Keyword) {

		var receiver = $('#receiver').val();
		var receiver_array = '';
		if(!!receiver) {

			receiver_array = receiver.join(",")

		}

		console.log(receiver_array)

		cm.ajax({ //历史告警统计（设备 近5个月）
			url: "/Monitor/GetTemperatureReport",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: $("#select_c").val(),
				Type_name: '压力',
				Time_slot: Keyword || "",
				Start_time: $("#begindata").val() || '',
				End_time: $("#enddata").val() || '',
				Node_name: receiver_array
			},
			success: function(data) {

				self.analyticChart("pressure-chart", data)
			},
			error: function(data) {
				console.log(data)
			}
		})
	}

	//加载压力折线图数据
	this.analyticChart = function(chart_name, analytic_array) {

		//时间轴数组
		var time_array = [];
		//Y轴数组
		var series_array = [];

		//昵称数组
		var legend_name = [];
		$.each(analytic_array, function(i, n) {
			if(n["data"]) {
				var series_item = {
					name: '',
					type: 'line',
					stack: '总量',
					data: []
				};
				series_item["name"] = n["Node_name"];
				legend_name.push(n["Node_name"]);
				n["data"] = JSON.parse(n["data"]);

				$.each(n["data"], function(j, m) {
					//取第一轮数据的时间作为时间轴
					if(i == 0) {
						time_array.push(m["coll_date"]);
					}
					series_item["data"].push(m["coll_val"]);
				});
				series_array.push(series_item);
			}
		});

		console.log(series_array)
		self.status_graph(chart_name, time_array, series_array, legend_name);

	}

	//图表初始化
	this.status_graph = function(chart_name, time_array, series_array, legend_name) {
		var myChart = echarts.init(document.getElementById(chart_name));
		option = {
			//	title: {
			//		text: '压力曲线图',
			//		textStyle: {
			//			//文字颜色
			//			color: '#ccc'
			//		},
			//
			//	},
			 color:["#f50c0c", "#f5840c", "#f5e40c", "#9af50c", "#ff0030", "#f50c96", "#0cf5d6", "#b17000"],
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				borderRadius: [10, 10, 10, 10],
				itemWidth: 22, //图例的宽度
				itemHeight: 22, //图例的高度
				textStyle: {
					color: '#fff'
				},
				data: legend_name
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {
						icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAYAAAAj6qa3AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAA6tJREFUaN7tmW1oU1ccxp+T5h6k2C8yJ9MloWAbNlqFtZP4MjEwVIxNQ6yijA2RYRW0lApbN7BjFUSE2tEW0boNJo6FmK4WHJRabEenZbT7IO2Wl2mr8W0yGaWJTXPT5r8P5URpKG2T9J7B8nw53HPOved5ftxzbvgH+J+Lab2g933DKuVOURHKdQfIk5eXGOiI/8AqQqG3uh8+i60fHpYNZsnkrzSc51X9/T6f0cg5kWhFv9Z+dLKByFYWgGwDspUFINuAbGUByDYgW1kAsg3IVhZAug/4veJtN8C57wtjp+Jvbw8UG1Ypd/bvz7RR71GThW91On1FhnvKtevXR8lEwLJl0gCI4Pq88EdKZ1sbDuAwK3Y44iXsENtx5UqmQIjgOk/8czxxueBhVrbPZlOtVKOc6ehIF0TKAHK+Df/E66ur6VO8zuy7dycGavE9/snJob9wie25fFkESDc49bFjCCqKGKcLaGN127dHQ3SQ11dVaQ7AnBf8Tq1raIANZ7HG5Zo9LgyzCFkRcLsX+kbMFzyh42Snu+3tYf/KIbWusTHVHGnXAwYHSt4BFGW5+e9i5VePB0/Qw96z25MmnsEHWDE9zUYoSP0jI9TK+pi5oCBhxEIH6X4gAAWlbGt+/pzBY3BRU2dnzkU+GDvicBS03K0ColFpAIRmnwlJW0MsGIARnIgKEYTK2Mt+enOmnz16tT8xfgR7qL6ri/ewc7Ha8vJ89oABk5Pp+s54RUgcSuKQEns1aeI1bMHyeDxx7cAvCOuStuRSBRfK+O8AYTC3LI5YrcOBUfqRPr55M2miCDxHcHyFzWju65ssiQ7Hap3OTAdPAuBtXj3OuwsL/SsMY8rU1auz2z8CJtI3WSwLfbDhxKNGIBIJr5z6LXa+rAyv0Wn6sKdn3hsn8Rxf3ro1/TwypVbu2rW+4dkN4MWLha4rfM6VQ+RMutHbbKrWn9y4cXatLtF6jQau7N2bKunBwTcuArm5/gqjm7t7e5Nqgu8auvknt2/7vjYfAl4pli5SwudcOUROMV+f6kKLVWnp00pgYuLPY2ub1H12+/Rnais/3NXFIrQNPkWJfsMK1bM227p1/iAQCmnlSzMAQjOfrfHxUTKR2rpzpziHzexBEBgb09qP5gCEZg417QOnDmADeum4xeLzGrfxZtm25/eJAVhZSyYBDMDKWmpqADDt/09ahBYYXChbD5BtQLYSWyD+88TjqVNDQzrkOvUnN22SbWypJHLK9vGf0b+3QdEady+4rAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wOC0yNFQxNTo1NjowMCswODowMPNLHoUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDgtMjRUMTU6NTY6MDArMDg6MDCCFqY5AAAAVHRFWHRzdmc6YmFzZS11cmkAZmlsZTovLy9ob21lL2FkbWluL2ljb24tZm9udC90bXAvaWNvbl9rZnh6MWh1cWwzLyVFNCVCOCU4QiVFOCVCRCVCRC5zdmcyguCTAAAAAElFTkSuQmCC'
					}
				}
			},
			xAxis: {
				axisLine: {
					lineStyle: {
						color: '#fff'
					}
				},
				type: 'category',
				boundaryGap: false,
				data: time_array
			},
			yAxis: {
				axisLine: {
					lineStyle: {
						color: '#fff'
					}
				},
				type: 'value'
			},
			series: series_array
		};
		// 使用刚指定的配置项和数据显示图表。
		//这里设置为true 防止数据叠加
		myChart.setOption(option, true);
	}
};

var model = new viewModel();