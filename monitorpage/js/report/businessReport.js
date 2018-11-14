var companyId = sessionStorage.getItem("companyId") ? sessionStorage.getItem("companyId") : '';
//alert(companyId);
cm.ajax({//历史告警统计（设备 近5个月）
	url: "/AfterSaleManage/dm_alarm/GetAlarmInfoToCountPdt",
	type: "POST",
	dataType: "json",
	data: {
		keyValue: companyId
	},
	success: function(data) {
		console.log(data)
		var myChart = echarts.init(document.getElementById('main'));
		var options;
		var nam = [];
		var val = [];
		$.each(data, function(i, n) {
			nam.push(n.name);
			val.push(n.value);
		});
		 options = {
				color: ['#2c60d6'],
				tooltip: {},
				legend: {
					data: ['历史警告']
				},
				xAxis: {
					axisLine: {
						lineStyle: {
							color: '#fff'
						}
					},
					data: nam
				},
				yAxis: {
					axisLine: {
						lineStyle: {
							color: '#fff'
						}
					},
				},
				series: [{
					barWidth: 50,
					axisLine: {
						lineStyle: {
							color: '#fff'
						}
					},
					//		name: '历史警告',
					type: 'bar',
					data: val
				}]
			};
		// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(options);

	},
	error: function(data) {
		console.log(data)
	}
})


cm.ajax({//门禁、烟禁、水禁、红外告警次数分布
	url: "/dm_alarm/GetAlarmInfoToCountAlarmType",
	type: "POST",
	dataType: "json",
	data: {
		keyValue: companyId
	},
	success: function(data) {
	var myChart_a = echarts.init(document.getElementById('main_1'));
	var options_a;
//	var nam = [];
	var val = [];
	
	$.each(data, function(i, n) {
		var json_data = {};
			json_data.value = n.value;
			json_data.name = n.name;
			val.push(json_data);
		});
	options_a = {
	    title : {
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
//	        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
	    },
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            center :['50%', '50%'],
	            radius: ['30%', '50%'],
	            data:val,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	myChart_a.setOption(options_a);
	},
	error: function(data) {
		console.log(data)
	}
	})




cm.ajax({//历史告警统计（月份 近5个月）
	url: "/AfterSaleManage/dm_alarm/GetAlarmInfoToCountMonth",
	type: "POST",
	dataType: "json",
	data: {
		keyValue: companyId
	},
	success: function(data) {
		console.log(data)
	var myChart_b = echarts.init(document.getElementById('main_2'));
	var options_b;
	var nam = [];
	var val = [];
	$.each(data, function(i, n) {
			nam.push(n.name);
			val.push(n.value);
		});
	options_b = {
		tooltip: {
				trigger: 'axis',
				axisPointer: {
					animation: false
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
			data: nam
		},
		yAxis: {
			axisLine: {
				lineStyle: {
					color: '#fff'
				}
			},
			type: 'value'
		},
		series: [{
			type: 'line',
			areaStyle: {},
			data: val
		}]
	};
	myChart_b.setOption(options_b);
	},
	error: function(data) {
		console.log(data)
	}
	})



cm.ajax({//历史告警统计（按天6月份）
	url: "/AfterSaleManage/dm_alarm/GetAlarmInfoToCountDay",
	type: "POST",
	dataType: "json",
	data: {
		keyValue: companyId
	},
	success: function(data) {
	var myChartc_d = echarts.init(document.getElementById('main_3'));
	var options_d;
	var nam = [];
	var val = [];
	$.each(data, function(i, n) {
			nam.push(n.name);
			val.push(n.value);
		});
	options_d = {
		tooltip: {
			trigger: 'axis',
			formatter: "{c}",
			position: function(p) { //其中p为当前鼠标的位置
				return [p[0], p[1] - 10];
			}
		},
		//	  backgroundColor: ['#1b1b1b'],//背景色
		color: ['#EEEE00'],
		xAxis: {
			type: 'category',
			axisLine: {
				lineStyle: {
					color: '#fff'
				}
			},
			data:nam,
			axisTick: {
				alignWithLabel: true
			}
		},
		yAxis: {
			axisLine: {
				lineStyle: {
					color: '#fff'
				}
			},
			type: 'value'
		},
		series: [{
			barWidth: 10,
			data: val,
			type: 'bar'
		}]
	};
	
	myChartc_d.setOption(options_d);
	},
	error: function(data) {
		console.log(data)
	}
})
