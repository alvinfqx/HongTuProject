var viewModel = function() {
	var self = this;
	this.keyValue = request('keyValue');
	this.procode = request('procode');
	this.proname = newrequest('proname');
	
	$('body').css({
		height: '650px'
	});
	$('#iframe1').css({
		'height': document.documentElement.clientHeight - 44
	});
	
	$("#iframe1").attr("src", "../equipment/artwork.html?keyValue=" + self.keyValue + '&procode=' + self.procode);
	this.iframe_url = ["../equipment/artwork.html?keyValue=" + self.keyValue + '&procode=' + self.procode];
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
	
	
};