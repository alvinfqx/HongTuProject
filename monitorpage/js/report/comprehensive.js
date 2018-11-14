var viewModel = function() {
	var self = this;
	$(function() {
		self.comprehensiveCurveDiagram();
	});

	this.comprehensiveCurveDiagram = function() { //综合曲线图初始化
		var myChart = echarts.init(document.getElementById('status_graph'));
		var option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#fff'
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
				},
				iconStyle:{
					color:"#fff"
				}
			},
			legend: {
				data: ['蒸发量', '降水量', '平均温度'],
				textStyle: {
						color: '#fff', //刻度标签字体颜色						
					},
			},
			xAxis: [{
				type: 'category',
				data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				axisPointer: {
					type: 'shadow'
				},
				axisLabel: { //坐标轴刻度标签
					show: true,
					textStyle: {
						color: '#fff' //刻度标签字体颜色						
					}
				}
			}],
			yAxis: [{
					type: 'value',
					name: '水量',
					nameTextStyle:{
						color:"#fff"
					},
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} ml',
						textStyle: {
						color: '#fff', //刻度标签字体颜色						
					}
					}
				},
				{
					type: 'value',
					name: '温度',
					nameTextStyle:{
						color:"#fff"
					},
					min: 0,
					max: 25,
					interval: 5,
					axisLabel: {
						formatter: '{value} °C',
						textStyle: {
						color: '#fff', //刻度标签字体颜色						
					},
					}
				}
			],
			series: [{
					name: '降水量',
					type: 'line',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				},
				{
					name: '平均温度',
					type: 'line',
					yAxisIndex: 1,
					data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
				}
			]
		};
		// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
	}
	
}

var model = new viewModel();