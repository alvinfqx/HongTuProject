var cm = {
	token: sessionStorage.getItem("token"),
//	domain: "http://10.33.140.95:9005",http://10.99.27.80:9005
	 domain: "http://10.99.27.80:9003",
	ws: "ws://10.99.27.80:2012/",
	oldDomain: "http://10.33.140.95:9002",
	account: sessionStorage.getItem("account"),
	userId: sessionStorage.getItem("userId"),
	system: '/frontEndHongTu', //项目总名称，用于调用token过去或者接口type=3时跳出登录界面
	comSystemName: sessionStorage.getItem("comSystemName"), //"中集宏图",
	systemName: sessionStorage.getItem("systemName"), //"客服服务",
	smallSystemName: sessionStorage.getItem("smallSystemName"), //"宏图",
};
var contentPath = cm.domain;

cm.ajax = function(options) {
	options = $.extend({
		type: 'POST',
		dataType: 'json',
		//contentType: 'application/json',
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var msg = '‘' + errorThrown + '’';
			dialogMsg(msg, -1);
			console.log('cm.ajax接口加载失败');
		},
		showLoading: true,
		data: {}
	}, options);
	if(typeof options.data == "string") {
		options.data = JSON.parse(options.data);
		options.data.token = cm.token;
		options.data = JSON.stringify(options.data);
	} else {
		options.data.token = cm.token;
	}
	options.url = cm.domain + options.url;
	//  alert(options.url);
	var _beforeSend = options.beforeSend;
	options.beforeSend = function(request) {
		//  	     request.setRequestHeader("token", cm.token);
		// 禁用按钮防止重复提交
		var w = window.innerWidth;
		var h = window.innerHeight;
		var h2 = h / 2;
		var html = "";
		html += "<div id='ajax_tip' style='z-index: 10000; opacity: 0.5; background-color: #000; width:";
		html += w + "px;height:" + h + "px;position: absolute;top: 0; left: 0; text-align:center;'>";
		html += "<div style='margin-top:" + h2 + "px;'>";
		html += "<span style='font-size:22px;color:#fff;'>加载中...</span>";
		//          html += "<div class='overlay'>";
		//          html += " <i class='fa fa-refresh fa-spin'></i>";
		//          html += "</div>";
		html += "</div></div>";
		$("body").append(html);
		_beforeSend && _beforeSend();
	};
	var _success = options.success;
	options.success = function(data, textStatus) {
		$("#ajax_tip").remove();

		//token 过期函数
		if(data && data.type == 3) {
			dialogIsAlert(data.message, 2, function() {
				window.top.logout && window.top.logout();
			});

		}
		_success(data, textStatus);
	};
	$.ajax(options);

};

//判断数组出现相同数据大于5次,判断数组当前值是否都等于0
//		var checkArray = function(value, array) {
//			return array.reduce(function(total, currentValue) {
//				return currentValue <= value ? total + 1 : (total < 5 ? 0 : total)
//			}, 0) >= 5
//		}