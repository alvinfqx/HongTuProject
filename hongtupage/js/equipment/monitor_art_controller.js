var viewModel = function() {
	var self = this;
	this.keyValue = request('keyValue');
	this.productCatId = request("productCatId");
	this.productType = request("productType");
	
	$("#iframe1").attr("src", "../equipment/monitor_art_con_basic.html?keyValue=" + self.keyValue + "&productCatId=" + self.productCatId);
	$("#iframe1").css({
		'height': document.documentElement.clientHeight - 44
	});

	this.iframe_url = [
		"../equipment/monitor_art_con_basic.html?keyValue=" + self.keyValue + "&productCatId=" + self.productCatId,
		"../equipment/monitor_art_con_set.html?keyValue=" + self.keyValue + "&productCatId=" + self.productCatId + '&productType= ' + self.productType
	];
	
};
var model = new viewModel();

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
	if(iframe_show && iframe_show.attr("src").length == 0) {
		iframe_show.attr("src", model.iframe_url[tabs_active]);
	}

	iframe_show.show();

	iframe_show.css({
		'height': document.documentElement.clientHeight - 44
	});
	
};

