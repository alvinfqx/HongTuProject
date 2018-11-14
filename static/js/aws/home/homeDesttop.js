"use strict";
var viewModel = function() {
	var self = this;
	var keyword_s = '本月';
	$(".dashboard-stats-item").on("click", function() {
		var item_href = $(this).attr("href");
		if(item_href.indexOf('&') > 0) {
			var h_len = item_href.length;
			var index = item_href.indexOf('&');
			var word = item_href.substring(index + 1, h_len);
			item_href = item_href.replace(word, 'keyword=' + keyword_s);
		} else {
			item_href += '&keyword=' + keyword_s;
		}
		$(this).attr("href", item_href);
		top.$.learuntab.addTab.call($(this));

	})
	this.GetfromJson = function(Keyword) { //实时工单情况
		var menut = {
			"现场实施": 0,
			"已回访": 0,
			"客户回访": 0,
			"受理客户需求": 0,
			"制定方案": 0,
			"关闭": 0,
			"其他": 0
		}
		cm.ajax({
			type: "post",
			url: "/Monitor/GetWorkStatusTypeStatisticsInfo",
			data: {
				Keyword: Keyword || "",
				Status_name: ''
			},
			success: function(data) {
				$.each(data, function(i, n) {
					menut[n["workstatus"]] = n["total"]
				})

				$("#demand").html((menut["受理客户需求"] || "0") + "<span>条</span>")
				$("#Single").html((menut["已回访"] || "0") + "<span>条</span>")
				$("#Customized").html((menut["制定方案"] || "0") + "<span>条</span>")
				$("#scene").html((menut["现场实施"] || "0") + "<span>条</span>")
				$("#Customer").html((menut["客户回访"] || "0") + "<span>条</span>")
				$("#Close").html((menut["关闭"] || "0") + "<span>条</span>")
				$("#suspend").html((menut["其它"] || "0") + "<span>条</span>")
				console.log(data);
				//$("#form1").SetWebControls(data);
			}
		});
	}

	this.faultType = function(Keyword) { //获取故障类型量分析
		cm.ajax({
			url: "/Monitor/GetServiceTypeStatistics",
			type: "POST",
			dataType: "json",
			data: {
				Keyword: Keyword || ""
			},
			success: function(data) {
				if(data != null) {
					self.analyticChart(data.data);
					var End_time = data.End_time;
					var Start_time = data.Start_time;
					$("#Start_time").text(Start_time);
					$("#End_time").text(End_time);
				} else {
					self.analyticChart('[]');
				}

				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		})
	}
	this.analyticChart = function(datas) { //加载故障类型量分析
		datas = JSON.parse(datas)
		var time_list = [];
		var series_list = [];
		$.each(datas, function(i, n) {
			time_list.push((n["servicetype"]) || "")
			series_list.push((n["num"]) || 0)
		})

		self.initBarChart(time_list, series_list)
	}
	this.initBarChart = function(time_array, series_array) {
		var myChart = echarts.init(document.getElementById('Canvas3')); //工单进度执行
		var option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					}
				}
			},
			color: ['#29baf0', '#94e385', '#f2b863', '#f0715e', '#53d9d0', '#8b82df'],
			toolbox: {
				feature: {
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			xAxis: [{
				type: 'category',
				data: time_array,
				axisLabel: {
					interval: 0,
					rotate: 30
				},
				axisPointer: {

					type: 'shadow'
				}
			}],
			yAxis: [{
				type: 'value',
				//				name: '水量',
				min: 0,
				max: function(value) {
						return value.max + 10;
					},
				interval:6,
				axisLabel: {
					formatter: '{value}'
				}
			}],
			series: [{
				type: 'bar',
				data: series_array
			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	this.getWorkListStatistics = function(Keyword) { //获取工单统计折线图报表
		cm.ajax({
			url: "/Monitor/GetWorkStatusStatistics",
			type: "POST",
			dataType: "json",
			data: {
				Keyword: Keyword || ""
			},
			success: function(data) {
				var y_analysis = [];
				var m_analysis = [];
				var total_analysis = [];
				var num_analysis = [];
				$.each(data, function(i, n) {
					y_analysis.push((n["y"]) || 0)
					m_analysis.push((n["m"]) || 0)
					total_analysis.push((n["total"]) || 0)
					num_analysis.push((n["num"]) || 0)
				})
				self.listStatistics(y_analysis, m_analysis, total_analysis, num_analysis);
			},
			error: function(data) {
				console.log(data[0].y)
			}
		})
	}
	this.getChartsMonth = function(val_Time) { //日期点击
		self.getWorkListStatistics(val_Time);
	}
	this.listStatistics = function(y, m, total, num) { //初始化折线图
		var myChart = echarts.init(document.getElementById('Canvas6')); //工单进度执行
		var option = {
			title: {
				//				text: '折线图堆叠'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['工单总数', '已完成工单数']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: m,
			},
			yAxis: {
				type: 'value'
			},
			series: [{
					name: '工单总数',
					//				 	stack: '总量',
					type: 'line',
					data: total

				},
				{
					name: '已完成工单数',
					//					stack: '总量',
					type: 'line',
					data: num
				},
			]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	this.getInformation = function(Keyword) { //获取信息分类
		cm.ajax({
			url: "/Monitor/GetproductTypeStatistics",
			type: "POST",
			dataType: "json",
			data: {
				Keyword: Keyword || ""
			},
			success: function(data) {
				if(data != null) {
					self.loadInformation(data.data);
				} else {
					self.loadInformation('[]');
				}

				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	this.loadInformation = function(load_data) { //加载信息分类
		load_data = JSON.parse(load_data)
		console.log(load_data);
		var load = [];
		var load_val = [];
		$.each(load_data, function(i, n) {
			//			load_name.push((n["producttype"]) || "")
			load_val.push((n["producttype"]) || 0)
			load.push({
				value: ((n["total"]) || 0),
				name: ((n["producttype"]) || "")
			})
		});
		self.information('Canvas1', load, load_val);

	}

	this.getClassification = function(Keyword) { //获取服务信息分类
		cm.ajax({
			url: "/Monitor/GetServiceTypeProportionStatistics",
			type: "POST",
			dataType: "json",
			data: {
				Keyword: Keyword || ''
			},
			success: function(data) {
				if(data != null) {
					self.classification(data.data);
				} else {
					self.classification('[]');
				}

				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	this.classification = function(load_data) { //加载服务信息分类
		load_data = JSON.parse(load_data)
		console.log(load_data);
		var load = [];
		var load_val = [];
		$.each(load_data, function(i, n) {
			//			load_name.push((n["producttype"]) || "")
			load_val.push((n["servicetype"]) || 0)
			load.push({
				value: ((n["total"]) || 0),
				name: ((n["servicetype"]) || "")
			})
		});
		self.information('Canvas4', load, load_val);

	}

	this.getImplement = function(Keyword) { //获取服务进度执行
		cm.ajax({
			url: "/Monitor/GetserviceModeProportionStatistics",
			type: "POST",
			dataType: "json",
			data: {
				Keyword: Keyword || ''
			},
			success: function(data) {
				if(data == null) {
					self.implement('[]');

				} else {
					self.implement(data.data);
				}

				console.log(data);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	this.implement = function(load_data) { //加载服务进度执行
		load_data = JSON.parse(load_data)
		console.log(load_data);
		var load = [];
		var load_val = [];
		$.each(load_data, function(i, n) {
			//			load_name.push((n["producttype"]) || "")
			load_val.push((n["servicemode"]) || 0)
			load.push({
				value: ((n["total"]) || 0),
				name: ((n["servicemode"]) || "")
			})
		});
		self.information('Canvas2', load, load_val);

	}

	this.getChartsData = function(keyword) { // 点击历史数据统计时间段
		//		alert(keyword);
		keyword_s = keyword
		//		alert(keyword_s)
		self.getImplement(keyword);
		self.getClassification(keyword);
		self.getInformation(keyword);
		self.GetfromJson(keyword);
		self.faultType(keyword);
	}

	this.information = function(chart_name, producttype, load_) { //初始化信息分类
		var myChart = echarts.init(document.getElementById(chart_name)); //信息分类
		var option = {
			title: {
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			color: ['#f2b863', '#f0715e', '#29baf0', '#94e385', '#53d9d0', '#8b82df', '#f089e0'],
			legend: {
				orient: 'vertical',
				left: 'left',
				//				 top: 1,
				data: load_
			},
			series: [{
				name: '分类',
				type: 'pie',
				radius: '55%',
				center: ['60%', '48%'],
				label: {
					normal: {
						formatter: '{d}%'
					}
				},
				data: producttype,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	$(function() {
		if($('#areascontent').height() > $(window).height() - 20) {
			$('#areascontent').css("margin-right", "0px");
		}
		$('#areascontent').height($(window).height() - 22);
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$('#areascontent').height($(window).height() - 22);
			}, 200);
		});
		self.getWorkListStatistics();
		self.faultType();
		self.getInformation();
		self.getClassification();
		self.getImplement();
		setTimeout(function() { //实时刷新隔两分钟一次
			//获取数据方法
			model.GetfromJson();
			self.getWorkListStatistics();
			self.faultType();
			self.getInformation();
			self.getClassification();
			self.getImplement();
		}, 12000);

		model.GetfromJson();

	});

};
var model = new viewModel();