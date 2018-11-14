cm.format = {};

/*
 * author:alvin
 * 2018.3.8 17:08:00
 * 获取时间--转换成指定时间格式
 */
cm.format.formatDate = function(value, format) {
	if(!value) return "";
	var d = value;
	if(typeof value === 'string') {
		if(value.indexOf("/Date(") > -1)
			d = new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
		else
			d = new Date(Date.parse(value.replace(/-/g, "/").replace("T", " ").split(".")[0])); //.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
	}
	var o = {
		"M+": d.getMonth() + 1, //month
		"d+": d.getDate(), //day
		"h+": d.getHours(), //hour
		"m+": d.getMinutes(), //minute
		"s+": d.getSeconds(), //second
		"q+": Math.floor((d.getMonth() + 3) / 3), //quarter
		"S": d.getMilliseconds() //millisecond
	};
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
/*
 * author:alvin
 * 2018.3.8 17:08:00
 * 获取时间--转换成指定时间格式
 */
cm.format.Date = function(value) {
	return cm.format.formatDate(value, 'yyyy-MM-dd');
}

cm.format.TimeNoSecond = function(value) {
	return cm.format.formatDate(value, 'hh:mm');
}

cm.format.TimeFmt = function(value) {
	return cm.format.formatDate(value, 'yyyy-MM-dd hh:mm:ss');
}

/*
 * author:alvin
 * 2018.3.9 13:32:00
 * 获取当前日期距离一个星期/一个月等等
 * 近7天  cm.format.getData（‘day’,-7）;
 * 近1个月 cm.format.getData（'month',-1）;
 */
cm.format.getData = function(type, data) {
	var today = new Date(),
		val = null;
	if(!type) return false;
	switch(type) {
		case 'day':
			var target_day_seconds = today.getTime() + 1000 * 60 * 60 * 24 * data;
			today.setTime(target_day_seconds); //注意，这行是关键代码               
			break;
		case 'month':
			today.setMonth(today.getMonth() + data);
			break;
			defaults:
				console.log('type未配置');

	}
	return today;
};

/*
 * author:alvin
 * 2018.3.20 13:32:00
 * 随机生成流水号
 */
cm.format.guid = function() {
	function S4() {
		return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/*
 * author:alvin
 * 2018.4.8 
 * 获取参数值
 * 传参：typename = 
 * 工单状态：workstaus_ass
 * 信息服务类型: sevice_nature_as
 */
cm.format.getParam = function(typename) {
	var result = null;
	cm.ajax({
		async: false,
		type: 'Get',
		url: "/SystemManage/DataItemDetail/GetDataItemListJson",
		data: {
			EnCode: typename
		},
		dataType: "json",
		success: function(data) {
			result = data;
		}
	});
	return result;
}

/*
 * author:alvin
 * 2018.4.9
 * 数组拆分成几个小数组
 * 参数：
 * arr是需要拆分的原数组
 * len是拆分的每个数组包含多少个元素
 */
cm.format.split_array = function(arr, len) {
	var a_len = arr.length;
	var result = [];
	for(var i = 0; i < a_len; i += len) {
		result.push(arr.slice(i, i + len));
	}
	return result;
}

/*
 * author:alvin
 * 2018.4.9
 * 用于jqgrid含内新增时候格式化
 * 格式化获取获取addrow里面的html格式数据JSON
 * 参数：获取html格式
 */
cm.format.formToJSON = function(selector) {
	var form = {};
	$(selector).find(':input[name]:enabled').each(function() {
		var self = $(this);
		var name = self.attr('name');
		if(form[name]) {
			form[name] = form[name] + ',' + self.val();
		} else {
			form[name] = self.val();
		}
	});
	return form;
}

//

/*
 * author:alvin
 * 2018.7.3
 * 获取json长度
 */
cm.format.getJsonLength = function(jsonData) {
	var jsonLength = 0;
	for(var item in jsonData) {
		jsonLength++;
	}
	return jsonLength;
}