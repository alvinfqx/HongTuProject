var viewModel = function(){
	var self = this;
	$(function() {
		$.learunindex.load();
//		$.learunindex.loadMenu();
		$.learunindex.loadNewMenu();
		$.learuntab.init();
		self.initPage();
	});
	
	this.initPage = function(){
		var window_height = $(window).height();
		var header_height = $('.main-header').height();
		var content_height = window_height-header_height;
		$('#content-main').css({
			"height":content_height
		});		
	};
	
	$('body').on('click','.menuItem',function(){
//		alert(1)
		var url_name = $(this).data('href');
		var data_id = $(this).data('id');
		$("#iframe_home").attr('data-id', data_id);		
		$("#iframe_home").attr("src", "../.." + url_name + ".html");	
	});
	
	//个人信息
	$(".person_btn").click(function(){
		var url_name = $(this).data('href');
		var data_id = $(this).data('id');
		$("#iframe_home").attr('data-id', data_id);		
		$("#iframe_home").attr("src", "../.." + url_name + ".html");	
	});
	
};

var model = new viewModel();