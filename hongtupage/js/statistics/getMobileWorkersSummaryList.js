//	var viewModel = function() {
//		var self = this;
//		$(function() {
//			self.getServiceSummaryTable();
//		});

layui.use(['form', 'layer', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		laypage = layui.laypage;

	$(function() {
		getServiceSummaryTable();
	});

	$("#btn_Search").on("click", function() {
		//		alert("点击");
		var begindata = $("#begindata").val();
		var enddata = $("#enddata").val();
		getServiceSummaryTable(begindata, enddata);
	})

	function getServiceSummaryTable(begin, end) {
		var pageJson = {
			rows: "20",
			page: "1",
			sord: "desc",
			sidx: "createdate",
			conditionJson: null
		};
		var pageJson = JSON.stringify(pageJson)
		cm.ajax({
			url: "/Monitor/GetMobileWorkersSummaryList",
			type: "POST",
			dataType: "json",
			data: {
				str_pagination: pageJson,
				keyValue: "",
				startTime: begin || "",
				endTime: end || ""
			},
			success: function(data) {
				console.log(data)

				var data = data;
				analysisServiceSummaryTable(data.rows);
				pageInit(data.records, 0, '/Monitor/GetMobileWorkersSummaryList')
			},
			error: function(data) {

			}
		})
	}

	//初始分页 初始列表
	function pageInit(totalPage, firstIndex, in_url) {
		console.log(totalPage)
		laypage.render({
			elem: 'page-button',
			count: totalPage,
			theme: '#3c8dbc',
			limit: 5,
			jump: function(obj, first) {
				//obj包含了当前分页的所有参数，比如：
				//console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
				//console.log(obj.limit); //得到每页显示的条数

				if(!first) {
					var page_Json = {
						rows: "20",
						page: obj.curr,
						sord: "desc",
						sidx: "createdate",
						conditionJson: null
					};
					page_Json = JSON.stringify(page_Json)
					console.log(page_Json)
					cm.ajax({
						type: "post",
						url: in_url,
						data: {
							str_pagination: page_Json,
							keyValue: "",
							startTime: "",
							endTime: ""
						},
						success: function(data) {

							var data = data;
							if(data && data.rows.length != 0) {
								$("#report-table-one").html("");
								analysisServiceSummaryTable(data.rows);
								//								$('#report-table-one').highlight($("#query").val());
								//									 $('#page_list').highlight('油压突然下降');
							} else {
								$("#report-table-one").html("");
								layer.msg("暂无数据！", {
									icon: 2
								});
							}
						},
						error: function(data) {
							console.log(data);
							layer.msg("网络错误,请稍后再试!", {
								icon: 2
							});
						}
					});
				}

			}
		});
	}

	function analysisServiceSummaryTable(arrdata) {
		var table_html = '';
		var table_head = null;

		var table_tr_floo = '<tr>';
		var table_tr = "";
		for(var i = 0; i < arrdata.length; i++) { //二维数组
			for(var j = 0; j < arrdata[i].length; j++) {
				table_tr_floo += '<td>' + ((arrdata[i][j].num) || "") + '</td>';
			}
			table_tr_floo += "</tr>";
		}
		$.each(arrdata[0], function(i, n) {
			table_head += '<th>' + ((n.serviceMode) || "") + '</th>';
		})
		table_html = '<thead><tr style="background: #ecf0f5">' + table_head + '</tr></thead>' +
			'<tbody>' + table_tr_floo + '</tbody>'
		$("#report-table-one").html(table_html)
	}
	
	$("#daochu").on("click", function() {
		var begindata = $("#begindata").val();
		var enddata = $("#enddata").val();
		var pageJson = {
			rows: "20",
			page: "1",
			sord: "desc",
			sidx: "createdate",
			conditionJson: null
		};
		var pages= JSON.stringify(pageJson)
		window.location = cm.domain + "/Monitor/GetMobileWorkersSummaryList?keyValue=" + "导出" + "&startTime=" + begindata + "&endTime=" + enddata +"&str_pagination=" +pages+ "&token=" + cm.token;
	})
})

//};
//
//var model = new viewModel();