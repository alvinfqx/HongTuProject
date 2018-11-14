var viewModel = function() {
	var self = this;

	//productInfoId
	var keyValue = request('keyValue');
	//定义productCatId 产品类型
	var productCatId = request('productcatid');
	

	//树形点击事件参数 alvin star
	var _itemId = "";
	var _itemName = "";
	//end

	//页面初始化
	$(function() {
		//产品类别
		$("#productCatId").ComboBoxTree({
			url: "/SystemManage/DataItem/GetTreeJson4ProductCat",
			cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
			description: "==请选择==",
			height: "200px"
		});
		self.InitialPage();
		self.GetTree();
		self.Initialization();
		self.productIntroduction();
		self.obtain_aftersale();
		self.obtain_warrantyPeriod();		
		self.initGridTable();
		self.getTableData(_itemId, keyValue);
		
	});
	//初始化页面
	this.InitialPage = function() {
		//resize重设布局;
		$(window).resize(function(e) {
			window.setTimeout(function() {
				$("#itemTree").setTreeHeight($(window).height() - 45);
			}, 200);
			e.stopPropagation();
		});
	};
	//获取产品基本信息初始化页面
	this.Initialization = function() {
		cm.ajax({
			url: "/AfterSaleManage/productinfo/GetProductInfo", //
			type: "POST",
			dataType: "json",
			data: {
				productInfoId: keyValue
			},
			success: function(res) {
				var data = res[0];
				console.log(data);
				$("#form").SetWebControls(data);
				var productinfoid = data.productinfoid;
				var productcatid = data.productcatid;
				var productname = data.productname;
				var producttype = data.producttype;
				var productcode = data.productcode;
				var productdesc = data.productdesc;
				$("#productName").val(productname);
				$("#productCatId").ComboBoxTreeSetValue(productcatid);
				$("#productCode").val(productcode);
				$("#productDesc").val(productdesc);
				if(data.photourl == null || data.photourl == "") {
                     
				} else {
					var data_img_url = cm.domain+'/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist='+ data.photourl +'&token='+ cm.token;
//					var data_img_url = data.photoUrl + '&token=' + cm.token;
					$("#photoUrl").attr("src", data_img_url).css("visibility", "visible");
					$("#picPath").val(data.photourl);
				}
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	//根据产品id获取产品的售后服务
	this.obtain_aftersale = function() {
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/productinfo/GetProductCustomerSeviceHtmlContent", //回访
			type: "POST",
			dataType: "json",
			data: {
				productInfoId: keyValue
			},
			success: function(res) {
				var data = res[0];
				console.log(data);
				var productinfoid = data.productinfoid;
				var customerservicehtml = data.customerservicehtml;
				$("#htmlContent1").summernote('code', customerservicehtml);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	//根据产品id获取质保期的html介绍
	this.obtain_warrantyPeriod = function() {
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/productinfo/GetProductwarrentyHtmlContent", //回访
			type: "POST",
			dataType: "json",
			data: {
				productInfoId: keyValue
			},
			success: function(res) {
				var data = res[0];
				console.log(data);
				var productinfoid = data.productinfoid;
				var warrantdeschtml = data.warrantdeschtml;
				$("#htmlContent2").summernote('code', warrantdeschtml);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	//初始化产品介绍
	this.productIntroduction = function() {
		cm.ajax({
			url: "/AfterSaleManage/productinfo/GetProductHtmlContent", 
			type: "POST",
			dataType: "json",
			data: {
				productInfoId: keyValue
			},
			success: function(res) {
				var data = res[0];
				var productinfoid = data.productinfoid;
				var markupStr = data.htmlcontent;
				$('#htmlContent').summernote('code', markupStr);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	//保存产品基本数据
	this.preservation_b = function() {
		var json_data = {};
		var postData = {};
		var test = $('#htmlContent').summernote('code');
		var imgSrr = $("#picPath").val();
		postData["htmlContent"] = escape(test);
		postData["photourl"] = escape(imgSrr);
		postData.productInfoId = keyValue;
		postData.productName = $('#productName').val();
		postData.productCatId = $("#productCatId").attr('data-value');
		//产品类型text
		postData.productType = $("#productCatId").attr('data-text');
		postData.productCode = $('#productCode').val();
		json_data.keyValue = '';
		json_data.productInfoId = keyValue;
		json_data.basicInfo = postData;
		//拓展表格新增删除
		json_data.productExtendAttuList_save = self.get_ext_pro_data();
		json_data.productExtendAttuList_del = delete_arr;
		console.log(JSON.stringify({
			productInfoJson: json_data
		}));
		var str = JSON.stringify(json_data);
		cm.ajax({
			url: '/AfterSaleManage/productinfo/SaveFormData',
			type: "POST",
			dataType: "json",
			data: {
				productInfoJson: str
			},
			success: function(data) {
				//star
				//保存成功后清空删除数组
				delete_arr = [];
				self.getExtData();
				dialogMsg(data.message, 1);
				//end				
			},
			error: function(data) {
				dialogMsg(data.message, 2);
			}
		});
	}

	//加载树
	this.GetTree = function() {
		var item = {
			height: $(window).height() - 45,
			url: "/SystemManage/DataItem/GetTreeJson4ItemTypeCat",
			param: {				
				productInfoId: keyValue
			},
			onnodeclick: function(item) {
				console.log(item);
				_itemId = item.id;
				self.initGridTable();
				self.getTableData(_itemId, keyValue);
			}
		};
		//bom初始化
		$("#itemTree").treeview(item);
	}

	//富文本框初始化
	var myDropzone = new Dropzone("#dropzone1", {
		// url: "/admin/upload",//文件提交地址
		url: cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_requirement_attachment&token=" + cm.token, //文件提交地址
		method: "post", //也可用put
		paramName: "file", //默认为file
		maxFiles: 10, //一次性上传的文件数量上限
		maxFilesize: 10, //文件大小，单位：MB
		//   acceptedFiles: ".jpg,.gif,.png,.jpeg", //上传的类型
		addRemoveLinks: true,
		parallelUploads: 1, //一次上传的文件数量
		//previewsContainer:"#preview",//上传图片的预览窗口
		dictDefaultMessage: '拖动文件至此或者点击上传',
		dictMaxFilesExceeded: "您最多只能上传10个文件！",
		dictResponseError: '文件上传失败!',
		dictInvalidFileType: "文件类型只能是*.jpg,*.gif,*.png,*.jpeg。",
		dictFallbackMessage: "浏览器不受支持",
		dictFileTooBig: "文件过大上传文件最大支持.",
		dictRemoveLinks: "删除",
		dictCancelUpload: "取消",
		init: function() {
			this.on("addedfile", function(file) {
				//上传文件时触发的事件
				document.querySelector('div .dz-default').style.display = 'none';
			});
			this.on("success", function(file, data) {
				//上传成功触发的事件
				console.log('ok');
				// angular.element(appElement).scope().file_id = data.data.id;
			});
			this.on("error", function(file, data) {
				//上传失败触发的事件
				console.log('fail');
				var message = '';
				//lavarel框架有一个表单验证，
				//对于ajax请求，JSON 响应会发送一个 422 HTTP 状态码，
				//对应file.accepted的值是false，在这里捕捉表单验证的错误提示
				if(file.accepted) {
					$.each(data, function(key, val) {
						message = message + val[0] + ';';
					})
					//控制器层面的错误提示，file.accepted = true的时候；
					alert(message);
				}
			});
			this.on("removedfile", function(file) {
				console.log('removedfile');
				console.log("File " + file.name + "removed");
				//删除文件时触发的方法
				//  var file_id = angular.element(appElement).scope().file_id;
				var file_id = "11";
				// alert(file_id);
				if(file_id) {
					$.post('/AfterSaleManage/aw_workinfo/BatchDelete?keyValue=' + file.name, {
						'tbname': 'aw_requirement_attachment'
					}, function(data) {
						console.log('删除结果:' + data.message);
					})
				}
				//   angular.element(appElement).scope().file_id = 0;
				document.querySelector('div .dz-default').style.display = 'block';
			});
		}
	});

	this.show_msage = function(target) {
		var $up_data = $(target).parent().parent().parent().find(".up-data");
		var $box_show = $(target).parent().parent().parent().find(".box_show");
		var $dropzone = $up_data.find(".dropzone");
		var $up_data_msg = $up_data.find(".up-data-msg");
		if($up_data.css("display") == "none") {
			$box_show.css("display", "block");
			$up_data.css("display", "block");
			$up_data_msg.css('display', 'block');
			$dropzone.css('display', 'block');
		} else {
			$box_show.css("display", "none");
			$up_data.css("display", "none");
			$up_data_msg.css('display', 'none');
			$dropzone.css('display', 'none');
		}
	}

	$('#htmlContent').summernote({
		height: 280,
		tabsize: 2,
		lang: 'zh-CN',

	});

	$('#htmlContent1').summernote({
		height: 280,
		tabsize: 2,
		lang: 'zh-CN'
	});

	$('#htmlContent2').summernote({
		height: 280,
		tabsize: 2,
		lang: 'zh-CN'
	});

	$(".radio_a").on("click", "input", function() {
		var id_data = $(this).attr("id-data")
		var id = $("." + id_data + "")
		id.show();
		id.siblings().hide();
	})

    //左边树的点击事件
	$('#tab li').click(function() {
		//点击索引
		var index = $(this).index();
		//找到点击的索引，显示
		$('#main_body').find('.content').eq(index).show();
		//隐藏同级的兄弟标签
		$('#main_body').find('.content').eq(index).siblings().hide();
	});

	/*
	 * alvin
	 * 基本信息配置---拓展属性
	 * star
	 */

	//新增按钮
	this.add_ext_pro = function() {
		if(!$('#ext_pro_id').Validform()) {
			return false;
		}
		var html = "";
		var tr_len = $('#ext_pro_id').find('tr').length;

		if(tr_len >= 1) {
			html += '<tr class="addtr" id="ext' + (tr_len) + '">';
			html += '<td>';
			html += '<input type="hidden" />';
			html += '<input type="text" class="form-control" placeholder="请输入英文code" style="width: 200px;" />';
			html += '</td>';
			html += '<td>';
			html += '<input type="text" class="form-control" checkexpession="NotNull" isvalid="yes" placeholder="请输入中文名称" style="width: 200px;" />';
			html += '</td>';
			html += '<td>';
			html += '<input type="text" class="form-control" placeholder="请输入值" style="width: 200px;" />';
			html += '</td>';
			html += '<td>';
			html += '<button id="lr-remove" type="button" class="btn btn-block btn-primary">';
			html += '<i class="fa  fa-trash-o"></i>';
			html += '</button>';
			html += '</td>';
			html += '</tr>';
		}

		$("#ext_pro_id").append(html);
	}

	//--拓展属性删除

	var delete_arr = [];
	$("#ext_pro_id").on("click", ".lr-remove", function() {

		//获取删除的id
		var delet_json = {};
		var input_len = $(this).parent().parent().find('input');
		if(input_len.eq(0).val() && input_len.eq(0).val().length > 0) {
			delet_json.productAttuId = input_len.eq(0).val();
			delete_arr.push(delet_json);
		}

		var tr_parent = $(this).parent().parent().parent();
		if(tr_parent.children("tr").length == 1) {
			dialogMsg("不能再删除了哟！", 0);
			return false;
		}
		$(this).parent().parent().remove();

		//当删除某一行时候，重新排序id
		var child_tr = $('#ext_pro_id').find('tr');
		for(var i = 0; i < child_tr.length; i++) {
			child_tr.eq(i).attr('id', 'ext' + i);
		}
	});

	//获取拓展的值
	this.get_ext_pro_data = function() {
		var ext_pro_arr = [];
		var child_tr = $('#ext_pro_id').find('tr');
		for(var i = 0; i < child_tr.length; i++) {
			var tr_json = {};
			var child_tr_input = $('#ext' + i).find('input');
			tr_json.productAttuId = child_tr_input.eq(0).val();
			tr_json.attributeEnName = child_tr_input.eq(1).val();
			tr_json.attributeName = child_tr_input.eq(2).val();
			tr_json.productAttuValue = child_tr_input.eq(3).val();
			ext_pro_arr.push(tr_json);
		}
		return ext_pro_arr;
	}

	//插入拓展属性html 
	this.addExtHtml = function(rows) {
		var html = '';
		if(rows && rows.length > 0) {
			$("#ext_pro_id").html("");
			for(var i = 0; i < rows.length; i++) {
				html += '<tr class="addtr" id="ext' + i + '">';
				html += '<td>';
				html += '<input type="hidden" value="' + rows[i].productattuid + '"/>';
				html += '<input type="text" class="form-control" value="' + rows[i].attributename + '"  placeholder="请输入英文code" style="width: 200px;" />';
				html += '</td>';
				html += '<td>';
				html += '<input type="text" class="form-control" value="' + rows[i].attributename + '" checkexpession="NotNull" isvalid="yes" placeholder="请输入中文名称" style="width: 200px;" />';
				html += '</td>';
				html += '<td>';
				html += '<input type="text" class="form-control" value="' + rows[i].productattuvalue + '" placeholder="请输入值" style="width: 200px;" />';
				html += '</td>';
				html += '<td>';
				html += '<button class="lr-remove" type="button" class="btn btn-block btn-primary">';
				html += '<i class="fa  fa-trash-o"></i>';
				html += '</button>';
				html += '</td>';
				html += '</tr>';
			}
			$("#ext_pro_id").html(html);
		} else {
			console.log('无产品拓展属性数据！');
		}

	}

	//获取拓展属性数据
	this.getExtData = function() {
		cm.ajax({
			url: "/AfterSaleManage/productinfo/GetProductExtAttribute", //回访
			type: "Get",
			dataType: "json",
			data: {
				productInfoId: keyValue
			},
			success: function(data) {
				self.addExtHtml(data);
			},
			error: function(data) {
				console.log(data);
			}
		});
	};
	self.getExtData();

	/*
	 * alvin
	 * end
	 */

	/*
	 * alvin
	 * 规格参数配置页签
	 * star
	 */
	//清空model2的html,重新插入
	this.appendModel2Html = function(){		
		var html = '';
		    html += '<div class="type-group index_group" id="table_0">';
		    html += '<table id="table_type_0">';
		    html += '<tr class="addtr_0">';
		    html += '<td>';
		    html += '<input type="text" class="form-control" placeholder="请输入分类名称" />';
		    html += '<input type="hidden" />	';
		    html += '</td>';
		    html += '<td class="td_btn_class">';
		    html += '<button id="addRow_0" type="button" class="btn btn-block btn-primary add_row_spe">';
		    html += '<i class="fa fa-plus"></i>';
		    html += '</button>';
		    html += '</td>';
		    html += '<td class="td_btn_class">';
		    html += '<button id="removeRow_0" type="button" class="btn btn-block btn-primary remove_class_spe">';
		    html += '<i class="fa  fa-trash-o"></i>';
		    html += '</button>';
		    html += '</td>';
		    html += '</tr>';
		    html += '</table>';
		    html += '<div id="table_div_0">';
		    html += '<table id="table_id_0" data-id="table_id_0"></table>';
		    html += '</div>';
		    html += '</div>';	
		    return html;	    
	};
	
	//获取规格参数数据
	this.getSpecifData = function() {
		cm.ajax({
			url: "/AfterSaleManage/productinfo/GetSpecDataItemList",
			type: "Get",
			dataType: "json",
			async: true,
			data: {
				productInfoId: keyValue
			},
			success: function(data) {
				if(data && data.length > 0 ) {
					if(data && data.length == 1 && data[0].ItemTypeId == null) {
						if(data[0].itemModelList && data[0].itemModelList.length > 0) {
							$("#content_id").html("");
							$("#content_id").html(self.appendModel2Html());
							self.specifTwoTable('table_div_0', 'table_id_0');
							self.initSpecifGridTable();							
							for(var k = 0; k < data[0].itemModelList.length; k++) {
								self.addSpecifRow($("#specif_table_id"), data[0].itemModelList[k], k);
							}
						}
					} else {					
					     	self.initSpecifGridTable();  
							$("#content_id").html("");
							for(var i = 0; i < data.length; i++) {
								self.editHtml(data[i], i);
							}						
					}
				} else {
					console.log('无规格参数配置数据！');
				}
			},
			error: function(data) {
				console.log(data);
			}
		});
	};
	self.getSpecifData();   
   //赋值model2数据
   this.load_model2_data = function(){
   	var that = this;
   	//再次初始化获取model2的值
	this.init_model2 = function() {
		var model2 = [];
		cm.ajax({
			url: "/AfterSaleManage/productinfo/GetSpecDataItemList",
			type: "Get",
			dataType: "json",
			async: false,
			data: {
				productInfoId: keyValue
			},
			success: function(data) {
				model2 = data;
			}
		});
		return model2;
	}
	//启用定时器获取动态插入的ID
	setTimeout(function() {
		if(that.init_model2() && that.init_model2().length > 0) {
			if(that.init_model2()[0].ItemTypeId && that.init_model2()[0].ItemTypeId.length > 0) {
				var index_len = $("#content_id").children().length;
				for(var n = 0; n < index_len; n++) {
					var dom_div = "table_div_" + n;
					var dom = "table_id_" + n;
					self.specifTwoTable(dom_div, dom);
					//获取row的值
					var data_index = that.init_model2()[n].itemModelList;
					for(var m = 0; m < data_index.length; m++) {
						self.editSpecifTwoRow($("#" + dom), data_index[m], m ,that.init_model2()[n]);
					}
				}
			}
		}
	}, 500);
   }
	self.load_model2_data();

	//===============规格参数配置 一级显示=============
	//初始化规格参数一级模式table
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
					name: 'cfgItemId',
					index: 'cfgItemId',
					hidden: true
				},
				{
					label: '分类ID',
					name: 'cfigItemCatgId',
					index: 'cfigItemCatgId',
					hidden: true
				},
				{
					label: '产品ID',
					name: 'productInfoId',
					index: 'productInfoId',
					hidden: true,
					formatter: function(cellvalue, options, row) {
						return "";
					}
				},
				{
					label: '项目',
					name: 'cfgItemName',
					index: 'cfgItemName',
					width: 200,
				},
				{
					label: '值',
					name: 'cfgItemValue',
					index: 'cfgItemValue',
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
	//规格配置--新增方法--表格行内新增
	this.addSpecifRow = function($grid, row, i) {

		var html = '';
		html += '<input name="cfgItemId" type="hidden" class="editable center" value="' + (row.ItemId || "") + '"/>';
		html += '<input name="cfigItemCatgId" type="hidden" class="editable center" value="' + (row.ItemCatgId || "") + '"/>';
		html += '<span style="color:red;">*</span>';
		html += '<input checkexpession="NotNull" isvalid="yes" name="cfgItemName" type="text" style="width:90%;margin-left:5px;" class="editable center" value="' + (row.ItemName || "") + '"/>';
		var rowdata = {
			//主键
			cfgItemId: row.ItemId,
			cfigItemCatgId: row.cfigItemCatgId,
			productInfoId: keyValue,
			cfgItemName: html,
			cfgItemValue: '<input name="cfgItemValue" type="text" class="editable center" value="' + (row.ItemValue || "") + '"/>',
		}
		$grid.jqGrid('addRowData', i, rowdata);
	}
	// 规格参数配置---新增事件
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
	//规格参数一-----删除按钮
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
	//规格参数配置一---保存事件
	this.save_specif_one = function() {
		var $gridSpefic = $("#specif_table_id");
		if(!$('#specif_id').Validform()) {
			return false;
		}
		var postSpeData = {};
		postSpeData.productInfoId = keyValue;
		//循环获取新增的table
		var detailJson = [];
		$gridSpefic.find('[role=row]').each(function(i) {
			if(!!$(this).find('input[name="cfgItemName"]').val()) {
				var d = cm.format.formToJSON(this);
				d.SortCode = i;
				detailJson.push(d);
			}
		});
		postSpeData.basicInfo = {
			productInfoId: keyValue,
			productCatId: productCatId,

		};

		postSpeData.productCfgItemList_Mode1 = detailJson;
		console.log(JSON.stringify({
			productInfoJson: postSpeData
		}));
		var str_spe_one = JSON.stringify(postSpeData);
		cm.ajax({
			type: 'post',
			async: false,
			data: {
				productInfoJson: str_spe_one
			},
			url: '/AfterSaleManage/productinfo/SaveFormData',
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
	//===============规格参数配置一 end=============

	//===============规格配置 二级显示=============
	//默认table的初始化
	this.specifTwoTable = function(dom, tableId) {
		$("#" + dom).html("<table id='" + tableId + "'></table>");
		var $grid_s = $("#" + tableId);
		$grid_s.jqGrid({
			unwritten: false,
			datatype: "local",
			height: '100%',
			autowidth: true,
			cmTemplate: {
				sortable: false
			},
			colModel: [{
					label: '主键',
					name: 'cfgItemId',
					index: 'cfgItemId',
					hidden: true
				},
				{
					label: '分类ID',
					name: 'cfigItemCatgId',
					index: 'cfigItemCatgId',
					hidden: true
				},
				{
					label: '产品ID',
					name: 'productInfoId',
					index: 'productInfoId',
					hidden: true,
					formatter: function(cellvalue, options, row) {
						return keyValue;
					}
				},
				{
					label: '项目',
					name: 'cfgItemName',
					index: 'cfgItemName',
					width: 260,
				},
				{
					label: '值',
					name: 'cfgItemValue',
					index: 'cfgItemValue',
					width: 200,
				},
				{
					label: '操作按钮',
					name: 'deleteIndex',
					index: 'deleteIndex',
					align: 'center',
					width: 80,
					formatter: function(cellvalue, options, row) {
						return '<button  type="button" class="btn btn-primary remove_btn_specif_two"><i class="fa  fa-trash-o"></i></button>';
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
		$grid_s.find("tbody tr:eq(1)").find('input').removeAttr('disabled').attr("isvalid", "yes");
		$grid_s.find('.disabled').attr("disabled", "disabled");
	}
	//初始化调用规格配置table
	self.specifTwoTable('table_div_0', 'table_id_0');
	//新增html
	this.appendHtml = function(i) {
		var html = '';
		html += '<div class="type-group index_group" id="table_' + i + '">';
		html += '<table id="table_type_' + i + '">';
		html += '<tr class="addtr_' + i + '">';
		html += '<td>';
		html += '<input type="text" class="form-control" placeholder="请输入分类名称" />';
		html += '<input type="hidden" />';
		html += '</td>';
		html += '<td class="td_btn_class">';
		html += '<button id="addRow_' + i + '" type="button" class="btn btn-block btn-primary add_row_spe">';
		html += '<i class="fa fa-plus"></i>';
		html += '</button>';
		html += '</td>';
		html += '<td class="td_btn_class">';
		html += '<button id="removeRow_' + i + '" type="button" class="btn btn-block btn-primary remove_class_spe">';
		html += '<i class="fa  fa-trash-o"></i>';
		html += '</button>';
		html += '</td>';
		html += '</tr>';
		html += '</table>';
		html += '<div id="table_div_' + i + '">';
		html += '<table id="table_id_' + i + '"></table>';
		html += '</div>';
		html += '</div>';
		$('#content_id').append(html);
	};
	//编辑html 
	this.editHtml = function(row, i) {
		
		var edit_html = '';
		edit_html += '<div class="type-group index_group" id="table_' + i + '">';
		edit_html += '<table id="table_type_' + i + '">';
		edit_html += '<tr class="addtr_' + i + '">';
		edit_html += '<td>';
		edit_html += '<input type="text" value="' + (row.ItemTypeName || "") + '" class="form-control" placeholder="请输入分类名称" />';
		edit_html += '<input type="hidden"  value="' + (row.ItemTypeId || "") + '"/>';
		edit_html += '</td>';
		edit_html += '<td class="td_btn_class">';
		edit_html += '<button id="addRow_' + i + '" type="button" class="btn btn-block btn-primary add_row_spe">';
		edit_html += '<i class="fa fa-plus"></i>';
		edit_html += '</button>';
		edit_html += '</td>';
		edit_html += '<td class="td_btn_class">';
		edit_html += '<button id="removeRow_' + i + '" type="button" class="btn btn-block btn-primary remove_class_spe">';
		edit_html += '<i class="fa  fa-trash-o"></i>';
		edit_html += '</button>';
		edit_html += '</td>';
		edit_html += '</tr>';
		edit_html += '</table>';
		edit_html += '<div id="table_div_' + i + '">';
		edit_html += '<table id="table_id_' + i + '"></table>';
		edit_html += '</div>';
		edit_html += '</div>';

		$('#content_id').append(edit_html); 

	};
	//新增分类主按钮	
	this.add_classification = function() {
		var index = $('#content_id').find('.index_group').length;
		self.appendHtml(index);
		self.specifTwoTable('table_div_' + index, 'table_id_' + index);
	}
	//删除分类
	$("#content_id").on('click', '.remove_class_spe', function() {
		if($('#content_id').find('.index_group').length <= 1) {
			dialogMsg("不能再删除了哟！", 0);
			return false;
		}
		$(this).parent().parent().parent().parent().parent().remove();
	});

	//规格二 行内新增
	//规格配置--新增方法--表格行内新增
	this.addSpecifTwoRow = function($grid, row, i ,parentID) {
		var html = '';
		html += '<input name="cfgItemId" type="hidden" class="editable center" value="' + (row.ItemId || "") + '"/>';
		html += '<input name="cfigItemCatgId" type="hidden" class="editable center" value="' + (parentID || "") + '"/>';
		html += '<input checkexpession="NotNull" isvalid="yes" name="cfgItemName" type="text"  class="editable center" value="' + (row.ItemName || "") + '"/>';
		var rowdata = {
			//主键
			cfgItemId: row.ItemId,
			cfigItemCatgId: parentID || '',
			productInfoId: keyValue,
			//字段
			cfgItemName: html,
			cfgItemValue: '<input name="cfgItemValue" type="text" class="editable center" value="' + (row.ItemValue || "") + '"/>',
		}
		$grid.jqGrid('addRowData', i, rowdata);
	}
	//规格配置--编辑方法--表格行内 
	this.editSpecifTwoRow = function($grid, row, i,rowParent) {
		var html = '';
		html += '<input name="cfgItemId" type="hidden" class="editable center" value="' + (row.ItemId || "") + '"/>';
		html += '<input name="cfigItemCatgId" type="hidden" class="editable center" value="' + (rowParent.ItemTypeId || "") + '"/>';
		html += '<input checkexpession="NotNull" isvalid="yes" name="cfgItemName" type="text"  class="editable center" value="' + (row.ItemName || "") + '"/>';
		var rowdata = {
			//主键
			cfgItemId: row.ItemId,
			cfigItemCatgId: rowParent.ItemTypeId || '',
			productInfoId: keyValue,
			//字段
			cfgItemName: html,
			cfgItemValue: '<input name="cfgItemValue" type="text" class="editable center" value="' + (row.ItemValue || "") + '"/>',
		}
		$grid.jqGrid('addRowData', i, rowdata);
	}
	//新增table行内----项目值
	$("#content_id").on('click', '.add_row_spe', function() {
		//通过按钮找到Table ID 
		var dom = $(this).parent().parent().parent().parent().next().children().find('.ui-jqgrid-bdiv').children().find('table').attr('id');
		//获取父类型的流水号
		var parent_id = $(this).parent().parent().find('input').eq(1).val();
		var parent_val = "";
		if(parent_id && parent_id.length >0){
			parent_val = parent_id;
		}
		var $gridTwoSpefic = $("#" + dom);
		var len = $gridTwoSpefic.getDataIDs().length;
		self.addSpecifTwoRow($gridTwoSpefic, {}, len , parent_val);
		$gridTwoSpefic.find('tbody tr').last().find('input').eq(2).focus();
	});
	//删除某table的行
	$("#content_id").on('click', '.remove_btn_specif_two', function() {
		var $obj = $(this);
		$obj.parents('[role=row]').remove();
	});
	//获取所有新增模式2的值
	this.getAllSpeData = function() {
		var all_arr_data = [];
		//获取多少类型长度
		var index = $('#content_id').find('.index_group').length;

		if(index && index > 0) {
			for(var i = 0; i < index; i++) {
				var json_class = {};
				var json_detail = [];
				//获取类型名
				var cfgItemCatgName = $("#table_type_" + i).find('input').eq(0).val();
				json_class.cfgItemCatgName = cfgItemCatgName;
				//流水号
				var cfigItemCatgId = $("#table_type_" + i).find('input').eq(1).val();
				json_class.cfigItemCatgId = cfigItemCatgId;
				//循环table的值
				var $table = $("#table_id_" + i);
				$table.find('[role=row]').each(function(i) {
					if(!!$(this).find('input[name="cfgItemName"]').val()) {
						var d = cm.format.formToJSON(this);
						d.SortCode = i;
						json_detail.push(d);
					}
				});
				json_class.productCfgItemList = json_detail;
				all_arr_data.push(json_class);
			}
		}
		return all_arr_data;
	}
	//保存模式2新增数据
	this.save_specif_two = function() {
		var postSpeTwoData = {};
		postSpeTwoData.productInfoId = keyValue;
		
		postSpeTwoData.basicInfo = {
			productInfoId: keyValue,
			productCatId: productCatId,
		};	
		postSpeTwoData.productCfgItemList_Mode2 = self.getAllSpeData();
		
		var str_spe_two = JSON.stringify(postSpeTwoData);
		console.log(JSON.stringify({
			productInfoJson: postSpeTwoData
		}));
		cm.ajax({
			type: 'post',
			async: false,
			data: {
				productInfoJson: str_spe_two
			},
			url: '/AfterSaleManage/productinfo/SaveFormData',
			success: function(data) {
				if(data.type && data.type == 1) {
					self.getSpecifData();   
					self.load_model2_data();
					dialogMsg(data.message, 1);
					
				} else {
					dialogMsg(data.message, 2);
				}
			}
		});
	}

	//===============规格参数配置二 end=============
	/*
	 * alvin
	 * end
	 * /
   
	/*alvin 
	 * BOM属性
	 */
	
	//物流分类字典
	this.btn_logistics = function() {
		dialogOpen({
			id: "DataItemSort",
			title: '物料类型字典',
			url: '/hongtupage/view/product_attributes/logistics.html?productInfoId='+ keyValue +'&productCatId=' + productCatId,
			width: "800px",
			height: "500px",
			btn: null
		});
	}

	/*
	 * alvin   star
	 * table 单行新增
	 */

	//加载明细
	var postData = {},
		productBomAttuEntityList_save = [], //保存数据,新增，编辑
		productBomAttuEntityList_del = []; //删除

	//获取初始化数据
	this.getTableData = function(itemID, proInfoId) {
		var $grid = $("#gridTable");

		cm.ajax({
			type: 'post',
			async: false,
			url: '/AfterSaleManage/productbomattu/GetListJsonByItemType',
			data: {
				itemType: itemID,
				productInfoId: proInfoId,
			},
			success: function(data) {
				var $grid = $("#gridTable");
				var len = $grid.getDataIDs().length;
				if(data && data.length > 0) {
					var detail = data;
					for(var i = 0; i < detail.length; i++) {
						self.addRow($grid, detail[i], i);
					}
				}
				else{				
					self.addRow($grid, {}, len);
				}
			}
		});
	}
	//初始化table
	this.initGridTable = function() {
		$(".gridPanel").html("<table id='gridTable'></table>");
		var $grid = $("#gridTable");
		$grid.jqGrid({
			unwritten: false,
			datatype: "local",
			height: $(window).height() - 135,
			autowidth: true,
			isLocal: true,
			cmTemplate: {
				sortable: false
			},
			colModel: [{
					label: '物料id',
					name: 'productBomAttuId',
					index: 'productBomAttuId',
					hidden: true
				},
				{
					label: 'bom分类类型ID',
					name: 'productBomCatId',
					index: 'productBomCatId',
					hidden: true,
					formatter: function(cellvalue, options, row) {
						return _itemId;
					}
				},
				{
					label: '产品ID',
					name: 'productInfoId',
					index: 'productInfoId',
					hidden: true
				},
				{
					label: '操作按钮',
					name: 'deleteIndex',
					index: 'deleteIndex',
					align: 'center',
					width: 60,
					formatter: function(cellvalue, options, row) {
						return '<button  id=""  type="button" class="btn btn-primary btn_class"><i class="fa  fa-trash-o"></i></button>';

					}
				},
				{
					label: '物料名称',
					name: 'attributeName',
					width: 120,
					index: 'attributeName'
				},
				{
					label: '物料编码',
					name: 'itemCode',
					width: 100,
					index: 'itemCode'
				},
				{
					label: '物料规格',
					name: 'spec',
					width: 100,
					index: 'spec'
				},
				{
					label: '供应商',
					name: 'vendor',
					width: 90,
					index: 'vendor'
				},
				{
					label: '质保年限',
					name: 'warrantYears',
					width: 60,
					index: 'warrantYears'
				},
				{
					label: '启用时间',
					name: 'warrantyBeginTime',
					width: 130,
					index: 'warrantyBeginTime'
				},

				{
					label: '三包到期时间',
					name: 'warrantyExpTime',
					index: 'warrantyExpTime',
					width: 130,
				},
				{
					label: '物料描述',
					name: 'remark1',
					width: 100,
					index: 'remark1',
				}
			],
			cellattr: function() {
				return ' title=""'
			},
			rownumbers: false,
			shrinkToFit: false,
			gridview: true,
			pager: false, //表格页脚的占位符(一般是div)的id
		});

		$grid.find("tbody tr:eq(1)").find('input').removeAttr('disabled').attr("isvalid", "yes");
		$grid.find('.disabled').attr("disabled", "disabled");
	}
	//表格刷新
	this.reload_table = function(item, proInfoID) {
		$("#gridTable").jqGrid('setGridParam', {
			postData: {
				itemType: item,
				productInfoId: proInfoID,
			},
			page: 1
		}).trigger('reloadGrid');
	}

	//表格行内新增
	this.addRow = function($grid, row, i) {
		var rowdata = {
			//物品id
			productBomAttuId: row.productBomAttuId,
			//bom分类ID
			productBomCatId: _itemId,
			//物料名称
			attributeName: '<input name="productBomAttuId" type="hidden" class="editable center" value="' + (row.productBomAttuId || "") + '"/><input name="productBomCatId" type="hidden" class="editable center" value="' + (_itemId || "") + '"/><span style="color:red;">*</span><input checkexpession="NotNull" isvalid="yes" name="attributeName" type="text" style="width:100px;padding-left:5px;" class="editable center" value="' + (row.attributeName || "") + '"/>',
			//物料编码
			itemCode: '<input name="itemCode" type="text" class="editable center" value="' + (row.itemCode || "") + '"/>',
			//物料规格
			spec: '<input name="spec" type="text" class="editable center" value="' + (row.spec || "") + '"/>',
			//供应商
			vendor: '<input name="vendor" type="text" class="editable center" value="' + (row.vendor || "") + '"/>',
			//质保年限
			warrantYears: '<input name="warrantYears" type="text" checkexpession="NumAndFloat" isvalid="yes"  class="editable center" value="' + (row.warrantYears || "") + '"/>',
			//启用时间
			warrantyBeginTime: '<input name="warrantyBeginTime" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',qsEnabled:0,isShowClear:0,isShowOK:0,isShowToday:0})" style="width:120px;" class="editable center form-control  input-datepicker" value="' + (row.warrantyBeginTime || "") + '"/>',
			//三包到期事件
			warrantyExpTime: '<input name="warrantyExpTime" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',qsEnabled:0,isShowClear:0,isShowOK:0,isShowToday:0})" style="width:120px;" class="editable center form-control  input-datepicker" value="' + (row.warrantyExpTime || "") + '"/>',
			//描述
			remark1: '<input name="remark1" type="text" class="editable" value="' + (row.remark1 || "") + '"/>',
		}
		$grid.jqGrid('addRowData', i, rowdata);
	}

	//
	this.updateRow = function(r, data) {
		r.find('input[name="productBomAttuId"]').val(data.productBomAttuId);
		r.find('input[name="attributeName"]').val(data.attributeName);
		r.find('input[name="itemCode"]').val(data.itemCode);
		r.find('input[name="spec"]').val(data.spec);
		r.find('input[name="vendor"]').val(data.vendor);
		r.find('input[name="warrantYears"]').val(data.warrantYears);
		r.find('input[name="warrantyBeginTime"]').val(data.warrantyBeginTime);
		r.find('input[name="warrantyExpTime"]').val(data.warrantyExpTime);
		r.find('input[name="remark1"]').val(data.remark1);

		r.find('input').removeAttr('disabled').attr("isvalid", "yes");
		r.find('a.btn').removeAttr('disabled');
		r.next().find('input').removeAttr('disabled');
	}

	//单行新增事件
	this.btn_add_bom = function() {
		if(!_itemId && _itemId.length <= 0) {
			dialogMsg('请选择需要新增的BOM分类!', 0);
			return false;
		}
		var $grid = $("#gridTable");
		if($grid.find('tbody tr').length > 1) {
			if(!$('#gridTable').Validform()) {
				return false;
			}
		}
		var len = $grid.getDataIDs().length;
		self.addRow($grid, {}, len);
	}

	//删除按钮
	$('body').on('click', '.btn_class', function() {
		var $obj = $(this);
		var json_id = {};
		$obj.parents('[role=row]').remove();
		var delete_val = $obj.parent().parent().find('[aria-describedby="gridTable_productBomAttuId"]').text();
		if(delete_val && delete_val.length > 0) {
			json_id.productBomAttuId = delete_val;
			productBomAttuEntityList_del.push(json_id);
		}
	});

	//保存bom表格数据按钮
	this.save_bom_table = function() {
		if(!_itemId && _itemId.length <= 0) {
			dialogMsg('请选择需要新增的BOM分类!', 0);
			return false;
		}
		var $grid = $("#gridTable");
		if(!$('#gridTable').Validform()) {
			return false;
		}
		
		postData.productInfoId = keyValue;
		//循环获取新增的table
		var detailJson = [];
		$grid.find('[role=row]').each(function(i) {
			if(!!$(this).find('input[name="attributeName"]').val()) {
				var d = self.formToJSON(this);
				d.SortCode = i;
				detailJson.push(d);
			}
		});
		postData.basicInfo = {
			productInfoId: keyValue,
			productCatId: productCatId,
		};

		postData.productBomAttuEntityList_save = detailJson;
		postData.productBomAttuEntityList_del = productBomAttuEntityList_del;
		console.log(JSON.stringify(postData));
		var str_data = JSON.stringify(postData);
		cm.ajax({
			type: 'post',
			async: false,
			data: {
				productInfoJson: str_data
			},
			url: '/AfterSaleManage/productinfo/SaveFormData',
			success: function(data) {
				if(data.type && data.type == 1) {
					dialogMsg(data.message, 1);
					self.initGridTable();
					self.getTableData(_itemId, keyValue);
				} else {
					dialogMsg(data.message, 2);
				}
			}
		});

	};

	//格式化获取获取addrow里面的html格式数据JSON
	this.formToJSON = function(selector) {
		var form = {};
		$(selector).find(':input[name]:enabled').each(function() {
			var self = $(this);
			var name = self.attr('name');
			if(form[name]) {
				form[name] = form[name] + ',' + self.val();
			} else {
				form[name] = self.val();
			}
		});
		return form;
	}
	/*
	 * BOM end
	 */

	//售后服务页签----保存
	this.save_servece = function() {

		var test = $('#htmlContent1').summernote('code');
		var test_to = $('#htmlContent2').summernote('code');
		var pageJson = {
			"productInfoId": keyValue,
			"basicInfo": {
				"productInfoId": keyValue,
				"productCatId": productCatId,
				"customerServiceHtml": escape(test),
				"warrantDescHtml": escape(test_to)
			}
		};
		var data = JSON.stringify(pageJson);

		var pageJson = {
			productInfoJson: data
		};
		console.log(JSON.stringify(pageJson));
		cm.ajax({
			url: "/AfterSaleManage/productinfo/SaveFormData", //回访
			type: 'POST',
			dataType: 'json',
			data: pageJson,
			success: function(data) {
				productInfoId = "";
				productCatId = "";
				dialogMsg(data.message, 1);
				dialogClose();
			},
			error: function(data) {
				dialogMsg(data.message, 2);
			}
		})

	};

};

var model = new viewModel();