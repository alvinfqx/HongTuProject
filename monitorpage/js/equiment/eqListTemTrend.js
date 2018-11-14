var viewModel = function(){
	var self = this;
	var nodeid = request('nodeid');
	var eqid = request('eqid');
	var nodeName = newrequest('nodeName');
	var now_day = cm.format.Date(cm.format.getData('day', 0), 'yyyy-MM-dd');
	var now_week = cm.format.Date(cm.format.getData('day', -7), 'yyyy-MM-dd');
	var startTime = $("#star_id").val(now_week);
	var endTime = $("#end_id").val(now_day);
	
	this.newIframeUrl = function(start_Time, end_Time){
		var iframe_url = "";
	    iframe_url += "http://10.99.27.41:8080/WebReport/ReportServer?reportlet=Columns_Row.cpt";
	    iframe_url += "&node_name=" + nodeName;
	    iframe_url += "&StarDate=" + start_Time;
	    iframe_url += "&EndDate=" + end_Time;
	    iframe_url += "&EQ_ID=" + eqid;
	    iframe_url += "&NODE_ID=" + nodeid;
		return iframe_url;
	}
	
	
	$(function(){
		$('body').css({
		   'height':document.documentElement.clientHeight - 20
		});
		$("#name_id").val(nodeName);
		$("#iframe1").attr("src", self.newIframeUrl($("#star_id").val(),$("#end_id").val()));
	});
	
	this.reload = function(){
		location.reload();
	}
	
	this.searchBtn = function(){
		var start_time = $("#star_id").val();
	    var end_time = $("#end_id").val();
	    if(!start_time){
	    		dialogMsg('请选择起始时间!',0);
	    		return false;
	    }
	     if(!end_time){
	    		dialogMsg('请选择结束时间!',0);
	    		return false;
	    }
	    var new_url = self.newIframeUrl(start_time, end_time);
		$("#iframe1").attr("src", new_url);
	}
	
};

var model = new viewModel();