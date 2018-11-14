var viewModel = function() {
	var self = this;
	$(function() {
		self.mapInitData('');
		self.Initpage();
		self.statisticalInitData();
		self.monthBrokenlineInitData();
		self.areaBasicInitData('本年');
		self.pirTjInitData();
		self.InitAlarmTypeData();
		//		self.ProvinceMap('上海');
		//		mapInit();
		main();
	});

	$(document).keydown(function(event) {
		console.log(event.keyCode);
		if(event.keyCode == 27) {
			data_list = qj_data;
			$("#charmap").css({
				"display": "block"
			});
			$("#Province_chart").css({
				"display": "none"
			});
			$("#btn_back").css({
				"display": "none"
			});
			//			console.log(data_list);
			self.mapInit(data_list);
		}
		if(event.keyCode == 13) {
			$("#charmap").css({
				"display": "none"
			});
			$("#Province_chart").css({
				"display": "block"
			});
			$("#btn_back").css({
				"display": "block"
			});
			self.mapInitData(city);
		}
	});
	$("#btn_back").click(function() {
		data_list = qj_data;		
		self.mapInit(data_list);
		$("#charmap").css({
			"display": "block"
		});
		$("#Province_chart").css({
			"display": "none"
		});
		$("#btn_back").css({
			"display": "none"
		});
	});
	this.Initpage = function() {
		cm.ajax({
			url: "/Monitor/GetEqiupNumStatistics",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: ""
			},
			success: function(data) {
				if(data != null) {
					var eq_RunNum = data.eq_RunNum;
					var eq_faultNum = data.eq_faultNum;
					var eq_num = data.eq_num;
					$(".RunNum").text('');
					$(".RunNum").text(eq_RunNum);
					$(".num").text('');
					$(".num").text(eq_num);
					$(".faultNum").text('');
					$(".faultNum").text(eq_faultNum);
				}
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	var geoCoordMap = {
		"海门": [121.15, 31.89],
		"鄂尔多斯": [109.781327, 39.608266],
		"招远": [120.38, 37.35],
		"舟山": [122.207216, 29.985295],
		"齐齐哈尔": [123.97, 47.33],
		"盐城": [120.13, 33.38],
		"赤峰": [118.87, 42.28],
		"青岛": [120.33, 36.07],
		"乳山": [121.52, 36.89],
		"金昌": [102.188043, 38.520089],
		"泉州": [118.58, 24.93],
		"莱西": [120.53, 36.86],
		"日照": [119.46, 35.42],
		"胶南": [119.97, 35.88],
		"南通": [121.05, 32.08],
		"拉萨": [91.11, 29.97],
		"云浮": [112.02, 22.93],
		"梅州": [116.1, 24.55],
		"文登": [122.05, 37.2],
		"上海": [121.48, 31.22],
		"攀枝花": [101.718637, 26.582347],
		"威海": [122.1, 37.5],
		"承德": [117.93, 40.97],
		"厦门": [118.1, 24.46],
		"汕尾": [115.375279, 22.786211],
		"潮州": [116.63, 23.68],
		"丹东": [124.37, 40.13],
		"太仓": [121.1, 31.45],
		"曲靖": [103.79, 25.51],
		"烟台": [121.39, 37.52],
		"福州": [119.3, 26.08],
		"瓦房店": [121.979603, 39.627114],
		"即墨": [120.45, 36.38],
		"抚顺": [123.97, 41.97],
		"玉溪": [102.52, 24.35],
		"张家口": [114.87, 40.82],
		"阳泉": [113.57, 37.85],
		"莱州": [119.942327, 37.177017],
		"湖州": [120.1, 30.86],
		"汕头": [116.69, 23.39],
		"昆山": [120.95, 31.39],
		"宁波": [121.56, 29.86],
		"湛江": [110.359377, 21.270708],
		"揭阳": [116.35, 23.55],
		"荣成": [122.41, 37.16],
		"连云港": [119.16, 34.59],
		"葫芦岛": [120.836932, 40.711052],
		"常熟": [120.74, 31.64],
		"东莞": [113.75, 23.04],
		"河源": [114.68, 23.73],
		"淮安": [119.15, 33.5],
		"泰州": [119.9, 32.49],
		"南宁": [108.33, 22.84],
		"营口": [122.18, 40.65],
		"惠州": [114.4, 23.09],
		"江阴": [120.26, 31.91],
		"蓬莱": [120.75, 37.8],
		"韶关": [113.62, 24.84],
		"嘉峪关": [98.289152, 39.77313],
		"广州": [113.23, 23.16],
		"延安": [109.47, 36.6],
		"太原": [112.53, 37.87],
		"清远": [113.01, 23.7],
		"中山": [113.38, 22.52],
		"昆明": [102.73, 25.04],
		"寿光": [118.73, 36.86],
		"盘锦": [122.070714, 41.119997],
		"长治": [113.08, 36.18],
		"深圳": [114.07, 22.62],
		"珠海": [113.52, 22.3],
		"宿迁": [118.3, 33.96],
		"咸阳": [108.72, 34.36],
		"铜川": [109.11, 35.09],
		"平度": [119.97, 36.77],
		"佛山": [113.11, 23.05],
		"海口": [110.35, 20.02],
		"江门": [113.06, 22.61],
		"章丘": [117.53, 36.72],
		"肇庆": [112.44, 23.05],
		"大连": [121.62, 38.92],
		"临汾": [111.5, 36.08],
		"吴江": [120.63, 31.16],
		"石嘴山": [106.39, 39.04],
		"沈阳": [123.38, 41.8],
		"苏州": [120.62, 31.32],
		"茂名": [110.88, 21.68],
		"嘉兴": [120.76, 30.77],
		"长春": [125.35, 43.88],
		"胶州": [120.03336, 36.264622],
		"银川": [106.27, 38.47],
		"张家港": [120.555821, 31.875428],
		"三门峡": [111.19, 34.76],
		"锦州": [121.15, 41.13],
		"南昌": [115.89, 28.68],
		"柳州": [109.4, 24.33],
		"三亚": [109.511909, 18.252847],
		"自贡": [104.778442, 29.33903],
		"吉林": [126.57, 43.87],
		"阳江": [111.95, 21.85],
		"泸州": [105.39, 28.91],
		"西宁": [101.74, 36.56],
		"宜宾": [104.56, 29.77],
		"呼和浩特": [111.65, 40.82],
		"成都": [104.06, 30.67],
		"大同": [113.3, 40.12],
		"镇江": [119.44, 32.2],
		"桂林": [110.28, 25.29],
		"张家界": [110.479191, 29.117096],
		"宜兴": [119.82, 31.36],
		"北海": [109.12, 21.49],
		"西安": [108.95, 34.27],
		"金坛": [119.56, 31.74],
		"东营": [118.49, 37.46],
		"牡丹江": [129.58, 44.6],
		"遵义": [106.9, 27.7],
		"绍兴": [120.58, 30.01],
		"扬州": [119.42, 32.39],
		"常州": [119.95, 31.79],
		"潍坊": [119.1, 36.62],
		"重庆": [106.54, 29.59],
		"台州": [121.420757, 28.656386],
		"南京": [118.78, 32.04],
		"滨州": [118.03, 37.36],
		"贵阳": [106.71, 26.57],
		"无锡": [120.29, 31.59],
		"本溪": [123.73, 41.3],
		"克拉玛依": [84.77, 45.59],
		"渭南": [109.5, 34.52],
		"马鞍山": [118.48, 31.56],
		"宝鸡": [107.15, 34.38],
		"焦作": [113.21, 35.24],
		"句容": [119.16, 31.95],
		"北京": [116.46, 39.92],
		"徐州": [117.2, 34.26],
		"衡水": [115.72, 37.72],
		"包头": [110, 40.58],
		"绵阳": [104.73, 31.48],
		"乌鲁木齐": [87.68, 43.77],
		"枣庄": [117.57, 34.86],
		"杭州": [120.19, 30.26],
		"淄博": [118.05, 36.78],
		"鞍山": [122.85, 41.12],
		"溧阳": [119.48, 31.43],
		"库尔勒": [86.06, 41.68],
		"安阳": [114.35, 36.1],
		"开封": [114.35, 34.79],
		"济南": [117, 36.65],
		"德阳": [104.37, 31.13],
		"温州": [120.65, 28.01],
		"九江": [115.97, 29.71],
		"邯郸": [114.47, 36.6],
		"临安": [119.72, 30.23],
		"兰州": [103.73, 36.03],
		"沧州": [116.83, 38.33],
		"临沂": [118.35, 35.05],
		"南充": [106.110698, 30.837793],
		"天津": [117.2, 39.13],
		"富阳": [119.95, 30.07],
		"泰安": [117.13, 36.18],
		"诸暨": [120.23, 29.71],
		"郑州": [113.65, 34.76],
		"哈尔滨": [126.63, 45.75],
		"聊城": [115.97, 36.45],
		"芜湖": [118.38, 31.33],
		"唐山": [118.02, 39.63],
		"平顶山": [113.29, 33.75],
		"邢台": [114.48, 37.05],
		"德州": [116.29, 37.45],
		"济宁": [116.59, 35.38],
		"荆州": [112.239741, 30.335165],
		"宜昌": [111.3, 30.7],
		"义乌": [120.06, 29.32],
		"丽水": [119.92, 28.45],
		"洛阳": [112.44, 34.7],
		"秦皇岛": [119.57, 39.95],
		"株洲": [113.16, 27.83],
		"石家庄": [114.48, 38.03],
		"莱芜": [117.67, 36.19],
		"常德": [111.69, 29.05],
		"保定": [115.48, 38.85],
		"湘潭": [112.91, 27.87],
		"金华": [119.64, 29.12],
		"岳阳": [113.09, 29.37],
		"长沙": [113, 28.21],
		"衢州": [118.88, 28.97],
		"廊坊": [116.7, 39.53],
		"菏泽": [115.480656, 35.23375],
		"合肥": [117.27, 31.86],
		"武汉": [114.31, 30.52],
		"大庆": [125.03, 46.58],
		"安徽": [117.17, 31.52],
		"北京": [116.24, 39.55],
		"福建": [119.18, 26.05],
		"甘肃": [103.51, 36.04],
		"广东": [113.14, 23.08],
		"广西": [108.19, 22.48],
		"海南": [110.20, 20.02],
		"贵州": [106.42, 26.35],
		"河北": [114.30, 38.02],
		"河南": [113.40, 34.46],
		"黑龙江": [126.36, 45.44],
		"湖北": [114.17, 30.35],
		"湖南": [112.59, 28.12],
		"江苏": [118.46, 32.03],
		"江西": [115.55, 28.40],
		"辽宁": [123.25, 41.48],
		"内蒙古": [111.41, 40.48],
		"宁夏": [106.16, 38.27],
		"青海": [101.48, 36.38],
		"山东": [117.00, 36.40],
		"陕西": [110.970698, 39.525222],
		"山西": [112.33, 37.54],
		"浙江": [121.936428, 29.371889],
		"四川": [97.848274, 34.206932],
		"云南": [102.183416, 22.43027],
		"西藏": [88.718928, 36.337776],
		"新疆": [86.730441, 48.95902],
		"香港": [114.232564, 22.540043],
		"台湾": [120.443536, 22.441262]
	};

	var convertData = function(data) {
		var res = [];
		for(var i = 0; i < data.length; i++) {
			var geoCoord = geoCoordMap[data[i].name];
			if(geoCoord) {
				res.push({
					name: data[i].name,
					value: geoCoord.concat(data[i].value)
				});
			}
		}
		return res;
	};

	var data_list = [];
	var data_arr = [];
	var qj_data;
	this.mapInitData = function(Province, city) {
		cm.ajax({
			url: "/Monitor/GetMapData",
			type: "POST",
			dataType: "json",
			data: {
				Province: Province || "",
				area: ""
			},
			success: function(data) {
				//				data_arr = [];
				if(data != null) {
					if(Province == "") {
						data_list = [];
						$.each(data, function(i, n) {
							if(n["data"].length > 0) {
								var item = {
									name: n["Name"],
									value: n["data"].length
								};
								data_list.push(item);
							}
						});	
						qj_data = data_list;
						console.log(qj_data);
						self.mapInit(data_list);
					} else {
						data_arr=[];
						$.each(data[0].data, function(i, n) {
							var xypoints = [];
							$.each(n["xypoints"].split(','), function(j, m) {
								xypoints.push(parseFloat(m));
							});
							geoCoordMap[n["eq_type"]] = xypoints;
							var item = {
								name: n["eq_type"],
								value: data[0].data[i]
							};							
							data_list = [];
							data_arr.push(item);
						});
						self.ProvinceMap(Province, data_arr);
					}
				}
			},
			error: function(data) {
				console.log(data)
			}
		});
	}

	this.mapInit = function(data_arr) {
		var data = data_arr;
		var chart = echarts.init(document.getElementById('charmap'));
		$("#btn_back").css({
			"display": "none"
		});
		option = {
			backgroundColor: '#404a59',
			title: {
				show: true,
				text: '全国设备分布图',
				//subtext: 'data from PM25.in',
				//				sublink: 'http://www.pm25.in',
				left: 'center',
				textStyle: {
					color: '#fff'
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: function(data) {
					var info = data.name + " " + "<span style='color: white;'>" + "设备数量：" + data.value[2] + "台" + "</span>";
					return info;
				}
			},
			visualMap: {
				show: false, //色系条是否显示
				min: 0,
				max: 45000, //取其区间值就代表色系inRange中的一种颜色
				left: 'left',
				top: 'bottom',
				text: ['高', '低'], // 文本，默认为数值文本
				calculable: true,
				inRange: {
					color: ['#42a8be', '#00a69c', '#95ea95'], //上色范围
				}
			},

			legend: {
				orient: 'vertical',
				y: 'bottom',
				x: 'right',
				//				data: ['pm2.5'],
				textStyle: {
					color: '#fff'
				}
			},
			geo: {
				map: 'china',
				roam: true,
				itemStyle: {
					normal: {
						// borderWidth: 1,
						// borderColor: '#05BFA3',
						areaColor: '#12293A'

					},
					emphasis: { // 也是选中样式
						borderWidth: 1,
						borderColor: '#05BFA3',
						areaColor: '#104553'
					}
				},
				label: {
					normal: {
						textStyle: {
							fontSize: 15,
							color: '#05BFA3'
						},
						show: false //是否显示地区名称
					},
					emphasis: {
						textStyle: {
							fontSize: 15,
							color: '#05BFA3'
						},
						show: true
					}
				}
			},
			series: [{
				//					name: 'Top 10',
				//				data: convertData(data.sort(function(a, b) {
				//					return b.value - a.value;
				//				}).slice(0, 1000)),
				data: convertData(data),
				//					//					symbolSize: function(val) {
				//					//						return val[2] / 10;
				//					//					},

				type: "effectScatter", //特效散点图
				zlevel: 1, //柱状图所有图形的 zlevel 值。
				z: 0, //柱状图组件的所有图形的z值。控制图形的前后顺序。z值小的图形会被z值大的图形覆盖。
				silent: false, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
				//					name: "数据名称", //系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
				legendHoverLink: true, //是否启用图例 hover 时的联动高亮。
				hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
				effectType: "ripple", //特效类型，目前只支持涟漪特效'ripple'。
				showEffectOn: "render", //配置何时显示特效。可选：'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
				rippleEffect: { //涟漪特效相关配置。
					period: 3, //动画的时间。
					scale: 2.0, //动画中波纹的最大缩放比例。
					brushType: 'stroke', //波纹的绘制方式，可选 'stroke' 和 'fill'。
				},
				coordinateSystem: "geo", //'cartesian2d'使用二维的直角坐标系。'geo'使用地理坐标系
				xAxisIndex: 0, //使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
				yAxisIndex: 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
				polarIndex: 0, //使用的极坐标系的 index，在单个图表实例中存在多个极坐标系的时候有用。
				geoIndex: 0, //使用的地理坐标系的 index，在单个图表实例中存在多个地理坐标系的时候有用。
				calendarIndex: 0, //使用的日历坐标系的 index，在单个图表实例中存在多个日历坐标系的时候有用。
				symbol: "circle", //图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
				symbolSize: 15, //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
				symbolRotate: 0, //标记的旋转角度。注意在 markLine 中当 symbol 为 'arrow' 时会忽略 symbolRotate 强制设置为切线的角度。
				symbolOffset: [0, 0], //标记相对于原本位置的偏移。默认情况下，标记会居中置放在数据对应的位置
				large: false, //是否开启大规模散点图的优化，在数据图形特别多的时候（>=5k）可以开启。开启后配合 largeThreshold 在数据量大于指定阈值的时候对绘制进行优化。缺点：优化后不能自定义设置单个数据项的样式。
				largeThreshold: 2000, //开启绘制优化的阈值。
				cursor: "pointer", //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
				label: { //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等，
					normal: {
						formatter: '{b}',
						position: 'right',
						show: true
					}
				},
				itemStyle: { //图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
					normal: {
						color: '#f4e925',
						shadowBlur: 10,
						shadowColor: '#333'
					}
				}
			}]
		};

		chart.setOption(option);
		chart.on('click', function(params) {
			city = params.name;
			self.mapInitData(city);

			$("#charmap").css({
				"display": "none"
			});
			$("#Province_chart").css({
				"display": "block"
			});
			$("#btn_back").css({
				"display": "block"
			});
		});
	}

	this.ProvinceMap = function(city, data_arr) {
		data_list = [];
		var pie = echarts.init(document.getElementById('Province_chart'));
		pie.setOption(option = {
			backgroundColor: '#404a59',
			title: {
				show: true,
				text: city+'设备分布图',
				left: 'center',
				textStyle: {
					color: '#fff'
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: function(data) {
					var info = "<span style='color: white;'>" + "设备名称：" + data.value[2]["eq_name"] + " <br/>" + "设备编码：" + data.name + "<br/>公司名称：" + data.value[2]["cust_name"] + "<br/>详细地址：" + data.value[2]["custadress"] + "</span>";
					return info;
				}
			},
			visualMap: {
				show: false, //色系条是否显示
				min: 0,
				max: 45000, //取其区间值就代表色系inRange中的一种颜色
				left: 'left',
				top: 'bottom',
				text: ['高', '低'], // 文本，默认为数值文本
				calculable: true,
				inRange: {
					color: ['#42a8be', '#00a69c', '#95ea95'], //上色范围
				}
			},

			legend: {
				orient: 'vertical',
				y: 'bottom',
				x: 'right',
				//				data: ['pm2.5'],
				textStyle: {
					color: '#fff'
				}
			},
			geo: {
				map: city,
				roam: true,
				itemStyle: {
					normal: {
						// borderWidth: 1,
						// borderColor: '#05BFA3',
						areaColor: '#12293A'
					},
					emphasis: { // 也是选中样式
						borderWidth: 1,
						borderColor: '#05BFA3',
						areaColor: '#104553'
					}
				},
				label: {
					normal: {
						textStyle: {
							fontSize: 15,
							color: '#05BFA3'
						},
						show: false //是否显示地区名称
					},
					emphasis: {
						textStyle: {
							fontSize: 15,
							color: '#05BFA3'
						},
						show: true
					}
				}
			},
			series: [{		
				data: convertData(data_arr),
				type: "effectScatter", //特效散点图
				zlevel: 1, //柱状图所有图形的 zlevel 值。
				z: 0, //柱状图组件的所有图形的z值。控制图形的前后顺序。z值小的图形会被z值大的图形覆盖。
				silent: false, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
				//					name: "数据名称", //系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
				legendHoverLink: true, //是否启用图例 hover 时的联动高亮。
				hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
				effectType: "ripple", //特效类型，目前只支持涟漪特效'ripple'。
				showEffectOn: "render", //配置何时显示特效。可选：'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
				rippleEffect: { //涟漪特效相关配置。
					period: 3, //动画的时间。
					scale: 2.0, //动画中波纹的最大缩放比例。
					brushType: 'stroke', //波纹的绘制方式，可选 'stroke' 和 'fill'。
				},
				coordinateSystem: "geo", //'cartesian2d'使用二维的直角坐标系。'geo'使用地理坐标系
				xAxisIndex: 0, //使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
				yAxisIndex: 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
				polarIndex: 0, //使用的极坐标系的 index，在单个图表实例中存在多个极坐标系的时候有用。
				geoIndex: 0, //使用的地理坐标系的 index，在单个图表实例中存在多个地理坐标系的时候有用。
				calendarIndex: 0, //使用的日历坐标系的 index，在单个图表实例中存在多个日历坐标系的时候有用。
				symbol: "circle", //图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
				symbolSize: 15, //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
				symbolRotate: 0, //标记的旋转角度。注意在 markLine 中当 symbol 为 'arrow' 时会忽略 symbolRotate 强制设置为切线的角度。
				symbolOffset: [0, 0], //标记相对于原本位置的偏移。默认情况下，标记会居中置放在数据对应的位置
				large: false, //是否开启大规模散点图的优化，在数据图形特别多的时候（>=5k）可以开启。开启后配合 largeThreshold 在数据量大于指定阈值的时候对绘制进行优化。缺点：优化后不能自定义设置单个数据项的样式。
				largeThreshold: 2000, //开启绘制优化的阈值。
				cursor: "pointer", //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
				label: { //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等，
					normal: {
						formatter: '{b}',
						position: 'right',
						show: false
					}
				},
				itemStyle: { //图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
					normal: {
						color: '#05BFA3',
						shadowBlur: 10,
						shadowColor: '#333'
					}
				}
			}]
		});
	}

	this.statisticalInitData = function() {
		var ProvinceNameArr = [];
		var NumArr = [];
		cm.ajax({
			url: "/Monitor/GetProvinceEqiupNumStatistics",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: ""
			},
			success: function(data) {
				if(data != null) {
					$.each(data, function(i, n) {
						ProvinceNameArr.push(n["name"]);
						NumArr.push(n["eq_num"]);
					});
					self.statisticalInit(ProvinceNameArr, NumArr);
				}
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.statisticalInit = function(ProvinceNameArr, NumArr) {
		var dom = document.getElementById("bar_stack");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		app.title = '堆叠条形图';

		option = {
			title: {
				text: 'Top 10省份统计图',
			},
			color: ["#7890bf", "#698bbc", "#7fc369", "#00a3e8", "#42c0c9"],
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			//legend: {
			//    //orient: 'vertical',
			//    right: '0',
			//    //data: ['本年往月应收费用']
			//},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				show: false,
				type: 'value',
				axisLine: { //y轴
					"show": false

				},
				axisTick: { //y轴刻度线
					"show": false
				},
				splitLine: { //网格线
					"show": false
				},
			},
			yAxis: {
				type: 'category',
				inverse: true,
				axisLine: { //y轴
					"show": false

				},
				axisTick: { //y轴刻度线
					"show": false
				},
				splitLine: { //网格线
					"show": false
				},
				//				data: ['广西', '广东', '湖南', '湖北', '海南', '福建', '北京']
				data: ProvinceNameArr
			},
			series: [{
				name: '设备数量',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				//				data: [120, 202, 301, 234, 190, 230, 220]
				data: NumArr
			}]
		};

		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}
			myChart.on('click', function(params) {
//			debugger;
			city = params.name;
			self.mapInitData(city);

			$("#charmap").css({
				"display": "none"
			});
			$("#Province_chart").css({
				"display": "block"
			});
			$("#btn_back").css({
				"display": "block"
			});
		});
	}

	this.InitAlarmTypeData = function() {
		var data_arr = [];
		cm.ajax({
			url: "/AfterSaleManage/dm_alarm/GetAllAlarmTypeList",
			type: "POST",
			dataType: "json",
			//			data: {
			//				keyValue: ""
			//			},
			success: function(data) {
				if(data != null) {
					var html = '';
					$.each(data, function(i, n) {
						var div = "<div class='alarm-summ-item'><span class='alarm-icon'></span><span>" + n["alarmtype"] + ":" + n["num"] + "个" + "</span></div >"
						html = html + div;
					});
					$(".alarm-summ-block").html('');
					$(".alarm-summ-block").html(html);
				}
			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.pirTjInitData = function() {
		var data_arr = [];
		cm.ajax({
			url: "/AfterSaleManage/dm_alarm/GetHandle_statusList",
			type: "POST",
			dataType: "json",
			//			data: {
			//				keyValue: ""
			//			},
			success: function(data) {
				if(data != null) {
					for(var i = 0; i < data.length; i++) {
						var handle_status = '';
						if(data[i]["handle_status"] == '1')
							handle_status = '完成/完成率';
						else
							handle_status = '未完成/未完成率';
						var item = {
							value: data[i]["num"],
							name: handle_status
						};
						data_arr.push(item);
					}
					self.pirTjInit(data_arr);
				}
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}

	this.pirTjInit = function(data_arr) {
		var dom = document.getElementById("pie_tj");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		app.title = '环形图';
		option = {
			title: {
				//				text: '某站点用户访问来源',
				//				subtext: '纯属虚构',
				x: 'center'
			},
			tooltip: {

				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			color: ["#698bbc", "#7fc369", "#00a3e8", "#42c0c9"],
			series: [{
				name: '报警统计',
				type: 'pie',
				radius: ['50%', '70%'],
				center: ['50%', '60%'],
				minAngle: 1, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
				avoidLabelOverlap: true,
				labelLine: {
					show: false
				},

				data: data_arr,
				//				[{
				//						value: 335,
				//						name: '完成/完成率'
				//					},
				//					{
				//						value: 310,
				//						name: '未完成/未完成率'
				//					}
				//				],
				label: {
					align: 'left',
					normal: {
						formatter(v) {
							let text = Math.round(v.percent) + '%' + '' + v.name
							if(text.length <= 8) {
								return text;
							} else if(text.length > 8 && text.length <= 16) {
								return text = `${text.slice(0,8)}\n${text.slice(8)}`
							} else if(text.length > 16 && text.length <= 24) {
								return text = `${text.slice(0,8)}\n${text.slice(8,16)}\n${text.slice(16)}`
							} else if(text.length > 24 && text.length <= 30) {
								return text = `${text.slice(0,8)}\n${text.slice(8,16)}\n${text.slice(16,24)}\n${text.slice(24)}`
							} else if(text.length > 30) {
								return text = `${text.slice(0,8)}\n${text.slice(8,16)}\n${text.slice(16,24)}\n${text.slice(24,30)}\n${text.slice(30)}`
							}
						},
						textStyle: {
							fontSize: 9
						}
					}
				},
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};

		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}

	this.monthBrokenlineInitData = function() {
		var last_arr;
		var month_arr;
		//		var pro_arr = [];
		var pro_arr;
		var this_arr;
		cm.ajax({
			url: "/Monitor/GetMonthEqiupNumStatistics",
			type: "POST",
			dataType: "json",
			//			data: {
			//				keyValue: ""
			//			},
			success: function(data) {
				if(data != null) {
					last_arr = data.last_arr;
					month_arr = data.month_arr;
					pro_arr = data.pro_arr;
					//					for(var i = 0; i < data.pro_arr.length; i++) {
					//						var num = data.pro_arr[i];
					//						if(num < 0)
					//							num = 0;
					//						pro_arr.push(num);
					//					}

					this_arr = data.this_arr;
					self.monthBrokenlineInit(last_arr, month_arr, pro_arr, this_arr);
				}
				//				console.log(data)
			},
			error: function(data) {
				console.log(data)
			}
		});
	}

	this.monthBrokenlineInit = function(last_arr, month_arr, pro_arr, this_arr) {
		var dom = document.getElementById("MonthBrokenline");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		app.title = '折柱混合';

		option = {
			color: ["#cacaca", "#698bbc", "#698bbc", "#7fc369", "#00a3e8", "#42c0c9"],
			title: {
				//				text: '2018年各月份累计销售量',
				left: '0',
				//link:'http://www.baidu.com',//主标题超链接
				//target:'blank',//主标题超链接打开方式
				textStyle: { //设置主标题风格
					fontSize: 16,
					Color: 'green', //设置主标题字体颜色
					fontStyle: '', //主标题文字风格

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
				right: '50', // 'center' | 'left' | {number},
				top: '25', // 'center' | 'bottom' | {number}
				fontSize: 12,
				data: ['今年', '去年', '同比']
			},
			xAxis: [{
				type: 'category',
				//				data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				data: month_arr,
				axisPointer: {
					type: 'shadow'
				}
			}],
			yAxis: [{
					type: 'value',
					name: '设备(台)',
					min: 0,
					max: function(value) {
						return value.max + 30;
					},
					interval: 20,
					axisLabel: {
						formatter: '{value}'
					}
				},
				{
					type: 'value',
					name: '%',
					min: function(value) {
						return value.min;
					},
					max: function(value) {
						return value.max + 20;
					},
					//					interval: 4,
					axisLabel: {
						formatter: '{value}'
					}
				}
			],
			series: [{
					name: '去年',
					type: 'bar',
					//					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 80.6, 62.2, 32.6, 20.0, 6.4, 3.3]
					data: last_arr
				},
				{
					name: '今年',
					type: 'bar',
					//					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 80.6, 82.2, 48.7, 18.8, 6.0, 2.3]
					data: this_arr
				},
				{
					name: '同比',
					type: 'line',
					yAxisIndex: 1,
					//					data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 13.4, 13.0, 16.5, 12.0, 6.2]
					data: pro_arr
				}
			]
		};
		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}

	this.areaBasicInitData = function(keyValue) {
		var ym_arr = [];
		var num_arr = [];
		cm.ajax({
			url: "/Monitor/GetSalesVolume",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: keyValue || ""
			},
			success: function(data) {
				if(data != null) {
					$.each(data, function(i, n) {
						var m = n["m"];
						if(m < 10)
							m = '0' + m;

						ym_arr.push(n["y"] + '/' + m);
						num_arr.push(n["num"]);
					});
					self.areaBasicInit(ym_arr, num_arr);
				}

			},
			error: function(data) {
				console.log(data)
			}
		});
	}
	this.areaBasicInit = function(ym_arr, num_arr) {
		var dom = document.getElementById("area-basic");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		option = {
			title: {
				//				text: '销售量统计'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'line' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			color: ["#a2e2d4", "#cacaca", "#698bbc", "#698bbc", "#7fc369", "#00a3e8", "#42c0c9"],
			xAxis: {
				type: 'category',
				boundaryGap: false,
				//			data: ['1月', '2月', '3月', '4月', '5月', '6月']
				data: ym_arr
			},
			yAxis: {
				type: 'value',
				name: '设备(台)'
			},
			series: [{
				//			data: [820, 932, 901, 934, 1290, 1330, 1320],
				data: num_arr,
				type: 'line',
				areaStyle: {},
				label: {
					emphasis: {
						show: false,
						position: 'top',
						padding: 10,
						color: '#2979ff',
						fontSize: 14,
						formatter: '{b}\n设备数量：{c}台'
					}
				}
			}]
		};;
		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}

	this.getChartsData = function(keyValue) {
		self.areaBasicInitData(keyValue);
	}

	function main() {
		var dom = document.getElementById("main");
		var myChart = echarts.init(dom);
		var app = {};
		option = null;
		// 颜色
		var lightBlue = {
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [{
				offset: 0,
				color: 'rgba(41, 121, 255, 1)' // 0% 处的颜色
			}, {
				offset: 1,
				color: 'rgba(0, 192, 255, 1)' // 100% 处的颜色
			}],
			globalCoord: false // 缺省为 false
		}
		// 纹理
		var piePane = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKElEQVQ4jWP8//8/AwXgPxMluhkYGBhGDRg1YNQAKhnAwsDAQFF+BgBtSwUd6uvSywAAAABJRU5ErkJggg=='
		var piePatternImg = new Image();
		piePatternImg.src = piePane;
		// 图标
		var cpu = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NzgyQTBDQTI3MjcxMUU4ODA3MEFBRjc3RkNBNDJBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NzgyQTBDQjI3MjcxMUU4ODA3MEFBRjc3RkNBNDJBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3ODJBMEM4MjcyNzExRTg4MDcwQUFGNzdGQ0E0MkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ3ODJBMEM5MjcyNzExRTg4MDcwQUFGNzdGQ0E0MkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+n1oX5AAACiRJREFUeNrsXUuIHUUU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'
		var memory = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NkZDRThCRDI3MjcxMUU4OTI4QUM3NDRGMEMxNjdDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NkZDRThCRTI3MjcxMUU4OTI4QUM3NDRGMEMxNjdDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2RkNFOEJCMjcyNzExRTg5MjhBQzc0NEYwQzE2N0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ2RkNFOEJDMjcyNzExRTg5MjhBQzc0NEYwQzE2N0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2qH1MwAACnBJREFUeNrsXWuoVUUU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'
		var disk = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NjczMjI5MjI3MjcxMUU4OTIzNUNGREYwREM2MEQ2RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NjczMjI5MzI3MjcxMUU4OTIzNUNGREYwREM2MEQ2RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2NzMyMjkwMjcyNzExRTg5MjM1Q0ZERjBEQzYwRDZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ2NzMyMjkxMjcyNzExRTg5MjM1Q0ZERjBEQzYwRDZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+e59NdAAACT1JREFUeNrsXTuPHEUQ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'

		// 指定图表的配置项和数据
		var option = {
			tooltip: {
				show: false
			},
			grid: {
				top: '30%',
				left: '5%',
				right: '5%',
				bottom: '20%',
			},
			xAxis: {
				data: ['完成率'],
				offset: 0,
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisLabel: {
					color: 'black',
					fontSize: 14
				}
			},
			yAxis: {
				min: 0,
				max: 100,
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisLabel: {
					show: false
				}
			},
			series: [{
					type: 'bar',
					label: {
						show: true,
						position: 'top',
						padding: 10,
						color: '#2979ff',
						fontSize: 14,
						formatter: '{c}%'
					},
					itemStyle: {
						color: lightBlue
					},
					barWidth: '75%',
					data: [49],
					z: 10
				},
				//{
				//    type: 'bar',
				//    barGap: '-100%',
				//    itemStyle: {
				//        color: {
				//            image: piePatternImg,
				//            repeat: 'repeat'
				//        },
				//        opacity: 1
				//    },
				//    barWidth: '100%',

				//    data: [100],
				//    z: 5
				//},
				{
					type: 'bar',
					barGap: '-100%',
					itemStyle: {
						color: '#536dfe',
						opacity: 0.2
					},
					barWidth: '75%',

					data: [100],
					z: 5
				},
				{
					name: 'glyph',
					type: 'pictorialBar',
					barGap: '-100%',
					symbolPosition: 'end',
					symbolSize: 45,
					symbolOffset: [0, '-110%'],
					data: [{
						value: 100,
						symbol: cpu,
					}]
				}
			],
			//backgroundColor: "#190c12",
		};
		if(option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}
}
var model = new viewModel();