(function() {
	layui.use(['tree', 'form', 'layer', 'laypage'], function() {
		var form = layui.form,
			layer = layui.layer,
			tree = layui.tree,
			laypage = layui.laypage;
		var treenode_id = '';

		$(function() {
			GetKonwTree();
			GetPagetotal();
		})

		$("#search").on("click", function() {
			var query= $("#query").val();
			if(query == ''){
				GetPagetotal();
			}else{
				getSearch();
			}
			
		})

		//编辑
		$("#page_list").on("click", ".tab-pane", function() {
			dialogOpenContent({
				id: 'Form',
				url: '/hongtupage/view/aw_knowledge_view/Form.html?keyValue=' + $(this).find(".page-title").data("pageid"),
				width: '90%',
				height: '98%',
				callBack: function(iframeId) {
					top.frames[iframeId].model.AcceptClick();

				}
			});
		})

		//初始化树形
		function GetKonwTree() {
			cm.ajax({
				type: "post",
				url: "/AfterSaleManage/aw_knowledge_dataitem/GetTreeJson4LayUI",
				success: function(data) {
					tree({
						elem: '#demo',
						skin: 'blue',
						nodes: data,
						click: function(node) {
							console.log(node) //node即为当前点击的节点数据
							var post_data;
							treenode_id = node.id;
							var jq = $("#query").val();
//							if(jq == ''){
//								GetTreePageList(treenode_id);
//							}else{
//								getSearch();
//								
//							}
GetTreePageList(treenode_id);
							
						}
					});
				},
				error: function(data) {
					console.log(data);
					layer.msg("网络错误,请稍后再试!", {
						icon: 2
					});
				}
			});
		}

		//获取页数给分页
		function GetPagetotal() {

			var pageJson = {
				condition: "",
				keyword: "",
				page: "1",
				rows: "5"
			};
			cm.ajax({
				url: "/AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost",
				type: "POST",
				data: pageJson,
				success: function(data) {
					console.log(data)
					var post_data = {
						condition: "",
						keyword: "",
						page: "1",
						rows: "5"
					}
					var data = data;

					pageInit(data.records, 0, post_data, '/AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost')
				},
				error: function(data) {
					console.log(data)
					if(layer) {
						layer.msg("网络错误,无法加载数据!", {
							icon: 2
						});
					} else {
						alert("网络错误,无法加载数据!");
					}
				}
			})
		}

		//搜索查询
		function getSearch() {

			var pageJson = {
				classId: treenode_id,
				keyword: $("#query").val(),
				page: "1",
				rows: "5"
			};
			cm.ajax({
				url: "/AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListWhthSearch",
				type: "POST",
				data: pageJson,
				success: function(data) {
					//						
					var data = data;

					pageInit(data.records, 0, pageJson, '/AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListWhthSearch')
					
				},
				error: function(data) {
					console.log(data)
					if(layer) {
						layer.msg("网络错误,无法加载数据!", {
							icon: 2
						});
					} else {
						alert("网络错误,无法加载数据!");
					}
				}
			})
		}

		//点击树形菜单查询
		function GetTreePageList(id) {
			var post_data = {
				condition: "itemClassId",
				keyword: id,
				page: "1",
				rows: "5"
			}
			cm.ajax({
				url: "/AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost",
				type: "POST",
				data: post_data,
				success: function(data) {
					console.log(data)
					//						var data = JSON.stringify(data);
					var post_data = {
						condition: "itemClassId",
						keyword: id,
						rows: "5"
					}
					pageInit(data.records, 0, post_data, '/AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost')
				},
				error: function(data) {
					console.log(data)
					if(layer) {
						layer.msg("网络错误,无法加载数据!", {
							icon: 2
						});
					} else {
						alert("网络错误,无法加载数据!");
					}
				}
			})
		}

		//初始分页 初始列表
		function pageInit(totalPage, firstIndex, post_data, in_url) {
			console.log(totalPage)
			laypage.render({
				elem: 'page-button',
				count: totalPage,
				theme: '#3c8dbc',
				limit:5,
				jump: function(obj, first) {
					//obj包含了当前分页的所有参数，比如：
					//console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
					//console.log(obj.limit); //得到每页显示的条数
					post_data["page"] = obj.curr
					console.log(post_data)
					cm.ajax({
						type: "post",
						url: in_url,
						data: post_data,
						success: function(data) {

							var data = data;
							if(data && data.rows.length != 0) {
								$("#page_list").html("");
								$('#page_list').append(analyData(data.rows))
								$('#page_list').highlight($("#query").val());
								//									 $('#page_list').highlight('油压突然下降');
							} else {
								$("#page_list").html("");
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
			});
		}

		//解析列表数据
		function analyData(data) {
			var pages = '';
			var imghtml = '';
			$.each(data, function(i, n) {
				if(n.ImageOrText){
					if(n.ImageOrText == '图'){
						imghtml ='<img class="img-circle img-bordered-sm" src="' + n.thumbnailPath + '&token=' + cm.token + '" alt="" style="">' ;
					}
				}else{
					imghtml = '<img class="img-circle img-bordered-sm" src="' + n.thumbnailPath + '&token=' + cm.token + '" alt="" style="">' ;
				}
				var aw_knowledge_ItemDetailId = (n.aw_knowledge_ItemDetailId) || ""
				pages += '<div class="active tab-pane" >' +
					'<div class="post">' +
					'<div class="user-block">' +
					imghtml+
					'<span class="username" style="">' +
					'<a href="#" class="page-title" data-pageid=' + aw_knowledge_ItemDetailId + '>' + n.title + '</a>' +
					'<ul class="list-inline founder">' +
					'<li>' +
					'<span>创建人:</span>' +
					'</li><li>' +
					'<span>' + n.CreateUserName + '</span>' +
					'</li></ul>' +
					'</span>' +

					'<p class="description">' + ((n.basicInfo) || "无描述") + '</p>' +
					'<ul class="list-inline" style="text-align: right;">' +
					'<li>' +
					'<span style="margin-right: 10px;">所属分类:' + n.media_type + '</span>' +
					'</li><li>' +
					'<a href="#" class="link-black text-sm"><i class="fa fa-clock-o margin-r-5"></i>上传时间：</a>' +
					'<span style="margin-right: 10px;">' + n.CreateDate + '</span>' +
					'</li></ul>' +
					'</div></div></div>';
			});

			return pages;
		}

	})

})()

function ImageTextSwitch() { //图文切换
	
	var checked = $('input[name="checkbox1"]').is(':checked');
	console.log(checked);
	if(checked ){
		$("#page_list").addClass("no_ming");
	}else{
		$("#page_list").removeClass("no_ming");
		
	}
	
	
}

//子页面提示框
function tip(text, number) {
	layer.msg(text, {
		icon: number,
		time: 600
	}, function() {
		location.reload();
	});
}