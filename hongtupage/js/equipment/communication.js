var viewModel = function() {
	var self = this;
	var list = [];
	var keyValue = request('keyValue');
	var productinfoid = request('productinfoid');
//	alert(productinfoid)
	var productname = decodeURI(request('productname'));
	var producttype = decodeURI(request('producttype'));
	//alert(producttype);
	var productcode = decodeURI(request('productcode'));
	
	var cf_id = null;
	var tf_id = null;
	var isadd = false;
	var lit = [];
	$(function() {
		$("#receiver").ComboBoxTree({
			url: "/BaseManage/User/GetTreeJson",
			param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
			description: "==请选择==",
			height: "200px",
			allowSearch: true
		});
		self.Gettotaldata();
		self.Initialization();
	});
	this.Initialization = function() { //页面初始化接口
		
		$("#productname").val(productname);
		$("#producttype").val(producttype);
		$("#producttoken").val(productcode);
				
		cm.ajax({
			url: "/AfterSaleManage/dm_terminalinfo/GetTerminalInfoList", //
			type: "POST",
			dataType: "json",
			data: {
				"orderProductID": keyValue
			},
			success: function(res) {
				
				lit = res;
				self.addExtHtml(res);

				console.log(res)
				var data = res[0];

				$("#form1").SetWebControls(data);

				if(typeof(data) != "undefined") {
					tf_id = data.tf_id;
					var productname = data.productname;
					var producttype = data.producttype;
					var producttoken = data.producttoken;
					var txzdno = data.txzdno;
					var txzdmodel = data.txzdmodel;
					var txzdwlh = data.txzdwlh;
					var tf_jddate = data.tf_jddate;
					var brand = data.brand;
					var tf_createusername = data.tf_createusername;
					//				alert(tf_createusername)
					var ip = data.ip;
					var port = data.port;
					var remark = data.remark;
				
				}
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	this.Gettotaldata = function() {
		cm.ajax({
			url: "/AfterSaleManage/aw_workinfo/GetImplementUsers",
			type: "POST",
			dataType: "json",
			data: {
				"keyValue": keyValue
			},
			success: function(data2) {

				var html = ''
				$.each(data2, function(i, n) {
					if(n.id == cm.userId) {
						html += '<option value="' + n.id + '" selected >' + n.name + '</option>';
					} else {
						html += '<option value="' + n.id + '">' + n.name + '</option>'
					}

				})
				$('#tf_createusername').append(html)
				if(data2.baseEntity) {
					if(data2.baseEntity.receiver) {
						var initvalue = data2.baseEntity.receiver;
					}
				}

				//  initvalue = initvalue + ",System,ccccccc," + data.baseEntity.serviceStaff + ",";
				console.log("*******mulChoise2");
				console.log(initvalue);
				if(initvalue != null) {
					initvalue = initvalue.replace(/,/, ";");
					$("#tf_createusername").select2().select2("val", initvalue.split(';'));
				} else {
					$("#tf_createusername").select2();
				}

			},
			error: function(data2) {
				console.log(data2)
			}
		});
	}

	$("#addItem").click(function() {
        if(isadd) return false;
		loadTable(Math.random().toString());
	});
	$("#tbody_td").on('click', '.remove-item', function(e) { //删除方法
		var that = $(this);

		var id = e.currentTarget.dataset.v;
		//		console.log("id", id);
		//		console.log("result", lit);
		//		var htmlid = "ID" + id;
		//		var cc = 0;
		//		for(var uu = 0; uu < lit.length; uu++) {
		//			if(lit[uu].cf_id == id) {
		//				cc = 1;
		//			}
		//		}

		//		console.log("cc", cc);
		//		if(cc == 1) {
		//			console.log("删除");
		//			var idArray = [];
		//			idArray.push({
		//				ID: id
		//			});
		cm.ajax({
			url: "/AfterSaleManage/dm_cardinfo/RemoveForm", //回访
			type: "Post",
			dataType: "json",
			data: {
				keyValue: id
			},
			success: function(data) {
				that.parent().parent().remove().index();
			},
			error: function(data) {
				console.log(data);
			}
		});

		//		} else {
		//			console.log("不删除");
		//			that.parent().parent().remove().index();
		//		}

	});

	//新增
	function loadTable(i) {
		var l = [];
		l.push("<tr class='addtr' id='ID" + i + "'>" +
			"<th><button class='lr-remove remove-item'  data-v=''  type='button'><i class='fa  fa-trash-o'></i></button></th>" +
			"<td><input type='text' class='card-no' value=''></td>" +
			"<td><input type='text' class='card-number' value=''></td>" +
			"<td><input type='text' class='card-material' value=''></td>" +

			"<td><input  type='text' class='type' value=''></td>" +
			"<td><input  type='text' class='brand' value=''></td>" +
			'<td><input  class="form-control input-wdatepicker" style="    width: 100px;" value="" onfocus="WdatePicker({ dateFmt: \'yyyy-MM-dd \' })" /></td>' +
			"</tr>");

		$('#tbody_td').append(l);
	}

	//初始化拓展属性html 
	this.addExtHtml = function(list) {
		var result = [];
		console.log("list------", list);
	
		for(var i = 0; i < list.length; i++) {
			result.push("<tr class='addtr' id='ID" + list[i].cf_id + "'>" +
				"<th><button class='lr-remove remove-item' data-v=" + list[i].cf_id + " type='button'><i class='fa  fa-trash-o'></i></button></th>" +
				"<td><input type='text' class='card-no' value='" + list[i].txkno + "'></td>" +
				"<td><input type='text' class='card-number' value='" + list[i].txknumber + "'></td>" +
				"<td><input type='text' class='card-material' value='" + list[i].txkwlh + "'></td>" +

				"<td><input  type='text' class='type' value='" + list[i].type + "'></td>" +
				"<td><input  type='text' class='brand' value='" + list[i].cf_brand + "'></td>" +
				'<td><input  class="form-control input-wdatepicker" style="    width: 100px;" value="' + list[i].cf_jddate + '" onfocus="WdatePicker({ dateFmt: \'yyyy-MM-dd \' })" /></td>' +

				"</tr>")
		}
		$('#tbody_td').html("").append(result.join(''));
	}

   this.AcceptClick = function() {
		if(!$('#form1').Validform()) {
			return false;
		}

		var postData = {};
		postData["card"] = "";
		var $trs = $("#tbody_td tr");

		for(var i = 0; i < $trs.length; i++) {
			var $tds = $trs.eq(i).find("td");
			postData["card"] += (JSON.stringify({
				ID: $trs.eq(i).find("th .lr-remove").data("v"),
				TXKNo: $tds.eq(0).children("input").val(),
				TXKNumber: $tds.eq(1).children("input").val(),
				TXKWLH: $tds.eq(2).children("input").val(),
				Type: $tds.eq(3).children("input").val(),
				Brand: $tds.eq(4).children("input").val(),
				JDDate: $tds.eq(5).children("input").val(),
				Remark: "12",
				organizationid: productinfoid
			}) + '||');
		}

		postData["term"] = JSON.stringify({
			ID: tf_id,
			ProductID: productinfoid,
			CardID: "1",
			TXZDNo: $('#txzdno').val(),
			TXZDModel: $('#txzdmodel').val(),
			TXZDWLH: $('#txzdwlh').val(),
			Brand: $("#brand").val(),
			JDDate: $('#tf_jddate').val(),
			Remark: $("#remark").val(),
			ProductNo: $("#producttoken").val(),
			IP: $("#ip").val(),
			port: $("#port").val(),
			organizationid: productinfoid
		});

		console.log(postData);
		cm.ajax({
			type: 'post',
			url: "/AfterSaleManage/dm_terminalinfo/SaveInfoJsonStr",
			data: postData,
			async: false,
			success: function(data) {
				alert(data.message);
				self.Initialization();
			},
			error: function(data) {
				console.log(data);
			}
		});
	}
};

var model = new viewModel();