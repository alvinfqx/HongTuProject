var viewModel = function() {
	var self = this;
    
    var Bdata = [];
    var tydata, jydata;
    cm.ajax({
			url: "/AfterSaleManage/aw_basicdata/GetListJson",
			type: "Get",
			dataType: "json",
			async: true,
			success: function(data) {
				for (var i = 0; i < data.length; i++) {
					if(data[i].datatype == "统一价格"){
						tydata = data[i];
					}
					else{
						jydata = data[i];
					}
				}
			}
    });

this.getSpecifData = function() {
		cm.ajax({
			url: "/AfterSaleManage/aw_basicdata_details/GetTableWithSql",
			type: "Get",
			dataType: "json",
			async: true,
			//			data: {
			//				queryJson:""
			//			},
			success: function(data) {
				if(data && data.length > 0) {
					var k = 1;
					self.initSpecifGridTable();
					for(var i = 0; i < data.length; i++) {
						if(data[i].bdd_name == "合同统一价") {
							$("#price").val(data[i].price);
							$("#price").data("bid",data[i].bd_id);
//							data.splice(i);
						}
						else{
							self.addSpecifRow($("#specif_table_id"), data[i], k);
							k++;
						}
					}
				} else {
					console.log('无配置数据！');
				}
			},
			error: function(data) {
				console.log(data);
			}
		});
	};
		self.getSpecifData(); 
	this.initSpecifGridTable = function() {
		$("#specif_id").html("<table id='specif_table_id'></table>");
		var $grid_specif = $("#specif_table_id");
		$grid_specif.jqGrid({
			unwritten: false,
			datatype: "local",
			height: $(window).height() - 300,
			autowidth: true,
			cmTemplate: {
				sortable: false
			},
			colModel: [{
					label: '主键',
					name: 'BDD_ID',
					index: 'BDD_ID',
					hidden: true
				},
				{
					label: '分类ID',
					name: 'BD_ID',
					index: 'BD_ID',
					hidden: true
				},
				{
					label: '阶梯名称',
					name: 'BDD_Name',
					index: 'BDD_Name',
					width: 200
					//					formatter: function(cellvalue, options, row) {
					//						return "";
					//					}
				},
				{
					label: '价格（元/m3）',
					name: 'Price',
					index: 'Price',
					width: 200,
				},
				{
					label: '范围',
					name: 'Range',
					index: 'Range',
					width: 200,
				},
				{
					label: '备注',
					name: 'Remark',
					index: 'Remark',
					width: 200,
				},
				{
					label: '操作按钮',
					name: 'deleteIndex',
					index: 'deleteIndex',
					align: 'center',
					width: 100,
					formatter: function(cellvalue, options, row) {
						return '<button  id=""  type="button" class="btn btn-primary btn_specif_one_class"><i class="fa  fa-trash-o"></i></button>';
					}
				},
			],
			cellattr: function() {
				return ' title=""'
			},
			rownumbers: true,
			shrinkToFit: true,
			gridview: true,
			hidegrid: false,
			pager: false, //表格页脚的占位符(一般是div)的id
		});

		$grid_specif.find("tbody tr:eq(1)").find('input').removeAttr('disabled').attr("isvalid", "yes");
		$grid_specif.find('.disabled').attr("disabled", "disabled");
	}
	//初始化调用规格配置table
	self.initSpecifGridTable();
	//参数配置--新增方法--表格行内新增
	this.addSpecifRow = function($grid, row, i) {

		var html = '';
		html += '<input name="BDD_ID" type="hidden" class="editable center" value="' + (row.bdd_id || "") + '"/>';
		html += '<input name="BD_ID" type="hidden" class="editable center" value="' + (row.bd_id || "") + '"/>';
		html += '<span style="color:red;">*</span>';
		html += '<input checkexpession="NotNull" isvalid="yes" name="BDD_Name" type="text" style="width:90%;margin-left:5px;" class="editable center" value="' + (row.bdd_name || "") + '"/>';
		
		var rowdata = {
			//主键
			BDD_ID: row.bdd_id,
			BD_ID: row.bd_id,
			BDD_Name: html,
			Price: '<input checkexpession="NotNull" isvalid="yes" name="Price" type="text" class="editable center" value="' + (row.price || "") + '"/>',
			Range: '<input checkexpession="NotNull" isvalid="yes" name="Range" type="text" class="editable center" value="' + (row.range || "") + '"/>',
			Remark: '<input name="Remark" type="text" class="editable center" value="' + (row.remark || "") + '"/>'
		}
		$grid.jqGrid('addRowData', i, rowdata);
	}
	// 参数配置---新增事件
	this.add_specif = function() {

		var $gridSpefic = $("#specif_table_id");
		if($gridSpefic.find('tbody tr').length > 1) {
			if(!$('#specif_id').Validform()) {
				return false;
			}
		}
		var len = $gridSpefic.getDataIDs().length;
		self.addSpecifRow($gridSpefic, {}, len);
		$gridSpefic.find('tbody tr').last().find('input').eq(2).focus();
	};
	//参数配置-----删除按钮
	$('body').on('click', '.btn_specif_one_class', function() {
		var $obj = $(this);
		var json_id = {};
		$obj.parents('[role=row]').remove();
		/*
		 * 暂时不需要删除传到后端
		var delete_val = $obj.parent().parent().find('[aria-describedby="specif_table_id_cfgItemId"]').text();
		if(delete_val && delete_val.length > 0) {
			json_id.cfgItemId = delete_val;
			productBomAttuEntityList_del.push(json_id);
		}*/
	});
	//参数配置---保存事件
	this.save_specif = function() {
		var $gridSpefic = $("#specif_table_id");
		if($("#price").val() != "" && !$('#specif_id').Validform()) {
			return false;
		}
		//循环获取新增的table
		var detailJson = [{"BDD_ID":"","BD_ID":"","BDD_Name":"合同统一价","Price":"","Range":"","Remark":""}];
		detailJson[0].BD_ID = $("#price").data("bid");
		detailJson[0].Price = $("#price").val();
		detailJson[0].Unit = "元/m3";
		$gridSpefic.find('[role=row]').each(function(i) {
			if(!!$(this).find('input[name="BDD_Name"]').val()) {
				var d = cm.format.formToJSON(this);
				d["BD_ID"] = jydata["BD_ID"];
				d["Sort"] = i+1;
				d["Unit"] = "元/m3";
				detailJson.push(d);
			}
		});

		var str_spe_one = JSON.stringify(detailJson);
		cm.ajax({
			type: 'post',
			async: false,
			data: {
				entitys: str_spe_one
			},
			url: '/AfterSaleManage/aw_basicdata_details/SaveFormData',
			success: function(data) {
				if(data.type && data.type == 1) {
					self.getSpecifData();
					dialogMsg(data.message, 1);
				} else {
					dialogMsg(data.message, 2);
				}
			}
		});
	}
};

var model = new viewModel();