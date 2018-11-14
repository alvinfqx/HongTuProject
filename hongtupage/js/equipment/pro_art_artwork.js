var viewModel = function() {
	var self = this;
	var keyValue = request('keyValue');
	var productinfoid = request('productinfoid');

	$(function() {
		self.init();
		self.initPoint();
	});

	//初始化背景图
	this.init = function() {
		//获取背景图设置高	
		cm.ajax({
			//受理客户需求
			url: "/AfterSaleManage/orderproduct/GetProductInfo", //回访
			type: "POST",
			dataType: "json",
			data: {
				orderProductId: keyValue
			},
			success: function(res) {
				console.log("2222222222222222222222222222")
				var data = res[0];
				console.log(data);
				if(data == "") {
					$('#img').css("background-image", "url(../../../static/img/monitor_5-7.bmp)");
					$('#img').css("height", document.documentElement.clientHeight - 44);
				} else {
					var photoUrl = data.monitorphotourl;

					$('#img').css("background-image", "url(" + cm.domain + "/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=" + photoUrl + "&token=" + cm.token + ")");
					$('#img').css("height", document.documentElement.clientHeight - 44);
					//avatar_html +="<img  src=>";
				}

			},
			error: function(data) {
				console.log(data);
			}
		})
	};

	this.btn_background = function() { //更换背景图
		dialogOpen({
			id: 'Form',
			title: '更换背景图',
			url: '/hongtupage/view/equipment/replace_a.html?keyValue=' + keyValue,
			width: "750px",
			height: "500px",
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClickBackground();
				self.init();
			}
		})
	}
	//初始化采集点
	this.initPoint = function() {
		cm.ajax({
			url: '/AfterSaleManage/aw_flowchart/GetOrderProductSettingList',
			type: 'GET',
			data: {
				orderProductId: keyValue
			},
			async: false,
			success: function(data) {
				$(".text_class").empty();
				if(data && data.length > 0) {
					for(var i = 0; i < data.length; i++) {
						var html = '';
						html += '<div id="draggable_' + (i + 1) + '"  class="drag_div" style="left:' + data[i].Left + '; top: ' + data[i].Top + ';">';
						html += '<a class="delete_class" data-index="' + (i + 1) + '"> <i class="fa fa-fw fa-times-circle"></i>';
						html += '<input type= "hidden" value="' + data[i].ProductSettingId + '" />';
						html += '</a>';
						html += data[i].Name;
						html += '<input type="hidden" value="' + data[i].NodeID + '"/>';
						html += '</div>';
						$(".text_class").append(html);
						$("#draggable_" + (i + 1)).draggable({
							scroll: false,
							cursor: "move",
						});
					}

				}

			}
		});
	};

	//刷新
	this.reload = function() {
		location.reload();
	};

	//新增
	this.btn_add = function() {
		var isMax = false;
		var num = 0;
		var index_num = 0;
		var arr = [];
		var len = $(".text_class").find('.drag_div').length;

		for(var z = 0; z < len; z++) {
			var top_num = Number($(".text_class").find('.drag_div').eq(z).css("top").replace('px', ''));
			arr.push(top_num);
		}

		//判断数据里面不超过5个小于20的值

		var checkIndex = function() {
			var ind = 0;
			for(var k = 0; k < arr.length; k++) {
				if(arr[k] < 20) {
					ind++;
				}
			}

			if(ind > 4) {
				return true;
			} else {
				return false
			}

		}
		isMax = checkIndex();

		if(Number(len) >= 5 && isMax) {
			top.layer.msg('新增太多标签!请先拖动标签保存或删除标签,再新增!', {
				icon: 0,
				time: 2000,
				shift: 5
			});
			return false;
		}

		var index = ++len
		var index_num = index % 5 + 1;
		var html = '';
		if(num != 0) {
			html += '<div id="draggable_' + index + '" class="drag_div" style="right:' + (num * 100) + 'px; top: 6px; ">';
		} else {
			html += '<div id="draggable_' + index + '"  class="drag_div" style="right:' + (index_num * 100) + 'px; top: 6px; ">';
		}

		html += '<a class="delete_class" data-index="' + index + '"> <i class="fa fa-fw fa-times-circle"></i>';
		html += '<input type= "hidden" value="" / >';
		html += '</a>';
		html += '<input type="hidden" value=""/>';
		html += '</div>';
		$(".text_class").append(html);

		//创建拖动和获取结束位置		
		$("#draggable_" + index).draggable({
			scroll: false,
			cursor: "move",
			stop: function(event, ui) {
				num = index % 5;

			}
		});
	};

	//删除标签
	$('body').on('click', '.delete_class', function() {
		var del_index = $(this).data("index");
		var id = $(this).find('input').val();
		if(!!id) {
			dialogConfirm('确定要删除该节点吗？', function(isDelete) {
				if(isDelete) {
					cm.ajax({
						url: '/AfterSaleManage/aw_flowchart/OrderProductSettingRemove',
						type: 'POST',
						data: {
							keyValue: id
						},
						async: false,
						success: function(data) {
							if(data.type == 1) {
								dialogMsg(data.message, 1);
								self.initPoint();
								change_index();
							} else {
								dialogMsg(data.message, 2);
							}
						}
					});
				}
			});
		} else {
			$(this).parent().remove();
			change_index();
		}

		var change_index = function() {
			var len = $(".text_class").find('.drag_div').length;
			for(var j = 0; j < len; j++) {
				$(".text_class").find('.drag_div').eq(j).attr('id', 'draggable_' + (j + 1));
				var top_num = Number($(".text_class").find('.drag_div').eq(j).css("top").replace('px', ''));
				if(top_num <= 20) {
					$(".text_class").find('.drag_div').eq(j).css({
						'right': ((j % 5 + 1) * 100) + 'px',
						'top': '6px'
					});
				}
				//创建拖动和获取结束位置		
				$("#draggable_" + (j + 1)).draggable({
					scroll: false,
					cursor: "move",
				});
			}
		}
	});

	//标签双击开窗事件
	$('body').on('dblclick', '.drag_div', function() {

		var $obj = $(this);
		dialogOpen({
			id: 'ProCollectionPoint',
			title: '选择采集点',
			url: '/hongtupage/view/equipment/pro_col_point.html?keyValue=' + productinfoid + '&orderProductId=' + keyValue,
			width: '750px',
			height: '500px',
			btn: ['确定', '取消'],
			callBack: function(iframeId) {
				top.frames[iframeId].model.AcceptClick(function(data) {
					var a_value = $obj.find('a').find('input').val();
					var a_index = $obj.find('a').data("index");
					$obj.html('');
					var html = '';
					html += '<a class="delete_class" data-index="' + a_index + '"> <i class="fa fa-fw fa-times-circle"></i>';
					html += '<input type= "hidden" value="' + a_value + '" />';
					html += '</a>';
					html += data.NODE_NAME;
					html += '<input type="hidden" value="' + data.orderproduct_NODE_ID + '"/>';
					$obj.html(html);
				});
			}
		});
	});

	//保存
	this.btn_save = function() {
		var postArray = new Array();
		var len = $(".text_class").children().length;

		for(var k = 0; k < len; k++) {
			var left_val = $("#draggable_" + (k + 1)).css('left');
			var top_val = $("#draggable_" + (k + 1)).css('top');
			var num_top = Number(top_val.replace('px', ''));
			var name = $("#draggable_" + (k + 1)).text();
			var point_id = $("#draggable_" + (k + 1)).find('input').eq(1).val();
			var set_id = $("#draggable_" + (k + 1)).find('a').find('input').val();
			if(point_id && num_top > 30) {

				var post_data = {
					Left: left_val,
					Top: top_val,
					Name: name, //label名
					NodeID: point_id, //采集点流水号

					ProductSettingId: set_id
				};
				postArray.push(post_data);
			}
		}

		cm.ajax({
			url: '/AfterSaleManage/aw_flowchart/OrderProductSettingSave',
			type: 'POST',
			data: {
				data: JSON.stringify(postArray),
				orderProductId: keyValue
			},
			async: false,
			success: function(data) {
				if(data.type == 1) {
					dialogMsg(data.message, 1);
					self.initPoint();
				} else {
					dialogMsg(data.message, 2);
				}
			}
		});
	};
};

var model = new viewModel();