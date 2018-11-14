var viewModel = function() {
	var self = this;
	var procode = parent.window.model.procode;
	
	$(function() {
		self.initHtml();
	});
	
	this.initHtml = function(){
		var tabArray = self.getNode();
		
		var tabHtml = '';
		var iframeHtml = '';
		
		tabHtml += '<li class="active">';
		tabHtml += '<a data-toggle="tab" data-href="#tab-1" aria-expanded="true">基本信息</a>';
	    tabHtml += '</li>';
	    
	    iframeHtml += '<iframe id="iframe1" style="width:100%;height:100%;border:none;" src="../equipment/list_basic_inf.html?id=0&code=' + procode + '" scrolling="no" frameborder="0" onload="Loading(false);"></iframe>' 
	    
		for(var i = tabArray.length-1; i >= 0; i--){	
//			debugger
			tabHtml += '<li data-id="'+ tabArray[i].Node_Type +'">';
		    tabHtml += '<a data-toggle="tab" data-href="#tab-'+ (i+2) +'" aria-expanded="false">'+ tabArray[i].TypeName + '</a>';
			tabHtml += '</li>';
			
			iframeHtml += '<iframe id="iframe'+ (i+2) +'" style="width:100%;height:100%;border:none;display:none;" src="" scrolling="no" frameborder="0" onload="Loading(false);"></iframe>';		
		}
		$('#liTab').html('');
		$('#iframeHtml').html('');
		$('#liTab').html(tabHtml);
		$('#iframeHtml').html(iframeHtml);
		
	}

	//获取节点
	this.getNode = function() {
		var node_data = [];
		cm.ajax({
			url: '/Monitor/GetRealNodeTableList',
			data: {
				keyValue: procode
			},
			type: 'get',
			async: false,
			success: function(data) {
				console.log(data);
				node_data = data.reverse();
			}
		});
		return node_data;
	};
	
	
}
var model = new viewModel();
var url_data = model.getNode();
var iframe_url = [];
iframe_url.push("../equipment/list_basic_inf.html?id=0&code=" + parent.window.model.procode);
for(var j = 0 ; j < url_data.length; j++){
	var url_name = "../equipment/list_template.html?id=" + url_data[j].Node_Type + '&code=' + parent.window.model.procode;
	iframe_url.push(url_name);
}
var loadData = function() {
	var tabs = $('#liTab li')
	var tabs_active;
	for(var i = 0; i < tabs.length; i++) {
		if($(tabs[i]).attr('class') && $(tabs[i]).attr('class') == 'active') {
			tabs_active = i;
		}
	}
	$("iframe").hide();
	var iframe_show = $("iframe").eq(tabs_active + 1);
		iframe_show.css({
		'height': 580
	});
		iframe_show.attr("src", iframe_url[tabs_active]);
	iframe_show.show();
	


};