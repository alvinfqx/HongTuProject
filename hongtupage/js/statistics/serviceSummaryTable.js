var viewModel = function(){
	var self = this;
	
	$(function() {
	self.getServiceSummaryTable();
	});
	
	this.getChartsData = function(){
		var begindata = $("#begindata").val();
		var enddata = $("#enddata").val();
		self.getServiceSummaryTable(begindata,enddata);
	}
	
	this.getServiceSummaryTable = function(begin,end){
	
		cm.ajax({
			url: "/Monitor/GetServiceSummaryList",
			type: "POST",
			dataType: "json",
			data: {
				keyValue: "",
				StartTime: begin,
				EndTime: end
			},
			success: function(data) {
				console.log(data)
				self.analysisServiceSummaryTable(data);
			},
			error: function(data) {

			}
		})
	}
	
	this.export_a = function() { //导出
		var begindata = $("#begindata").val();
		var enddata = $("#enddata").val();
			 window.location= cm.domain +"/Monitor/GetServiceSummaryList?keyValue=" + '导出'  + "&StartTime="+ begindata + "&EndTime=" + enddata + "&token="+cm.token;
		}
	
	this.analysisServiceSummaryTable = function(arrdata){
		var table_html = '';
		var table_head = '';
		var table_tr_floo = '';
		$.each(arrdata, function(i, n) {
			table_head += '<th>' + ((n["serviceMode"]) || "") + '</th>';
			table_tr_floo += '<td>' + ((n["num"]) || "") + '</td>';
		});
		table_html = '<thead><tr style="background: #ecf0f5">' + table_head + '</tr></thead>' +
			'<tbody>' +
			'<tr>' + table_tr_floo + '<tr>' +
			'</tbody>'
		$("#report-table-one").html(table_html)
	}
};

var model = new viewModel();