var viewModel = function(){
	var self = this;
	this.keyValue = request('keyValue');
};
var model = new viewModel();

//var iframe_url = [
//
//  "../customer_manage/order_record_product_desc.html",
//  "../customer_manage/order_record_product_specif.html",
//  
//];

//var exchang_iframe = function () {	
//	$("#iframe2").attr("src", "../customer_manage/order_record_product_specif.html");
//	$(".nav-tabs-custom iframe").hide();
//	$("#iframe2").show();
//  var tabs = $('#tabID li'),
//      tabs_active;
//
//  for (var i = 0; i < tabs.length; i++) {
//      if ($(tabs[i]).attr('class') && $(tabs[i]).attr('class') == 'active') {
//          tabs_active = i;
//      }
//  }
//  
//  $("iframe").hide();
//  var iframe_show = $("#ifram_div iframe").eq(tabs_active);
//     
//  if (iframe_show && iframe_show.attr("src").length == 0) {    
//     iframe_show.attr("src", iframe_url[tabs_active]);
//  }
//  iframe_show.css({'display':'block'});
//};