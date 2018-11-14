var myChart = echarts.init(document.getElementById('main'));
option = {
	color: ['#4c65b1'],
	tooltip: {
		trigger: 'axis',
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',
		data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		axisTick: {
			alignWithLabel: true
		}
	}],
	yAxis: [{
		type: 'value'
	}],
	series: [{
		name: '直接访问',
		type: 'bar',
		barWidth: '60%',
		data: [87, 100, 168, 200, 100, 265, 220]
	}]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

var myCharta = echarts.init(document.getElementById('main1'));
option = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
         data:['烟感','水禁','红外','门禁']
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'烟感'},
                {value:310, name:'水禁'},
                {value:234, name:'红外'},
                {value:135, name:'门禁'}
            ],
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
myCharta.setOption(option);

var myChartb = echarts.init(document.getElementById('main2'));
option = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [460, 550, 880, 530, 500],
        type: 'line',
        areaStyle: {}
    }]
};

myChartb.setOption(option);

var myChartc = echarts.init(document.getElementById('main3'));
option = {
//	  backgroundColor: ['#1b1b1b'],//背景色
	color: ['#c23531'],
    xAxis: {
        type: 'category',
        data: ['01', '02', '03', '04', '05', '06', '07','08', '09','10','12','13','14','15','16']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        barWidth : 10,
        data: [120, 200, 150, 80, 70, 110, 130, 110, 102, 115, 101, 98, 103, 69, 89],
        type: 'bar'
    }]
};

myChartc.setOption(option);