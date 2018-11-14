var viewModel = function() {
	var self = this;
	$(function() {
		self.MonthaccumulateData();
		//		self.InitMonthaccumulate();

		self.InitBusinessAccumulate();

		self.CompanyElectricityfeesData();
		//		self.CompanyElectricityfees();

		self.MonthElectricityfeesData();
		//		self.MonthElectricityfees();

		self.YearElectricityfeesData();
		//		self.YearElectricityfees();

		self.InitPage(); //初始化页面统计数据
	});
	this.InitPage = function() {
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetStatisticsNum",
			type: "POST",
			dataType: "json",
			//			data: {
			//				keyValue: ""
			//			},
			success: function(data) {
				var ReturnMoney = 0;
				var ST_Capacity = 0;
				var num = 0;
				if(data != null) {
					ReturnMoney = data.ReturnMoney;
					ST_Capacity = data.ST_Capacity;
					num = data.num;
				}
				$(".ReturnMoney").text(ReturnMoney);
				$(".ST_Capacity").text(ST_Capacity);
				$(".num").text(num);
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.MonthaccumulateData = function() {
		var CostarrList = [];
		var st_capacityarrList = [];
		var datearr = [];
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetMonthStatisticsSewageTreatList",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: ""
			},
			success: function(data) {
				if(data != null) {
					$.each(data, function(i, n) {
						datearr.push(n["y"] + "-" + n["m"]);
						CostarrList.push(n["cost"]);
						st_capacityarrList.push(n["st_capacity"]);
					});
					self.InitMonthaccumulate(CostarrList, st_capacityarrList, datearr);
				}
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.InitMonthaccumulate = function(CostarrList, st_capacityarrList, datearr) {
		var dom = document.getElementById("Monthaccumulate");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		app.title = '折柱混合';

		option = {
			//	backgroundColor: '#1d2948',
			color: ["#698bbc", "#cacaca"],
			title: {
				text: '2018年各月份累计污水处理量',
				left: 'center',
				textStyle: { //设置主标题风格
					//			color: '#fff', //设置主标题字体颜色
					fontStyle: '', //主标题文字风格
					fontSize: 16,
					fontWeight: '400'
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						//				color: '#fff'
					},
					label: {
						//				backgroundColor: '#000'
					}
				}
			},
			legend: {
				right: 'center', // 'center' | 'left' | {number},
				top: '25', // 'center' | 'bottom' | {number}
				textStyle: {
					//			color: '#fff'
				},
				data: ['污水处理量', '费用']
			},
			xAxis: [{
				type: 'category',
				//				data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				data: datearr,
				axisLine: {
					lineStyle: {
						//				color: '#fff'
					}
				},
				axisPointer: {
					type: 'shadow'
				}
			}],
			yAxis: [{
					type: 'value',
					name: '污水处理量(m3)',
					min: 0,
					max: function(value) {
						return value.max + 100;
					},
					//					interval: 20,
					axisLine: {
						lineStyle: {
							//					color: '#fff'
						}
					},
					axisLabel: {
						formatter: '{value}'
					}
				},
				{
					type: 'value',
					name: '费用(元)',
					min: 0,
					max: function(value) {
						return value.max + 100;
					},
					//					interval: 4,
					axisLine: {
						lineStyle: {
							//					color: '#fff'
						}
					},
					axisLabel: {
						formatter: '{value}'
					}
				}
			],
			series: [{
					name: '污水处理量',
					type: 'bar',
					barWidth: 18, //柱图宽度
					//					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 80.6, 62.2, 32.6, 20.0, 6.4, 3.3]
					data: st_capacityarrList
				},
				{
					name: '费用',
					type: 'line',
					yAxisIndex: 1,
					//					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 80.6, 82.2, 48.7, 18.8, 6.0, 2.3]
					data: CostarrList
				}
			]
		};
		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}

	}

	this.BusinessAccumulateData = function() {
		var CostarrList = [];
		var st_capacityarrList = [];
		var datearr = [];
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetLastMonthSewageTreatCostList",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: ""
			},
			success: function(data) {
				//				debugger;
				if(data != null) {
					$.each(data, function(i, n) {
						datearr.push(n["y"] + "-" + n["m"]);
						CostarrList.push(n["cost"]);
						st_capacityarrList.push(n["st_capacity"]);
					});
					self.InitMonthaccumulate(CostarrList, st_capacityarrList, datearr);
				}
				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		})
	}
	this.InitBusinessAccumulate = function() {
		var dom = document.getElementById("BusinessAccumulate");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		app.title = '折柱混合';

		option = {
			color: ["#698bbc", "#cacaca"],
			title: {
				text: '2018年按业务线累计污水处理量',
				left: 'center',
				textStyle: { //设置主标题风格
					//			color: '#fff', //设置主标题字体颜色
					fontStyle: '', //主标题文字风格
					fontSize: 16,
					fontWeight: '400',

				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					}
				}
			},
			legend: {
				right: 'center', // 'center' | 'left' | {number},
				top: '25', // 'center' | 'bottom' | {number}
				data: ['今年', '去年', '同比']
			},
			xAxis: [{
				type: 'category',
				data: ['华北地区', '华南地区', '山东', '陕西', '安徽'],
				axisPointer: {
					type: 'shadow'
				}
			}],
			yAxis: [{
					type: 'value',
					name: '吨',
					min: 0,
					max: 160,
					interval: 20,
					axisLabel: {
						formatter: '{value}'
					}
				},
				{
					type: 'value',
					name: '%',
					min: 0,
					max: 22,
					interval: 4,
					axisLabel: {
						formatter: '{value}'
					}
				}
			],
			series: [{
					name: '去年',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6]
				},
				{
					name: '今年',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7]
				},
				{
					name: '同比',
					type: 'line',
					yAxisIndex: 1,
					data: [2.0, 4.2, 3.3, 4.5, 6.3]
				}
			]
		};
		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}

	}

	this.MonthElectricityfeesData = function() {
		var NameList = [];
		var returnmoneyList = [];
		var tmst_list = [];
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetYearSewageTreatCostList",
			type: "POST",
			dataType: "json",
			//			data: {
			//				keyValue: ""
			//			},
			success: function(data) {
				//				debugger;
				if(data != null) {
					$.each(data, function(i, n) {
						NameList.push(n["fullname"]);
						tmst_list.push(n["lastmontharrears"]);
						if(parseFloat(n["lastmonthrecovery"]) < 0)
							n["lastmonthrecovery"] = 0;
						returnmoneyList.push(n["lastmonthrecovery"]);
					});
					self.InitMonthElectricityfees(NameList, returnmoneyList, tmst_list);
				}
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.InitMonthElectricityfees = function(NameList, returnmoneyList, tmst_list) {
		var dom = document.getElementById("MonthElectricityfees");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		app.title = '堆叠条形图';

		option = {
			title: {
				//				text: 'Y轴文字左对齐',
				left: 'center',
				textStyle: {
					color: '#0371f9',
					fontStyle: 'normal',
					fontWeight: 'normal',
					fontFamily: '微软雅黑',
					fontSize: 18
				}
			},
			color: ["#698bbc", "#cacaca"],
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				//orient: 'vertical',
				right: '0',
				data: ['本年往月应收费用', '本年往月欠费']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'value'
			},
			yAxis: {
				axisLabel: {
					interval: 0,
					//					margin: 95,
					textStyle: {
						//						align: 'center',
						//						baseline: 'middle'
					}
				},
				type: 'category',
				//				data: ['源美公司', '泰如公司', '信和公司', '协盈公司', '茂发公司', '长鑫公司', '优元公司']
				data: NameList
			},
			series: [{
					name: '本年往月应收费用',
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							show: true,
							position: 'insideLeft'
						}
					},
					//					data: [120, 202, 301, 234, 190, 230, 220]
					data: tmst_list
				},
				{
					name: '本年往月欠费',
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							show: true,
							position: 'insideRight',
							formatter: function(params) {
								if(params.value > 0) {
									return params.value;
								} else {
									return '';
								}
							}
						}
					},
					//					data: [120, 132, 101, 134, 90, 230, 210]
					data: returnmoneyList
				}
			]
		};;
		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}

	this.YearElectricityfeesData = function() {
		var NameList = [];
		var returnmoneyList = [];
		var tmst_list = [];
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetLastMonthSewageTreatCostList",
			type: "POST",
			dataType: "json",
			//			data: {
			//				keyValue: ""
			//			},
			success: function(data) {
				//				debugger;
				if(data != null) {
					$.each(data, function(i, n) {
						NameList.push(n["fullname"]);
						tmst_list.push(n["thismonthshouldcost"]);
						returnmoneyList.push(n["returnmoney"]);
					});
					self.InitYearElectricityfees(NameList, returnmoneyList, tmst_list);
				}
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.InitYearElectricityfees = function(NameList, returnmoneyList, tmst_list) {
		var dom = document.getElementById("YearElectricityfees");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		app.title = '堆叠条形图';

		option = {
			color: ["#698bbc", "#cacaca"],
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				//orient: 'vertical',
				right: '0',
				data: ['本月应收费用', '本月欠费']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				inverse: true
			},
			yAxis: {
				type: 'category',
				align: 'center',
				//				data: ['源美公司', '泰如公司', '信和公司', '协盈公司', '茂发公司', '长鑫公司', '优元公司'],
				data: NameList,
				axisLabel: {
					formatter: function() {
						return "";
					}
				}
			},
			series: [{
					name: '本月应收费用',
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							show: true,
							position: 'insideLeft'
						}
					},
					itemStyle: {
						normal: {
							//					color: 'rgba(237,125,49, 0.8)',
						}
					},
					//					data: [80, 102, 201, 134, 90, 130, 220]
					data: tmst_list
				},
				{
					name: '本月欠费',
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							show: true,
							position: 'insideRight',
							formatter: function(params) {
								if(params.value > 0) {
									return params.value;
								} else {
									return '';
								}
							}
						}
					},
					itemStyle: {
						normal: {
							//					color: 'rgba(157,163,223, 0.8)',
						}
					},
					//					data: [90, 132, 101, 94, 100, 130, 210]
					data: returnmoneyList
				}
			]
		};;
		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}

	this.CompanyElectricityfeesData = function() {
		var NameList = [];
		var returnmoneyList = [];
		var lmrecovery_list = [];
		cm.ajax({
			url: "/AfterSaleManage/aw_sewagetreatrefund/GetCostRecoveryList",
			type: "POST",
			dataType: "json",
			//			data: {
			//				keyValue: ""
			//			},
			success: function(data) {
				//				debugger;
				if(data != null) {
					$.each(data, function(i, n) {
						NameList.push(n["fullname"]);
						lmrecovery_list.push(n["lastmonthrecovery"]);
						returnmoneyList.push(n["returnmoney"]);
					});
					self.InitCompanyElectricityfees(NameList, returnmoneyList, lmrecovery_list);
				}
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.InitCompanyElectricityfees = function(NameList, returnmoneyList, lmrecovery_list) {
		var dom = document.getElementById("CompanyElectricityfees");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		option = {
				title: {
					text: ''
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['本月回收率', '本年往月回收率'],
					shadowColor: 'rgba(0, 0, 0, 0.5)',
					shadowBlur: 10
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
					//				data: ['源美公司', '泰如公司', '信和公司', '协盈公司', '茂发公司', '长鑫公司', '优元公司'],
					data: NameList,
					type: 'category',
					boundaryGap: false,
					splitLine: {
						show: true
					},
					axisLabel: {
						interval: 0, //标签设置为全部显示
						formatter: function(params) {
							//粘贴以下function内未注释的代码
							var newParamsName = ""; // 最终拼接成的字符串
							var paramsNameNumber = params.length; // 实际标签的个数
							var provideNumber = 4; // 每行能显示的字的个数
							var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
							/**
							 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
							 */
							// 条件等同于rowNumber>1
							if(paramsNameNumber > provideNumber) {
								/** 循环每一行,p表示行 */
								for(var p = 0; p < rowNumber; p++) {
									var tempStr = ""; // 表示每一次截取的字符串
									var start = p * provideNumber; // 开始截取的位置
									var end = start + provideNumber; // 结束截取的位置
									// 此处特殊处理最后一行的索引值
									if(p == rowNumber - 1) {
										// 最后一次不换行
										tempStr = params.substring(start, paramsNameNumber);
									} else {
										// 每一次拼接字符串并换行
										tempStr = params.substring(start, end) + "\n";
									}
									newParamsName += tempStr; // 最终拼成的字符串
								}

							} else {
								// 将旧标签的值赋给新标签
								newParamsName = params;
							}
							//将最终的字符串返回
							return newParamsName
						}
					}
			},
			yAxis: {
				type: 'value',
				name: '回收率（%）',
				min: 0,
				max: 100,
				interval: 20,
				//axisLabel: {
				//    formatter: '{value}'
				//}
				splitLine: {
					show: true
				}
			},
			series: [{
					name: '本月回收率',
					type: 'line',
					symbol: 'circle', //设置拐点格式样式 如:实心圆，空心圆或不显示拐点等
					itemStyle: {
						normal: {}
					},
					symbolSize: 10, //设置各个拐点的大小
					//					data: [30, 32, 10, 34, 60, 30, 21]
					data: returnmoneyList
				},
				{
					name: '本年往月回收率',
					type: 'line',
					symbol: 'circle', //设置拐点格式样式 如:实心圆，空心圆或不显示拐点等
					itemStyle: {
						normal: {}
					},
					symbolSize: 10, //设置各个拐点的大小
					//					data: [30, 52, 19, 33, 70, 30, 31]
					data: lmrecovery_list
				}
			]
	};;
	if(option && typeof option === "object") {
		myChart.setOption(option, true);
	}
};
}

var model = new viewModel();