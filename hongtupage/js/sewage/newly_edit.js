var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var sondata = "",
		htdata = "";
	$(function() {
		$("#CUST_ID").ComboBox({
			url: "/BaseManage/Organize/GetListByCategory",
			param: {
				category: 1
			},
			id: "OrganizeId",
			text: "FullName",
			description: "==请选择==",
			height: "200px"
		});
		self.Initialization();
	})

	this.inFYTypeShow = function(datatype) {
		cm.ajax({
			url: "/SystemManage/DataItemDetail/GetDataItemListJson",
			type: "Get",
			dataType: "json",
			data: {
				"EnCode": "FYType"
			},
			async: true,
			success: function(data) {
				var $radios = "";
				for(var i = 0; i < data.length; i++) {
					if(i == 0) {
						$radios += (" <input type='radio' name='optionsRadios'" + i + " value='" + data[i].ItemValue + "' checked='checked'> " + data[i].ItemValue);
					} else {
						$radios += (" <input type='radio' name='optionsRadios'" + i + " value='" + data[i].ItemValue + "'> " + data[i].ItemValue);
					}
				}
				$("#radio_datatype").html("").append($radios);
				$(":radio[name='optionsRadios']").change(function() {
					$("#specif_table_id tbody tr:gt(0)").remove();
					if($(this).val() == "阶梯价格") {
						self.initSpecifGridTable();
						for(var i = 0; i < sondata.length; i++) {
							self.addSpecifRow($("#specif_table_id"), sondata[i], i, "阶梯价格");
						}
						$("#lrs_add_model_one").show();
					} else {
						self.InitSpecifGridTable();
						if(htdata.length > 0) {
							self.addSpecifRow($("#specif_table_id"), htdata, 1, "合同统一价");
						} else {
							self.addSpecifRow($("#specif_table_id"), "", 1, "合同统一价");
						}
						$("#lrs_add_model_one").hide();
					}
				});

				if(!!datatype && datatype != $(":radio[name='optionsRadios']:checked").val()) {
					$(":radio[name='optionsRadios'][value='" + datatype + "']").prop("checked", true).trigger("change");
				}
			}
		});

	}

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
					label: '阶梯名称',
					name: 'STD_Name',
					index: 'STD_Name',
					width: 200
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

	this.InitSpecifGridTable = function() {
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
					label: '价格（元/m3）',
					name: 'Price',
					index: 'Price',
					width: 200,
				},
				{
					label: '备注',
					name: 'Remark',
					index: 'Remark',
					width: 200,
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

	this.Initialization = function() {
		//获取表单
		if(!!keyValue) {
			$.SetForm({
				url: "/AfterSaleManage/aw_swagetreatunitprice/GetFormJson",
				param: {
					keyValue: keyValue
				},
				success: function(data) {
					$("#CUST_ID").ComboBoxSetValue(data.CUST_ID);
					$("#DataType").ComboBoxSetValue(data.CUST_ID);
					$("#StartDate").val(formatDate(data.StartDate, "yyyy-MM-dd"));
					$("#EndDate").val(formatDate(data.EndDate, "yyyy-MM-dd"));
					$("#Remark").val(data.Remark);
					if(data.DataType == "阶梯价格") {
						sondata = data.sonEntity;
						self.initSpecifGridTable();
						for(var i = 0; i < sondata.length; i++) {
							self.addSpecifRow($("#specif_table_id"), sondata[i], i, "阶梯价格");
						}
						$("#lrs_add_model_one").show();
					} else {

						htdata = data.sonEntity[0];
						self.InitSpecifGridTable();
//						debugger;
						if(htdata != null) {
							self.addSpecifRow($("#specif_table_id"), htdata, 1, "合同统一价");
						} else {
							self.addSpecifRow($("#specif_table_id"), "", 1, "合同统一价");
						}
						$("#lrs_add_model_one").hide();
					}
					self.inFYTypeShow(data.DataType);
				}
			});
		} else {
			self.InitSpecifGridTable();
			$("#lrs_add_model_one").hide();
			self.addSpecifRow($("#specif_table_id"), "", 1, "合同统一价");
			self.inFYTypeShow("合同统一价");
		}
	}

	//参数配置--新增方法--表格行内新增
	this.addSpecifRow = function($grid, row, i, jtype) {
		var rowdata = {};
		if(jtype == "阶梯价格") {
			rowdata = {
				STD_Name: '<span style="color:red;">*</span><input checkexpession="NotNull" isvalid="yes" name="STD_Name" type="text" style="width:90%;margin-left:5px;" class="editable center" value="' + (row.STD_Name || "") + '"/>',
				Price: '<span style="color:red;">*</span><input checkexpession="NotNull" isvalid="yes" name="Price" type="text" style="width:90%;margin-left:5px;" class="editable center" value="' + (row.Price || "") + '"/>',
				Range: '<span style="color:red;">*</span><input checkexpession="NotNull" isvalid="yes" name="Range" type="text" style="width:90%;margin-left:5px;" class="editable center" value="' + (row.Range || "") + '"/>',
				Remark: '<input name="Remark" type="text" class="editable center" value="' + (row.Remark || "") + '"/>'
			}
		} else {
			rowdata = {
				Price: '<span style="color:red;">*</span>' + '<input checkexpession="NotNull" isvalid="yes" name="Price" type="text" style="width:90%;margin-left:5px;" class="editable center" value="' + (row.Price || "") + '"/>',
				Remark: '<input name="Remark" type="text" class="editable center" value="' + (row.Remark || "") + '"/>'
			}
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
		self.addSpecifRow($gridSpefic, {}, len, $(":radio[name='optionsRadios']:checked").val());
		$gridSpefic.find('tbody tr').last().find('input').eq(2).focus();
	};
	//参数配置-----删除按钮
	$('body').on('click', '.btn_specif_one_class', function() {
		var $obj = $(this);
		var json_id = {};
		$obj.parents('[role=row]').remove();
	});

	this.AcceptClick = function() { //编辑保存
		if(!$('#form1').Validform() && !$('#specif_id').Validform()) {
			return false;
		}

		//循环获取新增的table

		var spjson = $("#Custfrom").GetWebControls(keyValue);
		spjson["ST_ID"] = keyValue;
		spjson["CUST_Name"] = $("#CUST_ID").attr('data-text');
		spjson["DataType"] = $(":radio[name='optionsRadios']:checked").val();
		//		debugger;

		cm.ajax({
			type: 'get',
			async: false,
			data: spjson,
			url: '/AfterSaleManage/aw_swagetreatunitprice/ExistFormEdition',
			success: function(data) {
				if(data.message == "true") {
					alert(spjson.StartDate + " ~ " + spjson.EndDate + "该时间段已占用，请重新选择！");
				} else {
					//					spjson["ST_ID"] = "";
					self.getSaveFromData(spjson);
				}
			},
			error: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false);
				console.log(data);
				dialogClose();
			}
		});

	}

	this.getSaveFromData = function(spEntity) {
		Loading(true, "正在拼了命为您处理。。。");
		top.$("#loading_manage").attr('isTableLoading', 'true');
		var $gridSpefic = $("#specif_table_id");
		var detailJson = [];
		$gridSpefic.find('[role=row]').each(function(i) {

			if(!!$(this).find('input[name="Price"]').val()) {
				var d = cm.format.formToJSON(this);
				d["Sort"] = i + 1;
				d["Unit"] = "元/m3";
				if(spEntity["DataType"] == "合同统一价格") {
					d["STD_Name"] = "统一价格";
				}
				detailJson.push(d);
			}
		});

		cm.ajax({
			type: 'post',
			async: false,
			data: {
				"spEntity": JSON.stringify(spEntity),
				"spdList": JSON.stringify(detailJson)
			},
			url: '/AfterSaleManage/aw_swagetreatunitprice/SaveFormData',
			success: function(data) {
				top.$("#loading_manage").removeAttr('isTableLoading');
				Loading(false);
				if(data.type && data.type == 1) {
					dialogMsg(data.message, 1);
				} else {
					dialogMsg(data.message, 2);
				}
				dialogClose();
			}
		});
	}
};

var model = new viewModel();